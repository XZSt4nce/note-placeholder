import { TFile } from 'obsidian';
import { DEFAULT_SETTINGS, NotePlaceholderSettings } from './settings/settings';
import NotePlaceholderPlugin from 'src/main';
import { InternalLinks, LinkView, NoteLink } from './types';
import { splitHeadersWithEscapedSymbols, getInternalLinks, parseSpecialHeaders, getNotes, removeBlockCircumflex } from './utils';

export default class Replacer {
    private plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        this.plugin = plugin;
    }

    /**
     * @param {NodeListOf<Element>} links All internal links of note
     * @returns {InternalLinks} Object with block links and note links
     */
    getBlockAndNoteLinks(links: NodeListOf<Element>): InternalLinks {
        const blockLinks: Element[] = [];
        const noteLinks: Element[] = [];
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const hrefAttribute = link.getAttribute('href');
            if (hrefAttribute) {
                const [href]: string[] = splitHeadersWithEscapedSymbols(hrefAttribute);
                if (href) {
                    noteLinks.push(link);
                } else {
                    blockLinks.push(link);
                }
            }
        }
        return { blockLinks, noteLinks };
    }

    /**
     * Replaces internal links of note in view mode
     * @param {HTMLElement} element HTML element of note
     */
    replaceLinkNames(element: HTMLElement) {
        const links = getInternalLinks(element);
        const { blockLinks, noteLinks } = this.getBlockAndNoteLinks(links);
        const notes = getNotes(this.plugin.notesMap, noteLinks);

        const noteViews = notes.map(note => this.getNoteLinkView(note));
        notes.forEach((note, index) => {
            note.link.textContent = noteViews[index].view;
            note.link.setAttribute('data-href', noteViews[index].dataHref);
        });

        const linkViews = blockLinks.map(link => this.getBlockLinkView(link));
        blockLinks.forEach((link, index) => {
            link.textContent = linkViews[index].view;
            link.setAttribute('data-href', linkViews[index].dataHref);
        });
    }

    /**
     * @param {TFile} file File of note
     * @returns {string|undefined} `placeholder` property of the note if it exists
     */
    getPlaceholderProperty(file: TFile): string | undefined {
        const cache = this.plugin.app.metadataCache.getFileCache(file);
        const frontmatter = cache?.frontmatter;
        return frontmatter?.placeholder;
    }

    /**
     * @param {Element} link Block link
     * @returns {LinkView} View that represents an internal link
     */
    getBlockLinkView(link: Element): LinkView {
        const hrefAttribute = link.getAttribute('href');

        if (!hrefAttribute) {
            return {view: 'VIEW_ERROR', dataHref: ''};
        }

        const [, ...headers] = splitHeadersWithEscapedSymbols(hrefAttribute);
        const { specialHeaders, nonSpecialHeaders } = parseSpecialHeaders(headers);
        const dataHref = ['', ...nonSpecialHeaders].join('#');
        const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;

        // Specified separator or default separator
        const headerSeparator = specialHeaders.sep ?? settings.defaultHeaderSeparator;

        removeBlockCircumflex(nonSpecialHeaders);

        return {view: nonSpecialHeaders.join(headerSeparator), dataHref};
    }

    /**
     * @param {NoteLink} note
     * @returns {LinkView} View that represents an internal link
     */
    getNoteLinkView(note: NoteLink): LinkView {
        const linkName = note.link.textContent;
        const hrefAttribute = note.link.getAttribute('href');
        if (!linkName || !hrefAttribute) {
            return {view: 'VIEW_ERROR', dataHref: ''};
        }

        const placeholder = this.getPlaceholderProperty(note.file);
        const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;

        const noName = linkName === hrefAttribute.replace(/#/g, ' > ');
        const namesOff = settings.useLinkNameInsteadOfPlaceholder === 'always off';
        const disablePlaceholder = settings.textToDisablePlaceholder === linkName;
        const { specialHeaders, nonSpecialHeaders } = parseSpecialHeaders(note.headers);
        const dataHref = [hrefAttribute.substring(0, hrefAttribute.indexOf('#')), ...nonSpecialHeaders].join('#');

        // Specified separator or default separator
        const headerSeparator = specialHeaders.sep ?? settings.defaultHeaderSeparator;

        removeBlockCircumflex(nonSpecialHeaders);

        let view;
        if (disablePlaceholder) {
            // If placeholder disabled display href with default Obsidian headers separator (`#`)
            view = hrefAttribute;
        } else if (placeholder && (noName || namesOff)) {
            // If link name is not specified or using link name instead of `placeholder` is `always off` and placeholder is specified display placeholder
            view = [placeholder, ...nonSpecialHeaders].join(headerSeparator);
        } else {
            // Otherwise display filename with default Obsidian headers separator (` > `)
            view = linkName;
        }
        return {view, dataHref};
    }
}
import { MetadataCache, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, NotePlaceholderSettings } from './settings/settings';
import NotePlaceholderPlugin from 'src/main';
import { InternalLinks, NoteLink } from './types';
import { splitHeadersWithEscapedSymbols, getInternalLinks, parseSpecialHeaders, getNotes } from './utils';

export class Replacer {
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
                const tempMarker = '|~~~|'
                const [href]: string[] = hrefAttribute.replace(/\\#/g, tempMarker).split('#').map(el => el.replace(tempMarker, '\\#'));
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
    async replaceLinkNames(element: HTMLElement) {
        const links = getInternalLinks(element);
        const { blockLinks, noteLinks } = this.getBlockAndNoteLinks(links);
        const notes = getNotes(this.plugin.notesMap, noteLinks);

        const noteViews = notes.map(note => this.getNoteLinkView(note));
        notes.forEach((note, index) => {
            note.link.textContent = noteViews[index];
        });

        const linkViews = blockLinks.map(link => this.getBlockLinkView(link));
        blockLinks.forEach((link, index) => {
            link.textContent = linkViews[index];
        });
    }

    /**
     * @param {TFile} file File of note
     * @returns {string|undefined} `placeholder` property of the note if it exists
     */
    getPlaceholderProperty(file: TFile): string | undefined {
        const cache = this.plugin.app.metadataCache.getFileCache(file);
        const frontmatter = cache?.frontmatter;
        if (frontmatter) {
            return frontmatter.placeholder;
        }
    }

    /**
     * @param {string} link Block link
     * @returns {Promise<string>} New string that represents an internal link
     */
    getBlockLinkView(link: Element): string {
        const hrefAttribute = link.getAttribute('href');
        if (hrefAttribute) {
            const headers = splitHeadersWithEscapedSymbols(hrefAttribute);
            const { specialHeaders, nonSpecialHeaders } = parseSpecialHeaders(headers);
            const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;

            // Specified separator or default separator
            const headerSeparator = specialHeaders.sep ?? settings.defaultHeaderSeparator;

            const blockHeaders = nonSpecialHeaders.filter((value: string) => value.startsWith('^')).length;

            // Remove the `^` character in the block header
            if (blockHeaders === 1 && nonSpecialHeaders.length === 1) {
                nonSpecialHeaders[0] = nonSpecialHeaders[0].slice(1);
            }

            return nonSpecialHeaders.join(headerSeparator);
        }

        return 'VIEW_ERROR';
    }

    /**
     * @param {NoteLink} note
     * @returns {string} New string that represents an internal link
     */
    getNoteLinkView(note: NoteLink): string {
        const linkName = note.link.textContent;
        const placeholder = this.getPlaceholderProperty(note.file);
        if (linkName) {
            const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;
            const hrefAttribute = note.link.getAttribute('href');

            const noName = linkName === hrefAttribute?.replace(/#/g, ' > ');
            const namesOff = settings.useLinkNameInsteadOfPlaceholder === 'always off';
            const disablePlaceholder = settings.textToDisablePlaceholder === linkName;
            const { specialHeaders, nonSpecialHeaders } = parseSpecialHeaders(note.headers);

            // Specified separator or default separator
            const headerSeparator = specialHeaders.sep ?? settings.defaultHeaderSeparator;

            // Assigning remaining non-special headers
            note.headers = nonSpecialHeaders;
            // Count of headers that begins with the character `^`
            const blockHeaders = note.headers.filter((value: string) => value.startsWith('^')).length;

            // Remove the `^` character in the block header
            if (blockHeaders === 1 && note.headers.length === 1) {
                note.headers[0] = note.headers[0].slice(1);
            }

            if (disablePlaceholder && hrefAttribute) {
                // If placeholder disabled display href with default Obsidian headers separator (`#`)
                return hrefAttribute;
            } else if (placeholder && (noName || namesOff)) {
                // If link name is not specified or using link name instead of `placeholder` is `always off` and placeholder is specified display placeholder
                return [placeholder, ...note.headers].join(headerSeparator);
            } else {
                // Otherwise display filename with default Obsidian headers separator (` > `)
                return linkName;
            }
        }

        return 'VIEW_ERROR';
    }
}
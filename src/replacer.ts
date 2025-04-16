import { CachedMetadata, FrontMatterCache, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, NotePlaceholderSettings, Options } from './settings/settings';
import NotePlaceholderPlugin from 'src/main';
import { InternalLinks, LinkHeaders, LinkView, NoteLink } from './types';
import { splitHeadersWithEscapedSymbols, getInternalLinks, parseHeaders, getNotes, removeBlockCircumflex } from './utils';

const VIEW_ERROR = 'VIEW_ERROR';

export default class Replacer {
    private plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        this.plugin = plugin;
    }

    /**
     * Replaces internal links of note in view mode
     * @param {HTMLElement} element HTML element of note
     */
    public replaceLinkNames(element: HTMLElement) {
        const links: NodeListOf<Element> = getInternalLinks(element);
        const { blockLinks, noteLinks }: InternalLinks = this.getBlockAndNoteLinks(links);
        const notes: NoteLink[] = getNotes(this.plugin.notesMap, noteLinks);

        const noteViews: LinkView[] = notes.map(note => this.getNoteLinkView(note));
        notes.forEach((note, index) => {
            note.link.textContent = noteViews[index].view;
            note.link.setAttribute('data-href', noteViews[index].dataHref);
        });

        const linkViews: LinkView[] = blockLinks.map(link => this.getBlockLinkView(link));
        blockLinks.forEach((link, index) => {
            link.textContent = linkViews[index].view;
            link.setAttribute('data-href', linkViews[index].dataHref);
        });
    }

    /**
     * @param {NodeListOf<Element>} links All internal links of note
     * @returns {InternalLinks} Object with block links and note links
     */
    private getBlockAndNoteLinks(links: NodeListOf<Element>): InternalLinks {
        const blockLinks: Element[] = [];
        const noteLinks: Element[] = [];
        for (let i = 0; i < links.length; i++) {
            const link: Element = links[i];
            const hrefAttribute: string | null = link.getAttribute('href');
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
     * @param {TFile} file File of note
     * @returns {string|undefined} `placeholder` property of the note if it exists
     */
    private getPlaceholderProperty(file: TFile): string | undefined {
        const cache: CachedMetadata | null = this.plugin.app.metadataCache.getFileCache(file);
        const frontmatter: FrontMatterCache | undefined = cache?.frontmatter;
        if (frontmatter) {
            return frontmatter[this.plugin.settings.placeholderPropertyName];
        }
    }

    /**
     * @param {Element} link Block link
     * @returns {LinkView} View that represents an internal link
     */
    private getBlockLinkView(link: Element): LinkView {
        const hrefAttribute: string | null = link.getAttribute('href');

        if (!hrefAttribute) {
            return {view: VIEW_ERROR, dataHref: ''};
        }

        const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;
        const hasLinkName: boolean = link.textContent !== hrefAttribute.slice(1).replace(/#/g, ' > ');
        const canUseLinkName: boolean = settings.useLinkNameInsteadOfPlaceholder === Options.DNFS;

        const [, ...headers]: string[] = splitHeadersWithEscapedSymbols(hrefAttribute);
        const { specialHeaders, nonSpecialHeaders }: LinkHeaders = parseHeaders(headers);
        const dataHref: string = ['', ...nonSpecialHeaders].join('#');

        let view: string;
        if (hasLinkName && canUseLinkName && link.textContent) {
            view = link.textContent;
        } else {

            // Specified separator or default separator
            const headerSeparator: string = specialHeaders.sep ?? settings.defaultHeaderSeparator;

            view = removeBlockCircumflex(nonSpecialHeaders).join(headerSeparator);
        }

        return {view, dataHref};
    }

    /**
     * @param {NoteLink} note
     * @returns {LinkView} View that represents an internal link
     */
    private getNoteLinkView(note: NoteLink): LinkView {
        const linkName: string | null = note.link.textContent;
        const hrefAttribute: string | null = note.link.getAttribute('href');
        if (!linkName || !hrefAttribute) {
            return {view: VIEW_ERROR, dataHref: ''};
        }

        const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;
        const namesOff: boolean = settings.useLinkNameInsteadOfPlaceholder === Options.AF;
        const placeholderDisabled: boolean = settings.textToDisablePlaceholder === linkName;

        const viewHref = hrefAttribute.replace(/#/g, ' > ');
        const noName: boolean = linkName === viewHref;

        const fileName: string = note.file.basename;
        const placeholder: string | undefined = this.getPlaceholderProperty(note.file);

        let view: string;
        if (placeholder && (noName || namesOff) && !placeholderDisabled) {
            view = placeholder;
        } else {
            view = fileName;
        }

        const { specialHeaders, nonSpecialHeaders }: LinkHeaders = parseHeaders(note.headers);
        const dataHref: string = [fileName, ...nonSpecialHeaders].join('#');

        const headerSeparator: string = specialHeaders.sep ?? settings.defaultHeaderSeparator;
        view = [view, ...removeBlockCircumflex(nonSpecialHeaders)].join(headerSeparator);

        return {view, dataHref};
    }
}
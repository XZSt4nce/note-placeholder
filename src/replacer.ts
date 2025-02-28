import { TFile } from "obsidian";
import { DEFAULT_SETTINGS, NotePlaceholderSettings } from "./settings";
import NotePlaceholderPlugin from "./main";
import { PropertiesParser } from "./propertiesParser";
import { NoteLink, SpecialHeaders } from "./types";
import { NoteFinder } from "./noteFinder";

export class Replacer {
    plugin: NotePlaceholderPlugin
    propertiesParser: PropertiesParser
    noteFinder: NoteFinder;

    constructor(notePlaceholderPlugin: NotePlaceholderPlugin) {
        this.plugin = notePlaceholderPlugin;
        this.propertiesParser = new PropertiesParser(notePlaceholderPlugin.app);
        this.noteFinder = new NoteFinder(notePlaceholderPlugin);
    }

    /**
     * @param links All internal links of note
     * @returns Object with in-note links (without href, only headers) and out-note links
     */
    getInNoteAndOutNoteLinks(links: NodeListOf<Element>): { inNoteLinks: Element[], outNoteLinks: Element[] } {
        const inNoteLinks: Element[] = [];
        const outNoteLinks: Element[] = [];
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const hrefAttribute = link.getAttribute('href');
            if (hrefAttribute) {
                const tempMarker = "|~~~|"
                const [href]: string[] = hrefAttribute.replace(/\\#/g, tempMarker).split("#").map(el => el.replace(tempMarker, '\\#'));
                if (href) {
                    outNoteLinks.push(link);
                } else {
                    inNoteLinks.push(link);
                }
            }
        }
        return { inNoteLinks, outNoteLinks };
    }

    /**
     * Replaces internal links of note in view mode
     * @param element HTML element of note
     */
    async replaceLinkNames(element: HTMLElement) {
        const links = this.getInternalLinks(element);
        const { inNoteLinks, outNoteLinks } = this.getInNoteAndOutNoteLinks(links);
        const notes = this.noteFinder.getNotes(outNoteLinks);

        const noteViews = await Promise.all(notes.map(note => this.getNoteView(note)));
        notes.forEach((note, index) => {
            note.link.textContent = noteViews[index];
        });

        const linkViews = await Promise.all(inNoteLinks.map(link => this.getLinkView(link)));
        inNoteLinks.forEach((link, index) => {
            link.textContent = linkViews[index];
        });
    }

    /**
     * @param element HTML element of note
     * @returns List of internal link (like `[[MyNote]]`) elements in HTML format
     */
    getInternalLinks(element: HTMLElement): NodeListOf<Element> {
        return element.querySelectorAll('a.internal-link');
    }

    /**
     * @param file File of note
     * @returns `placeholder` property of the note if it exists
     */
    async getPlaceholderProperty(file: TFile): Promise<string | undefined> {
        const properties = await this.propertiesParser.parseNoteProperties(file);
        if (properties) {
            return properties['placeholder'];
        }
    }

    /**
     * @param link In-note link without href (only headers)
     * @returns New string that represents an internal link
     */
    async getLinkView(link: Element): Promise<string> {
        const hrefAttribute = link.getAttribute('href');
        if (hrefAttribute) {
            const [, ...headers] = hrefAttribute.split('#');
            const { specialHeaders, nonSpecialHeaders } = this.parseSpecialHeaders(headers);
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

        return "VIEW_ERROR";
    }

    /**
     * @param note Special note struct {@link NoteLink}
     * @returns New string that represents an internal link
     */
    async getNoteView(note: NoteLink): Promise<string> {
        const linkName = note.link.textContent;
        const placeholder = await this.getPlaceholderProperty(note.file);
        if (linkName) {
            const settings: NotePlaceholderSettings = this.plugin.settings || DEFAULT_SETTINGS;
            const hrefAttribute = note.link.getAttribute('href');

            const noName = linkName === hrefAttribute?.replace(/#/g, ' > ');
            const namesOff = settings.useLinkNameInsteadOfPlaceholder === "always off";
            const disablePlaceholder = settings.textToDisablePlaceholder === linkName;
            const { specialHeaders, nonSpecialHeaders } = this.parseSpecialHeaders(note.headers);

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

        return "VIEW_ERROR";
    }

    /**
     * Parses special headers from a list of strings
     * @dev Special header framed by `!`
     * @example
     * ```
     * // Returns {test1: "Foo", test2: "Bar"}:
     * getSpecialHeaderContent(["!test1:Foo!", "!test2:Bar!"]);
     * ```
     * @param headers Strings that represents a headers of note link
     * @returns Object of the special headers that begins and ends with the character `!`
     */
    parseSpecialHeaders(headers: string[]): { specialHeaders: SpecialHeaders, nonSpecialHeaders: string[] } {
        const nonSpecialHeaders = [];
        const specialHeadersArray = [];
        for (let header of headers) {
            if (header.startsWith('!') && header.endsWith('!')) {
                specialHeadersArray.push(header);
            } else {
                nonSpecialHeaders.push(header);
            }
        }

        const parsedHeaders = specialHeadersArray.map((header) => header.slice(1, -1).split(':'));
        const specialHeaders: SpecialHeaders = {};
        for (let [key, value] of parsedHeaders) {
            if (value === "\\#") {
                value = "#";
            }
            specialHeaders[key] = value;
        }
        return { specialHeaders, nonSpecialHeaders };
    }
}
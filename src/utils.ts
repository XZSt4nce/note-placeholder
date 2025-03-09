import { TFile } from 'obsidian';
import { LinkHeaders, NoteLink, SpecialHeaders } from './types';

/**
 * Split headings by #, excluding escaped ones
 * @param {string} hrefAttribute 
 * @returns {string[]} Headers
 */
export const splitHeadersWithEscapedSymbols = (hrefAttribute: string): string[] => {
    const tempMarker = '|~~~|';
    const [href, ...headers]: string[] = hrefAttribute.replace(/\\#/g, tempMarker).split('#').map(el => el.replace(tempMarker, '\\#'));
    if (href) {
        return [href, ...headers];
    }
    return headers;
}

/**
 * @param {HTMLElement} element HTML element of note
 * @returns {NodeListOf<Element>} List of internal link (e.g. `[[MyNote]]`, `[[#MyHeader]]`) elements in HTML format
 */
export const getInternalLinks = (element: HTMLElement): NodeListOf<Element> => {
    return element.querySelectorAll('a.internal-link');
}

/**
 * Parses special headers from a list of strings
 * @dev Special header framed by `!`
 * @example
 * ```
 * // Returns {test1: 'Foo', test2: 'Bar'}:
 * getSpecialHeaderContent(['!test1:Foo!', '!test2:Bar!']);
 * ```
 * @param {string[]} headers Strings that represents a headers of note link
 * @returns {LinkHeaders} Object of the special headers that begins and ends with the character `!`
 */
export const parseSpecialHeaders = (headers: string[]): LinkHeaders => {
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
        if (value === '\\#') {
            value = '#';
        }
        specialHeaders[key] = value;
    }
    return { specialHeaders, nonSpecialHeaders };
}

/**
 * @param {Element[]} links Internal links of note
 * @returns {NoteLink[]}
 */
export const getNotes = (notesMap: Map<string, TFile>, links: Element[]): NoteLink[] => {
    const notes: NoteLink[] = [];

    for (let i = 0; i < links.length; i++) {
        const link: Element = links[i];
        let note: NoteLink | undefined;
        const hrefAttribute = link.getAttribute('href');
        if (hrefAttribute) {
            const [href, ...headers] = splitHeadersWithEscapedSymbols(hrefAttribute);
            const fileName = href + '.md';
            let file: TFile | undefined = notesMap.get(fileName);

            if (file) {
                note = { file, link, headers };
            }
        }
        if (note) {
            notes.push(note);
        }
    }

    return notes;
}
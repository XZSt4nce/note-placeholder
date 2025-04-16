import { TFile } from 'obsidian';
import { LinkHeaders, NoteLink, SpecialHeaders } from './types';

/**
 * Split headings by #, excluding escaped ones
 * @param {string} hrefAttribute
 * @returns {string[]} Headers
 */
export const splitHeadersWithEscapedSymbols = (hrefAttribute: string): string[] => {
    const escapedGrid = '\\#';
    const tempMarker = '|~~~|';
    return hrefAttribute.replace(escapedGrid, tempMarker).split('#').map(el => el.replace(tempMarker, escapedGrid));
};

/**
 * @param {HTMLElement} element HTML element of note
 * @returns {NodeListOf<Element>} List of internal link (e.g. `[[MyNote]]`, `[[#MyHeader]]`) elements in HTML format
 */
export const getInternalLinks = (element: HTMLElement): NodeListOf<Element> => {
    return element.querySelectorAll('a.internal-link');
};

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
export const parseHeaders = (headers: string[]): LinkHeaders => {
    const nonSpecialHeaders: string[] = [];
    const specialHeaders: SpecialHeaders = {};
    for (const header of headers) {
        if (header.startsWith('!') && header.endsWith('!')) {
            const [key, value] = header.slice(1, -1).split(':');
            if (value === '\\#') {
                specialHeaders[key] = '#';
            } else {
                specialHeaders[key] = value;
            }
        } else {
            nonSpecialHeaders.push(header);
        }
    }

    return { specialHeaders, nonSpecialHeaders };
};

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
            const file: TFile | undefined = notesMap.get(fileName);

            if (file) {
                note = { file, link, headers };
            }
        }
        if (note) {
            notes.push(note);
        }
    }

    return notes;
};

/**
 * Removes `^` from block header
 * @param {string[]} headers
 */
export const removeBlockCircumflex = (headers: string[]) => {

    // Count of headers that begins with the character `^`
    const blockHeaders = headers.filter((value: string) => value.startsWith('^'));

    // Remove the `^` character in the block header
    if (blockHeaders.length === 1 && headers.length === 1) {
        blockHeaders[0] = blockHeaders[0].slice(1);
        return blockHeaders;
    }

    return headers;
};

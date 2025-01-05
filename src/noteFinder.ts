import { TFile } from "obsidian";
import { NoteLink } from "./types";
import { NoteMapper } from "./noteMapper";
import NotePlaceholderPlugin from "./main";

export class NoteFinder {
    noteMapper: NoteMapper;

    constructor(plugin: NotePlaceholderPlugin) {
        this.noteMapper = plugin.noteMapper;
    }

    /**
     * @param links Internal links of note
     * @returns List of special note structs {@link NoteLink}
     */
    getNotes(links: NodeListOf<Element>): NoteLink[] {
        const notes: NoteLink[] = [];

        for (let i = 0; i < links.length; i++) {
            const note = this.getNote(links[i]);
            if (note) {
                notes.push(note);
            }
        }

        return notes;
    }

    /**
     * @param link HTML element of internal link
     * @returns Special note struct {@link NoteLink} (if link is valid)
     */
    getNote(link: Element): NoteLink | undefined {
        const hrefAttribute = link.getAttribute('href');
        if (hrefAttribute) {
            const [href, ...headers]: string[] = hrefAttribute.split(/(?<!\\)#/);
            const fileName = href + '.md';
            let file: TFile | undefined = this.noteMapper.getFileByName(fileName);

            if (file) {
                return { file, link, headers };
            }
        }
    }
}

import { App, TFile } from "obsidian";
import { NoteProperties } from "./types";

export class PropertiesParser {
    app: App

    constructor(app: App) {
        this.app = app;
    }

    /**
     * @param file File of note
     * @returns Note properties
     */
    async parseNoteProperties(file: TFile): Promise<NoteProperties | undefined> {
        const cache = this.app.metadataCache.getFileCache(file);
        const frontmatter = cache?.frontmatter;
        return frontmatter;
    }
}

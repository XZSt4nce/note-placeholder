import { App, TFile } from "obsidian";
import { NoteProperties } from "./types";
import { load } from "./js-yaml";

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
        const fileContent = await this.app.vault.read(file);
        const yamlRegex = /---\n([\s\S]*?)\n---/;
        const yamlMatch = fileContent.match(yamlRegex);
        if (yamlMatch) {
            const yamlContent = yamlMatch[1];
            return this.parseYaml(yamlContent);
        }
    }

    /**
     * @param yamlContent Content in YAML format
     * @returns Content in key-value format
     */
    parseYaml(yamlContent: string): NoteProperties {
        return load(yamlContent);
    }
}

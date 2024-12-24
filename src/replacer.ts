import { TFile } from "obsidian";
import { DEFAULT_SETTINGS } from "./settings";
import NotePlaceholderPlugin from "./main";

type Note = {
    file: TFile,
    href: string
}

export class Replacer {
    plugin: NotePlaceholderPlugin

    constructor(notePlaceholderPlugin: NotePlaceholderPlugin) {
        this.plugin = notePlaceholderPlugin;
    }

    async replaceLinkNames(element: HTMLElement) {
        const links = this.getInternalLinks(element);
        const notes = this.getNotes(links);

        for (let i = 0; i < notes.length; i++) {
            const link = links[i];
            const note = notes[i];
            if (!note) {
                continue;
            }

            const placeholder = await this.getPlaceholderProperty(link, note);
            link.textContent = placeholder;
        }
    }

    getNotes(links: NodeListOf<Element>): (Note|undefined)[] {
        const notes: (Note|undefined)[] = [];

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const note = this.getNote(link);

            notes.push(note);
        }

        return notes;
    }

    getNote(link: Element): Note|undefined {
        const href: string = link.getAttribute('href')!;
        const fileName = href + '.md';
        let file: TFile|null = null;

        for (let mdFile of this.plugin.app.vault.getMarkdownFiles()) {
            if (mdFile.name === fileName) {
                file = mdFile;
                break;
            }
        }

        let note: Note|undefined = undefined;
        if (file instanceof TFile) {
            note = {file, href};
        }

        return note;
    }

    getInternalLinks(element: HTMLElement): NodeListOf<Element> {
        return element.querySelectorAll('a.internal-link');
    }

    async getPlaceholderProperty(link: Element, note: Note): Promise<string> {
        const fileContent = await this.plugin.app.vault.read(note.file);
        const yamlRegex = /---\n([\s\S]*?)\n---/;
        const yamlMatch = fileContent.match(yamlRegex);
        if (yamlMatch) {
            const yamlContent = yamlMatch[1];
            const yamlObject = this.parseYaml(yamlContent);
            const placeholder = yamlObject['placeholder'];
            if (placeholder) {
                const settings = this.plugin.settings || DEFAULT_SETTINGS;
                const noName = link.textContent === note.href;
                const namesOff = settings.useLinkNameInsteadOfPlaceholder === "always off";
                const disablePlaceholder = settings.textToDisablePlaceholder === link.textContent;

                if (disablePlaceholder) {
                    return note.href;
                } else if (noName || namesOff) {
                    return placeholder;
                }
            }
        }

        return link.textContent!;
    }

    parseYaml(yamlContent: string): any {
        const yaml = require("./js-yaml");
        return yaml.load(yamlContent);
    }
}
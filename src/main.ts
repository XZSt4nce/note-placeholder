import { Plugin, TFile } from 'obsidian';
import { NotePlaceholderSettings, DEFAULT_SETTINGS } from './settings/settings';
import { PlaceholderSettingTab } from './settings/settingsTab';
import Replacer from './replacer';
import NoteEventHandlers from './event-handlers/noteEventHandlers';
import Commands from './commands';
import RibbonIcons from './ribbonIcons';


export default class NotePlaceholderPlugin extends Plugin {
    public settings: NotePlaceholderSettings;
    public notesMap: Map<string, TFile>;
    private replacer: Replacer;

    async onload() {
        this.app.workspace.onLayoutReady(() => {
            this.initPlugin();
        });
    }

    private initPlugin() {
        this.notesMap = new Map(this.app.vault.getMarkdownFiles().map(file => [file.name, file]));
        this.replacer = new Replacer(this);

        this.loadSettings().then(() => {
            new NoteEventHandlers(this).registerEventHandlers();

            new RibbonIcons(this).addIcons();

            // This adds a settings tab so the user can configure various aspects of the plugin
            this.addSettingTab(new PlaceholderSettingTab(this));

            this.registerReplacer();

            new Commands(this).addCommands();
        });
    }

    private registerReplacer() {
        this.registerMarkdownPostProcessor((element: HTMLElement) => {
            this.replacer.replaceLinkNames(element);
        });
    }

    private async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    public async saveSettings() {
        await this.saveData(this.settings);
        this.registerReplacer();
    }
}

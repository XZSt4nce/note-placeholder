import { Plugin } from 'obsidian';
import { NotePlaceholderSettings, DEFAULT_SETTINGS } from './settings';
import { PlaceholderSettingTab } from './settingsTab';
import { PlaceholderPropertyModal } from './placeholderPropertyModal';
import { Replacer } from './replacer';


export default class NotePlaceholderPlugin extends Plugin {
	settings: NotePlaceholderSettings;
    replacer: Replacer

	async onload() {
        this.replacer = new Replacer(this);
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('any-key', 'Add Placeholder', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new PlaceholderPropertyModal(this.app).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PlaceholderSettingTab(this));

		// Register the placeholder property processor
        this.registerMarkdownPostProcessor((element) => {
            this.replacer.replaceLinkNames(element);
        });
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

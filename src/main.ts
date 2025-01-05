import { Plugin } from 'obsidian';
import { NotePlaceholderSettings, DEFAULT_SETTINGS } from './settings';
import { PlaceholderSettingTab } from './settingsTab';
import { PlaceholderPropertyModal } from './placeholderPropertyModal';
import { Replacer } from './replacer';
import { NoteMapper } from './noteMapper';


export default class NotePlaceholderPlugin extends Plugin {
	settings: NotePlaceholderSettings;
	replacer: Replacer
	noteMapper: NoteMapper

	async onload() {
		this.noteMapper = new NoteMapper(this.app);
		this.replacer = new Replacer(this);

		await this.loadSettings();

		// This creates an icon in the left ribbon that adds `placeholder` property to a note.
		this.addRibbonIcon('any-key', 'Add Placeholder', () => {
			// Called when the user clicks the icon.
			new PlaceholderPropertyModal(this.app).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PlaceholderSettingTab(this));

		this.registerReplacer();
	}

	async onunload() {
		this.noteMapper.unregisterEventHandlers();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.registerReplacer();
	}

	registerReplacer() {
		this.registerMarkdownPostProcessor((element: HTMLElement) => {
			this.replacer.replaceLinkNames(element);
		});
	}
}

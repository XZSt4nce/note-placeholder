import { Plugin, TFile } from 'obsidian';
import { NotePlaceholderSettings, DEFAULT_SETTINGS } from './settings/settings';
import { PlaceholderSettingTab } from './settings/settingsTab';
import PlaceholderPropertyModal from './modals/placeholderPropertyModal';
import Replacer from './replacer';
import NoteEventHandlers from './event-handlers/noteEventHandlers';


export default class NotePlaceholderPlugin extends Plugin {
	public settings: NotePlaceholderSettings;
	public notesMap: Map<string, TFile>
	private replacer: Replacer;
	private noteEventHandlers: NoteEventHandlers;

	async onload() {
		this.notesMap = new Map(this.app.vault.getMarkdownFiles().map(file => [file.name, file]));
		this.noteEventHandlers = new NoteEventHandlers(this);
		this.replacer = new Replacer(this);

		await this.loadSettings();

		// This creates an icon in the left ribbon that adds `placeholder` property to a note.
		this.addRibbonIcon('any-key', 'Add placeholder', () => {
			// Called when the user clicks the icon.
			new PlaceholderPropertyModal(this.app).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PlaceholderSettingTab(this));

		this.registerReplacer();

		this.addCommand({
			id: 'add-placeholder-property',
			name: 'Add placeholder property',
			editorCheckCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (file && file.extension === 'md') {
					if (!checking) {
						new PlaceholderPropertyModal(this.app).open();
					}
					
					return true;
				}
				return false;
			}
		})
	}

	onunload() {
		this.noteEventHandlers.unregisterEventHandlers();
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

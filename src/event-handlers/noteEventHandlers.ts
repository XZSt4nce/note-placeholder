import { TAbstractFile, TFile } from 'obsidian';
import NotePlaceholderPlugin from 'src/main';

export default class NoteEventHandlers {
    private plugin: NotePlaceholderPlugin;
    private createEventHandler: (file: TAbstractFile) => void;
    private deleteEventHandler: (file: TAbstractFile) => void;
    private renameEventHandler: (file: TFile, oldPath: string) => void;

    constructor(plugin: NotePlaceholderPlugin) {
        this.plugin = plugin;
        this.createEventHandler = this.handleFileCreate.bind(this);
        this.deleteEventHandler = this.handleFileDelete.bind(this);
        this.renameEventHandler = this.handleFileRename.bind(this);
        this.registerEventHandlers();
    }

    /**
     * Register event handlers.
     */
    registerEventHandlers() {
        this.plugin.registerEvent(this.plugin.app.vault.on('create', this.createEventHandler));
        this.plugin.registerEvent(this.plugin.app.vault.on('delete', this.deleteEventHandler));
        this.plugin.registerEvent(this.plugin.app.vault.on('rename', this.renameEventHandler));
    }

    /**
     * Handle note creation event.
     * @param {TAbstractFile} file Created file or folder
     */
    handleFileCreate(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            const markdownFile = file;
            this.plugin.notesMap.set(markdownFile.name, markdownFile);
        }
    }

    /**
     * Handle note deletion event.
     * @param {TAbstractFile} file Deleted file or folder
     */
    handleFileDelete(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            this.plugin.notesMap.delete(file.name);
        }
    }

    /**
     * Handle note rename event.
     * @param {TFile} file Renamed file
     * @param {string} oldPath Old path of the file
     */
    handleFileRename(file: TFile, oldPath: string) {
        if (file.extension === 'md') {
            const oldName = oldPath.split('/').pop();
            if (oldName) {
                this.plugin.notesMap.delete(oldName);
                this.plugin.notesMap.set(file.name, file);
            }
        }
    }
}

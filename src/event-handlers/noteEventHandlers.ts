import { TAbstractFile, TFile, Vault } from 'obsidian';
import NotePlaceholderPlugin from 'src/main';

export default class NoteEventHandlers {
    private vault: Vault;
    private notesMap: Map<string, TFile>;
    private createEventHandler: (file: TAbstractFile) => void;
    private deleteEventHandler: (file: TAbstractFile) => void;
    private renameEventHandler: (file: TFile, oldPath: string) => void;

    constructor(plugin: NotePlaceholderPlugin) {
        this.vault = plugin.app.vault;
        this.notesMap = plugin.notesMap;
        this.createEventHandler = this.handleFileCreate.bind(this);
        this.deleteEventHandler = this.handleFileDelete.bind(this);
        this.renameEventHandler = this.handleFileRename.bind(this);
        this.registerEventHandlers();
    }

    /**
     * Register event handlers.
     */
    registerEventHandlers() {
        this.vault.on('create', this.createEventHandler);
        this.vault.on('delete', this.deleteEventHandler);
        this.vault.on('rename', this.renameEventHandler);
    }

    /**
     * Unregister event handlers.
     */
    unregisterEventHandlers() {
        this.vault.off('create', this.createEventHandler);
        this.vault.off('delete', this.deleteEventHandler);
        this.vault.off('rename', this.renameEventHandler);
    }

    /**
     * Handle note creation event.
     * @param {TAbstractFile} file Created file or folder
     */
    handleFileCreate(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            const markdownFile = file;
            this.notesMap.set(markdownFile.name, markdownFile);
        }
    }

    /**
     * Handle note deletion event.
     * @param {TAbstractFile} file Deleted file or folder
     */
    handleFileDelete(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            this.notesMap.delete(file.name);
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
                this.notesMap.delete(oldName);
                this.notesMap.set(file.name, file);
            }
        }
    }
}

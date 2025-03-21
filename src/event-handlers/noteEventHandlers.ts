import { TAbstractFile, TFile } from 'obsidian';
import NotePlaceholderPlugin from 'src/main';

export default class NoteEventHandlers {
    private plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        this.plugin = plugin;
        this.registerEventHandlers();
    }

    /**
     * Register event handlers.
     */
    public registerEventHandlers() {
        this.plugin.registerEvent(this.plugin.app.vault.on('create', this.handleFileCreate));
        this.plugin.registerEvent(this.plugin.app.vault.on('delete', this.handleFileDelete));
        this.plugin.registerEvent(this.plugin.app.vault.on('rename', this.handleFileRename));
    }

    /**
     * Handle note creation event.
     * @param {TAbstractFile} file Created file or folder
     */
    private handleFileCreate(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            const markdownFile = file;
            this.plugin.notesMap.set(markdownFile.name, markdownFile);
        }
    }

    /**
     * Handle note deletion event.
     * @param {TAbstractFile} file Deleted file or folder
     */
    private handleFileDelete(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            this.plugin.notesMap.delete(file.name);
        }
    }

    /**
     * Handle note rename event.
     * @param {TFile} file Renamed file
     * @param {string} oldPath Old path of the file
     */
    private handleFileRename(file: TFile, oldPath: string) {
        if (file.extension === 'md') {
            const oldName = oldPath.split('/').pop();
            if (oldName) {
                this.plugin.notesMap.delete(oldName);
                this.plugin.notesMap.set(file.name, file);
            }
        }
    }
}

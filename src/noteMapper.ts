import { App, TAbstractFile, TFile } from "obsidian";

export class NoteMapper {
    app: App;
    notesMap: Map<string, TFile>
    private createEventHandler: (file: TAbstractFile) => void;
    private deleteEventHandler: (file: TAbstractFile) => void;
    private renameEventHandler: (file: TFile, oldPath: string) => void;

    constructor(app: App) {
        this.app = app;
        this.notesMap = new Map();
        this.initializeFileMap();
        this.createEventHandler = this.handleFileCreate.bind(this);
        this.deleteEventHandler = this.handleFileDelete.bind(this);
        this.renameEventHandler = this.handleFileRename.bind(this);
        this.registerEventHandlers();
    }

    /**
     * Initialize the note map with existing markdown files.
     */
    initializeFileMap() {
        const markdownFiles = this.app.vault.getMarkdownFiles();
        this.notesMap = new Map(markdownFiles.map(file => [file.name, file]));
    }

    /**
     * Register event handlers.
     */
    registerEventHandlers() {
        this.app.vault.on('create', this.createEventHandler);
        this.app.vault.on('delete', this.deleteEventHandler);
        this.app.vault.on('rename', this.renameEventHandler);
    }

    /**
     * Unregister event handlers.
     */
    unregisterEventHandlers() {
        this.app.vault.off('create', this.createEventHandler);
        this.app.vault.off('delete', this.deleteEventHandler);
        this.app.vault.off('rename', this.renameEventHandler);
    }

    /**
     * Handle note creation event.
     * @param file Created file or folder
     */
    handleFileCreate(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            const markdownFile = file as TFile; // Type assertion
            this.notesMap.set(markdownFile.name, markdownFile);
        }
    }

    /**
     * Handle note deletion event.
     * @param file Deleted file or folder
     */
    handleFileDelete(file: TAbstractFile) {
        if (file instanceof TFile && file.extension === 'md') {
            this.notesMap.delete(file.name);
        }
    }

    /**
     * Handle note rename event.
     * @param file Renamed file
     * @param oldPath Old path of the file
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

    /**
     * Get a note from the map by its name.
     * @param fileName The name of the file.
     * @returns The note if it exists in the map, otherwise undefined.
     */
    getFileByName(fileName: string): TFile | undefined {
        return this.notesMap.get(fileName);
    }
}

import { TFile } from 'obsidian';
import NotePlaceholderPlugin from './main';
import PlaceholderPropertyModal from './modals/placeholderPropertyModal';

export default class Commands {
    private plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        this.plugin = plugin;
    }

    public addCommands() {
        this.addPlaceholderProperty();
    }

    private addPlaceholderProperty() {
        this.plugin.addCommand({
            id: 'add-placeholder-property',
            name: 'Add placeholder property',
            editorCheckCallback: (checking: boolean) => {
                const file: TFile | null = this.plugin.app.workspace.getActiveFile();
                if (file && file.extension === 'md') {
                    if (!checking) {
                        new PlaceholderPropertyModal(this.plugin.app).open();
                    }

                    return true;
                }
                return false;
            }
        });
    }
}

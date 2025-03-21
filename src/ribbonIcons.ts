import NotePlaceholderPlugin from './main';
import PlaceholderPropertyModal from './modals/placeholderPropertyModal';

export default class RibbonIcons {
    private plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        this.plugin = plugin;
    }

    public addIcons() {
        this.addPlaceholderIcon();
    }

    private addPlaceholderIcon() {
        // This creates an icon in the left ribbon that adds `placeholder` property to a note.
        this.plugin.addRibbonIcon('any-key', 'Add placeholder', () => {
            // Called when the user clicks the icon.
            new PlaceholderPropertyModal(this.plugin.app).open();
        });
    }
}
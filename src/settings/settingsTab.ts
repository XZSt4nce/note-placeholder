import { PluginSettingTab, Setting } from 'obsidian';
import NotePlaceholderPlugin from 'src/main';
import { Options } from './settings';
import { SettingItem } from 'src/types';

export class PlaceholderSettingTab extends PluginSettingTab {
    private plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }

    /**
     * Display settings of {@link NotePlaceholderPlugin}
     */
    display() {
        const containerEl: HTMLElement = this.containerEl;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Placeholder property name')
            .setDesc('The name of the property, the text of which will be substituted for the link')
            .addText(tc =>
                tc.setValue(this.plugin.settings.placeholderPropertyName)
                    .onChange(async (value: string) => {
                        this.plugin.settings.placeholderPropertyName = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use link name instead of placeholder')
            .setDesc(this.settingItems([
                { item: Options.DNFS, description: 'the placeholder will only be shown if the link name is not specified' },
                { item: Options.AF, description: 'the placeholder will always be shown instead of link name' }
            ]))
            .addDropdown(dc =>
                dc.addOptions({
                    'default on, but off when specified': Options.DNFS,
                    'always off': Options.AF,
                })
                    .setValue(this.plugin.settings.useLinkNameInsteadOfPlaceholder)
                    .onChange(async (value: (typeof Options.DNFS | typeof Options.AF)) => {
                        this.plugin.settings.useLinkNameInsteadOfPlaceholder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Text to disable placeholder')
            .setDesc('If you pass this text to the link as a name, then the placeholder will not be used and the name of the note will be displayed')
            .addText(tc =>
                tc.setValue(this.plugin.settings.textToDisablePlaceholder)
                    .onChange(async (value: string) => {
                        this.plugin.settings.textToDisablePlaceholder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Default headers separator')
            .setDesc('Text between the text between the placeholder and headers/block. You can specify it for links using a special header (at the end) like \'!sep:SEP!\', then the link [[MyNote#someHeader#!sep:SEP!]] will be displayed as \'MyNoteSEPsomeHeader\'.')
            .addText(tc =>
                tc.setValue(this.plugin.settings.defaultHeaderSeparator)
                    .onChange(async (value: string) => {
                        this.plugin.settings.defaultHeaderSeparator = value;
                        await this.plugin.saveSettings();
                    })
            );
    }

    /**
     * Beautiful fragment of setting with items
     * @param items Object with items {@link SettingItem}
     * @returns Fragment that represents items of setting
    */
    settingItems(items: SettingItem[]) {
        return createFragment((frag: DocumentFragment) => {
            for (const item of items) {
                const container: HTMLDivElement = frag.createDiv();
                container.createEl('b', { text: item.item });
                container.createSpan({ text: ` : ${item.description}` });
            }
        });
    }
}

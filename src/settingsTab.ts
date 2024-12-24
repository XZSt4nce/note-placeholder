import { App, PluginSettingTab, Setting } from "obsidian";
import NotePlaceholderPlugin from "./main";


export const fragWithHTML = (text: string) => {
    return createFragment((frag) => {
        frag.createDiv().innerHTML = text.split("\n").map((line) => line.trim()).join("<br>");
    });
}

export class PlaceholderSettingTab extends PluginSettingTab {
    plugin: NotePlaceholderPlugin;

    constructor(plugin: NotePlaceholderPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h1", { text: "Note Placeholder" });

        new Setting(containerEl)
            .setName('Use Link Name Instead Of Placeholder')
            .setDesc(fragWithHTML(`- <b>default on, but off when specified</b> : the placeholder will only be shown if the link name is not specified
				- <b>always off</b> : the placeholder will always be shown instead of link name`))
            .addDropdown(tc =>
                tc.addOptions({
                    "default on, but off when specified": "default on, but off when specified",
                    "always off": "always off",
                })
                    .setValue(this.plugin.settings.useLinkNameInsteadOfPlaceholder)
                    .onChange(async (value: ("default on, but off when specified" | "always off")) => {
                        this.plugin.settings.useLinkNameInsteadOfPlaceholder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Text To Disable Placeholder')
            .setDesc(fragWithHTML(`If you pass this text to the link as a name, then the placeholder will not be used and the name of the note will be displayed`))
            .addText(tc =>
				tc.setValue(this.plugin.settings.textToDisablePlaceholder)
					.onChange(async (value: string) => {
						this.plugin.settings.textToDisablePlaceholder = value;
						await this.plugin.saveSettings();
					})
            );
    }
}
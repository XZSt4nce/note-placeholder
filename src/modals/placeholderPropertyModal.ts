import { App, Modal, Setting, Notice, TFile } from 'obsidian';


export class PlaceholderPropertyModal extends Modal {
    private placeholderPropertyValue: string;

    constructor(app: App) {
        super(app);
        this.placeholderPropertyValue = '';
    }

    onOpen() {
        const { contentEl } = this;

        new Setting(contentEl).setName('Placeholder property').setHeading();

        const file = this.app.workspace.getActiveFile();
        if (!file) {
            new Notice('No active file found.');
            this.close();
            return;
        }

        if (file.extension !== 'md') {
            new Notice('Active file is not Markdown File.');
            this.close();
            return;
        }

        const metadata = this.app.metadataCache.getFileCache(file);
        this.placeholderPropertyValue = metadata?.frontmatter?.placeholder || '';

        new Setting(contentEl)
            .setName('Placeholder property value')
            .addText(text => {
                text.setPlaceholder('Enter placeholder property value')
                    .setValue(this.placeholderPropertyValue)
                    .onChange(async (value) => {
                        this.placeholderPropertyValue = value;
                    })
                    .inputEl.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter') {
                            this.saveAndClose(file);
                        }
                    });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Save')
                .onClick(async () => {
                    await this.saveAndClose(file);
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    private async saveAndClose(file: TFile) {
        if (file) {
            await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                frontmatter.placeholder = this.placeholderPropertyValue;
                new Notice(`Added placeholder property (${this.placeholderPropertyValue}) for file ${file.basename}`);
            });
        }
        this.close();
    }
}

export class PropertiesParser {
    parseFrontMatter(content: string): Record<string, any> {
        const frontMatterRegex = /^---\s*([\s\S]*?)\s*---/;
        const match = content.match(frontMatterRegex);

        if (match) {
            const yamlContent = match[1];
            return this.parseYaml(yamlContent);
        }

        return {};
    }

    parseYaml(yamlContent: string): Record<string, any> {
        const lines = yamlContent.split('\n');
        const result: Record<string, any> = {};

        lines.forEach(line => {
            const [key, value] = line.split(':').map(part => part.trim());
            if (key && value) {
                result[key] = value;
            }
        });

        return result;
    }
}
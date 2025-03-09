import { TFile } from 'obsidian';

export type InternalLinks = {
    blockLinks: Element[], // Links to the blocks in the current note
    noteLinks: Element[] // Links to other notes
}

export type LinkHeaders = {
    specialHeaders: SpecialHeaders, // Headers framed by `!`
    nonSpecialHeaders: string[] // Other headers
}

export type NoteLink = {
    file: TFile, // The file associated with the note
    link: Element, // Element of the internal link to the note
    headers: string[] // A list of headings or block for an internal link
}

export type NoteProperties = {
    placeholder?: string; // placeholder property that displaying instead of default internal link view
    [key: string]: any; // other properties
};

export type SpecialHeaders = {
    sep?: string; // separator header that displaying between placeholder and headers/block
    [key: string]: any; // other special headers
}

export type SettingItem = {
    item: string; // Name of setting item
    description: string; // Description of setting item
};

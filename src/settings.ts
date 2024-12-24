export interface NotePlaceholderSettings {
	useLinkNameInsteadOfPlaceholder: ("default on, but off when specified" | "always off");
	textToDisablePlaceholder: string
}

export const DEFAULT_SETTINGS: NotePlaceholderSettings = {
	useLinkNameInsteadOfPlaceholder: "default on, but off when specified",
	textToDisablePlaceholder: "!dp!"
}
export const Options = {
	DNFS: 'default on, but off when specified',
	DFNS: 'default off, but on when specified',
	AN: 'always on',
	AF: 'always off'
};

export interface NotePlaceholderSettings {
	/**
	 * Whether the custom link name will be used instead of placeholder
	 * @defaultValue `default on, but off when specified`
	 */
	useLinkNameInsteadOfPlaceholder: (typeof Options.DNFS | typeof Options.AF);

	/**
	 * Text to use filename instead of placeholder
	 * @defaultValue `!dp!`
	 */
	textToDisablePlaceholder: string;

	/**
	 * Text that displaying between placeholder and headers/block
	 * @defaultValue ` > `
	 */
	defaultHeaderSeparator: string;
};

export const DEFAULT_SETTINGS: NotePlaceholderSettings = {
	useLinkNameInsteadOfPlaceholder: Options.DNFS,
	textToDisablePlaceholder: '!dp!',
	defaultHeaderSeparator: ' > '
};

# Note Placeholder

[Obsidian](https://obsidian.md) plugin developed by XZSt4nce

[ English | [Русский](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/README_ru.md) ]

With Note Placeholder, you can add text that will be automatically inserted in place of the link in view mode.

## Features

### Placeholder

You can add a placeholder for the note link by adding the `placeholder` (if it has not been redefined in the settings) property to it.

![placeholderProperty](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/placeholderProperty.png)

So this:

![noteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/noteLink.png)

Will be displayed (in view mode) like this:

![placeholderedNoteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/placeholderedNoteLink.png)

### Separator

You can specify separator for a headers and a specific block by specifying the special header `sep`

**Example 1**:

Link in source mode:

![headerSource](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/headerSource.png)

Link in view mode:

![headerView](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/headerView.png)

**Example 2**:

Link in source mode:

![blockSource](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/blockSource.png)

Link in view mode:

![blockView](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/blockView.png)

## Settings

- Placeholder property name : the name of the property, the text of which will be substituted for the link
- Use link name instead of placeholder
  - `default on, but off when specified` : the placeholder will only be shown if the link name is not specified
  - `always off` : the placeholder will always be shown instead of link name
- Text to disable placeholder : if you insert this text as the link name, the note name will be displayed (default: `!dp!`)
- Default header separator : text between the placeholder and headers/block (default: ` > `)

## License

MIT License

## Bug Report, Feature Request

If you find any bugs or have any feature requests, please report them on the [GitHub Issues](https://github.com/XZSt4nce/note-placeholder/issues). Thank you!

## Changelog

Versions are controlled by the rule below.

- Version x.y.z
  - x : increased when huge changes are made(ex. change of logic, etc.)
  - y : increased when features are newly added or changed
  - z : increased when bug fixes are made

# Note Placeholder

[Obsidian](https://obsidian.md) plugin developed by XZSt4nce

[ English | [Русский](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/README_ru.md) ]

With Note Placeholder, you can add text that will be automatically inserted in place of the link in view mode.

## Features

### Placeholder

You can add a placeholder for the note link by adding the `placeholder` property to it.

![placeholderProperty](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/placeholderProperty.png)

So this:

![noteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/noteLink.png)

Will be displayed (in view mode) like this:

![placeholderedNoteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/placeholderedNoteLink.png)

## Settings

- Use Link Name Instead Of Placeholder
  - default on, but off when specified : the placeholder will only be shown if the link name is not specified
  - always off : the placeholder will always be shown instead of link name
- Text To Disable Placeholder : if you insert this text as the link name, the note name will be displayed (default: !dp!)

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

### 1.0.0

- Initial release
- Add features
  - Add button to add `placeholder` property
  - Add replacing link name to placeholder
  - Add feature that replaces all internal links to placeholder, even link has name
  - Add text to disable replacing link name to placeholder

### 1.0.1

- Refactoring:
  - Settings Tab
    - Using `Obsidian HTML Elements` instead of `innerHTML`

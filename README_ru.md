# Note Placeholder

[Obsidian](https://obsidian.md) plugin developed by XZSt4nce

[ [English](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/README.md) | Русский ]

С помощью Note Placeholder, вы можете добавить заполнитель, который будет автоматически подставлен в качестве имени ссылки в режиме просмотра.

## Функции

### Заполнитель

Вы можете добавить заполнитель для имени ссылки, добавив заметке свойство `placeholder` (если не было переопределено в настройках).

![placeholderProperty](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/placeholderProperty.png)

Так что это:

![noteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/noteLink.png)

Будет отображено (в режиме просмотра) таким образом:

![placeholderedNoteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/placeholderedNoteLink.png)

### Разделитель

Вы можете указать разделитель для заголовков или конкретного блока, указав специальный заголовок `sep`

**Пример 1**:

Ссылка в режиме редактирования:

![headerSource](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/headerSource.png)

Ссылка в режиме просмотра:

![headerView](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/headerView.png)

**Пример 2**:

Ссылка в режиме редактирования:

![blockSource](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/blockSource.png)

Ссылка в режиме просмотра:

![blockView](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/main/images/blockView.png)

## Настройки

- Placeholder property name : имя свойства, текст которого будет подставляться вместо ссылки (по умолчанию: `placeholder`)
- Use link name instead of placeholder
  - `default on, but off when specified` : заполнитель будет использован только в том случае, если имя ссылки не определено
  - `always off` : заполнитель всегда будет использован в качестве имени ссылки
- Text to disable placeholder : если вы вставите этот текст в качестве имени ссылки, будет отображено имя заметки (по умолчанию: `!dp!`)
- Default headers separator : текст между заполнителем и заголовками/блоком (по умолчанию: ` > `)

## Лицензия

MIT License

## Сообщение Об Ошибках, Предложение Функций

Если вы нашли какую-то ошибку или у вас есть предложение, пожалуйста, напишите об этом в [GitHub Issues](https://github.com/XZSt4nce/note-placeholder/issues). Спасибо!

## Журнал изменений

Версии изменяются по правилам ниже.

- Версии x.y.z
  - x : увеличивается, когда происходят большие изменения (например, изменение логики и т.д.)
  - y : увеличивается, когда добавляются новые функции или изменяются старые
  - z : увеличивается, когда исправляются ошибки

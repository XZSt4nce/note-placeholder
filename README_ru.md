# Note Placeholder

[Obsidian](https://obsidian.md) plugin developed by XZSt4nce

[ [English](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/master/README.md) | Русский ]

С помощью Note Placeholder, вы можете добавить заполнитель, который будет автоматически подставлен в качестве имени ссылки в режиме просмотра.

## Функции

### Заполнитель

Вы можете добавить заполнитель для имени ссылки, добавив заметке свойство `placeholder`.

![placeholderProperty](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/master/images/placeholderProperty.png)

Так что это:

![noteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/master/images/noteLink.png)

Будет отображено (в режиме просмотра) таким образом:

![placeholderedNoteLink](https://github.com/XZSt4nce/obsidian-note-placeholder/blob/master/images/placeholderedNoteLink.png)

## Настройки

- Use Link Name Instead Of Placeholder
  - default on, but off when specified : заполнитель будет использован только в том случае, если имя ссылки не определено
  - always off : заполнитель всегда будет использован в качестве имени ссылки
- Text To Disable Placeholder : если вы вставите этот текст в качестве имени ссылки, будет отображено имя заметки (по умолчанию: !dp!)

## Лицензия

MIT License

## Сообщение Об Ошибках, Предложение Функций

Если вы нашли какую-то ошибку или у вас есть предложение, пожалуйста, напишите об этом в GitHub Issues. Спасибо!

## Журнал изменений

Версии изменяются по правилам ниже.

- Версии x.y.z
  - x : увеличивается, когда происходят большие изменения (например, изменение логики и т.д.)
  - y : увеличивается, когда добавляются новые функции или изменяются старые
  - z : увеличивается, когда исправляются ошибки

### 1.0.0

- Первоначальный выпуск
- Добавлены функции
  - Добавлена кнопка для добавления свойства `placeholder`
  - Добавлена замена имени ссылки на заполнитель
  - Добавлена функция, которая заменяет все внутренние ссылки на заполнитель, даже если у них есть имя
  - Добавлен текст, который отключает использование заполнителя
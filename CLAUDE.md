# Bulweb2 — сайт кофейни «Bulochka»

## Что это
Статический сайт для небольшой пекарни-кофейни в Израиле. Три файла:
- `index.html` — главная страница
- `menu.html` — отдельная страница меню
- `style.css` — общие стили (nav, footer, placeholders) для обоих страниц

Исходный файл дизайна: `D _ Light Modern.html` (18 МБ, экспорт из дизайн-инструмента) — только для справки по дизайну и контенту, не редактировать.

## Технологии
Чистый HTML/CSS/JS, без фреймворков. Mobile-first, breakpoints: 900px и 640px.

## Дизайн-токены (из `style.css`)
```css
--cream: #fbf8f2  --cream-mid: #f4eee2
--brown-dark: #2a1f18  --brown-mid: #7a5a3f
--brown-light: #9c8978  --brown-faint: rgba(42,31,24,0.08)
--sage: #6b8e5a
--serif: 'Newsreader', Georgia, serif
--sans: 'Inter Tight', system-ui, sans-serif
```
Шрифты подключены через Google Fonts CDN.

## Ключевые решения
- Заголовки: Newsreader, weight 300, tight tracking (`clamp(42px, 8vw, 104px)`)
- Логотип в nav: Newsreader italic 400 30px
- Кнопка Reserve: outline pill (`border-radius: 100px`, прозрачный фон)
- Зелёная точка перед часами: `nav-hours::before { content: '•'; color: var(--sage); }`
- Фото: не используются нигде. Везде `.photo-placeholder` с диагональным паттерном.
- В меню фото вообще нет (только типографика)

## Структура index.html
Hero → Сегодняшний фильтр-кофе → 4 особенности → «The Room» (5 фото-плейсхолдеров) → Медовик (feature section) → Visit (адрес/часы) → Footer

## Структура menu.html
Hero-заголовок → Jump nav (Coffee / Croissants / Filled / Cakes) → 4 категории × всего 24 позиции. Меню — чисто типографическое, без фото.

## Контент (кратко)
- Адрес: 14 Pekarnaya Lane, Old Town
- Телефон: +1 (415) 555-0179
- Часы: Mon–Fri 07:30–20:00, Sat 08:00–21:00, Sun 08:30–19:00
- Кофе: 8 позиций ($2.80–$4.40), Круассаны: 4 ($3.40–$4.80)
- Filled croissants: 6 ($5.40–$7.20), Cakes & slices: 6 ($4.40–$5.80)

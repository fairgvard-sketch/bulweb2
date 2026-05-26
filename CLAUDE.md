# Bulweb2 — сайт кофейни «Bulochka»

## Что это
Статический сайт для небольшой пекарни-кофейни в Израиле. Основные файлы:
- `index.html` — главная страница
- `menu.html` — страница меню (98 позиций, данные из Firebase Firestore)
- `careers.html` — страница вакансий
- `events.html` — страница мероприятий
- `style.css` — общие стили (nav, footer, shared components)
- `lang.js` — переключение языков (EN/HE/RU)
- `mobile-menu.js` — мобильное меню
- `analytics.js` — Firebase Analytics
- `admin/` — панель администратора

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
- Фото: используются на главной (hero, room grid, medovik, visit). В меню — реальные фото блюд из `img/`.
- `.photo-placeholder` с диагональным паттерном остался как fallback.

## Структура index.html
Hero (фото + filter card) → Ticker strip → «The Room» (5 фото) → Медовик → Shop (динамический из Firestore, скрыт если пусто) → Visit (адрес/часы/фото фасада) → Footer

## Структура menu.html
Hero → Filter bar (sticky, 10 категорий) → 10 категорий × 98 позиций с фото. Кнопка «Add to order» открывает addon-модал с WhatsApp-заказом.

## Контент (кратко)
- Адрес: Pinsker 29, Petah Tikva
- Телефон: +972 (52) 966-2724
- Часы: Sun–Thu 08:00–20:00, Fri 08:00–15:00, Sat Closed
- Меню: 98 позиций — горячие (14), холодные (22), сэндвичи/салаты (16), выпечка (10), круассаны с начинкой (7), тарталетки (6), торты/десерты (4), мороженое (3), алкоголь (12), пятничное (7)

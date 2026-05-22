# ОСС — интерактивный прототип (модуль 1, путь администратора)

Кликабельный прототип сценария **администратора общего собрания собственников** (ОСС) на портале ГИС ЖКХ 3.0 — модуль 1 «Подготовка данных и инициация собрания».

## Live

🔗 https://yurivolkoff.github.io/oss-prototype/

## Что внутри

- **Экран 01** — дашборд дома с CTA «Начать собрание», статусом подготовки, цифровым потенциалом и историей ОСС.
- **Экран 02** — подготовка данных по дому 1/2: общая информация, КН, документы, обращение в Росреестр.
- **Экран 03** — подготовка данных 2/2: status rows, шахматка 120 квартир + 5 нежилых помещений, фильтры по типу/этажу/подъезду + чипы проблем.
- **Модалка квартиры (04)** — error-state поля, TabBar 3 собственников (verified/pending), валидация (email, phone, share, required ФИО), focus-trap и Esc.
- **Заглушка модуля 2** — куда ведёт «Продолжить» с экрана 03.

## Стек

- Vite + React 18 + TypeScript
- Zustand (один store `useMeeting`)
- React Router 6
- `@fontsource/golos-text` (400/500/600)
- CSS-variables tokens + CSS-mask icons

## Запуск локально

```bash
npm install
npm run dev          # http://127.0.0.1:5173
npm run build        # production build → dist/
node tests/e2e.mjs   # 34 e2e-проверки в Playwright
```

## Структура

```
src/
├── lib/           # types, seed, zustand store, toast, validators, demo-state
├── components/
│   ├── layout/    # PageShell, AppHeader, AddressBar, TopPromoBar, Footer, Stepper
│   ├── ui/        # Button, Card, Pill, Accordion, Modal, Popover, Toast, ...
│   └── house-grid/  # шахматка
├── screens/       # DashboardScreen, PrepHouseAScreen, PrepHouseBScreen, ApartmentModal, Module2Placeholder
└── styles/        # tokens.css (из design-pack), global.css
```

## Demo-controls

Query-параметр `?demo-state=<state>` для прыжков по состояниям собрания:

- `?demo-state=draft_preparation` — начать с экрана 02
- (модули 2-5 — заглушка, пока не реализованы)

## Спецификация

Спека в `../docs/oss-prototype/spec/`. Чек-листы — в `../docs/oss-prototype/logs/`.

## Hard rules (соблюдены)

- Русский текст preserved verbatim из спеки
- Один Card, Button, Pill, Modal, Stepper — никаких one-off
- Destructive actions: explicit click, no auto-execute (в этом модуле релевантно для будущих модулей)
- СНИЛС/паспорт — ephemeral state в M1 (не реализовано в этой версии модели данных)
- Видимое 2-px focus-кольцо
- Lowercase micro-labels
- TODO-маркеры для неясностей

# OLDSCOOL JEDI DEVELOPMENT — лендинг

Vite + React + Material UI, деплой на GitHub Pages: https://turukmaktu.github.io/map-presentation/

```sh
npm install
npm run dev      # локально
npm run build    # сборка в dist/
```

- Тексты — `src/content.ts`.
- GIF этапов — положите файлы в `public/gifs/` и пропишите `gif: 'gifs/step-1.gif'` у шага в `src/content.ts`. Без `gif` показывается скелетон.
- PDF тех. описания — `public/` + `techPdf` в `src/content.ts`.
- Форма обратной связи (reCAPTCHA v3 → Google Sheets) — [docs/FEEDBACK_SETUP.md](docs/FEEDBACK_SETUP.md).
- Аналитика (события лендинга → GA4, воронка) — [docs/ANALYTICS.md](docs/ANALYTICS.md).

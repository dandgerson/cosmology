# Cosmology

A **Reveal.js** presentation (React + TypeScript + Vite) about cosmological models across cultures. Slide content is driven by [`src/presentation.md`](src/presentation.md). Optional **per-slide panels** (details, article, sources) use [TanStack Router](https://tanstack.com/router) for URLs and deep linking.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Local dev server (default: http://localhost:5173) |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Editing content

- **Slides:** Edit `src/presentation.md`. Blocks are separated by `---`. Each slide uses the field labels defined in [`src/lib/presentationConfig.ts`](src/lib/presentationConfig.ts) (e.g. **Заголовок:**, **Текст на слайде:**, **Детали:**, **Статья:**, **Источники:**).
- **Image folders:** Map slide ids to folders under `src/img/` via `SLIDE_IMAGE_DIRS` in `presentationConfig.ts`. Add new extensions in the static glob in [`src/lib/slideImages.ts`](src/lib/slideImages.ts) (Vite requires a literal string).
- **Themes:** Theme switcher in the UI; choice is stored in `localStorage`.

## URLs

- `/` — title slide  
- `/slide/:slideId/main` — main panel (e.g. `/slide/2/main`)  
- `/slide/:slideId/details`, `/article`, `/sources` when those fields exist in markdown  

Keyboard: **← →** change horizontal slides; **↑ ↓** move between vertical panels when a slide has extra content.

## Deploy on Vercel

1. Push the repo to GitHub (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo.
3. Use the defaults Vercel suggests for Vite (or confirm **Build Command** `npm run build`, **Output Directory** `dist`).
4. The repo includes [`vercel.json`](vercel.json): framework **vite**, output **`dist`**, plus a rewrite so client-side routes (e.g. `/slide/2/sources`) return `index.html` while real files under `dist/` (JS, CSS, images) are still served normally.

**CLI (optional):**

```bash
npx vercel
```

For production:

```bash
npx vercel --prod
```

## Tech stack

- React 19, TypeScript, Vite  
- Reveal.js 6, TanStack Router, react-markdown  

## License

Specify in `package.json` or add a `LICENSE` file if you publish the project publicly.

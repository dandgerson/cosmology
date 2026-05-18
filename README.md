# Cosmology

A **Reveal.js** presentation (React + TypeScript + Vite) about cosmological models across cultures. Slide content is driven by [`src/presentation.md`](src/presentation.md). Optional **per-slide panels** (details, article, sources) use [TanStack Router](https://tanstack.com/router) for URLs and deep linking.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Local dev server (default: http://localhost:5173) |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run deploy` | Production deploy ([Vercel CLI](https://vercel.com/docs/cli); run `deploy:login` once first) |
| `npm run deploy:preview` | Preview deployment to Vercel |
| `npm run deploy:login` | Log in / refresh Vercel CLI token (fixes “token is not valid”) |
| `npm run lint` | ESLint |

## Editing content

All slide text, panel tab labels, and image galleries live in **`src/presentation.md`**. Parser constants (section delimiter, field headings) are in [`src/lib/presentationConfig.ts`](src/lib/presentationConfig.ts) only—no Russian field labels or image folder maps.

### Frontmatter

YAML at the top configures the deck:

```yaml
---
panels:
  main:
    label: Слайд
  details:
    label: Детали
    showImages: true
  article:
    label: Статья
  sources:
    label: Источники
---
```

- **`panels`** — tab labels and optional `showImages: true` (gallery on that panel; main always shows images when present).

### Slides

Separate slides with `---`. Slide order in the file is the presentation order; URLs use auto-numbered ids (`1`, `2`, `3`, …). Rearrange blocks freely—no `## slide/{id}` headers needed.

```markdown
### title
*Slide title*

### body
> Main slide text (blockquote optional)

### notes
Speaker notes (Reveal notes plugin)

### search
google image search query

### details
Optional extra panel content

### article
Markdown for the article panel

### sources
Markdown list for sources

### images
![Alt text](img/2/1.jpg)
Caption on the next line, or inline: ![Alt](img/2/1.jpg) — short caption
```

Field headings are fixed: `title`, `body`, `notes`, `search`, `details`, `article`, `sources`, `images`.

### Images

- One folder per slide: `src/img/{slideId}/` (e.g. slide 2 → `src/img/2/`).
- Name files `1.jpg`, `2.jpeg`, … in gallery order; reference them as `img/2/1.jpg` in markdown.
- List each file under the slide’s `### images` block; order in markdown = gallery order.
- Optional `alt` in `![...]`; description on the following line(s) or after ` — ` on the same line.

### Themes

Theme switcher in the UI; choice is stored in `localStorage`.

## URLs

- `/` — redirects to the first slide (`/slide/1/main`)  
- `/slide/:slideId/main` — main panel (e.g. `/slide/2/main`); `slideId` is position in the file (1-based)  
- `/slide/:slideId/details`, `/article`, `/sources` when those fields exist in markdown  

Keyboard: **← →** change horizontal slides; **↑ ↓** move between vertical panels when a slide has extra content. Bottom-right: Reveal arrow controls and a **slide counter** (tap to open a jump list).

## Mobile

The deck is **mobile-first**: on viewports under 768px wide it uses a compact slide size, touch swipes (Reveal built-in), larger tap targets for panel tabs and images, and safe-area padding for notched phones.

- Open the deployed URL on your phone (or use **Add to Home Screen** for a fullscreen-like app).
- **Swipe** horizontally for previous/next slide; **swipe** vertically when a slide has multiple panels (main / details / article).
- Pinch/zoom is handled by Reveal’s scale limits; rotate the device for more horizontal space on long text.

## Deploy on Vercel

1. Push the repo to GitHub (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo.
3. Use the defaults Vercel suggests for Vite (or confirm **Build Command** `npm run build`, **Output Directory** `dist`).
4. The repo includes [`vercel.json`](vercel.json): framework **vite**, output **`dist`**, plus a rewrite so client-side routes (e.g. `/slide/2/sources`) return `index.html` while real files under `dist/` (JS, CSS, images) are still served normally.

**CLI (optional):**

First time (or after *“The specified token is not valid”*):

```bash
npm run deploy:login
```

Then deploy:

```bash
npm run deploy
```

Preview deployment:

```bash
npm run deploy:preview
```

If deploy still fails, check that a bad `VERCEL_TOKEN` is not set in your shell or CI (unset it locally, or create a new token in the Vercel dashboard).

## Tech stack

- React 19, TypeScript, Vite  
- Reveal.js 6, TanStack Router, react-markdown, yaml  

## License

Specify in `package.json` or add a `LICENSE` file if you publish the project publicly.

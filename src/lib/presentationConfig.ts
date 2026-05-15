/**
 * Single source of truth for presentation markdown parsing, panels, and assets.
 * Adjust typography (including **Label:**) in your .md and the labels below together.
 */

/** Stop parsing before this top-level heading (appendix / tables in presentation.md). */
export const MARKDOWN_APPENDIX_HEADING = 'ИТОГОВАЯ'

/** Regex for slide section headers: `## Слайд 2. Section name`. Group 1 = id, 2 = section title. */
export const SLIDE_HEADER_REGEX =
  /^## Слайд\s+([\wа-яА-Я]+)\.\s*(.+)$/m

/** Fallback deck title if `# Title` is missing. */
export const DEFAULT_DECK_TITLE = 'Презентация'

/**
 * Markdown **Field:** labels and how to parse their values.
 * - `multiline` — blockquote or plain multi-line body
 * - `comment` — italic/inline stripped to one line (speaker note style)
 * - `inline` — strip markdown inline, single-line
 */
export const MARKDOWN_FIELDS = {
  title: { label: 'Заголовок', kind: 'inline' as const },
  body: { label: 'Текст на слайде', kind: 'multiline' as const },
  comment: { label: 'Комментарий', kind: 'comment' as const },
  searchQuery: { label: 'Поисковый запрос', kind: 'inline' as const },
  details: { label: 'Детали', kind: 'multiline' as const },
  article: { label: 'Статья', kind: 'multiline' as const },
  sources: { label: 'Источники', kind: 'multiline' as const },
} as const

export type MarkdownFieldKey = keyof typeof MARKDOWN_FIELDS

/** Section delimiter between slide blocks in presentation.md */
export const SLIDE_SECTION_DELIMITER = '\n---\n'

/**
 * Content panels (routes: /slide/:id/:panel).
 * `main` has no optional body field — it uses `body` on the slide.
 */
export const PANELS_CONFIG = [
  { id: 'main', label: 'Слайд', slideKey: null },
  { id: 'details', label: 'Детали', slideKey: 'details' as const },
  { id: 'article', label: 'Статья', slideKey: 'article' as const },
  { id: 'sources', label: 'Источники', slideKey: 'sources' as const },
] as const

export type PanelId = (typeof PANELS_CONFIG)[number]['id']

export const PANEL_IDS = PANELS_CONFIG.map((p) => p.id) as PanelId[]

export const PANEL_LABELS: Record<PanelId, string> = Object.fromEntries(
  PANELS_CONFIG.map((p) => [p.id, p.label]),
) as Record<PanelId, string>

/** Maps slide id (as in `## Слайд X.`) → folder name under src/img */
export const SLIDE_IMAGE_DIRS: Record<string, string> = {
  '2': '2-babylon',
  '3': '3-egypt',
  '4': '4-china',
  '5': '5-greece',
  '5а': '5-a-greece',
  '5a': '5-a-greece',
  '5б': '5-b-greece',
  '5b': '5-b-greece',
  '6': '6-norse',
  '12': '12-masonic',
}

/** Path segment under `src/` where slide images live. */
export const SLIDE_IMAGES_ROOT = 'img'

/**
 * Extensions slide images may use (for docs / filtering logic).
 * Vite only allows a **string literal** in `import.meta.glob`, so the actual pattern
 * is duplicated in `slideImages.ts` — update both when adding extensions.
 */
export const SLIDE_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
] as const

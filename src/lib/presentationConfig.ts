/** Split between slide blocks in presentation.md */
export const SLIDE_SECTION_DELIMITER = '\n---\n'

/** `###` section headings the parser understands (language-neutral keys) */
export const SLIDE_FIELD_HEADINGS = [
  'title',
  'body',
  'notes',
  'search',
  'details',
  'article',
  'sources',
  'images',
] as const

export type SlideFieldHeading = (typeof SLIDE_FIELD_HEADINGS)[number]

export const DEFAULT_PANELS: Record<
  string,
  { label: string; showImages?: boolean }
> = {
  main: { label: 'Слайд' },
  details: { label: 'Детали', showImages: true },
  article: { label: 'Статья' },
  sources: { label: 'Источники' },
}

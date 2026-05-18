import { parse as parseYaml } from 'yaml'
import {
  DEFAULT_PANELS,
  SLIDE_FIELD_HEADINGS,
  SLIDE_SECTION_DELIMITER,
  type SlideFieldHeading,
} from './presentationConfig'
import { parseImageSection } from './parseImageSection'

export type SlideImage = {
  path: string
  src: string
  alt: string
  description: string
}

export type PanelConfig = {
  label: string
  showImages?: boolean
}

export type DeckMeta = {
  panels: Record<string, PanelConfig>
}

export type Slide = {
  id: string
  title: string
  body: string
  notes: string
  search: string
  details: string
  article: string
  sources: string
  images: SlideImage[]
}

export type ParsedPresentation = {
  meta: DeckMeta
  slides: Slide[]
}

function stripMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function parseBlockquote(block: string): string {
  return block
    .split('\n')
    .map((line) => line.replace(/^>\s?/, ''))
    .join('\n')
    .trim()
}

function parseMultilineField(block: string): string {
  const trimmed = block.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('>')) return parseBlockquote(trimmed)
  return trimmed
}

function parseNotesField(block: string): string {
  return stripMarkdownInline(block.replace(/\n/g, ' '))
}

function parseFieldContent(heading: SlideFieldHeading, raw: string): string {
  if (heading === 'images') return raw
  switch (heading) {
    case 'title':
    case 'search':
      return stripMarkdownInline(raw).replace(/^`|`$/g, '')
    case 'notes':
      return parseNotesField(raw)
    case 'body':
    case 'details':
    case 'article':
    case 'sources':
      return parseMultilineField(raw)
    default:
      return raw.trim()
  }
}

function extractSections<H extends string>(
  block: string,
  headings: readonly H[],
): Map<H, string> {
  const sections = new Map<H, string>()
  const headingPattern = new RegExp(
    `^### (${headings.join('|')})\\s*$`,
    'gim',
  )

  const matches: { heading: H; index: number; length: number }[] = []
  let match: RegExpExecArray | null
  while ((match = headingPattern.exec(block)) !== null) {
    matches.push({
      heading: match[1] as H,
      index: match.index,
      length: match[0].length,
    })
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].length
    const end = i + 1 < matches.length ? matches[i + 1].index : block.length
    const raw = block.slice(start, end).trim()
    sections.set(matches[i].heading, raw)
  }

  return sections
}

function splitFrontmatter(markdown: string): {
  data: Record<string, unknown>
  content: string
} {
  const text = markdown.replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) {
    return { data: {}, content: text }
  }

  const end = text.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: text }
  }

  const yamlText = text.slice(4, end)
  const content = text.slice(end + 4).replace(/^\r?\n/, '')

  try {
    const parsed = parseYaml(yamlText)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { data: parsed as Record<string, unknown>, content }
    }
  } catch {
    // ignore invalid frontmatter
  }

  return { data: {}, content }
}

function parseMeta(data: Record<string, unknown>): DeckMeta {
  const panelsRaw = data.panels
  if (panelsRaw && typeof panelsRaw === 'object' && !Array.isArray(panelsRaw)) {
    const panels: Record<string, PanelConfig> = {}
    for (const [id, value] of Object.entries(panelsRaw)) {
      if (value && typeof value === 'object' && 'label' in value) {
        const entry = value as { label?: string; showImages?: boolean }
        panels[id] = {
          label: String(entry.label ?? id),
          showImages: entry.showImages === true,
        }
      }
    }
    if (Object.keys(panels).length > 0) {
      return { panels }
    }
  }

  return { panels: { ...DEFAULT_PANELS } }
}

function isSlideBlock(block: string): boolean {
  const pattern = new RegExp(
    `^### (${SLIDE_FIELD_HEADINGS.join('|')})\\s*$`,
    'im',
  )
  return pattern.test(block)
}

function emptySlide(id: string): Slide {
  return {
    id,
    title: '',
    body: '',
    notes: '',
    search: '',
    details: '',
    article: '',
    sources: '',
    images: [],
  }
}

export function parsePresentation(markdown: string): ParsedPresentation {
  const { data, content: rawContent } = splitFrontmatter(markdown)
  const meta = parseMeta(data as Record<string, unknown>)

  const content = rawContent.trim()
  const slideBlocks = content
    .split(SLIDE_SECTION_DELIMITER)
    .map((block) => block.trim())
    .filter(isSlideBlock)

  const slides: Slide[] = []

  slideBlocks.forEach((block, index) => {
    const id = String(index + 1)
    const sections = extractSections(block, SLIDE_FIELD_HEADINGS)
    const slide = emptySlide(id)

    for (const [heading, raw] of sections) {
      if (heading === 'images') {
        slide.images = parseImageSection(raw)
        continue
      }
      const value = parseFieldContent(heading, raw)
      if (heading === 'title') slide.title = value
      else if (heading === 'body') slide.body = value
      else if (heading === 'notes') slide.notes = value
      else if (heading === 'search') slide.search = value
      else if (heading === 'details') slide.details = value
      else if (heading === 'article') slide.article = value
      else if (heading === 'sources') slide.sources = value
    }

    slides.push(slide)
  })

  return { meta, slides }
}

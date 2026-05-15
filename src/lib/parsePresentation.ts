import {
  DEFAULT_DECK_TITLE,
  MARKDOWN_APPENDIX_HEADING,
  MARKDOWN_FIELDS,
  SLIDE_HEADER_REGEX,
  SLIDE_SECTION_DELIMITER,
  type MarkdownFieldKey,
} from './presentationConfig'

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

function extractByKind(
  raw: string,
  kind: (typeof MARKDOWN_FIELDS)[MarkdownFieldKey]['kind'],
): string {
  switch (kind) {
    case 'multiline':
      return parseMultilineField(raw)
    case 'comment':
      return stripMarkdownInline(raw.replace(/\n/g, ' '))
    case 'inline':
      return stripMarkdownInline(raw)
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

function extractField(block: string, key: MarkdownFieldKey): string {
  const { label, kind } = MARKDOWN_FIELDS[key]
  const pattern = new RegExp(
    `\\*\\*${label}:\\*\\*\\s*\\n?([\\s\\S]*?)(?=\\n\\*\\*|$)`,
    'i',
  )
  const match = block.match(pattern)
  if (!match) return ''

  const raw = match[1].trim()
  return extractByKind(raw, kind)
}

export type Slide = {
  id: string
  section: string
  title: string
  body: string
  comment: string
  searchQuery: string
  details: string
  article: string
  sources: string
}

export function parsePresentation(markdown: string): {
  deckTitle: string
  slides: Slide[]
} {
  const appendixRegex = new RegExp(`^# ${MARKDOWN_APPENDIX_HEADING}`, 'm')
  const appendixIndex = markdown.search(appendixRegex)
  const content =
    appendixIndex === -1 ? markdown : markdown.slice(0, appendixIndex)

  const titleMatch = content.match(/^# (.+)$/m)
  const deckTitle = titleMatch
    ? stripMarkdownInline(titleMatch[1])
    : DEFAULT_DECK_TITLE

  const body = content.replace(/^# .+\n+/, '')
  const sections = body
    .split(SLIDE_SECTION_DELIMITER)
    .map((section) => section.trim())
    .filter(Boolean)

  const slides: Slide[] = []

  for (const section of sections) {
    const header = section.match(SLIDE_HEADER_REGEX)
    if (!header) continue

    slides.push({
      id: header[1].toLowerCase(),
      section: header[2].trim(),
      title: extractField(section, 'title'),
      body: extractField(section, 'body'),
      comment: extractField(section, 'comment'),
      searchQuery: extractField(section, 'searchQuery').replace(/^`|`$/g, ''),
      details: extractField(section, 'details'),
      article: extractField(section, 'article'),
      sources: extractField(section, 'sources'),
    })
  }

  return { deckTitle, slides }
}

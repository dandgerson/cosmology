export type Slide = {
  id: string
  section: string
  title: string
  body: string
  comment: string
  searchQuery: string
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

function extractField(block: string, label: string): string {
  const pattern = new RegExp(
    `\\*\\*${label}:\\*\\*\\s*\\n?([\\s\\S]*?)(?=\\n\\*\\*|$)`,
    'i',
  )
  const match = block.match(pattern)
  if (!match) return ''

  const raw = match[1].trim()
  if (label === 'Текст на слайде') {
    return parseBlockquote(raw)
  }
  if (label === 'Комментарий') {
    return stripMarkdownInline(raw.replace(/\n/g, ' '))
  }
  if (label === 'Заголовок') {
    return stripMarkdownInline(raw)
  }
  return raw
}

export function parsePresentation(markdown: string): {
  deckTitle: string
  slides: Slide[]
} {
  const appendixIndex = markdown.search(/^# ИТОГОВАЯ/m)
  const content =
    appendixIndex === -1 ? markdown : markdown.slice(0, appendixIndex)

  const titleMatch = content.match(/^# (.+)$/m)
  const deckTitle = titleMatch
    ? stripMarkdownInline(titleMatch[1])
    : 'Презентация'

  const body = content.replace(/^# .+\n+/, '')
  const sections = body
    .split(/\n---\n/)
    .map((section) => section.trim())
    .filter(Boolean)

  const slides: Slide[] = []

  for (const section of sections) {
    const header = section.match(/^## Слайд\s+([\wа-яА-Я]+)\.\s*(.+)$/m)
    if (!header) continue

    slides.push({
      id: header[1].toLowerCase(),
      section: header[2].trim(),
      title: extractField(section, 'Заголовок'),
      body: extractField(section, 'Текст на слайде'),
      comment: extractField(section, 'Комментарий'),
      searchQuery: extractField(section, 'Поисковый запрос').replace(
        /^`|`$/g,
        '',
      ),
    })
  }

  return { deckTitle, slides }
}

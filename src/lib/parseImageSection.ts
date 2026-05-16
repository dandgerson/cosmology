import type { SlideImage } from './parsePresentation'
import { resolveImagePath, warnIfImageMissing } from './slideImages'

const IMAGE_LINE =
  /^!\[([^\]]*)\]\(([^)]+)\)\s*(.*)$/

const DESCRIPTION_PREFIX = /^[—–\-·]\s*/

export function parseImageSection(raw: string): SlideImage[] {
  const lines = raw.split('\n')
  const images: SlideImage[] = []
  let pending: SlideImage | null = null

  const flushPending = () => {
    if (!pending) return
    images.push(pending)
    pending = null
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const imageMatch = trimmed.match(IMAGE_LINE)
    if (imageMatch) {
      flushPending()
      const path = imageMatch[2].trim()
      let inlineDesc = imageMatch[3].trim()
      inlineDesc = inlineDesc.replace(DESCRIPTION_PREFIX, '')

      pending = {
        path,
        src: resolveImagePath(path),
        alt: imageMatch[1].trim(),
        description: inlineDesc,
      }
      warnIfImageMissing(path)
      continue
    }

    if (pending) {
      pending.description = pending.description
        ? `${pending.description}\n\n${trimmed}`
        : trimmed
    }
  }

  flushPending()
  return images
}

import presentationMd from '../presentation.md?raw'
import { DEFAULT_PANELS } from './presentationConfig'
import { parsePresentation } from './parsePresentation'

function loadPresentation() {
  try {
    return parsePresentation(presentationMd)
  } catch (error) {
    console.error('[presentation] failed to parse presentation.md', error)
    return {
      title: 'Ошибка загрузки',
      meta: { panels: { ...DEFAULT_PANELS } },
      slides: [],
    }
  }
}

export const presentation = loadPresentation()

export const { title: deckTitle, slides, meta } = presentation

export function getSlideById(slideId: string) {
  return slides.find((s) => s.id === slideId)
}

/** Horizontal Reveal index: 0 = title, 1+ = content slides */
export function getHorizontalIndex(slideId: string | undefined): number {
  if (!slideId) return 0
  const index = slides.findIndex((s) => s.id === slideId)
  return index === -1 ? 0 : index + 1
}

export function getSlideIdFromHorizontal(h: number): string | undefined {
  if (h <= 0) return undefined
  return slides[h - 1]?.id
}

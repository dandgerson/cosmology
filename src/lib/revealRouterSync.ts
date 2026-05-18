import type { DeckApi } from '../RevealContext'
import type { PanelId } from './slidePanels'
import {
  getHorizontalIndex,
  getSlideById,
  getSlideIdFromHorizontal,
} from './presentationData'
import { getSlidePanels, panelIndex } from './slidePanels'

export function getRevealIndices(
  slideId: string | undefined,
  panel: PanelId,
): { h: number; v: number } {
  const h = getHorizontalIndex(slideId)
  if (h === 0) return { h: 0, v: 0 }

  const slide = getSlideById(slideId!)
  if (!slide) return { h: 0, v: 0 }

  return { h, v: panelIndex(slide, panel) }
}

export function getRouteFromReveal(deck: DeckApi): {
  slideId?: string
  panel: PanelId
} {
  const indices = deck.getIndices()
  const slideId = getSlideIdFromHorizontal(indices.h)

  if (!slideId) {
    return { slideId: undefined, panel: 'main' }
  }

  const slide = getSlideById(slideId)
  if (!slide) {
    return { slideId: undefined, panel: 'main' }
  }

  const panels = getSlidePanels(slide)
  const panel = panels[indices.v] ?? 'main'

  return { slideId, panel }
}

/** Keep panel when the target slide has it; otherwise fall back to main. */
export function getPanelForSlide(
  slideId: string,
  preferredPanel: PanelId,
): PanelId {
  const slide = getSlideById(slideId)
  if (!slide) return 'main'

  const panels = getSlidePanels(slide)
  return panels.includes(preferredPanel) ? preferredPanel : 'main'
}

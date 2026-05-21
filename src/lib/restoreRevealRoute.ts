import type { DeckApi } from '../RevealContext'
import { updateRevealControls } from './revealControls'
import { getRevealIndices } from './revealRouterSync'
import { revealRouteSyncLock } from './revealSyncState'
import { isPanelId, type PanelId } from './slidePanels'

/** Read route from the URL so restore stays correct during orientation transitions. */
export function getRouteFromPathname(
  pathname = window.location.pathname,
): { slideId: string | undefined; panel: PanelId } {
  const match = pathname.match(/^\/slide\/([^/]+)\/([^/]+)/)
  if (!match) return { slideId: undefined, panel: 'main' }

  const panel = match[2]
  return {
    slideId: match[1],
    panel: isPanelId(panel) ? panel : 'main',
  }
}

function disableSlideTransitions(deck: DeckApi, disabled: boolean) {
  deck.getRevealElement()?.querySelector('.slides')?.classList.toggle(
    'disable-slide-transitions',
    disabled,
  )
}

/** Re-apply the routed slide after layout (indices may match but DOM/transform can be wrong). */
export function restoreRevealRoute(
  deck: DeckApi,
  slideId?: string,
  panel?: PanelId,
) {
  const route = getRouteFromPathname()
  const resolvedSlideId = slideId ?? route.slideId
  const resolvedPanel = panel ?? route.panel
  const { h, v } = getRevealIndices(resolvedSlideId, resolvedPanel)
  const current = deck.getIndices()
  const targetSlide = deck.getSlide(h, v)
  const visibleSlide = deck.getCurrentSlide()

  revealRouteSyncLock.locked = true
  disableSlideTransitions(deck, true)

  if (current.h === h && current.v === v && targetSlide && visibleSlide !== targetSlide) {
    // Indices match but the wrong section is visible — force state + sync.
    deck.setState({
      ...deck.getState(),
      indexh: h,
      indexv: v,
      indexf: -1,
    })
  } else {
    deck.slide(h, v)
  }

  deck.sync()
  updateRevealControls(deck)
  disableSlideTransitions(deck, false)

  requestAnimationFrame(() => {
    revealRouteSyncLock.locked = false
  })
}

export function layoutSizeKey(size: {
  width: number
  height: number
  margin: number
  isMobile: boolean
}): string {
  return `${size.width}x${size.height}x${size.margin}x${size.isMobile ? 1 : 0}`
}

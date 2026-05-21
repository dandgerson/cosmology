import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { DeckApi } from '../RevealContext'
import { getFirstSlideId } from '../lib/presentationData'
import { updateRevealControls } from '../lib/revealControls'
import { getRevealLayoutSize } from '../lib/revealLayout'
import { getRevealIndices, getRouteFromReveal } from '../lib/revealRouterSync'
import {
  layoutSizeKey,
  restoreRevealRoute,
} from '../lib/restoreRevealRoute'
import { revealRouteSyncLock } from '../lib/revealSyncState'
import type { PanelId } from '../lib/slidePanels'

/** URL ↔ Reveal sync and viewport layout in one hook (stable hook order). */
export function useRevealDeckSync(
  deck: DeckApi | null,
  slideId: string | undefined,
  panel: PanelId,
) {
  const navigate = useNavigate()
  const routeRef = useRef({ slideId, panel })
  const lastSizeKeyRef = useRef('')

  useEffect(() => {
    routeRef.current = { slideId, panel }
  }, [slideId, panel])

  const syncRevealToRoute = useCallback(
    (instance: DeckApi) => {
      const { h, v } = getRevealIndices(slideId, panel)
      const current = instance.getIndices()

      if (current.h === h && current.v === v) return

      restoreRevealRoute(instance, slideId, panel)
    },
    [slideId, panel],
  )

  // URL → Reveal
  useEffect(() => {
    if (!deck) return
    syncRevealToRoute(deck)
  }, [deck, syncRevealToRoute])

  // Reveal → URL
  useEffect(() => {
    if (!deck) return

    const onSlideChanged = () => {
      if (revealRouteSyncLock.locked) return

      updateRevealControls(deck)
      const route = getRouteFromReveal(deck)

      if (!route.slideId) {
        const first = getFirstSlideId()
        if (first) {
          navigate({
            to: '/slide/$slideId/$panel',
            params: { slideId: first, panel: 'main' },
          })
        }
        return
      }

      navigate({
        to: '/slide/$slideId/$panel',
        params: { slideId: route.slideId, panel: route.panel },
      })
    }

    deck.on('slidechanged', onSlideChanged)
    return () => {
      deck.off('slidechanged', onSlideChanged)
    }
  }, [deck, navigate])

  // Viewport / orientation layout
  useEffect(() => {
    if (!deck) return

    let frame = 0
    const restoreTimers: number[] = []

    const clearRestoreTimers = () => {
      for (const id of restoreTimers) window.clearTimeout(id)
      restoreTimers.length = 0
    }

    const scheduleRestore = () => {
      clearRestoreTimers()
      const run = () => {
        const { slideId: id, panel: p } = routeRef.current
        restoreRevealRoute(deck, id, p)
      }
      run()
      for (const delay of [100, 250, 500, 800]) {
        restoreTimers.push(window.setTimeout(run, delay))
      }
    }

    const applyLayout = () => {
      const { slideId: id, panel: p } = routeRef.current
      const size = getRevealLayoutSize()
      const sizeKey = layoutSizeKey(size)

      revealRouteSyncLock.locked = true

      if (sizeKey !== lastSizeKeyRef.current) {
        deck.configure({
          width: size.width,
          height: size.height,
          margin: size.margin,
          center: !size.isMobile,
          scrollActivationWidth: 0,
        })
        lastSizeKeyRef.current = sizeKey
      }

      deck.layout()
      document.documentElement.dataset.mobileDeck = size.isMobile
        ? 'true'
        : 'false'

      restoreRevealRoute(deck, id, p)
    }

    const scheduleLayout = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(applyLayout)
      })
    }

    const onOrientationChange = () => {
      lastSizeKeyRef.current = ''
      scheduleLayout()
      window.setTimeout(scheduleLayout, 150)
      window.setTimeout(scheduleLayout, 350)
      scheduleRestore()
    }

    scheduleLayout()
    window.addEventListener('resize', scheduleLayout)
    window.addEventListener('orientationchange', onOrientationChange)
    window.visualViewport?.addEventListener('resize', scheduleLayout)

    return () => {
      cancelAnimationFrame(frame)
      clearRestoreTimers()
      window.removeEventListener('resize', scheduleLayout)
      window.removeEventListener('orientationchange', onOrientationChange)
      window.visualViewport?.removeEventListener('resize', scheduleLayout)
    }
  }, [deck])
}

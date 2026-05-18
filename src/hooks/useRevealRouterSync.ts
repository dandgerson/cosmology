import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { DeckApi } from '../RevealContext'
import { getFirstSlideId } from '../lib/presentationData'
import { updateRevealControls } from '../lib/revealControls'
import { getRevealIndices, getRouteFromReveal } from '../lib/revealRouterSync'
import { useSlideRoute } from './useSlideRoute'

export function useRevealRouterSync(reveal: DeckApi | null) {
  const navigate = useNavigate()
  const syncingRef = useRef(false)
  const { slideId, panel } = useSlideRoute()

  // URL → Reveal
  useEffect(() => {
    if (!reveal) return

    const { h, v } = getRevealIndices(slideId, panel)
    const current = reveal.getIndices()

    if (current.h === h && current.v === v) return

    syncingRef.current = true
    reveal.slide(h, v)
    updateRevealControls(reveal)
    requestAnimationFrame(() => {
      syncingRef.current = false
    })
  }, [reveal, slideId, panel])

  // Reveal → URL
  useEffect(() => {
    if (!reveal) return

    const onSlideChanged = () => {
      if (syncingRef.current) return

      updateRevealControls(reveal)
      const route = getRouteFromReveal(reveal)

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

    reveal.on('slidechanged', onSlideChanged)
    return () => {
      reveal.off('slidechanged', onSlideChanged)
    }
  }, [reveal, navigate])
}

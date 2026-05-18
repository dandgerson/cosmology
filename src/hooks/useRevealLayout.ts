import { useEffect } from 'react'
import type { DeckApi } from '../RevealContext'
import { getRevealLayoutSize } from '../lib/revealLayout'

/** Re-run Reveal layout when viewport or orientation changes (mobile ↔ desktop) */
export function useRevealLayout(deck: DeckApi | null) {
  useEffect(() => {
    if (!deck) return

    let frame = 0

    const applyLayout = () => {
      const size = getRevealLayoutSize()
      deck.configure({
        width: size.width,
        height: size.height,
        margin: size.margin,
      })
      deck.layout()
      document.documentElement.dataset.mobileDeck = size.isMobile
        ? 'true'
        : 'false'
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(applyLayout)
    }

    schedule()
    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
    }
  }, [deck])
}

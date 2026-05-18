import { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import Notes from 'reveal.js/plugin/notes'
import { RevealContext, type DeckApi } from '../RevealContext'
import { useRevealLayout } from '../hooks/useRevealLayout'
import { slides } from '../lib/presentationData'
import { getRevealLayoutSize, getRevealOptions } from '../lib/revealLayout'
import { getSlidePanels, type PanelId } from '../lib/slidePanels'
import { useRevealRouterSync } from '../hooks/useRevealRouterSync'
import { useSlideRoute } from '../hooks/useSlideRoute'
import DeckNavigation from './DeckNavigation'
import SlidePanelContent from './SlidePanelContent'
import SlidePanelNav from './SlidePanelNav'
import 'reveal.js/reveal.css'
import '../presentation.css'

function SlideStack({
  slide,
  activePanel,
}: {
  slide: (typeof slides)[number]
  activePanel: PanelId
}) {
  const panels = getSlidePanels(slide)

  return (
    <section>
      {panels.map((panel) => (
        <section key={panel} data-panel={panel}>
          <SlidePanelNav slide={slide} activePanel={activePanel} />
          <SlidePanelContent slide={slide} panel={panel} />
          {slide.notes && panel === 'main' && (
            <aside className="notes">
              {slide.notes}
              {slide.search && (
                <>
                  {'\n\n'}
                  Поиск: {slide.search}
                </>
              )}
            </aside>
          )}
        </section>
      ))}
    </section>
  )
}

export default function Presentation() {
  const deckRef = useRef<HTMLDivElement>(null)
  const [reveal, setReveal] = useState<DeckApi | null>(null)
  const { slideId, panel } = useSlideRoute()

  useRevealRouterSync(reveal)
  useRevealLayout(reveal)

  useEffect(() => {
    if (!deckRef.current) return

    const size = getRevealLayoutSize()
    document.documentElement.dataset.mobileDeck = size.isMobile
      ? 'true'
      : 'false'

    const deck = new Reveal(deckRef.current, {
      ...getRevealOptions(size),
      plugins: [Notes],
    })

    deck.initialize()
    setReveal(deck)

    return () => {
      deck.destroy()
      setReveal(null)
    }
  }, [])

  return (
    <RevealContext.Provider value={reveal}>
      <div className="reveal" ref={deckRef}>
        <div className="slides">
          {slides.map((slide) => (
            <SlideStack
              key={slide.id}
              slide={slide}
              activePanel={slide.id === slideId ? panel : 'main'}
            />
          ))}
        </div>
      </div>
      <DeckNavigation />
    </RevealContext.Provider>
  )
}

import { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import Notes from 'reveal.js/plugin/notes'
import { RevealContext, type DeckApi } from '../RevealContext'
import { slides } from '../lib/presentationData'
import { getSlidePanels, type PanelId } from '../lib/slidePanels'
import { useRevealRouterSync } from '../hooks/useRevealRouterSync'
import { useSlideRoute } from '../hooks/useSlideRoute'
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

  useEffect(() => {
    if (!deckRef.current) return

    const deck = new Reveal(deckRef.current, {
      plugins: [Notes],
      hash: false,
      history: false,
      slideNumber: 'c/t',
      transition: 'slide',
      backgroundTransition: 'fade',
      width: 1920,
      height: 1080,
      margin: 0.06,
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
    </RevealContext.Provider>
  )
}

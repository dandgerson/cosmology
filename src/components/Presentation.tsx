import { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import Notes from 'reveal.js/plugin/notes'
import { RevealContext, type DeckApi } from '../RevealContext'
import { useRevealDeckSync } from '../hooks/useRevealDeckSync'
import { slides } from '../lib/presentationData'
import { updateRevealControls } from '../lib/revealControls'
import { getRevealLayoutSize, getRevealOptions } from '../lib/revealLayout'
import { getSlidePanels, type PanelId } from '../lib/slidePanels'
import { useSlideRoute } from '../hooks/useSlideRoute'
import DeckNavigation from './DeckNavigation'
import SlidePanelContent from './SlidePanelContent'
import SlidePanelNav from './SlidePanelNav'
import 'reveal.js/reveal.css'

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
        <section key={panel} data-panel={panel} className="slide-shell">
          <div className="slide-center">
            <SlidePanelNav slide={slide} activePanel={activePanel} />
            <SlidePanelContent slide={slide} panel={panel} />
          </div>
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

  useRevealDeckSync(reveal, slideId, panel)

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

    let cancelled = false

    void deck.initialize().then(() => {
      if (cancelled) return
      updateRevealControls(deck)
      setReveal(deck)
    })

    return () => {
      cancelled = true
      deck.destroy()
      setReveal(null)
    }
  }, [])

  return (
    <RevealContext.Provider value={reveal}>
      <div className="reveal size-full font-sans" ref={deckRef}>
        <div className="slides text-left">
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

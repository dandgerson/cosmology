import { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import { RevealContext, type DeckApi } from '../RevealContext'
import Notes from 'reveal.js/plugin/notes'
import presentationMd from '../presentation.md?raw'
import { parsePresentation } from '../lib/parsePresentation'
import { getSlideImages } from '../lib/slideImages'
import SlideImages from './SlideImages'
import ThemeSwitcher from './ThemeSwitcher'
import 'reveal.js/reveal.css'
import '../presentation.css'

const { deckTitle, slides } = parsePresentation(presentationMd)

function formatBody(text: string) {
  return text.split(/\n\n+/).map((paragraph, i) => (
    <p key={i}>{paragraph}</p>
  ))
}

export default function Presentation() {
  const deckRef = useRef<HTMLDivElement>(null)
  const [reveal, setReveal] = useState<DeckApi | null>(null)

  useEffect(() => {
    if (!deckRef.current) return

    const deck = new Reveal(deckRef.current, {
      plugins: [Notes],
      hash: true,
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
      <ThemeSwitcher />
      <div className="reveal" ref={deckRef}>
      <div className="slides">
        <section className="title-slide">
          <h1>{deckTitle}</h1>
          <p className="deck-subtitle">
            Космологические модели разных культур и традиций
          </p>
        </section>

        {slides.map((slide) => {
          const images = getSlideImages(slide.id)

          return (
            <section key={slide.id}>
              <h2>{slide.title}</h2>
              <div className="slide-body">{formatBody(slide.body)}</div>

              <SlideImages images={images} />

              {slide.comment && (
                <aside className="notes">
                  {slide.comment}
                  {slide.searchQuery && (
                    <>
                      {'\n\n'}
                      Поиск: {slide.searchQuery}
                    </>
                  )}
                </aside>
              )}
            </section>
          )
        })}
      </div>
    </div>
    </RevealContext.Provider>
  )
}

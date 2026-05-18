import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { slides } from '../lib/presentationData'
import {
  getAdjacentPanel,
  getAdjacentSlideId,
  getPanelForSlide,
} from '../lib/revealRouterSync'
import { getSlidePanels } from '../lib/slidePanels'
import { useSlideRoute } from '../hooks/useSlideRoute'
import SlidePicker from './SlidePicker'

export default function DeckNavigation() {
  const navigate = useNavigate()
  const { slideId, panel } = useSlideRoute()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (slides.length === 0) return null

  const currentIndex = slideId
    ? slides.findIndex((s) => s.id === slideId)
    : 0
  const slideIndex = currentIndex === -1 ? 0 : currentIndex
  const currentSlide = slides[slideIndex]
  const panels = currentSlide ? getSlidePanels(currentSlide) : ['main']
  const panelIndex = panels.indexOf(panel)
  const hasVertical = panels.length > 1

  const canGoPrevSlide = slideIndex > 0
  const canGoNextSlide = slideIndex < slides.length - 1
  const canGoPrevPanel = hasVertical && panelIndex > 0
  const canGoNextPanel = hasVertical && panelIndex < panels.length - 1

  const goToSlide = (direction: 'prev' | 'next') => {
    if (!slideId) return
    const nextId = getAdjacentSlideId(slideId, direction)
    if (!nextId) return

    navigate({
      to: '/slide/$slideId/$panel',
      params: {
        slideId: nextId,
        panel: getPanelForSlide(nextId, panel),
      },
    })
  }

  const goToPanel = (direction: 'prev' | 'next') => {
    if (!slideId) return
    const nextPanel = getAdjacentPanel(slideId, panel, direction)
    if (!nextPanel) return

    navigate({
      to: '/slide/$slideId/$panel',
      params: { slideId, panel: nextPanel },
    })
  }

  const displaySlideId = slideId ?? slides[0]?.id ?? '1'

  return (
    <>
      <nav className="deck-nav" aria-label="Навигация по презентации">
        <div className="deck-nav-cluster deck-nav-cluster--vertical">
          <button
            type="button"
            className="deck-nav-btn"
            aria-label="Предыдущий раздел"
            disabled={!canGoPrevPanel}
            onClick={() => goToPanel('prev')}
          >
            ∧
          </button>
          <button
            type="button"
            className="deck-nav-btn"
            aria-label="Следующий раздел"
            disabled={!canGoNextPanel}
            onClick={() => goToPanel('next')}
          >
            ∨
          </button>
        </div>

        <div className="deck-nav-cluster deck-nav-cluster--horizontal">
          <button
            type="button"
            className="deck-nav-btn deck-nav-btn--slide"
            aria-label="Предыдущий слайд"
            disabled={!canGoPrevSlide}
            onClick={() => goToSlide('prev')}
          >
            &lt;
          </button>

          <button
            type="button"
            className="deck-nav-counter"
            aria-label="Открыть список слайдов"
            aria-haspopup="listbox"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen(true)}
          >
            <span className="deck-nav-counter-current">{slideIndex + 1}</span>
            <span className="deck-nav-counter-sep">/</span>
            <span className="deck-nav-counter-total">{slides.length}</span>
          </button>

          <button
            type="button"
            className="deck-nav-btn deck-nav-btn--slide"
            aria-label="Следующий слайд"
            disabled={!canGoNextSlide}
            onClick={() => goToSlide('next')}
          >
            &gt;
          </button>
        </div>
      </nav>

      {pickerOpen && (
        <SlidePicker
          slides={slides}
          currentSlideId={displaySlideId}
          currentPanel={panel}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )
}

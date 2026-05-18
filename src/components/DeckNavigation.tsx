import { useState } from 'react'
import { slides } from '../lib/presentationData'
import { useSlideRoute } from '../hooks/useSlideRoute'
import SlidePicker from './SlidePicker'

export default function DeckNavigation() {
  const { slideId, panel } = useSlideRoute()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (slides.length === 0) return null

  const currentIndex = slideId
    ? slides.findIndex((s) => s.id === slideId)
    : 0
  const slideIndex = currentIndex === -1 ? 0 : currentIndex
  const displaySlideId = slideId ?? slides[0]?.id ?? '1'

  return (
    <>
      <button
        type="button"
        className="deck-chrome-counter"
        aria-label="Открыть список слайдов"
        aria-haspopup="listbox"
        aria-expanded={pickerOpen}
        onClick={() => setPickerOpen(true)}
      >
        <span className="deck-chrome-counter-current">{slideIndex + 1}</span>
        <span className="deck-chrome-counter-sep">/</span>
        <span className="deck-chrome-counter-total">{slides.length}</span>
      </button>

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

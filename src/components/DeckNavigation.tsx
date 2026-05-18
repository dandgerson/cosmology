import { useState } from 'react'
import { slides } from '../lib/presentationData'
import { useSlideRoute } from '../hooks/useSlideRoute'
import SlidePicker from './SlidePicker'

export default function DeckNavigation() {
  const { slideId, panel } = useSlideRoute()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (slides.length === 0) return null

  const slideIndex = Math.max(
    0,
    slideId ? slides.findIndex((s) => s.id === slideId) : 0,
  )
  const displaySlideId = slideId ?? slides[0]?.id ?? '1'

  return (
    <>
      <button
        type="button"
        className="btn-focus fixed right-3 bottom-2 z-[41] min-h-8 rounded bg-black/75 px-2 py-1 text-xs text-white tabular-nums hover:bg-black/90 mobile-deck:right-[max(0.75rem,env(safe-area-inset-right))] mobile-deck:bottom-[max(0.35rem,env(safe-area-inset-bottom))]"
        aria-label="Открыть список слайдов"
        aria-haspopup="listbox"
        aria-expanded={pickerOpen}
        onClick={() => setPickerOpen(true)}
      >
        {slideIndex + 1} / {slides.length}
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

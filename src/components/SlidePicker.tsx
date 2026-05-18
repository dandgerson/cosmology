import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from '@tanstack/react-router'
import type { Slide } from '../lib/parsePresentation'
import { getPanelForSlide } from '../lib/revealRouterSync'
import type { PanelId } from '../lib/slidePanels'

type SlidePickerProps = {
  slides: Slide[]
  currentSlideId: string
  currentPanel: PanelId
  onClose: () => void
}

export default function SlidePicker({
  slides,
  currentSlideId,
  currentPanel,
  onClose,
}: SlidePickerProps) {
  const navigate = useNavigate()
  const listId = useId()
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.body.classList.add('slide-picker-open')

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.classList.remove('slide-picker-open')
    }
  }, [onClose])

  const goToSlide = (slideId: string) => {
    const panel = getPanelForSlide(slideId, currentPanel)
    navigate({
      to: '/slide/$slideId/$panel',
      params: { slideId, panel },
    })
    onClose()
  }

  return createPortal(
    <div
      className="slide-picker-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="slide-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby={listId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="slide-picker-header">
          <h2 id={listId} className="slide-picker-title">
            Перейти к слайду
          </h2>
          <button
            type="button"
            className="slide-picker-close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <ol className="slide-picker-list" role="listbox">
          {slides.map((slide) => {
            const isActive = slide.id === currentSlideId
            return (
              <li key={slide.id} role="none">
                <button
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`slide-picker-item${isActive ? ' is-active' : ''}`}
                  onClick={() => goToSlide(slide.id)}
                >
                  <span className="slide-picker-id">{slide.id}</span>
                  <span className="slide-picker-label">
                    {slide.title || `Слайд ${slide.id}`}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>,
    document.body,
  )
}

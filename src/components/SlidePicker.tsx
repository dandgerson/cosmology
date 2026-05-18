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
    navigate({
      to: '/slide/$slideId/$panel',
      params: { slideId, panel: getPanelForSlide(slideId, currentPanel) },
    })
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10001] flex items-end justify-end bg-black/50 p-2 pb-[calc(var(--spacing-deck-chrome)+0.5rem)]"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[60dvh] w-80 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-lg border border-white/20 bg-[var(--r-background-color,#111)] text-[var(--r-main-color,#eee)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={listId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <h2 id={listId} className="m-0 text-sm font-semibold">
            Перейти к слайду
          </h2>
          <button
            type="button"
            className="btn-focus size-8 rounded border-0 bg-transparent text-xl"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <ol className="m-0 list-none overflow-y-auto p-1" role="listbox">
          {slides.map((slide) => {
            const isActive = slide.id === currentSlideId
            return (
              <li key={slide.id} role="none">
                <button
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`btn-focus flex w-full items-baseline gap-2 rounded px-2 py-2 text-left hover:bg-white/10${isActive ? ' bg-[var(--r-link-color,#e94560)]/20' : ''}`}
                  onClick={() => goToSlide(slide.id)}
                >
                  <span className="w-6 shrink-0 font-semibold opacity-70">
                    {slide.id}
                  </span>
                  <span className="truncate">{slide.title || `Слайд ${slide.id}`}</span>
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

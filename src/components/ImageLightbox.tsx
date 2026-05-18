import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { SlideImage } from '../lib/parsePresentation'
import { useReveal } from '../RevealContext'

type ImageLightboxProps = {
  images: SlideImage[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

const navBtn =
  'btn-focus z-[2] flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 disabled:opacity-25'

export default function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const reveal = useReveal()
  const current = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1
  const showNav = images.length > 1

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1)
  }, [hasPrev, index, onIndexChange])

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1)
  }, [hasNext, index, onIndexChange])

  useEffect(() => {
    const wasPaused = reveal?.isPaused() ?? false
    reveal?.togglePause(true)
    return () => {
      if (!wasPaused) reveal?.togglePause(false)
    }
  }, [reveal])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.stopImmediatePropagation()
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.body.classList.add('lightbox-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.classList.remove('lightbox-open')
    }
  }, [onClose, goPrev, goNext])

  if (!current) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] animate-lightbox-in bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || `Изображение ${index + 1} из ${images.length}`}
      onClick={onClose}
    >
      {showNav && (
        <>
          <button
            type="button"
            className={`${navBtn} absolute top-1/2 left-[max(0.75rem,env(safe-area-inset-left))] -translate-y-1/2`}
            disabled={!hasPrev}
            aria-label="Предыдущее"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className={`${navBtn} absolute top-1/2 right-[max(0.75rem,env(safe-area-inset-right))] -translate-y-1/2`}
            disabled={!hasNext}
            aria-label="Следующее"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
          >
            ›
          </button>
        </>
      )}

      <div
        className="absolute inset-0 z-[1] flex flex-col px-16 pt-12 pb-8 mobile-deck:px-14"
        onClick={onClose}
      >
        <figure
          className="m-0 flex min-h-0 flex-1 flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex min-h-0 w-full max-w-full flex-1 items-center justify-center">
            <img
              src={current.src}
              alt={current.alt}
              className="h-full max-h-full w-full max-w-full object-contain"
            />
          </div>
          {(showNav || current.description) && (
            <figcaption className="mt-2 shrink-0 text-center text-sm text-white/80">
              {showNav && (
                <span className="block">
                  {index + 1} / {images.length}
                </span>
              )}
              {current.description && <p className="mt-1">{current.description}</p>}
            </figcaption>
          )}
        </figure>
      </div>

      <button
        type="button"
        className={`${navBtn} absolute top-[max(0.5rem,env(safe-area-inset-top))] right-[max(0.5rem,env(safe-area-inset-right))]`}
        aria-label="Закрыть"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        ×
      </button>
    </div>,
    document.body,
  )
}

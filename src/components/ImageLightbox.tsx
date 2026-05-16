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
  const ariaLabel =
    current?.alt || `Изображение ${index + 1} из ${images.length}`

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

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          goPrev()
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          goNext()
          break
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
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      {showNav && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          disabled={!hasPrev}
          aria-label="Предыдущее изображение"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
        >
          ‹
        </button>
      )}

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img
          src={current.src}
          alt={current.alt}
          className="lightbox-image"
        />
        {(showNav || current.description) && (
          <figcaption className="lightbox-caption">
            {showNav && (
              <span className="lightbox-counter">
                {index + 1} / {images.length}
              </span>
            )}
            {current.description && (
              <p className="lightbox-description">{current.description}</p>
            )}
          </figcaption>
        )}
      </figure>

      {showNav && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          disabled={!hasNext}
          aria-label="Следующее изображение"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
        >
          ›
        </button>
      )}

      <button
        type="button"
        className="lightbox-close"
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

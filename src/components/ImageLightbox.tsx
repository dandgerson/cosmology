import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useReveal } from '../RevealContext'

type ImageLightboxProps = {
  images: string[]
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

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображения"
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
        <img src={images[index]} alt="" className="lightbox-image" />
        {showNav && (
          <figcaption className="lightbox-counter">
            {index + 1} / {images.length}
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

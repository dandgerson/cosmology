import { useState } from 'react'
import type { SlideImage } from '../lib/parsePresentation'
import ImageLightbox from './ImageLightbox'

type SlideImagesProps = {
  images: SlideImage[]
}

export default function SlideImages({ images }: SlideImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const sizeClass =
    images.length === 1 ? 'single' : images.length <= 3 ? 'few' : 'many'

  return (
    <>
      <div className={`slide-images ${sizeClass}`}>
        {images.map((image, i) => (
          <button
            key={image.path}
            type="button"
            className="slide-image-btn"
            aria-label={
              image.alt ||
              `Увеличить изображение ${i + 1} из ${images.length}`
            }
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  )
}

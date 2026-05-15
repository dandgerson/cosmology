import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

type SlideImagesProps = {
  images: string[]
}

export default function SlideImages({ images }: SlideImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const sizeClass =
    images.length === 1 ? 'single' : images.length <= 3 ? 'few' : 'many'

  return (
    <>
      <div className={`slide-images ${sizeClass}`}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="slide-image-btn"
            aria-label={`Увеличить изображение ${i + 1} из ${images.length}`}
            onClick={() => setLightboxIndex(i)}
          >
            <img src={src} alt="" loading="lazy" />
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

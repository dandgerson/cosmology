import { useState } from 'react'
import type { SlideImage } from '../lib/parsePresentation'
import ImageLightbox from './ImageLightbox'
import SlideImageButton from './SlideImageButton'

type SlideImagesProps = {
  images: SlideImage[]
}

export default function SlideImages({ images }: SlideImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const layout =
    images.length === 1 ? 'single' : images.length <= 3 ? 'few' : 'many'

  return (
    <>
      <div
        className={`slide-thumbs${layout === 'single' ? ' slide-thumbs--single' : layout === 'few' ? ' slide-thumbs--few' : ''}`}
        data-prevent-swipe
      >
        {images.map((image, i) => (
          <SlideImageButton
            key={image.path}
            image={image}
            index={i}
            total={images.length}
            onOpen={() => setLightboxIndex(i)}
          />
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

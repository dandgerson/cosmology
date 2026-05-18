import type { SlideImage } from '../lib/parsePresentation'
import { useTapActivate } from '../hooks/useTapActivate'

type SlideImageButtonProps = {
  image: SlideImage
  index: number
  total: number
  onOpen: () => void
}

export default function SlideImageButton({
  image,
  index,
  total,
  onOpen,
}: SlideImageButtonProps) {
  const tap = useTapActivate(onOpen)

  return (
    <button
      type="button"
      className="slide-image-btn"
      data-prevent-swipe
      aria-label={
        image.alt || `Увеличить изображение ${index + 1} из ${total}`
      }
      {...tap}
    >
      <img src={image.src} alt={image.alt} loading="lazy" draggable={false} />
    </button>
  )
}

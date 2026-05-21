import type { SlideImage } from '../lib/parsePresentation'

type SlideImageButtonProps = {
  image: SlideImage
  index: number
  total: number
}

export default function SlideImageButton({
  image,
  index,
  total,
}: SlideImageButtonProps) {
  return (
    <button
      type="button"
      className="slide-thumb btn-focus"
      data-prevent-swipe
      data-image-index={index}
      aria-label={
        image.alt || `Увеличить изображение ${index + 1} из ${total}`
      }
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        draggable={false}
        className="size-full object-cover"
      />
    </button>
  )
}

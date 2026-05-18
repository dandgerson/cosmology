import Markdown from 'react-markdown'
import type { Slide } from '../lib/parsePresentation'
import {
  getPanelLabel,
  shouldShowImages,
  type PanelId,
} from '../lib/slidePanels'
import SlideImages from './SlideImages'

function formatBody(text: string) {
  return text.split(/\n\n+/).map((paragraph, i) => (
    <p key={i}>{paragraph}</p>
  ))
}

type SlidePanelContentProps = {
  slide: Slide
  panel: PanelId
}

export default function SlidePanelContent({ slide, panel }: SlidePanelContentProps) {
  const images = shouldShowImages(panel) ? slide.images : []

  switch (panel) {
    case 'main':
      return (
        <>
          <h2>{slide.title}</h2>
          <div className="slide-body">{formatBody(slide.body)}</div>
          {images.length > 0 && <SlideImages images={images} />}
        </>
      )

    case 'details':
      return (
        <>
          <h2>{slide.title}</h2>
          <p className="panel-label">{getPanelLabel('details')}</p>
          <div className="slide-body panel-scroll">{formatBody(slide.details)}</div>
          {images.length > 0 && <SlideImages images={images} />}
        </>
      )

    case 'article':
      return (
        <>
          <h2>{slide.title}</h2>
          <p className="panel-label">{getPanelLabel('article')}</p>
          <article className="slide-article panel-scroll">
            <Markdown>{slide.article}</Markdown>
          </article>
          {images.length > 0 && <SlideImages images={images} />}
        </>
      )

    case 'sources':
      return (
        <>
          <h2>{slide.title}</h2>
          <p className="panel-label">{getPanelLabel('sources')}</p>
          <div className="slide-sources panel-scroll">
            <Markdown>{slide.sources}</Markdown>
          </div>
        </>
      )

    default:
      return null
  }
}

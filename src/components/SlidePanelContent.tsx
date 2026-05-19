import Markdown from 'react-markdown'
import type { Slide } from '../lib/parsePresentation'
import {
  getPanelLabel,
  panelShowsNotes,
  shouldShowImages,
  type PanelId,
} from '../lib/slidePanels'
import PanelMain from './PanelMain'
import SlideImages from './SlideImages'

type SlidePanelContentProps = {
  slide: Slide
  panel: PanelId
}

export default function SlidePanelContent({ slide, panel }: SlidePanelContentProps) {
  const images = shouldShowImages(panel) ? slide.images : []
  const showLabel = panel !== 'main'

  const body = (() => {
    switch (panel) {
      case 'main':
        return slide.body
      case 'details':
        return slide.details
      case 'article':
        return slide.article
      case 'sources':
        return slide.sources
      default:
        return ''
    }
  })()

  const showNotes = panel === 'main' && panelShowsNotes('main') && slide.notes.trim().length > 0
  const hasScrollable = body.trim().length > 0 || images.length > 0 || showNotes

  return (
    <div className="slide-body">
      <h2 className="slide-title">{slide.title}</h2>
      {showLabel && <p className="slide-label">{getPanelLabel(panel)}</p>}
      {hasScrollable && (
        <PanelMain>
          {body.trim() && (
            <div className="slide-prose">
              <Markdown>{body}</Markdown>
            </div>
          )}
          {showNotes && (
            <div className="slide-notes slide-prose">
              <Markdown>{slide.notes}</Markdown>
            </div>
          )}
          {images.length > 0 && <SlideImages images={images} />}
        </PanelMain>
      )}
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import type { Slide } from '../lib/parsePresentation'
import {
  getPanelLabel,
  getSlidePanels,
  type PanelId,
} from '../lib/slidePanels'

type SlidePanelNavProps = {
  slide: Slide
  activePanel: PanelId
}

export default function SlidePanelNav({ slide, activePanel }: SlidePanelNavProps) {
  const panels = getSlidePanels(slide)

  if (panels.length <= 1) return null

  return (
    <nav className="slide-panel-nav" aria-label="Разделы слайда">
      {panels.map((panel) => (
        <Link
          key={panel}
          to="/slide/$slideId/$panel"
          params={{ slideId: slide.id, panel }}
          className={panel === activePanel ? 'active' : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {getPanelLabel(panel)}
        </Link>
      ))}
    </nav>
  )
}

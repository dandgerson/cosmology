import type { Slide } from './parsePresentation'
import { meta } from './presentationData'

export type PanelId = string

const PANEL_SLIDE_KEYS: Partial<Record<string, keyof Slide>> = {
  details: 'details',
  article: 'article',
  sources: 'sources',
}

export const PANEL_IDS = Object.keys(meta.panels)

export function isPanelId(value: string): value is PanelId {
  return value in meta.panels
}

export function getPanelLabel(panelId: string): string {
  return meta.panels[panelId]?.label ?? panelId
}

export function panelShowsImages(panelId: string): boolean {
  return meta.panels[panelId]?.showImages === true
}

export function getSlidePanels(slide: Slide): PanelId[] {
  const panels: PanelId[] = ['main']
  for (const id of Object.keys(meta.panels)) {
    if (id === 'main') continue
    const key = PANEL_SLIDE_KEYS[id]
    if (key && typeof slide[key] === 'string' && slide[key].trim()) {
      panels.push(id)
    }
  }
  return panels
}

export function panelIndex(slide: Slide, panel: PanelId): number {
  const panels = getSlidePanels(slide)
  const index = panels.indexOf(panel)
  return index === -1 ? 0 : index
}

export function shouldShowImages(panel: PanelId): boolean {
  return panel === 'main' || panelShowsImages(panel)
}

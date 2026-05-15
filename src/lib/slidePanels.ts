import type { Slide } from './parsePresentation'
import {
  PANELS_CONFIG,
  PANEL_LABELS,
  type PanelId,
} from './presentationConfig'

export type { PanelId }
export { PANEL_LABELS }

export const PANEL_IDS = PANELS_CONFIG.map((p) => p.id) as PanelId[]

export function isPanelId(value: string): value is PanelId {
  return (PANEL_IDS as readonly string[]).includes(value)
}

export function getSlidePanels(slide: Slide): PanelId[] {
  const panels: PanelId[] = ['main']
  for (const p of PANELS_CONFIG) {
    if (p.slideKey) {
      const value = slide[p.slideKey]
      if (value?.trim()) panels.push(p.id)
    }
  }
  return panels
}

export function panelIndex(slide: Slide, panel: PanelId): number {
  const panels = getSlidePanels(slide)
  const index = panels.indexOf(panel)
  return index === -1 ? 0 : index
}

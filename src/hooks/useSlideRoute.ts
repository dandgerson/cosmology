import { useRouterState } from '@tanstack/react-router'
import { isPanelId, type PanelId } from '../lib/slidePanels'

export function useSlideRoute() {
  return useRouterState({
    select: (state) => {
      const match = state.location.pathname.match(
        /^\/slide\/([^/]+)\/([^/]+)/,
      )
      if (!match) {
        return { slideId: undefined, panel: 'main' as PanelId }
      }
      const panel = match[2]
      return {
        slideId: match[1],
        panel: isPanelId(panel) ? panel : ('main' as PanelId),
      }
    },
  })
}

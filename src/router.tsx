import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import RootLayout from './routes/RootLayout'
import { isPanelId } from './lib/slidePanels'
import { getFirstSlideId, getSlideById, meta } from './lib/presentationData'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const first = getFirstSlideId()
    if (first) {
      throw redirect({
        to: '/slide/$slideId/$panel',
        params: { slideId: first, panel: 'main' },
      })
    }
  },
})

const slideRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slide/$slideId',
  beforeLoad: ({ params }) => {
    if (!getSlideById(params.slideId)) {
      redirectToFirstSlide()
    }
    throw redirect({
      to: '/slide/$slideId/$panel',
      params: { slideId: params.slideId, panel: 'main' },
    })
  },
})

function redirectToFirstSlide(): never {
  const first = getFirstSlideId()
  if (first) {
    throw redirect({
      to: '/slide/$slideId/$panel',
      params: { slideId: first, panel: 'main' },
    })
  }
  throw redirect({ to: '/' })
}

const slidePanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slide/$slideId/$panel',
  beforeLoad: ({ params }) => {
    if (!getSlideById(params.slideId)) {
      redirectToFirstSlide()
    }
    if (!isPanelId(params.panel) || !meta.panels[params.panel]) {
      throw redirect({
        to: '/slide/$slideId/$panel',
        params: { slideId: params.slideId, panel: 'main' },
      })
    }
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  slideRedirectRoute,
  slidePanelRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

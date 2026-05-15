import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import RootLayout from './routes/RootLayout'
import { isPanelId } from './lib/slidePanels'
import { getSlideById } from './lib/presentationData'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

const slideRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slide/$slideId',
  beforeLoad: ({ params }) => {
    if (!getSlideById(params.slideId)) {
      throw redirect({ to: '/' })
    }
    throw redirect({
      to: '/slide/$slideId/$panel',
      params: { slideId: params.slideId, panel: 'main' },
    })
  },
})

const slidePanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slide/$slideId/$panel',
  beforeLoad: ({ params }) => {
    if (!getSlideById(params.slideId)) {
      throw redirect({ to: '/' })
    }
    if (!isPanelId(params.panel)) {
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

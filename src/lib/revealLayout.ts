/** Viewports below this width use compact slide layout */
export const MOBILE_BREAKPOINT = 768

export type RevealLayoutSize = {
  width: number
  height: number
  margin: number
  isMobile: boolean
}

export function isMobileViewport(width = window.innerWidth): boolean {
  return width < MOBILE_BREAKPOINT
}

/** Slide canvas size — smaller base on phones so Reveal scale stays readable */
export function getRevealLayoutSize(
  vw = window.innerWidth,
  vh = window.innerHeight,
): RevealLayoutSize {
  if (!isMobileViewport(vw)) {
    return { width: 1920, height: 1080, margin: 0.06, isMobile: false }
  }

  const aspect = vw / Math.max(vh, 1)
  const height = 720
  const width = Math.round(height * aspect)

  return {
    width: Math.max(320, width),
    height,
    margin: 0.02,
    isMobile: true,
  }
}

export function getRevealOptions(size: RevealLayoutSize = getRevealLayoutSize()) {
  return {
    hash: false,
    history: false,
    controls: true,
    controlsLayout: 'bottom-right' as const,
    slideNumber: false,
    transition: 'slide' as const,
    backgroundTransition: 'fade' as const,
    width: size.width,
    height: size.height,
    margin: size.margin,
    minScale: 0.2,
    maxScale: 2,
    touch: true,
    center: true,
  }
}

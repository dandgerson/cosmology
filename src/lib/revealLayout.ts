/** Viewports below this width use compact slide layout */
export const MOBILE_BREAKPOINT = 768

export type RevealLayoutSize = {
  width: number
  height: number
  margin: number
  isMobile: boolean
}

export function getViewportSize(): { width: number; height: number } {
  const vv = window.visualViewport
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
  }
}

/** Use the shorter edge so landscape phones stay in mobile layout (width often exceeds 768px). */
export function isMobileViewport(
  width = getViewportSize().width,
  height = getViewportSize().height,
): boolean {
  return Math.min(width, height) < MOBILE_BREAKPOINT
}

/** Slide canvas size — smaller base on phones so Reveal scale stays readable */
export function getRevealLayoutSize(
  vw = getViewportSize().width,
  vh = getViewportSize().height,
): RevealLayoutSize {
  if (!isMobileViewport(vw, vh)) {
    return { width: 1920, height: 1080, margin: 0.04, isMobile: false }
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
    center: !size.isMobile,
    // Reveal 6 enables scroll view at <=435px; portrait phones would switch
    // modes on rotation while indices/URL stay put — keep slide + swipe layout.
    scrollActivationWidth: 0,
  }
}

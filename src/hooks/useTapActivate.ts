import { useCallback, useEffect, useRef, type RefObject } from 'react'

const TAP_MOVE_THRESHOLD_PX = 12
const ACTIVATE_DEBOUNCE_MS = 400

type TapTarget = {
  x: number
  y: number
  el: HTMLElement
}

/** Delegated tap handling for interactive regions inside Reveal slides. */
export function useTapDelegate(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  onActivate: (el: HTMLElement) => void,
) {
  const onActivateRef = useRef(onActivate)

  useEffect(() => {
    onActivateRef.current = onActivate
  }, [onActivate])

  const bindTap = useCallback((root: HTMLElement) => {
    let start: TapTarget | null = null
    let lastActivateAt = 0

    const findTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null
      const el = target.closest(selector)
      if (!el || !root.contains(el) || !(el instanceof HTMLElement)) return null
      return el
    }

    const reset = () => {
      start = null
    }

    const activate = (el: HTMLElement, e: Event) => {
      const now = Date.now()
      if (now - lastActivateAt < ACTIVATE_DEBOUNCE_MS) return
      lastActivateAt = now
      e.stopPropagation()
      if (e.cancelable) e.preventDefault()
      onActivateRef.current(el)
    }

    const recordStart = (x: number, y: number, el: HTMLElement) => {
      start = { x, y, el }
    }

    const tryActivate = (x: number, y: number, el: HTMLElement, e: Event) => {
      if (!start || start.el !== el) return
      const dx = Math.abs(x - start.x)
      const dy = Math.abs(y - start.y)
      reset()
      if (dx > TAP_MOVE_THRESHOLD_PX || dy > TAP_MOVE_THRESHOLD_PX) return
      activate(el, e)
    }

    const onPointerDown = (e: PointerEvent) => {
      const el = findTarget(e.target)
      if (!el) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      recordStart(e.clientX, e.clientY, el)
    }

    const onPointerUp = (e: PointerEvent) => {
      const el = findTarget(e.target)
      if (!el) return
      tryActivate(e.clientX, e.clientY, el, e)
    }

    const onTouchStart = (e: TouchEvent) => {
      const el = findTarget(e.target)
      if (!el) return
      const t = e.touches[0]
      if (t) recordStart(t.clientX, t.clientY, el)
    }

    const onTouchEnd = (e: TouchEvent) => {
      const el = findTarget(e.target)
      if (!el) return
      const t = e.changedTouches[0]
      if (t) tryActivate(t.clientX, t.clientY, el, e)
    }

    const onClick = (e: MouseEvent) => {
      const el = findTarget(e.target)
      if (!el) return
      if (Date.now() - lastActivateAt < ACTIVATE_DEBOUNCE_MS) return
      activate(el, e)
    }

    const capture = { capture: true } as const
    const passiveCapture = { capture: true, passive: true } as const
    const activeCapture = { capture: true, passive: false } as const

    root.addEventListener('pointerdown', onPointerDown, passiveCapture)
    root.addEventListener('pointerup', onPointerUp, activeCapture)
    root.addEventListener('pointercancel', reset, capture)
    root.addEventListener('touchstart', onTouchStart, passiveCapture)
    root.addEventListener('touchend', onTouchEnd, activeCapture)
    root.addEventListener('touchcancel', reset, capture)
    root.addEventListener('click', onClick, activeCapture)

    return () => {
      root.removeEventListener('pointerdown', onPointerDown, passiveCapture)
      root.removeEventListener('pointerup', onPointerUp, activeCapture)
      root.removeEventListener('pointercancel', reset, capture)
      root.removeEventListener('touchstart', onTouchStart, passiveCapture)
      root.removeEventListener('touchend', onTouchEnd, activeCapture)
      root.removeEventListener('touchcancel', reset, capture)
      root.removeEventListener('click', onClick, activeCapture)
    }
  }, [selector])

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    return bindTap(root)
  }, [bindTap, containerRef])
}

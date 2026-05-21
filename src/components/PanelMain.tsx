import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useReveal } from '../RevealContext'

type PanelMainProps = {
  children: ReactNode
}

function viewportBottom(): number {
  const vv = window.visualViewport
  if (vv) return vv.offsetTop + vv.height
  return window.innerHeight
}

/** Scrollable panel body (prose/images only); title and tabs stay fixed above */
export default function PanelMain({ children }: PanelMainProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const reveal = useReveal()

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const shell = scrollEl.closest('.slide-shell') as HTMLElement | null

    const applyHeight = () => {
      const isMobile = document.documentElement.dataset.mobileDeck === 'true'

      // Mobile: flex + safe center; clear stale inline caps after rotation.
      if (isMobile) {
        if (shell) {
          shell.style.maxHeight = ''
          shell.style.overflow = ''
        }
        scrollEl.style.height = ''
        scrollEl.style.maxHeight = ''
        scrollEl.style.minHeight = ''
        return
      }

      const shellStyle = shell ? getComputedStyle(shell) : null
      const padBottom = shellStyle ? parseFloat(shellStyle.paddingBottom) : 12

      if (shell) {
        const shellTop = shell.getBoundingClientRect().top
        const shellMax = viewportBottom() - shellTop - 8
        shell.style.maxHeight = `${Math.max(120, shellMax)}px`
        shell.style.overflow = 'hidden'
      }

      const top = scrollEl.getBoundingClientRect().top
      const available = viewportBottom() - top - padBottom - 8
      const maxHeight = Math.max(80, available)

      scrollEl.style.height = ''
      scrollEl.style.maxHeight = `${maxHeight}px`
      scrollEl.style.minHeight = ''
      scrollEl.style.overflowY = 'auto'
    }

    applyHeight()
    const frame = requestAnimationFrame(applyHeight)

    const ro = new ResizeObserver(applyHeight)
    ro.observe(scrollEl)
    if (shell) ro.observe(shell)

    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) applyHeight()
    })
    if (shell) io.observe(shell)

    const scheduleHeight = () => {
      applyHeight()
      window.setTimeout(applyHeight, 150)
      window.setTimeout(applyHeight, 350)
    }

    window.addEventListener('resize', scheduleHeight)
    window.addEventListener('orientationchange', scheduleHeight)
    window.visualViewport?.addEventListener('resize', scheduleHeight)
    window.visualViewport?.addEventListener('scroll', scheduleHeight)

    reveal?.on('slidechanged', applyHeight)
    reveal?.on('resize', scheduleHeight)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('resize', scheduleHeight)
      window.removeEventListener('orientationchange', scheduleHeight)
      window.visualViewport?.removeEventListener('resize', scheduleHeight)
      window.visualViewport?.removeEventListener('scroll', scheduleHeight)
      reveal?.off('slidechanged', applyHeight)
      reveal?.off('resize', scheduleHeight)
    }
  }, [reveal])

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el || el.scrollHeight <= el.clientHeight) return

    const atTop = el.scrollTop <= 0
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1

    if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
      e.stopPropagation()
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="slide-scroll"
      onWheel={onWheel}
      data-panel-scroll
    >
      <div className="slide-scroll-inner">{children}</div>
    </div>
  )
}

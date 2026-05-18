import { useCallback, useRef } from 'react'

const TAP_MOVE_THRESHOLD_PX = 12

type TapHandlers = {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onClick: (e: React.MouseEvent) => void
}

/** Reliable tap on touch devices (Reveal swipe handler won't steal the gesture). */
export function useTapActivate(onActivate: () => void): TapHandlers {
  const start = useRef<{ x: number; y: number } | null>(null)
  const activatedByPointer = useRef(false)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      if (e.pointerType === 'mouse' && e.button !== 0) return
      start.current = { x: e.clientX, y: e.clientY }
      activatedByPointer.current = false
    },
    [],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      if (!start.current) return

      const dx = Math.abs(e.clientX - start.current.x)
      const dy = Math.abs(e.clientY - start.current.y)
      start.current = null

      if (dx <= TAP_MOVE_THRESHOLD_PX && dy <= TAP_MOVE_THRESHOLD_PX) {
        activatedByPointer.current = true
        onActivate()
      }
    },
    [onActivate],
  )

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (activatedByPointer.current) {
        activatedByPointer.current = false
        return
      }
      onActivate()
    },
    [onActivate],
  )

  return { onPointerDown, onPointerUp, onClick }
}

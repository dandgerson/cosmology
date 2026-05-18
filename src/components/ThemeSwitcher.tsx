import { useEffect, useState } from 'react'
import {
  getStoredRevealTheme,
  REVEAL_THEMES,
  setRevealTheme,
  type RevealThemeId,
} from '../lib/revealThemes'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<RevealThemeId>(getStoredRevealTheme)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setRevealTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const selectTheme = (id: RevealThemeId) => {
    setTheme(id)
    setRevealTheme(id)
    setOpen(false)
  }

  return (
    <div className="fixed top-2 right-2 z-50 text-sm mobile-deck:top-[max(0.5rem,env(safe-area-inset-top))] mobile-deck:right-[max(0.5rem,env(safe-area-inset-right))]">
      <button
        type="button"
        className="btn-focus flex min-h-11 items-center gap-1.5 rounded-md border border-switcher-border bg-switcher-bg px-3 py-2 text-switcher-fg backdrop-blur-sm hover:bg-switcher-hover"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Сменить тему оформления"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">◐</span>
        <span className="mobile-deck:hidden">
          {REVEAL_THEMES.find((t) => t.id === theme)?.label}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[49] border-0 bg-transparent"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
          />
          <ul
            className="absolute top-full right-0 z-[51] mt-2 max-h-[70vh] min-w-44 list-none overflow-y-auto rounded-lg border border-switcher-border bg-switcher-menu p-1.5 shadow-xl"
            role="listbox"
            aria-label="Темы"
          >
            {REVEAL_THEMES.map((t) => (
              <li key={t.id} role="option" aria-selected={t.id === theme}>
                <button
                  type="button"
                  className={`btn-focus block w-full rounded px-2.5 py-1.5 text-left text-sm text-switcher-fg hover:bg-switcher-menu-hover${t.id === theme ? ' bg-switcher-active text-switcher-active-fg' : ''}`}
                  onClick={() => selectTheme(t.id)}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

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
    <div className="theme-switcher">
      <button
        type="button"
        className="theme-switcher-toggle"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Сменить тему оформления"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="theme-switcher-icon" aria-hidden="true">
          ◐
        </span>
        <span className="theme-switcher-label">
          {REVEAL_THEMES.find((t) => t.id === theme)?.label}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="theme-switcher-backdrop"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
          />
          <ul className="theme-switcher-menu" role="listbox" aria-label="Темы">
            {REVEAL_THEMES.map((t) => (
              <li key={t.id} role="option" aria-selected={t.id === theme}>
                <button
                  type="button"
                  className={t.id === theme ? 'active' : undefined}
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

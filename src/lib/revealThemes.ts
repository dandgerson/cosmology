import beige from 'reveal.js/theme/beige.css?url'
import black from 'reveal.js/theme/black.css?url'
import blackContrast from 'reveal.js/theme/black-contrast.css?url'
import blood from 'reveal.js/theme/blood.css?url'
import dracula from 'reveal.js/theme/dracula.css?url'
import league from 'reveal.js/theme/league.css?url'
import moon from 'reveal.js/theme/moon.css?url'
import night from 'reveal.js/theme/night.css?url'
import serif from 'reveal.js/theme/serif.css?url'
import simple from 'reveal.js/theme/simple.css?url'
import sky from 'reveal.js/theme/sky.css?url'
import solarized from 'reveal.js/theme/solarized.css?url'
import white from 'reveal.js/theme/white.css?url'
import whiteContrast from 'reveal.js/theme/white-contrast.css?url'

export const REVEAL_THEME_STORAGE_KEY = 'cosmology-reveal-theme'

export const REVEAL_THEMES = [
  { id: 'black', label: 'Black' },
  { id: 'white', label: 'White' },
  { id: 'black-contrast', label: 'Black contrast' },
  { id: 'white-contrast', label: 'White contrast' },
  { id: 'league', label: 'League' },
  { id: 'beige', label: 'Beige' },
  { id: 'sky', label: 'Sky' },
  { id: 'night', label: 'Night' },
  { id: 'moon', label: 'Moon' },
  { id: 'serif', label: 'Serif' },
  { id: 'simple', label: 'Simple' },
  { id: 'solarized', label: 'Solarized' },
  { id: 'blood', label: 'Blood' },
  { id: 'dracula', label: 'Dracula' },
] as const

export type RevealThemeId = (typeof REVEAL_THEMES)[number]['id']

const THEME_URLS: Record<RevealThemeId, string> = {
  beige,
  black,
  'black-contrast': blackContrast,
  blood,
  dracula,
  league,
  moon,
  night,
  serif,
  simple,
  sky,
  solarized,
  white,
  'white-contrast': whiteContrast,
}

export const DEFAULT_REVEAL_THEME: RevealThemeId = 'black'

export const LIGHT_REVEAL_THEMES: RevealThemeId[] = [
  'white',
  'white-contrast',
  'beige',
  'sky',
  'serif',
  'simple',
  'solarized',
]

export function isLightRevealTheme(theme: RevealThemeId): boolean {
  return LIGHT_REVEAL_THEMES.includes(theme)
}

const THEME_LINK_ID = 'reveal-theme-link'

function getThemeLink(): HTMLLinkElement {
  let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.id = THEME_LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  return link
}

export function isRevealThemeId(value: string): value is RevealThemeId {
  return value in THEME_URLS
}

export function getStoredRevealTheme(): RevealThemeId {
  const stored = localStorage.getItem(REVEAL_THEME_STORAGE_KEY)
  if (stored && isRevealThemeId(stored)) return stored
  return DEFAULT_REVEAL_THEME
}

export function setRevealTheme(theme: RevealThemeId): void {
  const link = getThemeLink()
  link.href = THEME_URLS[theme]
  // Keep theme stylesheet last so its :root variables win
  document.head.appendChild(link)
  document.documentElement.dataset.revealTheme = theme
  localStorage.setItem(REVEAL_THEME_STORAGE_KEY, theme)
}

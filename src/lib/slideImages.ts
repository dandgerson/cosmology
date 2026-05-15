import { SLIDE_IMAGE_DIRS } from './presentationConfig'

// Must stay a compile-time string literal (Vite import.meta.glob). Sync with SLIDE_IMAGE_* in presentationConfig.
const imageModules = import.meta.glob('../img/**/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function normalizeSlideId(id: string): string {
  return id.toLowerCase().replace('а', 'a').replace('б', 'b')
}

export function getSlideImages(slideId: string): string[] {
  const normalized = normalizeSlideId(slideId)
  const dir = SLIDE_IMAGE_DIRS[slideId] ?? SLIDE_IMAGE_DIRS[normalized]
  if (!dir) return []

  return Object.entries(imageModules)
    .filter(([path]) => path.includes(`${dir}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url)
}

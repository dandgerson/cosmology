const imageModules = import.meta.glob('../img/**/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

/** Maps slide id (from presentation.md) to image folder prefix under src/img */
const SLIDE_IMAGE_DIRS: Record<string, string> = {
  '2': '2-babylon',
  '3': '3-egypt',
  '4': '4-china',
  '5': '5-greece',
  '5а': '5-a-greece',
  '5a': '5-a-greece',
  '5б': '5-b-greece',
  '5b': '5-b-greece',
  '6': '6-norse',
  '12': '12-masonic',
}

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

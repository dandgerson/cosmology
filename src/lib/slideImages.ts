// Vite requires a string literal here (not imported from config).
const imageModules = import.meta.glob('../img/**/*.{jpg,jpeg,png,gif,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const knownPaths = new Set(
  Object.keys(imageModules).map((key) =>
    key.replace(/^(\.\.\/)+/, '').replace(/^\//, ''),
  ),
)

function moduleKey(relativePath: string): string {
  return `../${relativePath.replace(/^\//, '')}`
}

export function resolveImagePath(relativePath: string): string {
  const key = moduleKey(relativePath)
  const url = imageModules[key]
  if (url) return url
  return new URL(`../${relativePath.replace(/^\//, '')}`, import.meta.url).href
}

export function warnIfImageMissing(path: string): void {
  if (import.meta.env.PROD) return
  const normalized = path.replace(/^\//, '')
  const found = [...knownPaths].some(
    (p) => p === normalized || p.endsWith(`/${normalized}`),
  )
  if (!found) {
    console.warn(`[presentation] image not found: ${path}`)
  }
}

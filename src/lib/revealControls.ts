import type { DeckApi } from '../RevealContext'

type ControlsApi = { update: () => void }

/** Reveal exposes controls on the instance; types omit it. */
export function updateRevealControls(deck: DeckApi | null) {
  const controls = (deck as DeckApi & { controls?: ControlsApi })?.controls
  controls?.update()
}

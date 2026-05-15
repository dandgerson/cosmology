import { createContext, useContext } from 'react'
import type Reveal from 'reveal.js'

export type DeckApi = InstanceType<typeof Reveal>

export const RevealContext = createContext<DeckApi | null>(null)

export function useReveal() {
  return useContext(RevealContext)
}

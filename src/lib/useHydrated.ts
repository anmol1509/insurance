'use client'
import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * False during server render and the first client render, true afterwards.
 *
 * Stores persisted to sessionStorage only rehydrate in the browser, so any
 * branch that depends on them (e.g. "is this customer signed in?") must wait
 * for this before rendering, or the first paint contradicts the server HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false)
}

'use client'
import { useEffect, useState } from 'react'
import { fetchNsiaDropdowns } from './browser'
import type { NsiaDropdown } from './types'

/**
 * Loads NSIA master data for a form. The lists are cached server-side, so
 * calling this from several steps is cheap.
 *
 * Failures are deliberately silent: the caller falls back to its local
 * constants, and a dropdown that will not load is no reason to block a quote.
 */
export function useNsiaDropdowns<T extends Record<string, unknown>>(
  names: NsiaDropdown[]
): { data: Partial<T>; loading: boolean } {
  const key = names.join(',')
  // Keyed so a change of `names` reports as loading again without needing to
  // reset state from inside the effect.
  const [result, setResult] = useState<{ key: string; data: Partial<T> } | null>(null)

  useEffect(() => {
    let active = true

    fetchNsiaDropdowns<T>(key.split(',') as NsiaDropdown[])
      .then((data) => {
        if (active) setResult({ key, data })
      })
      .catch(() => {
        if (active) setResult({ key, data: {} })
      })

    return () => {
      active = false
    }
  }, [key])

  const settled = result?.key === key
  return { data: settled ? result.data : {}, loading: !settled }
}

/**
 * Merges an NSIA list into our local options: NSIA's values come first so a
 * submission carries names the insurer recognises, and anything only we know
 * about is kept at the end.
 */
export function mergeOptions(local: string[], remote: unknown): string[] {
  if (!Array.isArray(remote)) return local

  const fromNsia = remote.filter((entry): entry is string => typeof entry === 'string')
  if (fromNsia.length === 0) return local

  const seen = new Set(fromNsia.map((entry) => entry.toLowerCase()))
  return [...fromNsia, ...local.filter((entry) => !seen.has(entry.toLowerCase()))]
}

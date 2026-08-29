/**
 * Flattens a Fortis motor catalog response into a list of selectable
 * products (each with its covers). Client-safe — no credentials involved.
 *
 * The partner docs describe the response as "the motor root product, child
 * motor products, and their covers/prices" without pinning down the exact
 * key names for the parent/child relationship, and no live response has
 * been observed to confirm it. This walks the tree looking for any of the
 * plausible child-array keys, so it keeps working whether the API returns a
 * flat list under `data.products` or a nested root-with-children structure.
 */
import type { FortisProduct } from './types'

const CHILD_KEYS = ['products', 'children', 'child_products', 'childProducts']

function collectProducts(node: unknown, seen: Set<unknown>): FortisProduct[] {
  if (!node || typeof node !== 'object' || seen.has(node)) return []
  seen.add(node)

  const obj = node as Record<string, unknown>
  const results: FortisProduct[] = []

  if (typeof obj.id !== 'undefined' && Array.isArray(obj.covers)) {
    results.push(obj as unknown as FortisProduct)
  }

  for (const key of CHILD_KEYS) {
    const value = obj[key]
    if (Array.isArray(value)) {
      for (const child of value) results.push(...collectProducts(child, seen))
    }
  }

  return results
}

/** Accepts the raw `{ success, catalog }` wrapper this platform's own /api/fortis/catalog returns. */
export function extractMotorProducts(catalogResponse: unknown): FortisProduct[] {
  const root =
    (catalogResponse as { catalog?: unknown })?.catalog ??
    (catalogResponse as { data?: unknown })?.data ??
    catalogResponse

  const seen = new Set<unknown>()
  if (Array.isArray(root)) {
    return root.flatMap((item) => collectProducts(item, seen))
  }
  return collectProducts(root, seen)
}

function coverPrice(cover: FortisCoverLike): number {
  const raw = cover.price ?? cover.premium ?? cover.amount
  const num = raw != null ? Number(raw) : NaN
  return Number.isFinite(num) ? num : 0
}

interface FortisCoverLike {
  price?: number | string
  premium?: number | string
  amount?: number | string
}

export function findMotorProduct(products: FortisProduct[], isComprehensive: boolean): FortisProduct | undefined {
  return (
    products.find((p) =>
      isComprehensive ? /comprehensive/i.test(p.name ?? '') : /third.?party|tpo/i.test(p.name ?? '')
    ) ?? products[0]
  )
}

export function cheapestCoverPrice(product: FortisProduct | undefined): number | null {
  const prices = (product?.covers ?? []).map(coverPrice).filter((price) => price > 0)
  return prices.length > 0 ? Math.min(...prices) : null
}

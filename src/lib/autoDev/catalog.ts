import { NIGERIA_VEHICLE_CATALOG } from '@/data/vehicleMakes'

export interface VehicleMakeOption {
  name: string
  models: string[]
}

type AutoDevModels = Record<string, unknown>

const simplify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export function nigeriaCatalog(): VehicleMakeOption[] {
  return Object.entries(NIGERIA_VEHICLE_CATALOG).map(([name, models]) => ({
    name,
    models: [...models],
  }))
}

/** Restrict Auto.dev's global model list to the vehicles supported in Nigeria. */
export function filterAutoDevCatalog(payload: unknown): VehicleMakeOption[] {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return nigeriaCatalog()

  const root = payload as Record<string, unknown>
  const raw = (root.data && typeof root.data === 'object' && !Array.isArray(root.data)
    ? root.data
    : root) as AutoDevModels
  const autoMakes = Object.entries(raw).filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))

  return nigeriaCatalog().map((allowed) => {
    const upstream = autoMakes.find(([name]) => simplify(name) === simplify(allowed.name))?.[1]
    if (!upstream) return allowed

    const upstreamNames = upstream
      .map((model) => typeof model === 'string' ? model : null)
      .filter((model): model is string => Boolean(model))
    const matched = allowed.models.filter((model) => {
      const expected = simplify(model)
      return upstreamNames.some((candidate) => {
        const received = simplify(candidate)
        return received === expected || received.startsWith(expected) || expected.startsWith(received)
      })
    })

    return { ...allowed, models: matched.length ? matched : allowed.models }
  })
}

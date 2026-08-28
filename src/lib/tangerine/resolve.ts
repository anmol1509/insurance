/**
 * Our platform stores vehicle/location data as free text (make & model
 * together, colour name, state name), but Tangerine's `GeneratePolicy`
 * endpoints require its own numeric codes. This resolves our text against
 * Tangerine's own master-data lists by name, so the UI never has to know
 * about Tangerine's codes.
 */
import { TangerineError } from './client'
import { getEngineCapacityCodes, getLGACodes, getStateCodes, getVehicleColours, getVehicleMakeCodes, getVehicleModelCodes } from './api'
import type { TangerineLine } from './config'
import type { TangerineVehicleMake } from './types'

/** British/American spelling variants our local colour names don't share with Tangerine's. */
const COLOUR_SYNONYMS: Record<string, string> = { gray: 'grey' }

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function findBestMatch<T>(
  candidates: T[],
  query: string,
  nameOf: (item: T) => string
): T | undefined {
  const target = normalise(query)
  if (!target) return undefined

  const exact = candidates.find((c) => normalise(nameOf(c)) === target)
  if (exact) return exact

  const startsWith = candidates.find((c) => normalise(nameOf(c)).startsWith(target) || target.startsWith(normalise(nameOf(c))))
  if (startsWith) return startsWith

  return candidates.find((c) => normalise(nameOf(c)).includes(target) || target.includes(normalise(nameOf(c))))
}

function requireMatch<T>(match: T | undefined, kind: string, query: string): T {
  if (!match) {
    throw new TangerineError(
      `Could not match "${query}" to a known Tangerine ${kind}. Please check the spelling and try again.`,
      400
    )
  }
  return match
}

/**
 * Splits our combined "make and model" text against Tangerine's own make
 * list first (so multi-word makes like "Land Rover" aren't cut short), then
 * resolves the remainder against that make's models.
 */
export async function resolveVehicleCodes(
  line: TangerineLine,
  makeModel: string
): Promise<{ makeCode: string; modelCode: string; makeName: string; modelName: string }> {
  const [makes, models] = await Promise.all([getVehicleMakeCodes(line), getVehicleModelCodes(line)])

  const trimmed = makeModel.trim()
  const sortedMakes = [...makes].sort(
    (a: TangerineVehicleMake, b: TangerineVehicleMake) => b.VehicleMakeName.length - a.VehicleMakeName.length
  )
  const make = sortedMakes.find((m) => normalise(trimmed).startsWith(normalise(m.VehicleMakeName)))
  const resolvedMake = requireMatch(make, 'vehicle make', makeModel)

  const modelQuery = trimmed.slice(resolvedMake.VehicleMakeName.length).trim() || trimmed
  const modelsForMake = models.filter((m) => m.VehicleMakeCode === resolvedMake.VehicleMakeCode)
  const model = findBestMatch(modelsForMake, modelQuery, (m) => m.VehicleModelName) ?? modelsForMake[0]
  const resolvedModel = requireMatch(model, 'vehicle model', modelQuery)

  return {
    makeCode: resolvedMake.VehicleMakeCode,
    modelCode: resolvedModel.VehicleModelCode,
    makeName: resolvedMake.VehicleMakeName,
    modelName: resolvedModel.VehicleModelName,
  }
}

export async function resolveColourCode(line: TangerineLine, colourName: string): Promise<string> {
  const colours = await getVehicleColours(line)
  const query = COLOUR_SYNONYMS[colourName.trim().toLowerCase()] ?? colourName
  const match = findBestMatch(colours, query, (c) => c.ColourName)
  return requireMatch(match, 'vehicle colour', colourName).ColourCode
}

/**
 * Our platform buckets engine size in cc ("1500–1999cc"); Tangerine buckets
 * in litres ("1.6 - 2.0"). Matched by converting our bucket to a
 * representative litre value and finding which of Tangerine's ranges it
 * falls in, rather than by name.
 */
const CC_BUCKET_MIDPOINT_LITRES: Record<string, number> = {
  'Under 1000cc': 0.9,
  '1000–1499cc': 1.25,
  '1500–1999cc': 1.75,
  '2000–2499cc': 2.25,
  '2500–2999cc': 2.75,
  '3000–3499cc': 3.25,
  '3500cc and above': 4.5,
}

export async function resolveEngineCapacityCode(line: TangerineLine, ccBucket: string): Promise<string> {
  const litres = CC_BUCKET_MIDPOINT_LITRES[ccBucket]
  if (litres == null) {
    throw new TangerineError(`Unrecognised engine capacity "${ccBucket}".`, 400)
  }

  const capacities = await getEngineCapacityCodes(line)
  const ranges = capacities
    .map((c) => {
      const match = c.CapacityName.match(/([\d.]+)\s*-\s*([\d.]+)/)
      return match ? { code: c.CapacityCode, min: Number(match[1]), max: Number(match[2]) } : null
    })
    .filter((r): r is { code: string; min: number; max: number } => r !== null)
    .sort((a, b) => a.min - b.min)

  const inRange = ranges.find((r) => litres >= r.min && litres <= r.max)
  if (inRange) return inRange.code

  // Outside every published range (e.g. below the lowest or above the highest) — clamp to the nearest end.
  const clamped = litres < (ranges[0]?.min ?? 0) ? ranges[0] : ranges[ranges.length - 1]
  return requireMatch(clamped, 'engine capacity', ccBucket).code
}

export async function resolveStateCode(line: TangerineLine, stateName: string): Promise<{ code: string; name: string }> {
  const states = await getStateCodes(line)
  const match = findBestMatch(states, stateName, (s) => s.StateName)
  const resolved = requireMatch(match, 'state', stateName)
  return { code: resolved.StateCode, name: resolved.StateName }
}

/** LGA names repeat across states, so the match is scoped to the resolved state code. */
export async function resolveLgaCode(line: TangerineLine, stateCode: string, lgaName: string): Promise<string> {
  const lgas = await getLGACodes(line)
  const inState = lgas.filter((l) => l.StateCode === stateCode)
  const match = findBestMatch(inState, lgaName, (l) => l.LGAName)
  return requireMatch(match, 'local government area', lgaName).LGACode
}

/**
 * Our platform stores vehicle/customer data as free text (make & model
 * together, colour name, a generic vehicle type, a plain title/gender), but
 * AIICO's `PostMotorSchedule` needs its own title/gender GUIDs and an exact
 * match against its own body-type, colour, and year-scoped make/model
 * lists. This resolves our text against AIICO's own master data by name —
 * same approach as the Tangerine integration's resolve.ts — so the UI never
 * has to know about AIICO's IDs or controlled vocabulary.
 */
import { AiicoError } from './client'
import { getBodyTypes, getColorList, getGenders, getTitles, getVehicleMakeModels, getVehicleMakes } from './api'
import type { AiicoLookup } from './types'

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function findBestMatch<T>(candidates: T[], query: string, nameOf: (item: T) => string): T | undefined {
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
    throw new AiicoError(`Could not match "${query}" to a known AIICO ${kind}. Please check the spelling and try again.`, 400)
  }
  return match
}

export async function resolveTitleId(titleName: string): Promise<string> {
  const titles = await getTitles()
  return requireMatch(findBestMatch(titles, titleName, (t: AiicoLookup) => t.name), 'title', titleName).id
}

export async function resolveGenderId(genderName: string): Promise<string> {
  const genders = await getGenders()
  return requireMatch(findBestMatch(genders, genderName, (g: AiicoLookup) => g.name), 'gender', genderName).id
}

const BODY_TYPE_KEYWORDS: Record<string, string> = {
  suv: 'jeep - suv', jeep: 'jeep - suv', bus: 'bus', van: 'bus', minibus: 'bus',
  truck: 'truck', pickup: 'truck', lorry: 'truck', car: 'car', sedan: 'car', saloon: 'car', hatchback: 'car',
}

/** AIICO's body types are a fixed 4-item enum; our "vehicle type" field is a broader freeform bucket. */
export async function resolveBodyType(vehicleType: string): Promise<string> {
  const bodyTypes = await getBodyTypes()
  const target = normalise(vehicleType)

  const exact = findBestMatch(bodyTypes, vehicleType, (b) => b)
  if (exact) return exact

  for (const [keyword, bodyTypeQuery] of Object.entries(BODY_TYPE_KEYWORDS)) {
    if (target.includes(keyword)) {
      const match = findBestMatch(bodyTypes, bodyTypeQuery, (b) => b)
      if (match) return match
    }
  }

  return requireMatch<string>(undefined, 'body type', vehicleType)
}

export async function resolveColor(colorName: string): Promise<string> {
  const colors = await getColorList()
  return requireMatch(findBestMatch(colors, colorName, (c) => c), 'colour', colorName)
}

/**
 * Splits our combined "make and model" text against AIICO's own make list
 * for the given manufacture year first (so multi-word makes aren't cut
 * short), then resolves the remainder against that make's models.
 */
export async function resolveVehicleMakeModel(
  makeModel: string,
  manufactureYear: string
): Promise<{ make: string; model: string }> {
  const makes = await getVehicleMakes(manufactureYear)
  const trimmed = makeModel.trim()
  const sortedMakes = [...makes].sort((a, b) => b.length - a.length)
  const make = sortedMakes.find((m) => normalise(trimmed).startsWith(normalise(m)))
  const resolvedMake = requireMatch(make, 'vehicle make', makeModel)

  const modelQuery = trimmed.slice(resolvedMake.length).trim() || trimmed
  const models = await getVehicleMakeModels(resolvedMake, manufactureYear)
  const model = findBestMatch(models, modelQuery, (m) => m) ?? models[0]
  const resolvedModel = requireMatch(model, 'vehicle model', modelQuery)

  return { make: resolvedMake, model: resolvedModel }
}

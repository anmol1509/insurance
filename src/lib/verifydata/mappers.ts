/**
 * Maps a VerifyData vehicle record onto this platform's own vehicle fields.
 * Client-safe: no credentials, no environment access.
 */
import { ENGINE_CAPACITIES, VEHICLE_COLOURS, VEHICLE_TYPES } from '@/lib/constants'
import type { VerifyVehicleResponse } from './types'

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '')
}

/** Best-effort match against our own fixed option lists; falls back to "Other". */
function matchOption(value: string, options: string[]): string {
  const target = normalise(value)
  if (!target) return 'Other'
  const exact = options.find((o) => normalise(o) === target)
  if (exact) return exact
  const partial = options.find((o) => normalise(o).includes(target) || target.includes(normalise(o)))
  return partial ?? 'Other'
}

/**
 * VerifyData returns engine capacity as free text (e.g. "2000cc" or "2.0L");
 * this pulls out the first number, normalises it to cc, and buckets it into
 * one of our own ranges the same way the rest of the motor flow expects.
 */
function bucketEngineCapacity(raw: string): string {
  const match = raw.match(/[\d.]+/)
  if (!match) return ''
  let cc = Number(match[0])
  // A bare "2.0" is litres, not cc.
  if (cc < 20) cc *= 1000

  if (cc < 1000) return ENGINE_CAPACITIES[0]
  if (cc < 1500) return ENGINE_CAPACITIES[1]
  if (cc < 2000) return ENGINE_CAPACITIES[2]
  if (cc < 2500) return ENGINE_CAPACITIES[3]
  if (cc < 3000) return ENGINE_CAPACITIES[4]
  if (cc < 3500) return ENGINE_CAPACITIES[5]
  return ENGINE_CAPACITIES[6]
}

export interface VerifiedVehicleFields {
  vehicleMakeModel: string
  yearOfManufacture: number | null
  vehicleType: string
  engineCapacity: string
  vehicleColour: string
  chassisVIN: string
}

export function toMotorFields(vehicle: VerifyVehicleResponse): VerifiedVehicleFields {
  const makeModel = [vehicle.vehicleMake, vehicle.vehicleModel]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')

  return {
    vehicleMakeModel: makeModel,
    yearOfManufacture: vehicle.yearOfManufacture || null,
    vehicleType: matchOption(vehicle.vehicleCategory ?? '', VEHICLE_TYPES),
    engineCapacity: bucketEngineCapacity(vehicle.vehicleEngineCapacity ?? ''),
    vehicleColour: matchOption(vehicle.vehicleColor ?? '', VEHICLE_COLOURS),
    chassisVIN: vehicle.vehicleChasisNo ?? '',
  }
}

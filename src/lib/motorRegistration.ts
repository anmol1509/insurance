/**
 * A brand-new car has no plate yet, but every insurer's submission requires a
 * registration number. A new car is therefore identified to the insurer by a
 * placeholder built from its chassis number — unique per car, so insurers
 * that refuse a second policy on the same registration never collide.
 */
import type { MotorData } from '@/store/quoteStore'

/** Hero-widget hand-off value meaning "start the motor quote as a new car". */
export const NEW_CAR_PREFILL = '__new_car__'

const PLACEHOLDER_PREFIX = 'NEW'
/** Tangerine rejects a registration number over 10 characters, so prefix (3) + chassis tail (7). */
const CHASSIS_TAIL_LENGTH = 7

export function newCarPlaceholder(chassisVIN: string): string {
  const tail = chassisVIN.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-CHASSIS_TAIL_LENGTH)
  return `${PLACEHOLDER_PREFIX}${tail}`
}

/** The registration number to send to an insurer: the real plate, or the new-car placeholder. */
export function registrationForInsurer(
  motorData: Pick<MotorData, 'registrationNumber' | 'isNewCar' | 'chassisVIN'>
): string {
  const plate = motorData.registrationNumber.trim().toUpperCase()
  if (plate) return plate
  return motorData.isNewCar ? newCarPlaceholder(motorData.chassisVIN) : ''
}

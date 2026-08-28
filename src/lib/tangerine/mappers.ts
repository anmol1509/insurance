/** Formatting helpers for the fields Tangerine's generate-policy endpoints expect. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Tangerine dates are formatted like "01-Jan-2001". */
export function toTangerineDate(value: string | undefined): string {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return toTangerineDate(undefined)
  const day = String(date.getDate()).padStart(2, '0')
  return `${day}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`
}

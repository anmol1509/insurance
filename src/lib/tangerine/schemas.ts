/** Zod schemas for the JSON payload our /api/tangerine/submit/{product} route accepts. */
import { z } from 'zod'

export const tangerineCustomerSchema = z.object({
  fullName: z.string().min(1, 'Full name required'),
  phone: z.string().min(7, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  address: z.string().min(1, 'Address required'),
  userType: z.enum(['personal', 'corporate']).default('personal'),
  tin: z.string().default(''),
  nin: z.string().default(''),
  bvn: z.string().default(''),
})

export const tangerineMotorSchema = z.object({
  vehicleMakeModel: z.string().min(1, 'Vehicle make and model required'),
  colour: z.string().min(1, 'Vehicle colour required'),
  state: z.string().min(1, 'State required'),
  lga: z.string().min(1, 'Local government area required'),
  chassisNumber: z.string().min(1, 'Chassis number required'),
  registrationNumber: z.string().min(1, 'Registration number required'),
  yearOfMake: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  /** Our own cc bucket label (e.g. "1500–1999cc") — resolved to Tangerine's litre-based code server-side. */
  engineCapacity: z.string().min(1, 'Engine capacity required'),
  /** Comprehensive only. */
  valuation: z.number().positive().optional(),
  mileageKm: z.number().nonnegative().optional(),
  vehicleRegistrationDate: z.string().optional(),
  /** 3rd party only — private motor, commercial, or tricycle. */
  usageType: z.enum(['private', 'commercial', 'tricycle']).optional(),
})

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}

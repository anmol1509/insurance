/** Zod schema for the /api/fortis/submit request body. */
import { z } from 'zod'

export const fortisSubmitSchema = z.object({
  motorData: z.object({
    coverType: z.enum(['comprehensive', 'tpo']).nullable().optional(),
    residentialAddress: z.string().optional(),
    residentialState: z.string().optional(),
    registrationNumber: z.string().optional(),
    vehicleMakeModel: z.string().optional(),
    vehicleColour: z.string().optional(),
    yearOfManufacture: z.number().nullable().optional(),
    engineCapacity: z.string().optional(),
    chassisVIN: z.string().optional(),
    carValue: z.number().nullable().optional(),
  }),
  policyHolder: z.object({
    fullName: z.string().min(1, 'Full name required'),
    email: z.string().email('Valid email required'),
    phone: z.string().min(7, 'Valid phone number required'),
  }),
})

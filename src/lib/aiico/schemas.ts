/** Zod schemas for the JSON payloads our /api/aiico/* routes accept. */
import { z } from 'zod'

export const aiicoCustomerSchema = z.object({
  titleId: z.string().min(1, 'Title required'),
  genderId: z.string().optional(),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone number required'),
  address: z.string().min(1, 'Address required'),
  nin: z.string().min(11, 'A valid NIN is required'),
})

export const aiicoVehicleSchema = z.object({
  bodyType: z.string().min(1, 'Body type required'),
  regNo: z.string().min(1, 'Registration number required'),
  yearOfManufacture: z.string().min(4, 'Manufacture year required'),
  make: z.string().min(1, 'Vehicle make required'),
  model: z.string().min(1, 'Vehicle model required'),
  chassisNo: z.string().min(1, 'Chassis number required'),
  color: z.string().min(1, 'Colour required'),
  engineNo: z.string().min(1, 'Engine number required'),
  /** Comprehensive only — the sum insured / vehicle value. */
  vehicleAmount: z.number().positive().optional(),
})

export const aiicoImagesSchema = z.object({
  vehicleLicenseUrl: z.string().min(1, 'Vehicle license image required'),
  identificationUrl: z.string().min(1, 'Identification image required'),
  proofOfOwnershipUrl: z.string().optional(),
  utilityBillUrl: z.string().optional(),
})

export const aiicoMotorSubmitSchema = z.object({
  line: z.enum(['third-party', 'comprehensive']),
  wefDt: z.string().min(1, 'Start date required'),
  wetDt: z.string().min(1, 'End date required'),
  customer: aiicoCustomerSchema,
  vehicle: aiicoVehicleSchema,
  images: aiicoImagesSchema,
  payment: z.object({
    accountNumber: z.string().min(1),
    amountPaid: z.number().positive(),
    paymentRef: z.string().min(1),
    partnerReference: z.string().min(1),
  }),
})

export const aiicoRenewalSubmitSchema = z.object({
  oldPolicyNumber: z.string().min(1, 'Existing policy number required'),
  regNo: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  bodyType: z.string().min(1),
  premiumAmount: z.number().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  pryEmail: z.string().email(),
  smsTel: z.string().min(7),
  wefDt: z.string().min(1),
  wetDt: z.string().min(1),
  payment: z.object({
    accountNumber: z.string().min(1),
    amountPaid: z.number().positive(),
    paymentRef: z.string().min(1),
    partnerReference: z.string().min(1),
  }),
})

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}

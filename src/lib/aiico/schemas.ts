/** Zod schemas for the JSON payloads our /api/aiico/* routes accept. Vehicle/customer fields are plain text — resolve.ts matches them against AIICO's controlled vocabulary. */
import { z } from 'zod'

export const aiicoCustomerSchema = z.object({
  title: z.string().min(1, 'Title required'),
  gender: z.string().optional(),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone number required'),
  address: z.string().min(1, 'Address required'),
  nin: z.string().min(11, 'A valid NIN is required'),
})

export const aiicoVehicleSchema = z.object({
  vehicleType: z.string().min(1, 'Vehicle body type required'),
  regNo: z.string().min(1, 'Registration number required'),
  yearOfManufacture: z.string().min(4, 'Manufacture year required'),
  vehicleMakeModel: z.string().min(1, 'Vehicle make and model required'),
  chassisNo: z.string().min(1, 'Chassis number required'),
  color: z.string().min(1, 'Colour required'),
  engineNo: z.string().min(1, 'Engine number required'),
  /** Comprehensive only — the sum insured / vehicle value. */
  vehicleAmount: z.number().positive().optional(),
})

export const aiicoPaymentSchema = z.object({
  accountNumber: z.string().min(1),
  amountPaid: z.number().positive(),
  paymentRef: z.string().min(1),
  partnerReference: z.string().min(1),
})

export const aiicoMotorSubmitSchema = z.object({
  line: z.enum(['third-party', 'comprehensive']),
  wefDt: z.string().min(1, 'Start date required'),
  wetDt: z.string().min(1, 'End date required'),
  customer: aiicoCustomerSchema,
  vehicle: aiicoVehicleSchema,
  payment: aiicoPaymentSchema,
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
  payment: aiicoPaymentSchema,
})

export const aiicoLifeRenewalSubmitSchema = z.object({
  policyNo: z.string().min(1, 'Policy number required'),
  transactionDate: z.string().min(1, 'Transaction date required'),
  customerName: z.string().min(1, 'Customer name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone number required'),
  amount: z.number().positive(),
  payment: aiicoPaymentSchema,
})

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}

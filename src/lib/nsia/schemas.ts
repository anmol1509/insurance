/**
 * Zod schemas for the JSON payload our own /api/nsia/* routes accept.
 * Validating here keeps malformed submissions from ever reaching NSIA.
 */
import { z } from 'zod'
import { NSIA_DROPDOWNS, NSIA_PRODUCTS } from './types'

const money = z.number().nonnegative()
const isoDate = z.string().min(4, 'Date required')

/** Applicant identity, shared by every product submission. */
export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone number required'),
  address: z.string().min(1, 'Address required'),
  state: z.string().default('Lagos'),
  country: z.string().default('Nigeria'),
  gender: z.string().default(''),
  dateOfBirth: z.string().default(''),
  occupation: z.string().default(''),
  nationalId: z.string().default(''),
  meansOfId: z.string().default('National ID'),
  meansOfIdNumber: z.string().default(''),
  userType: z.enum(['personal', 'corporate']).default('personal'),
  companyName: z.string().default(''),
  rcNumber: z.string().default(''),
})

export type CustomerInput = z.infer<typeof customerSchema>

export const motorSchema = z.object({
  coverType: z.enum(['COMPREHENSIVE', 'THIRDPARTY']),
  sumInsured: money,
  premium: money,
  vehicleMake: z.string().min(1, 'Vehicle make required'),
  vehicleModel: z.string().min(1, 'Vehicle model required'),
  vehicleType: z.string().default(''),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().default(''),
  chassisNo: z.string().min(1, 'Chassis number required'),
  engineNo: z.string().default(''),
  registrationNo: z.string().min(1, 'Registration number required'),
  natureOfUse: z.string().default('Private'),
  tracking: money.optional(),
  nameOfAgent: z.string().default(''),
  inspectionVenue: z.string().default(''),
  inspectorName: z.string().default(''),
  inspectorPhoneNumber: z.string().default(''),
})

export const marineSchema = z.object({
  sumInsured: money,
  premium: money,
  coverType: z.string().min(1, 'Cover type required'),
  cargoCategory: z.string().min(1, 'Cargo category required'),
  cargoDescription: z.string().default(''),
  vesselName: z.string().default(''),
  voyageFrom: z.string().default(''),
  voyageTo: z.string().default(''),
  invoiceNumber: z.string().default(''),
  invoiceValue: money.default(0),
  currency: z.string().default('NGN'),
  packingType: z.string().default(''),
  numberOfPackages: z.number().int().nonnegative().default(0),
})

export const personalAccidentSchema = z.object({
  sumInsured: money,
  premium: money,
  dateOfBirth: isoDate,
  gender: z.string().min(1, 'Gender required'),
  occupation: z.string().min(1, 'Occupation required'),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  beneficiaryName: z.string().min(1, 'Beneficiary name required'),
  beneficiaryRelationship: z.string().min(1, 'Beneficiary relationship required'),
  beneficiaryPhone: z.string().default(''),
  beneficiaryEmail: z.string().default(''),
  hasPreExistingCondition: z.boolean().default(false),
  preExistingConditionDetails: z.string().default(''),
})

export const publicLiabilitySchema = z.object({
  sumInsured: money,
  premium: money,
  businessName: z.string().min(1, 'Business name required'),
  rcNumber: z.string().default(''),
  businessType: z.string().min(1, 'Business type required'),
  yearsInBusiness: z.number().int().nonnegative().default(0),
  numberOfEmployees: z.number().int().nonnegative().default(0),
  annualTurnover: money.default(0),
  claimsHistory: z.string().default('None'),
})

export const professionalIndemnitySchema = z.object({
  sumInsured: money,
  premium: money,
  profession: z.string().min(1, 'Profession required'),
  professionalQualification: z.string().default(''),
  yearsOfPractice: z.number().int().nonnegative().default(0),
  practiceArea: z.string().default(''),
  firmName: z.string().default(''),
  registrationNumber: z.string().default(''),
  regulatoryBody: z.string().default(''),
  annualFees: money.default(0),
  claimsHistory: z.string().default('None'),
})

/** One schema per product, keyed the way the submit route is addressed. */
export const productSchemas = {
  motor: motorSchema,
  marine: marineSchema,
  'personal-accident': personalAccidentSchema,
  'public-liability': publicLiabilitySchema,
  'professional-indemnity': professionalIndemnitySchema,
} as const

export const submissionSchema = z.object({
  customer: customerSchema,
  details: z.unknown(),
})

export const productParamSchema = z.enum(
  NSIA_PRODUCTS as [string, ...string[]]
)

export const dropdownParamSchema = z.enum(
  NSIA_DROPDOWNS as [string, ...string[]]
)

export const profileRequestSchema = customerSchema

export const marinePricingSchema = z.object({
  category: z.string().min(1, 'Category required'),
  sumInsured: money,
  coverType: z.string().min(1, 'Cover type required'),
  currency: z.string().default('NGN'),
})

/** Flattens a Zod failure into `{ field: message }` for the API response. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}

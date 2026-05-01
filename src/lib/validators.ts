import { z } from 'zod'

export const ninSchema = z.string()
  .regex(/^\d{11}$/, 'NIN must be exactly 11 digits')

export const nigerianPhone = z.string()
  .regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number')

export const emailSchema = z.string().email('Enter a valid email address')

export const dobAdult = z.string().refine((dob) => {
  if (!dob) return false
  const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return age >= 18
}, 'Must be at least 18 years old')

export const clientInfoSchema = z.object({
  fullName:           z.string().min(2, 'Full name required'),
  dateOfBirth:        dobAdult,
  nin:                ninSchema,
  phone:              nigerianPhone,
  email:              emailSchema,
  gender:             z.string().min(1, 'Select gender'),
  maritalStatus:      z.string().min(1, 'Select marital status'),
  residentialAddress: z.string().min(10, 'Enter full address'),
  residentialState:   z.string().min(1, 'Select state'),
  occupation:         z.string().min(2, 'Enter occupation'),
  idType:             z.string().min(1, 'Select ID type'),
  idNumber:           z.string().min(5, 'Enter ID number'),
})

export const motorStep1Schema = z.object({
  vehicleMakeModel:   z.string().min(2, 'Enter vehicle make and model'),
  yearOfManufacture:  z.number({ error: 'Select year' }).min(1990).max(new Date().getFullYear()),
  vehicleType:        z.string().min(1, 'Select vehicle type'),
  engineCapacity:     z.string().min(1, 'Select engine capacity'),
  vehicleColour:      z.string().min(1, 'Select vehicle colour'),
  registrationNumber: z.string().min(2, 'Enter registration number'),
  chassisVIN:         z.string().min(5, 'Enter chassis/VIN number'),
  marketValueRange:   z.string().min(1, 'Select market value range'),
  useType:            z.enum(['private','commercial','own_goods','hired']).refine(Boolean, 'Select use type'),
  coverType:          z.enum(['comprehensive','tpo','tpft']).refine(Boolean, 'Select cover type'),
  usageCategory:      z.enum(['personal','business','commercial']).refine(Boolean, 'Select usage category'),
  geographicalState:  z.string().min(1, 'Select state'),
})

export const motorStep2Schema = z.object({
  driverAge:         z.number({ error: 'Enter driver age' }).min(18, 'Driver must be at least 18').max(70),
  drivingExperience: z.string().min(1, 'Select experience'),
  claimsHistory:     z.boolean(),
  claimsDetail:      z.string().optional(),
  securityFeatures:  z.array(z.string()).min(1, 'Select at least one option'),
  licenseNumber:     z.string().min(5, 'Enter license number'),
  licenseExpiry:     z.string().min(1, 'Select expiry date'),
}).refine(
  d => !d.claimsHistory || (d.claimsDetail && d.claimsDetail.length > 5),
  { message: 'Please describe your claims history', path: ['claimsDetail'] }
)

// Validate a single field value, returning error string or null
export function validateField(schema: z.ZodTypeAny, value: unknown): string | null {
  const result = schema.safeParse(value)
  return result.success ? null : result.error.issues[0]?.message ?? 'Invalid'
}

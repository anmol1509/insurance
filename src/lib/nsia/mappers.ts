/**
 * Translates our validated payloads into the exact field names NSIA expects
 * for each product (guide sections 5.2, 7.2, 8.3, 9.2, 10.2, 11.2).
 *
 * Field names are copied verbatim from the guide, including the `ProductTYpe`
 * casing on motor — NSIA spells it that way and will ignore `ProductType`.
 */
import type { z } from 'zod'
import type {
  marineSchema,
  motorSchema,
  personalAccidentSchema,
  professionalIndemnitySchema,
  publicLiabilitySchema,
  CustomerInput,
} from './schemas'
import { NSIA_USER_TYPE, type NsiaFieldMap, type NsiaProfilePayload } from './types'

type MotorInput = z.infer<typeof motorSchema>
type MarineInput = z.infer<typeof marineSchema>
type PersonalAccidentInput = z.infer<typeof personalAccidentSchema>
type PublicLiabilityInput = z.infer<typeof publicLiabilitySchema>
type ProfessionalIndemnityInput = z.infer<typeof professionalIndemnitySchema>

/** NSIA stores dates as ISO 8601 with a zero time component. */
export function toIsoDate(value: string): string {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return `${parsed.toISOString().split('T')[0]}T00:00:00.000Z`
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export function userTypeCode(customer: CustomerInput): number {
  return customer.userType === 'corporate' ? NSIA_USER_TYPE.corporate : NSIA_USER_TYPE.personal
}

/** Section 5.2 — the insured-client profile body. */
export function toProfilePayload(customer: CustomerInput): NsiaProfilePayload {
  return {
    surname: customer.lastName,
    firstname: customer.firstName,
    address: customer.address,
    fullName: `${customer.lastName} ${customer.firstName}`.trim(),
    state: customer.state,
    landphone: '',
    mobilePhone: customer.phone,
    email: customer.email,
    nationalId: customer.nationalId || customer.meansOfIdNumber,
    occupation: customer.occupation,
    sex: customer.gender,
    country: customer.country,
    dateofBirth: toIsoDate(customer.dateOfBirth),
    meansOfId: customer.meansOfId,
    meansOfIdNumber: customer.meansOfIdNumber || customer.nationalId,
  }
}

/** Identity fields every product submission repeats. */
function baseFields(customer: CustomerInput, insuredClientId: number): NsiaFieldMap {
  return {
    FirstName: customer.firstName,
    LastName: customer.lastName,
    Email: customer.email,
    PhoneNumber: customer.phone,
    Address: customer.address,
    InsuredClientId: insuredClientId,
  }
}

/** Section 7.2 — motor insurance. */
export function toMotorFields(
  customer: CustomerInput,
  motor: MotorInput,
  insuredClientId: number
): NsiaFieldMap {
  return {
    ...baseFields(customer, insuredClientId),
    UserType: userTypeCode(customer),
    Gender: customer.gender,
    RCNumber: customer.userType === 'corporate' ? customer.rcNumber : '',
    ProductTYpe: 'MOTOR INSURANCE',
    SumInsured: motor.sumInsured,
    IsMobile: true,
    MeansOfIdentification: customer.meansOfId,
    ChassisNo: motor.chassisNo,
    NameOfAgent: motor.nameOfAgent,
    EngineNo: motor.engineNo,
    VehicleRegistrationNo: motor.registrationNo,
    // "NA" for every mobile/partner submission, per the guide.
    BusinessClass: 'NA',
    BusinessType: 'NA',
    VehicleType: motor.vehicleType,
    VehicleMake: motor.vehicleMake,
    Color: motor.color,
    Year: motor.year,
    VehicleModel: motor.vehicleModel,
    NatureOfUse: motor.natureOfUse,
    CoverType: motor.coverType,
    Tracking: motor.tracking ?? 0,
    Premium: motor.premium,
    InspectionVenue: motor.inspectionVenue,
    InspectorName: motor.inspectorName,
    InspectorPhoneNumber: motor.inspectorPhoneNumber,
  }
}

/** Section 8.3 — marine cargo. */
export function toMarineFields(
  customer: CustomerInput,
  marine: MarineInput,
  insuredClientId: number
): NsiaFieldMap {
  return {
    ...baseFields(customer, insuredClientId),
    ProductType: 'Marine Cargo',
    SumInsured: marine.sumInsured,
    Premium: marine.premium,
    CoverType: marine.coverType,
    CargoCategory: marine.cargoCategory,
    CargoDescription: marine.cargoDescription,
    VesselName: marine.vesselName,
    VoyageFrom: marine.voyageFrom,
    VoyageTo: marine.voyageTo,
    InvoiceNumber: marine.invoiceNumber,
    InvoiceValue: marine.invoiceValue,
    Currency: marine.currency,
    PackingType: marine.packingType,
    NumberOfPackages: marine.numberOfPackages,
  }
}

/** Section 9.2 — personal accident. */
export function toPersonalAccidentFields(
  customer: CustomerInput,
  cover: PersonalAccidentInput,
  insuredClientId: number
): NsiaFieldMap {
  return {
    ...baseFields(customer, insuredClientId),
    ProductType: 'Personal Accident',
    DateOfBirth: toIsoDate(cover.dateOfBirth),
    Gender: cover.gender,
    Occupation: cover.occupation,
    Height: cover.height,
    Weight: cover.weight,
    SumInsured: cover.sumInsured,
    Premium: cover.premium,
    BeneficiaryName: cover.beneficiaryName,
    BeneficiaryRelationship: cover.beneficiaryRelationship,
    BeneficiaryPhone: cover.beneficiaryPhone,
    BeneficiaryEmail: cover.beneficiaryEmail,
    HasPreExistingCondition: cover.hasPreExistingCondition,
    PreExistingConditionDetails: cover.preExistingConditionDetails,
  }
}

/** Section 10.2 — public liability. */
export function toPublicLiabilityFields(
  customer: CustomerInput,
  cover: PublicLiabilityInput,
  insuredClientId: number
): NsiaFieldMap {
  return {
    ...baseFields(customer, insuredClientId),
    ProductType: 'Public Liability',
    UserType: userTypeCode(customer),
    BusinessName: cover.businessName,
    RCNumber: cover.rcNumber || customer.rcNumber,
    BusinessType: cover.businessType,
    YearsInBusiness: cover.yearsInBusiness,
    NumberOfEmployees: cover.numberOfEmployees,
    AnnualTurnover: cover.annualTurnover,
    SumInsured: cover.sumInsured,
    Premium: cover.premium,
    ClaimsHistory: cover.claimsHistory,
  }
}

/** Section 11.2 — professional indemnity. */
export function toProfessionalIndemnityFields(
  customer: CustomerInput,
  cover: ProfessionalIndemnityInput,
  insuredClientId: number
): NsiaFieldMap {
  return {
    ...baseFields(customer, insuredClientId),
    ProductType: 'Professional Indemnity',
    UserType: userTypeCode(customer),
    Profession: cover.profession,
    ProfessionalQualification: cover.professionalQualification,
    YearsOfPractice: cover.yearsOfPractice,
    PracticeArea: cover.practiceArea,
    FirmName: cover.firmName,
    RegistrationNumber: cover.registrationNumber,
    RegulatoryBody: cover.regulatoryBody,
    AnnualFees: cover.annualFees,
    SumInsured: cover.sumInsured,
    Premium: cover.premium,
    ClaimsHistory: cover.claimsHistory,
  }
}

/** Builds AIICO API payloads from the validated shapes in schemas.ts. */
import { AIICO_PRODUCT_IDS, AIICO_SUBCLASS_COVER_IDS } from './config'
import type {
  AiicoFinalizePaymentRequest,
  AiicoMotorScheduleRequest,
  AiicoRenewalScheduleRequest,
} from './types'
import type { aiicoCustomerSchema, aiicoImagesSchema, aiicoVehicleSchema } from './schemas'
import type { z } from 'zod'

type Customer = z.infer<typeof aiicoCustomerSchema>
type Vehicle = z.infer<typeof aiicoVehicleSchema>
type Images = z.infer<typeof aiicoImagesSchema>

export function toThirdPartySchedule(
  customer: Customer,
  vehicle: Vehicle,
  images: Images,
  dates: { wefDt: string; wetDt: string },
  premiumAmount: number
): AiicoMotorScheduleRequest {
  return {
    productId: AIICO_PRODUCT_IDS.motorThirdParty,
    subclassSectCovtypeId: AIICO_SUBCLASS_COVER_IDS.motorThirdParty,
    titleId: customer.titleId,
    genderId: customer.genderId,
    firstName: customer.firstName,
    lastName: customer.lastName,
    dateOfBirth: customer.dateOfBirth,
    pryEmail: customer.email,
    smsTel: customer.phone,
    physicalAddrs: customer.address,
    nin: customer.nin,
    bodyType: vehicle.bodyType,
    regNo: vehicle.regNo,
    yrManft: vehicle.yearOfManufacture,
    make: vehicle.make,
    model: vehicle.model,
    chasisNo: vehicle.chassisNo,
    color: vehicle.color,
    engineNo: vehicle.engineNo,
    wefDt: dates.wefDt,
    wetDt: dates.wetDt,
    premiumAmount,
    vehicleLicenseUrl: images.vehicleLicenseUrl,
    identificationUrl: images.identificationUrl,
    proofOfOwnershipUrl: images.proofOfOwnershipUrl,
    utilityBillUrl: images.utilityBillUrl,
  }
}

export function toComprehensiveSchedule(
  customer: Customer,
  vehicle: Vehicle,
  images: Images,
  dates: { wefDt: string; wetDt: string }
): AiicoMotorScheduleRequest {
  return {
    productId: AIICO_PRODUCT_IDS.motorComprehensive,
    subclassSectCovtypeId: AIICO_SUBCLASS_COVER_IDS.motorComprehensiveAutoRoyale,
    titleId: customer.titleId,
    genderId: customer.genderId,
    firstName: customer.firstName,
    lastName: customer.lastName,
    dateOfBirth: customer.dateOfBirth,
    pryEmail: customer.email,
    smsTel: customer.phone,
    physicalAddrs: customer.address,
    nin: customer.nin,
    bodyType: vehicle.bodyType,
    regNo: vehicle.regNo,
    yrManft: vehicle.yearOfManufacture,
    make: vehicle.make,
    model: vehicle.model,
    chasisNo: vehicle.chassisNo,
    color: vehicle.color,
    engineNo: vehicle.engineNo,
    wefDt: dates.wefDt,
    wetDt: dates.wetDt,
    vehicleAmount: vehicle.vehicleAmount,
    vehicleLicenseUrl: images.vehicleLicenseUrl,
    identificationUrl: images.identificationUrl,
    proofOfOwnershipUrl: images.proofOfOwnershipUrl,
    utilityBillUrl: images.utilityBillUrl,
  }
}

export function toFinalizePayment(
  transactionRef: string,
  payment: { accountNumber: string; amountPaid: number; paymentRef: string; partnerReference: string }
): AiicoFinalizePaymentRequest {
  return {
    transactionRef,
    accountNumber: payment.accountNumber,
    amountPaid: payment.amountPaid,
    paymentRef: payment.paymentRef,
    partnerReference: payment.partnerReference,
  }
}

export function toRenewalSchedule(input: {
  oldPolicyNumber: string
  regNo: string
  make: string
  model: string
  bodyType: string
  premiumAmount: number
  firstName: string
  lastName: string
  pryEmail: string
  smsTel: string
  wefDt: string
  wetDt: string
}): AiicoRenewalScheduleRequest {
  return { ...input }
}

/** `MM/DD/YYYY` — the shape used in the Renewal sample payload, distinct from the ISO datetime the New Business endpoints take. */
export function toAiicoRenewalDate(isoDate: string): string {
  const d = new Date(isoDate)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`
}

/** Reads an uploaded File into the `data:<mime>;base64,...` string AIICO's image fields accept directly. */
export async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  return `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`
}

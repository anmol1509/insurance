/** Typed wrappers for every AIICO Motor endpoint documented so far (Third Party, Comprehensive, Renewal). */
import { aiicoRequest } from './client'
import { aiicoDemoMode } from './config'
import type {
  AiicoFinalizePaymentRequest,
  AiicoFinalizePaymentResult,
  AiicoLookup,
  AiicoMotorScheduleRequest,
  AiicoMotorScheduleResult,
  AiicoProduct,
  AiicoRenewalDetails,
  AiicoRenewalScheduleRequest,
  AiicoSubClassCoverEntry,
  AiicoVehicleDetails,
} from './types'

export function getProducts(): Promise<AiicoProduct[]> {
  return aiicoRequest<AiicoProduct[]>('/api/services/app/ProductService/GetProducts')
}

export function getProductSubClassCoverTypes(productId: string): Promise<AiicoSubClassCoverEntry[]> {
  return aiicoRequest<AiicoSubClassCoverEntry[]>('/api/services/app/ProductService/GetProductSubClassCoverTypes', {
    query: { productId },
  })
}

/** The five Travel variants (Africa, Gold, Premium, Schengen, Schengen Plus) with their benefits. */
export function getTravelSubClassCoverTypes(): Promise<AiicoSubClassCoverEntry[]> {
  return aiicoRequest<AiicoSubClassCoverEntry[]>('/api/services/app/ProductService/GetTravelSubClassCoverTypes')
}

export function getTitles(): Promise<AiicoLookup[]> {
  return aiicoRequest<AiicoLookup[]>('/api/services/app/UtilitiyService/GetTitles')
}

export function getGenders(): Promise<AiicoLookup[]> {
  return aiicoRequest<AiicoLookup[]>('/api/services/app/UtilitiyService/GetGenders')
}

export function getBodyTypes(): Promise<string[]> {
  return aiicoRequest<string[]>('/api/services/app/UtilitiyService/GetBodyTypes')
}

export function getVehicleDetails(numberPlate: string): Promise<AiicoVehicleDetails> {
  return aiicoRequest<AiicoVehicleDetails>('/api/services/app/MotorProductService/GetVehicleDetails', {
    query: { numberPlate },
  })
}

export function getColorList(): Promise<string[]> {
  return aiicoRequest<string[]>('/api/services/app/UtilitiyService/GetColorList')
}

export function getManufactureYears(): Promise<string[]> {
  return aiicoRequest<string[]>('/api/services/app/UtilityService/GetManufactureYear')
}

export function getVehicleMakes(makeYear: string): Promise<string[]> {
  return aiicoRequest<string[]>('/api/services/app/UtilityService/GetVehicleMake', { query: { makeYear } })
}

export function getVehicleMakeModels(vehicleMake: string, vehicleYear: string): Promise<string[]> {
  return aiicoRequest<string[]>('/api/services/app/UtilityService/GetVehicleMakeModel', {
    query: { VehicleMake: vehicleMake, VehicleYear: vehicleYear },
  })
}

/** Third Party only — fixed-rate lookup by body type. */
export function computeThirdPartyMotorPremium(bodyType: string): Promise<number> {
  return aiicoRequest<number>('/api/services/app/MotorProductService/ComputeThirdPartyMotorPremium', {
    method: 'POST',
    query: { bodyType },
  })
}

/** Shared by both Third Party and Comprehensive — the payload shape differs per line, see mappers.ts. */
export async function postMotorSchedule(payload: AiicoMotorScheduleRequest): Promise<AiicoMotorScheduleResult> {
  if (aiicoDemoMode()) {
    return {
      regNo: payload.regNo,
      make: payload.make,
      model: payload.model,
      bodyType: payload.bodyType,
      engineNo: payload.engineNo,
      chasisNo: payload.chasisNo,
      color: payload.color,
      transactionRef: `DEMO-TXN-${Date.now().toString().slice(-8)}`,
      premiumAmount: 20_000,
      vehicleAmount: payload.vehicleAmount ?? 0,
      productId: payload.productId,
      subclassSectCovtypeId: payload.subclassSectCovtypeId,
      wefDt: payload.wefDt,
      wetDt: payload.wetDt,
      grossPremium: 20_000,
      commission: 0,
      isQuote: false,
    }
  }
  return aiicoRequest<AiicoMotorScheduleResult>('/api/services/app/MotorProductService/PostMotorSchedule', {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })
}

/** Shared across Third Party, Comprehensive, and Renewal — call after the customer has actually paid. */
export async function finalizePartnerPayment(payload: AiicoFinalizePaymentRequest): Promise<AiicoFinalizePaymentResult> {
  if (aiicoDemoMode()) {
    const ref = Date.now().toString().slice(-8)
    return {
      fullName: '',
      agentName: null,
      policies: [`DEMO-AIICO-${ref}`],
      clientEmail: '',
      clientPhoneNumber: '',
      wef: '',
      wet: '',
      totalAmount: String(payload.amountPaid),
      printPolicyUrl: null,
      printReceiptUrl: null,
      hash: `DEMO-${ref}`,
      responseMessage: 'Demo mode: this policy was simulated and was never submitted to AIICO.',
      responseCode: null,
      polledToTQ: false,
      isLoan: false,
    }
  }
  return aiicoRequest<AiicoFinalizePaymentResult>('/api/services/app/PartnerService/FinalizePartnerPayment', {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })
}

export function getAutoRenewalDetails(policyNo: string): Promise<AiicoRenewalDetails> {
  return aiicoRequest<AiicoRenewalDetails>('/api/services/app/MotorProductService/GetAutoRenewalDetails', {
    query: { policyNo },
  })
}

export function postMotorRenewalSchedule(payload: AiicoRenewalScheduleRequest): Promise<AiicoMotorScheduleResult> {
  return aiicoRequest<AiicoMotorScheduleResult>('/api/services/app/MotorProductService/PostMotorRenewalSchedule', {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })
}

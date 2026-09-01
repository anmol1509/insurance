/** Types for the AIICO Insurance API (Motor: Third Party, Comprehensive, Renewal). */

/** Every AIICO response is wrapped in this ABP-framework envelope. */
export interface AiicoEnvelope<T> {
  result: T | null
  targetUrl: string | null
  success: boolean
  error: {
    code: number
    message: string
    details?: string | null
    validationErrors?: { message: string; members: string[] }[] | null
  } | null
  unAuthorizedRequest: boolean
  __abp: boolean
}

export interface AiicoProduct {
  id: string
  prefix: string
  name: string
  reqUW: boolean
  renewable: boolean
  wef: string
  wet: string | null
  description: string
  productCategory: string
  isThirdParty: boolean
  isActive: boolean
}

export interface AiicoSubClassCoverBenefit {
  name: string
  description: string
}

export interface AiicoSubClassCoverEntry {
  subClassCoverTypes: {
    productId: string
    id: string
    productName: string
    subClassName: string
    coverTypeName: string
    description: string | null
    benefit: string | null
    rate: number
    fixed: boolean
    sectionType: string
  }
  benefits: AiicoSubClassCoverBenefit[]
}

export interface AiicoLookup {
  id: string
  name: string
}

export interface AiicoVehicleDetails {
  licenseInfo: {
    color: string
    model: string
    registrationNo: string
    chasisNo: string
    engineNo: string
    vehicleMakeName: string
    vehicleStatus: string
    isssueDate: string
    expiryDate: string
    year: string
  }
  response: {
    responseCode: string
    responseMessage: string
  }
}

/**
 * Fields common to both Third Party and Comprehensive `PostMotorSchedule`.
 * The docs show slightly different required-field lists per line — third
 * party expects an explicit `premiumAmount`, comprehensive computes it
 * server-side from `vehicleAmount` — so both are optional here and the
 * mapper for each line fills in what it needs.
 */
export interface AiicoMotorScheduleRequest {
  productId: string
  subclassSectCovtypeId: string
  titleId: string
  genderId?: string
  firstName: string
  lastName: string
  dateOfBirth: string
  pryEmail: string
  smsTel: string
  physicalAddrs: string
  nin: string
  bodyType: string
  regNo: string
  yrManft: string
  make: string
  model: string
  chasisNo: string
  color: string
  engineNo: string
  wefDt: string
  wetDt: string
  premiumAmount?: number
  vehicleAmount?: number
  vehicleLicenseUrl: string
  identificationUrl: string
  proofOfOwnershipUrl?: string
  utilityBillUrl?: string
}

export interface AiicoMotorScheduleResult {
  regNo: string
  make: string
  model: string
  bodyType: string
  engineNo: string
  chasisNo: string
  color: string
  transactionRef: string
  premiumAmount: number
  vehicleAmount: number
  productId: string
  subclassSectCovtypeId: string
  wefDt: string
  wetDt: string
  grossPremium: number
  commission: number
  isQuote: boolean
  [key: string]: unknown
}

export interface AiicoFinalizePaymentRequest {
  paymentRef: string
  accountNumber: string
  amountPaid: number
  partnerReference: string
  transactionRef: string
}

export interface AiicoFinalizePaymentResult {
  fullName: string
  agentName: string | null
  policies: string[]
  clientEmail: string
  clientPhoneNumber: string
  wef: string
  wet: string
  totalAmount: string
  printPolicyUrl: string | null
  printReceiptUrl: string | null
  hash: string
  responseMessage: string | null
  responseCode: string | null
  polledToTQ: boolean
  isLoan: boolean
}

export interface AiicoRenewalDetails {
  isSuccessful: boolean
  policyNumber: string
  startDate: string
  endDate: string
  renewalDate: string
  customerName: string
  smsTel: string
  email: string
  premium: string
  productDescription: string
  registrationNumber: string
  vehicleName: string
  bodyType: string
  rate: string
  chasisNumber: string
  engineNumber: string
  color: string
  year: string
  amount: string
  coverType: string
}

export interface AiicoRenewalScheduleRequest {
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
  oldPolicyNumber: string
}

export interface AiicoLifePolicyRenewalDetails {
  isSuccessful: boolean
  productName: string
  policyStatus: string
  policyNumber: string
  policyCode: string
  dateOfBirth: string
  agentName: string
  agentShortDescription: string
  clientName: string
  clientShortDescription: string
  email: string
  phone: string
  effectiveDate: string
  paidToDate: string
  maturityDate: string
  totalPremium: string
  totalSavings: string
  paidPremium: string
  paymentFrequency: string
  nextInstallmentPremium: string
  hash: string | null
}

export interface AiicoLifeRenewalScheduleRequest {
  policyNo: string
  transactionDate: string
  customerName: string
  email: string
  phone: string
  amount: string
}

export interface AiicoLifeRenewalScheduleResult {
  policyNo: string
  transactionDate: string
  customerName: string
  email: string
  phone: string
  transactionRef: string
  amount: number
  policyStatus: string
  transactionType: string
  [key: string]: unknown
}

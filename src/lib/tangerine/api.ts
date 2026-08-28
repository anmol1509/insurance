/** Typed wrappers for the Tangerine Comprehensive and 3rd Party motor APIs. */
import { tangerineRequest } from './client'
import type {
  TangerineColour,
  TangerineEngineCapacity,
  TangerineLGA,
  TangerinePolicyResponse,
  TangerineComprehensivePolicyRequest,
  TangerineThirdPartyPolicyRequest,
  TangerineState,
  TangerineVehicleMake,
  TangerineVehicleModel,
} from './types'
import type { TangerineLine } from './config'

/** Endpoint filenames differ slightly (and confusingly) between the two product lines. */
const PATHS = {
  comprehensive: {
    colours: 'GetVehicleColours.aspx',
    engineCapacity: 'GetEngineCapacityCodes.aspx',
    states: 'GetStateCodes.aspx',
    lgas: 'GetLGACodes.aspx',
    makes: 'GetVehicleMakeCodes.aspx',
    models: 'GetVehicleModelCodes.aspx',
    confirmReg: 'ConfirmRegNumber.aspx',
    confirmPolicy: 'ConfirmPolicyNumber.aspx',
    valuationLimits: 'ReturnValuationLimits.aspx',
    generate: 'GenerateComprehensivePolicy.aspx',
  },
  thirdparty: {
    colours: 'ReturnVehicleColour.aspx',
    engineCapacity: 'ReturnEngineCapacity.aspx',
    states: 'ReturnStateCodes.aspx',
    lgas: 'ReturnLGACodes.aspx',
    makes: 'ReturnVehicleMakeCodes.aspx',
    models: 'ReturnVehicleModelCodes.aspx',
    confirmReg: 'ConfirmRegNo.aspx',
    confirmPolicy: 'ConfirmPolicy.aspx',
    generate: 'GeneratePolicy.aspx',
    generateTangAuto: 'GeneratePolicyTangAuto.aspx',
    renew: 'RenewPolicy.aspx',
  },
} as const

export async function getVehicleColours(line: TangerineLine): Promise<TangerineColour[]> {
  const data = await tangerineRequest<{ VehicleColourList: TangerineColour[] } & { Status: 'Successful' | 'Failed' }>(
    line, PATHS[line].colours, {}
  )
  return data.VehicleColourList ?? []
}

export async function getEngineCapacityCodes(line: TangerineLine): Promise<TangerineEngineCapacity[]> {
  const data = await tangerineRequest<{ EngineCapacityList: TangerineEngineCapacity[] } & { Status: 'Successful' | 'Failed' }>(
    line, PATHS[line].engineCapacity, {}
  )
  return data.EngineCapacityList ?? []
}

export async function getStateCodes(line: TangerineLine): Promise<TangerineState[]> {
  const data = await tangerineRequest<{ StateCodeList: TangerineState[] } & { Status: 'Successful' | 'Failed' }>(
    line, PATHS[line].states, {}
  )
  return data.StateCodeList ?? []
}

export async function getLGACodes(line: TangerineLine): Promise<TangerineLGA[]> {
  const data = await tangerineRequest<{ LGACodeList: TangerineLGA[] } & { Status: 'Successful' | 'Failed' }>(
    line, PATHS[line].lgas, {}
  )
  return data.LGACodeList ?? []
}

export async function getVehicleMakeCodes(line: TangerineLine): Promise<TangerineVehicleMake[]> {
  const data = await tangerineRequest<{ VehicleMakeList: TangerineVehicleMake[] } & { Status: 'Successful' | 'Failed' }>(
    line, PATHS[line].makes, {}
  )
  return data.VehicleMakeList ?? []
}

/**
 * The manual's own example mislabels this response's array as
 * `VehicleMakeList` even though its entries are models — kept here, not
 * "corrected", since that's the literal key the live API returns.
 */
export async function getVehicleModelCodes(line: TangerineLine): Promise<TangerineVehicleModel[]> {
  const data = await tangerineRequest<{ VehicleMakeList: TangerineVehicleModel[] } & { Status: 'Successful' | 'Failed' }>(
    line, PATHS[line].models, {}
  )
  return data.VehicleMakeList ?? []
}

export interface TangerineValuationLimits {
  lower: number
  upper: number
}

/** Comprehensive only — 3rd party cover has no vehicle valuation. */
export async function getValuationLimits(): Promise<TangerineValuationLimits> {
  const data = await tangerineRequest<
    { LowerValuationLimit: string; UpperValuationLimit: string } & { Status: 'Successful' | 'Failed' }
  >('comprehensive', PATHS.comprehensive.valuationLimits, {})
  return {
    lower: Number(data.LowerValuationLimit.replace(/,/g, '')),
    upper: Number(data.UpperValuationLimit.replace(/,/g, '')),
  }
}

export async function confirmRegistrationNumber(
  line: TangerineLine,
  regNo: string
): Promise<TangerinePolicyResponse> {
  return tangerineRequest<TangerinePolicyResponse>(line, PATHS[line].confirmReg, { RegNo: regNo })
}

export async function confirmPolicyNumber(
  line: TangerineLine,
  policyNo: string
): Promise<TangerinePolicyResponse> {
  return tangerineRequest<TangerinePolicyResponse>(line, PATHS[line].confirmPolicy, { PolicyNo: policyNo })
}

/** Section 10 — comprehensive cover. Premium is fixed by Tangerine at 5% of valuation. */
export async function generateComprehensivePolicy(
  request: Omit<TangerineComprehensivePolicyRequest, 'UserID'>
): Promise<TangerinePolicyResponse> {
  return tangerineRequest<TangerinePolicyResponse>(
    'comprehensive', PATHS.comprehensive.generate, request as unknown as Record<string, unknown>
  )
}

/** Section 9 of the 3rd party manual — private motor, commercial, or tricycle cover. */
export async function generateThirdPartyPolicy(
  request: Omit<TangerineThirdPartyPolicyRequest, 'UserID'>
): Promise<TangerinePolicyResponse> {
  return tangerineRequest<TangerinePolicyResponse>(
    'thirdparty', PATHS.thirdparty.generate, request as unknown as Record<string, unknown>
  )
}

/** Fixed-premium tiers from the 3rd party manual §10: 1→₦50k, 2→₦60k, 3→₦70k. */
export const TANG_AUTO_PREMIUMS: Record<'1' | '2' | '3', number> = { '1': 50_000, '2': 60_000, '3': 70_000 }

export async function generateTangAutoPolicy(
  request: Omit<TangerineThirdPartyPolicyRequest, 'UserID'> & {
    ContactAddress: string
    NIN: string
    TangAutoType: '1' | '2' | '3'
    ImageUrlList: unknown
  }
): Promise<TangerinePolicyResponse> {
  return tangerineRequest<TangerinePolicyResponse>(
    'thirdparty', PATHS.thirdparty.generateTangAuto, request as unknown as Record<string, unknown>
  )
}

/** Renewal only succeeds for a policy originally generated under this same UserID. */
export async function renewThirdPartyPolicy(policyNo: string): Promise<TangerinePolicyResponse> {
  return tangerineRequest<TangerinePolicyResponse>('thirdparty', PATHS.thirdparty.renew, { PolicyNo: policyNo })
}

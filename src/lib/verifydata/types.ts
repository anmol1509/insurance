/** Request/response shapes for the VerifyData vehicle verification API. */

export interface VerifyVehicleRequest {
  regNumber: string
  secretKey: string
}

/** Section "VERIFY VEHICLE" — POST /api/ValidateVehicle/Initiate */
export interface VerifyVehicleResponse {
  status: string
  vehicleRegistrationNo: string
  vehicleChasisNo: string
  vehicleEngineNo: string
  vehicleEngineCapacity: string
  engineCapacityId: number
  vehicleColor: string
  vehicleMake: string
  vehicleModel: string
  ownerName: string
  vehicleCategory: string
  vehicleCategoryID: number
  yearOfManufacture: number
}

/** The four documented error codes, keyed by the guide's own "Code" column. */
export const VERIFYDATA_ERROR_MESSAGES: Record<string, string> = {
  '01': 'Access denied due to an invalid secret key.',
  '02': 'Insufficient wallet balance — please fund your VerifyData wallet.',
  '05': 'Insufficient wallet balance for this registration number verification.',
  '06': 'VerifyData reported an internal error.',
}

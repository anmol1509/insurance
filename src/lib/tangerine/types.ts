/** Request and response shapes for the Tangerine Motor Insurance APIs. */

export interface TangerineColour {
  ColourCode: string
  ColourName: string
}

export interface TangerineEngineCapacity {
  CapacityCode: string
  CapacityName: string
}

export interface TangerineState {
  StateCode: string
  StateName: string
}

export interface TangerineLGA {
  LGACode: string
  LGAName: string
  StateCode: string
}

export interface TangerineVehicleMake {
  VehicleMakeCode: string
  VehicleMakeName: string
}

export interface TangerineVehicleModel {
  VehicleModelCode: string
  VehicleModelName: string
  VehicleMakeCode: string
}

/** The shared envelope every Tangerine endpoint responds with. */
export interface TangerineEnvelope {
  Status: 'Successful' | 'Failed'
  Message?: string
}

export interface TangerineImageUrls {
  FrontImageURL: string
  ChasisImageURL: string
  BackImageURL?: string
  SideImageURL?: string
}

/** Section 10 of the Comprehensive manual — POST GenerateComprehensivePolicy.aspx */
export interface TangerineComprehensivePolicyRequest {
  UserID: string
  InsuredName: string
  GSMNumber: string
  ChasisNumber: string
  RegistrationNo: string
  /** '1' = Private Motor Individual, '2' = Private Motor Corporate */
  PolicyType: '1' | '2'
  YearofMake: string
  Email: string
  EngineCapacityCode: string
  StateCode: string
  LGACode: string
  VehicleMakeCode: string
  VehicleColorCode: string
  VehicleModelCode: string
  /** Mandatory when PolicyType is '2' (corporate). */
  TIN?: string
  NIN?: string
  BVN?: string
  Valuation: string
  ContactAddress: string
  milageKM: string
  /** Format: "01-Jan-2001" */
  VehicleRegistrationDate: string
  ImageUrlList: [TangerineImageUrls]
}

/** Section 9 of the 3rd Party manual — POST GeneratePolicy.aspx */
export interface TangerineThirdPartyPolicyRequest {
  UserID: string
  InsuredName: string
  GSMNumber: string
  ChasisNumber: string
  RegistrationNo: string
  VehicleMakeCode: string
  VehicleModelCode: string
  VehicleColorCode: string
  StateCode: string
  LGACode: string
  YearofMake: string
  Email: string
  /** '1' = private motor, '2' = commercial, '3' = tricycles */
  PolicyType: '1' | '2' | '3'
  EngineCapacityCode: string
}

export interface TangerinePolicyResponse extends TangerineEnvelope {
  PolicyNo?: string
  InsuredName?: string
  RegistrationNo?: string
  CoverDate?: string
  ExpirationDate?: string
  Premium?: string
  SumAssured?: string
  TransactionReferenceNo?: string
  TransactionStatus?: string
  CertificateURL?: string
  CertificateURLTemp?: string
  NaicomPolicyNo?: string
}

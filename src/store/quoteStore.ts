import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface MotorData {
  // Step 1 — Vehicle
  vehicleMakeModel: string
  yearOfManufacture: number | null
  vehicleType: string
  engineCapacity: string
  vehicleColour: string
  registrationNumber: string
  chassisVIN: string
  marketValueRange: string
  useType: 'private' | 'commercial' | null
  coverType: 'comprehensive' | 'tpo' | null
  usageCategory: 'personal' | 'business' | 'commercial' | null
  geographicalState: string
  accessories: string
  fuelType: string
  vehicleVariant: string
  carValue: number | null
  previousPolicyExpiry: string
  // Step 2 — Driver & Risk
  driverAge: number | null
  drivingExperience: string
  claimsHistory: boolean
  claimsDetail: string
  securityFeatures: string[]
  licenseNumber: string
  licenseExpiry: string
  // Step 3 — Client Info
  fullName: string
  dateOfBirth: string
  nin: string
  bvn: string
  phone: string
  email: string
  gender: string
  maritalStatus: string
  residentialAddress: string
  residentialState: string
  occupation: string
  idType: string
  idNumber: string
  isBusinessPolicy: boolean
  companyName: string
  rcNumber: string
  contactPerson: string
  // Tangerine-specific — only asked for when a Tangerine plan is chosen
  lgaOfResidence: string
  mileageKm: number | null
  vehicleRegistrationDate: string
  tin: string
  // AIICO-specific — only asked for when an AIICO plan is chosen
  title: string
  // Step 4 — Documents
  uploadedDocs: Record<string, { name: string; size: number; status: 'uploaded' | 'pending' }>
  // Review
  reviewConfirmed: boolean
  selectedUnderwriter: string | null
}

export interface MedicalData {
  // Step 1 — Personal
  fullName: string
  dateOfBirth: string
  nin: string
  occupation: string
  gender: 'male' | 'female' | 'other' | null
  maritalStatus: string
  planType: 'individual' | 'family' | 'group' | null
  numberOfLives: number
  phone: string
  email: string
  occupationCategory: string
  minAge: number | null
  maxAge: number | null
  // Step 2 — Health
  smokes: boolean
  smokingFrequency: string
  drinksAlcohol: boolean
  alcoholFrequency: string
  preexistingConditions: boolean
  conditions: string[]
  conditionDetails: string
  highRiskOccupation: boolean
  activityLevel: 'sedentary' | 'lightly_active' | 'active' | 'very_active' | null
  takingMedication: boolean
  medications: string
  medicalHistory: string
  hobbies: string[]
  // Step 3 — Coverage
  benefits: string[]
  criticalIllness: boolean
  dentalCover: boolean
  visionCover: boolean
  personalAccidentRider: boolean
  geoCoverage: string
  preferredHospitalState: string
  planTier: 'basic' | 'standard' | 'premium' | null
  requiresManualReview: boolean
  // Review
  reviewConfirmed: boolean
  selectedUnderwriter: string | null
}

export interface TravelData {
  // Step 1 — Traveller
  fullName: string
  dateOfBirth: string
  nin: string
  passportNumber: string
  destination: string
  numberOfTravellers: number
  allNigerianCitizens: boolean
  tripType: 'single' | 'multi_annual' | null
  visaRequirement: string
  // Step 2 — Trip
  departureDate: string
  returnDate: string
  addons: string[]
  preferredCurrency: string
  // Step 3 — Health
  preexistingConditions: boolean
  conditionDetails: string
  takingMedication: boolean
  medications: string
  medicalEmergencyCover: boolean
  emergencyContactName: string
  emergencyContactPhone: string
  confirmed: boolean
  // Review
  reviewConfirmed: boolean
  selectedUnderwriter: string | null
}

export interface BusinessData {
  // Step 1 — Business
  businessName: string
  businessType: string
  annualRevenue: string
  numberOfEmployees: number | null
  businessAddress: string
  state: string
  cacNumber: string
  businessSize: 'small' | 'medium' | 'large' | null
  // Step 2 — Coverage
  coverageItems: string[]
  // Fire & Perils details
  fireLocation: string
  fireOccupancy: string
  fireConstruction: string
  fireBuildingValue: string
  fireContentsValue: string
  fireStockValue: string
  fireProtection: string[]
  firePerils: string[]
  fireSecurity: string[]
  fireOwnerStatus: string
  fireDescription: string
  // Burglary details
  burglaryNature: string
  burglaryOccupancy: string
  burglaryHours: string
  burglarySecurity: string[]
  burglaryStockValue: string
  burglaryValuablesValue: string
  burglaryClaimsHistory: boolean
  burglaryClaimsDetail: string
  // Householder details
  houseLocation: string
  houseBuildingType: string
  houseUse: string
  houseOccupation: string
  houseBuildingValue: string
  houseContentsValue: string
  houseSecurity: string[]
  houseLossHistory: boolean
  houseLossDetail: string
  // GPA details
  gpaEmployees: number | null
  gpaOccupationCategory: string
  gpaMinAge: number | null
  gpaMaxAge: number | null
  gpaBenefits: string[]
  gpaSumInsuredMethod: string
  gpaAverageSalary: string
  gpaFixedBenefit: string
  gpaEmployeeCategories: string[]
  gpaClaimsHistory: boolean
  gpaClaimsDetail: string
  // Step 3 — Risk
  constructionType: string
  fireProtectionLevel: string
  hazardousMaterials: boolean
  hazardousTypes: string[]
  operatingHours: 'standard' | 'extended' | '247' | null
  siteVerificationConsent: boolean
  additionalInfo: string
  // Step 4 — Director Info
  directorName: string
  directorNin: string
  directorPhone: string
  directorEmail: string
  uploadedDocs: Record<string, { name: string; size: number; status: 'uploaded' | 'pending' }>
  // Review
  reviewConfirmed: boolean
  selectedUnderwriter: string | null
  confirmed: boolean
}

export interface MarineData {
  // Step 1 — Shipment & cargo
  cargoCategory: string
  cargoDescription: string
  sumInsured: number | null
  currency: string
  vesselName: string
  voyageFrom: string
  voyageTo: string
  invoiceNumber: string
  invoiceValue: number | null
  packingType: string
  numberOfPackages: number | null
  // Step 2 — Cover & premium
  coverType: string
  // Step 3 — Policyholder details
  fullName: string
  dateOfBirth: string
  nin: string
  phone: string
  email: string
  gender: string
  occupation: string
  residentialAddress: string
  residentialState: string
  idType: string
  idNumber: string
  // Step 4 — Documents
  uploadedDocs: Record<string, { name: string; size: number; status: 'uploaded' | 'pending' }>
  // Review
  reviewConfirmed: boolean
}

export interface PersonalAccidentData {
  // Step 1 — About you
  dateOfBirth: string
  gender: string
  occupation: string
  height: number | null
  weight: number | null
  sumInsured: number | null
  // Step 2 — Beneficiary & health
  beneficiaryName: string
  beneficiaryRelationship: string
  beneficiaryPhone: string
  beneficiaryEmail: string
  hasPreExistingCondition: boolean
  preExistingConditionDetails: string
  // Step 3 — Your details
  fullName: string
  nin: string
  phone: string
  email: string
  residentialAddress: string
  residentialState: string
  idType: string
  idNumber: string
  // Step 4 — Documents
  uploadedDocs: Record<string, { name: string; size: number; status: 'uploaded' | 'pending' }>
  // Review
  reviewConfirmed: boolean
}

type Product = 'motor' | 'medical' | 'travel' | 'business' | 'marine' | 'personal-accident'

interface QuoteStore {
  activeProduct: Product | null
  setActiveProduct: (p: Product | null) => void
  steps: Record<Product, number>
  setStep: (product: Product, step: number) => void
  motorData: MotorData
  medicalData: MedicalData
  travelData: TravelData
  businessData: BusinessData
  marineData: MarineData
  personalAccidentData: PersonalAccidentData
  updateMotor: (data: Partial<MotorData>) => void
  updateMedical: (data: Partial<MedicalData>) => void
  updateTravel: (data: Partial<TravelData>) => void
  updateBusiness: (data: Partial<BusinessData>) => void
  updateMarine: (data: Partial<MarineData>) => void
  updatePersonalAccident: (data: Partial<PersonalAccidentData>) => void
  calculatedPremium: number | null
  premiumBreakdown: Record<string, number>
  setCalculatedPremium: (total: number, breakdown: Record<string, number>) => void
  resetQuote: (product?: Product) => void
}

const defaultMotor: MotorData = {
  vehicleMakeModel: '', yearOfManufacture: null, vehicleType: '', engineCapacity: '',
  vehicleColour: '', registrationNumber: '', chassisVIN: '', marketValueRange: '',
  useType: null, coverType: null, usageCategory: null, geographicalState: '', accessories: '',
  fuelType: '', vehicleVariant: '', carValue: null, previousPolicyExpiry: '',
  driverAge: null, drivingExperience: '', claimsHistory: false, claimsDetail: '',
  securityFeatures: [], licenseNumber: '', licenseExpiry: '',
  fullName: '', dateOfBirth: '', nin: '', bvn: '', phone: '', email: '',
  gender: '', maritalStatus: '', residentialAddress: '', residentialState: '',
  occupation: '', idType: '', idNumber: '', isBusinessPolicy: false,
  companyName: '', rcNumber: '', contactPerson: '',
  lgaOfResidence: '', mileageKm: null, vehicleRegistrationDate: '', tin: '',
  title: '',
  uploadedDocs: {}, reviewConfirmed: false, selectedUnderwriter: null,
}

const defaultMedical: MedicalData = {
  fullName: '', dateOfBirth: '', nin: '', occupation: '', gender: null,
  maritalStatus: '', planType: null, numberOfLives: 1, phone: '', email: '',
  occupationCategory: '', minAge: null, maxAge: null,
  smokes: false, smokingFrequency: '', drinksAlcohol: false, alcoholFrequency: '',
  preexistingConditions: false, conditions: [], conditionDetails: '',
  highRiskOccupation: false, activityLevel: null, takingMedication: false,
  medications: '', medicalHistory: '', hobbies: [],
  benefits: ['death'], criticalIllness: false, dentalCover: false,
  visionCover: false, personalAccidentRider: false,
  geoCoverage: 'nigeria', preferredHospitalState: '', planTier: null,
  requiresManualReview: false, reviewConfirmed: false, selectedUnderwriter: null,
}

const defaultTravel: TravelData = {
  fullName: '', dateOfBirth: '', nin: '', passportNumber: '',
  destination: '', numberOfTravellers: 1, allNigerianCitizens: true,
  tripType: null, visaRequirement: '',
  departureDate: '', returnDate: '', addons: [], preferredCurrency: 'NGN',
  preexistingConditions: false, conditionDetails: '',
  takingMedication: false, medications: '', medicalEmergencyCover: false,
  emergencyContactName: '', emergencyContactPhone: '', confirmed: false,
  reviewConfirmed: false, selectedUnderwriter: null,
}

const defaultBusiness: BusinessData = {
  businessName: '', businessType: '', annualRevenue: '', numberOfEmployees: null,
  businessAddress: '', state: '', cacNumber: '', businessSize: null,
  coverageItems: [],
  fireLocation: '', fireOccupancy: '', fireConstruction: '', fireBuildingValue: '',
  fireContentsValue: '', fireStockValue: '', fireProtection: [], firePerils: [],
  fireSecurity: [], fireOwnerStatus: '', fireDescription: '',
  burglaryNature: '', burglaryOccupancy: '', burglaryHours: '', burglarySecurity: [],
  burglaryStockValue: '', burglaryValuablesValue: '',
  burglaryClaimsHistory: false, burglaryClaimsDetail: '',
  houseLocation: '', houseBuildingType: '', houseUse: '', houseOccupation: '',
  houseBuildingValue: '', houseContentsValue: '', houseSecurity: [],
  houseLossHistory: false, houseLossDetail: '',
  gpaEmployees: null, gpaOccupationCategory: '', gpaMinAge: null, gpaMaxAge: null,
  gpaBenefits: [], gpaSumInsuredMethod: '', gpaAverageSalary: '', gpaFixedBenefit: '',
  gpaEmployeeCategories: [], gpaClaimsHistory: false, gpaClaimsDetail: '',
  constructionType: '', fireProtectionLevel: '', hazardousMaterials: false,
  hazardousTypes: [], operatingHours: null, siteVerificationConsent: false,
  additionalInfo: '',
  directorName: '', directorNin: '', directorPhone: '', directorEmail: '',
  uploadedDocs: {}, reviewConfirmed: false, selectedUnderwriter: null, confirmed: false,
}

const defaultMarine: MarineData = {
  cargoCategory: '', cargoDescription: '', sumInsured: null, currency: 'NGN',
  vesselName: '', voyageFrom: '', voyageTo: '', invoiceNumber: '', invoiceValue: null,
  packingType: '', numberOfPackages: null,
  coverType: '',
  fullName: '', dateOfBirth: '', nin: '', phone: '', email: '', gender: '',
  occupation: '', residentialAddress: '', residentialState: '', idType: '', idNumber: '',
  uploadedDocs: {}, reviewConfirmed: false,
}

const defaultPersonalAccident: PersonalAccidentData = {
  dateOfBirth: '', gender: '', occupation: '', height: null, weight: null, sumInsured: null,
  beneficiaryName: '', beneficiaryRelationship: '', beneficiaryPhone: '', beneficiaryEmail: '',
  hasPreExistingCondition: false, preExistingConditionDetails: '',
  fullName: '', nin: '', phone: '', email: '', residentialAddress: '', residentialState: '',
  idType: '', idNumber: '',
  uploadedDocs: {}, reviewConfirmed: false,
}

const defaultSteps: Record<Product, number> = {
  motor: 1, medical: 1, travel: 1, business: 1, marine: 1, 'personal-accident': 1,
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      activeProduct: null,
      setActiveProduct: (p) => set({ activeProduct: p }),
      steps: defaultSteps,
      setStep: (product, step) => set((s) => ({ steps: { ...s.steps, [product]: step } })),
      motorData: defaultMotor,
      medicalData: defaultMedical,
      travelData: defaultTravel,
      businessData: defaultBusiness,
      marineData: defaultMarine,
      personalAccidentData: defaultPersonalAccident,
      updateMotor: (data) => set((s) => ({ motorData: { ...s.motorData, ...data } })),
      updateMedical: (data) => set((s) => ({ medicalData: { ...s.medicalData, ...data } })),
      updateTravel: (data) => set((s) => ({ travelData: { ...s.travelData, ...data } })),
      updateBusiness: (data) => set((s) => ({ businessData: { ...s.businessData, ...data } })),
      updateMarine: (data) => set((s) => ({ marineData: { ...s.marineData, ...data } })),
      updatePersonalAccident: (data) => set((s) => ({ personalAccidentData: { ...s.personalAccidentData, ...data } })),
      calculatedPremium: null,
      premiumBreakdown: {},
      setCalculatedPremium: (total, breakdown) => set({ calculatedPremium: total, premiumBreakdown: breakdown }),
      resetQuote: (product) => {
        if (!product) {
          set({
            motorData: defaultMotor, medicalData: defaultMedical,
            travelData: defaultTravel, businessData: defaultBusiness,
            marineData: defaultMarine, personalAccidentData: defaultPersonalAccident,
            steps: defaultSteps,
            calculatedPremium: null, premiumBreakdown: {},
          })
        } else {
          const resets: Record<string, object> = {
            motor: { motorData: defaultMotor }, medical: { medicalData: defaultMedical },
            travel: { travelData: defaultTravel }, business: { businessData: defaultBusiness },
            marine: { marineData: defaultMarine }, 'personal-accident': { personalAccidentData: defaultPersonalAccident },
          }
          set((s) => ({ ...resets[product], steps: { ...s.steps, [product]: 1 } }))
        }
      },
    }),
    {
      name: 'shopinsurance-quote',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
    }
  )
)

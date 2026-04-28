import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface MotorData {
  ownerName: string
  regNumber: string
  vehicleModel: string
  year: number | null
  vehicleValue: number | null
  coverType: 'comprehensive' | 'tpo' | 'tpft' | null
  useType: 'private' | 'commercial' | 'own_goods' | 'hired' | null
  state: string
  color: string
  engineCapacity: number | null
  licenseNumber: string
  driverAge: number | null
  yearsExperience: '0-5' | '6-10' | '10+' | null
  previousAccidents: boolean
  previousAccidentsDetails: string
  claimFree: boolean
  securityFeatures: string[]
  addons: string[]
}

export interface MedicalData {
  fullName: string
  dob: string
  occupation: string
  gender: 'male' | 'female' | 'other' | null
  maritalStatus: string
  planType: 'individual' | 'family' | 'group' | null
  numberOfLives: number
  phone: string
  email: string
  smokes: boolean
  smokingFrequency: string
  drinksAlcohol: boolean
  alcoholFrequency: string
  preexistingConditions: boolean
  conditions: string[]
  conditionDetails: string
  highRiskOccupation: boolean
  activityLevel: 'sedentary' | 'active' | 'very_active' | null
  takingMedication: boolean
  medications: string
  addons: string[]
  geoCoverage: string
  planTier: 'basic' | 'standard' | 'premium' | null
}

export interface TravelData {
  fullName: string
  dob: string
  passportNumber: string
  destination: string
  numberOfTravellers: number
  tripType: 'single' | 'multi_annual' | null
  departureDate: string
  returnDate: string
  addons: string[]
  preexistingConditions: boolean
  conditionDetails: string
  takingMedication: boolean
  medicalEmergencyCover: boolean
  emergencyContactName: string
  emergencyContactPhone: string
  confirmed: boolean
}

export interface BusinessData {
  businessName: string
  businessType: string
  cacNumber: string
  annualRevenue: number | null
  numberOfEmployees: number | null
  businessAddress: string
  state: string
  businessSize: 'small' | 'medium' | 'large' | null
  coverageItems: string[]
  sumInsuredValues: Record<string, number>
  constructionType: string
  fireProtection: string[]
  securityMeasures: string[]
  hazardousMaterials: boolean
  hazardousDetails: string
  operatingHours: 'standard' | 'extended' | '247' | null
  additionalInfo: string
  confirmed: boolean
}

type Product = 'motor' | 'medical' | 'travel' | 'business'

interface QuoteStore {
  activeProduct: Product | null
  setActiveProduct: (p: Product | null) => void

  steps: Record<Product, number>
  setStep: (product: Product, step: number) => void

  motorData: MotorData
  medicalData: MedicalData
  travelData: TravelData
  businessData: BusinessData

  updateMotor: (data: Partial<MotorData>) => void
  updateMedical: (data: Partial<MedicalData>) => void
  updateTravel: (data: Partial<TravelData>) => void
  updateBusiness: (data: Partial<BusinessData>) => void

  calculatedPremium: number | null
  premiumBreakdown: Record<string, number>
  setCalculatedPremium: (total: number, breakdown: Record<string, number>) => void

  resetQuote: (product?: Product) => void
}

const defaultMotor: MotorData = {
  ownerName: '', regNumber: '', vehicleModel: '', year: null, vehicleValue: null,
  coverType: null, useType: null, state: '', color: '', engineCapacity: null,
  licenseNumber: '', driverAge: null, yearsExperience: null,
  previousAccidents: false, previousAccidentsDetails: '', claimFree: false,
  securityFeatures: [], addons: [],
}

const defaultMedical: MedicalData = {
  fullName: '', dob: '', occupation: '', gender: null, maritalStatus: '',
  planType: null, numberOfLives: 1, phone: '', email: '',
  smokes: false, smokingFrequency: '', drinksAlcohol: false, alcoholFrequency: '',
  preexistingConditions: false, conditions: [], conditionDetails: '',
  highRiskOccupation: false, activityLevel: null, takingMedication: false,
  medications: '', addons: [], geoCoverage: '', planTier: null,
}

const defaultTravel: TravelData = {
  fullName: '', dob: '', passportNumber: '', destination: '',
  numberOfTravellers: 1, tripType: null, departureDate: '', returnDate: '',
  addons: [], preexistingConditions: false, conditionDetails: '',
  takingMedication: false, medicalEmergencyCover: false,
  emergencyContactName: '', emergencyContactPhone: '', confirmed: false,
}

const defaultBusiness: BusinessData = {
  businessName: '', businessType: '', cacNumber: '', annualRevenue: null,
  numberOfEmployees: null, businessAddress: '', state: '',
  businessSize: null, coverageItems: ['fire_perils', 'burglary'],
  sumInsuredValues: {}, constructionType: '', fireProtection: [],
  securityMeasures: [], hazardousMaterials: false, hazardousDetails: '',
  operatingHours: null, additionalInfo: '', confirmed: false,
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      activeProduct: null,
      setActiveProduct: (p) => set({ activeProduct: p }),

      steps: { motor: 1, medical: 1, travel: 1, business: 1 },
      setStep: (product, step) =>
        set((s) => ({ steps: { ...s.steps, [product]: step } })),

      motorData: defaultMotor,
      medicalData: defaultMedical,
      travelData: defaultTravel,
      businessData: defaultBusiness,

      updateMotor: (data) => set((s) => ({ motorData: { ...s.motorData, ...data } })),
      updateMedical: (data) => set((s) => ({ medicalData: { ...s.medicalData, ...data } })),
      updateTravel: (data) => set((s) => ({ travelData: { ...s.travelData, ...data } })),
      updateBusiness: (data) => set((s) => ({ businessData: { ...s.businessData, ...data } })),

      calculatedPremium: null,
      premiumBreakdown: {},
      setCalculatedPremium: (total, breakdown) =>
        set({ calculatedPremium: total, premiumBreakdown: breakdown }),

      resetQuote: (product) => {
        if (!product) {
          set({
            motorData: defaultMotor, medicalData: defaultMedical,
            travelData: defaultTravel, businessData: defaultBusiness,
            steps: { motor: 1, medical: 1, travel: 1, business: 1 },
            calculatedPremium: null, premiumBreakdown: {},
          })
        } else {
          const resets: Record<string, object> = {
            motor: { motorData: defaultMotor },
            medical: { medicalData: defaultMedical },
            travel: { travelData: defaultTravel },
            business: { businessData: defaultBusiness },
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

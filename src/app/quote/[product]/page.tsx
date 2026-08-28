'use client'
import { use, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import QuoteLayout from '@/components/quote/QuoteLayout'
import { PRODUCT_STEPS } from '@/lib/constants'
import { requiredMotorDocKeys, tangerineLineFor } from '@/lib/motorDocuments'
import { requiredSlotsFor } from '@/lib/nsia/documents'

import MotorStep1 from '@/components/quote/steps/motor/MotorStep1'
import MotorStep2 from '@/components/quote/steps/motor/MotorStep2'
import MotorStep3 from '@/components/quote/steps/motor/MotorStep3'
import MotorPlanSelect from '@/components/quote/steps/motor/MotorPlanSelect'
import MotorDocuments from '@/components/quote/steps/motor/MotorDocuments'
import MotorStep4 from '@/components/quote/steps/motor/MotorStep4'

import MedicalStep1 from '@/components/quote/steps/medical/MedicalStep1'
import MedicalStep2 from '@/components/quote/steps/medical/MedicalStep2'
import MedicalPlanSelect from '@/components/quote/steps/medical/MedicalPlanSelect'
import MedicalStep3 from '@/components/quote/steps/medical/MedicalStep3'
import MedicalReview from '@/components/quote/steps/medical/MedicalReview'

import TravelStep1 from '@/components/quote/steps/travel/TravelStep1'
import TravelStep2 from '@/components/quote/steps/travel/TravelStep2'
import TravelStep3 from '@/components/quote/steps/travel/TravelStep3'
import TravelReview from '@/components/quote/steps/travel/TravelReview'

import BusinessStep1 from '@/components/quote/steps/business/BusinessStep1'
import BusinessStep2 from '@/components/quote/steps/business/BusinessStep2'
import BusinessStep3 from '@/components/quote/steps/business/BusinessStep3'
import BusinessStep4 from '@/components/quote/steps/business/BusinessStep4'
import BusinessReview from '@/components/quote/steps/business/BusinessReview'

import MarineStep1 from '@/components/quote/steps/marine/MarineStep1'
import MarineStep2 from '@/components/quote/steps/marine/MarineStep2'
import MarineStep3 from '@/components/quote/steps/marine/MarineStep3'
import MarineDocuments from '@/components/quote/steps/marine/MarineDocuments'
import MarineReview from '@/components/quote/steps/marine/MarineReview'

import PersonalAccidentStep1 from '@/components/quote/steps/personal-accident/PersonalAccidentStep1'
import PersonalAccidentStep2 from '@/components/quote/steps/personal-accident/PersonalAccidentStep2'
import PersonalAccidentStep3 from '@/components/quote/steps/personal-accident/PersonalAccidentStep3'
import PersonalAccidentDocuments from '@/components/quote/steps/personal-accident/PersonalAccidentDocuments'
import PersonalAccidentReview from '@/components/quote/steps/personal-accident/PersonalAccidentReview'

const VALID_PRODUCTS = ['motor', 'medical', 'travel', 'business', 'marine', 'personal-accident'] as const
type Product = (typeof VALID_PRODUCTS)[number]

const STEP_COMPONENTS: Record<Product, React.ComponentType[]> = {
  motor:    [MotorStep1,    MotorStep2,    MotorStep3,    MotorPlanSelect,   MotorDocuments, MotorStep4],
  medical:  [MedicalStep1,  MedicalStep2,  MedicalPlanSelect, MedicalStep3, MedicalReview],
  travel:   [TravelStep1,   TravelStep2,   TravelStep3,   TravelReview],
  business: [BusinessStep1, BusinessStep2, BusinessStep3, BusinessStep4, BusinessReview],
  marine:   [MarineStep1, MarineStep2, MarineStep3, MarineDocuments, MarineReview],
  'personal-accident': [PersonalAccidentStep1, PersonalAccidentStep2, PersonalAccidentStep3, PersonalAccidentDocuments, PersonalAccidentReview],
}

export default function QuotePage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  const router = useRouter()

  if (!VALID_PRODUCTS.includes(product as Product)) notFound()

  const typedProduct = product as Product
  const { steps, setActiveProduct, setStep, motorData, medicalData, marineData, personalAccidentData } = useQuoteStore()
  const currentStep = steps[typedProduct]
  const stepConfig = PRODUCT_STEPS[typedProduct][currentStep - 1]
  const totalSteps = PRODUCT_STEPS[typedProduct].length
  const StepComponent = STEP_COMPONENTS[typedProduct][currentStep - 1]

  useEffect(() => {
    setActiveProduct(typedProduct)
  }, [typedProduct, setActiveProduct])

  // The required set depends on the plan chosen at step 4 — NSIA asks for more.
  const REQUIRED_MOTOR_DOCS = requiredMotorDocKeys(motorData)
  const nextDisabled =
    (typedProduct === 'motor' && (
      (currentStep === 1 && !motorData.vehicleMakeModel) ||
      (currentStep === 2 && (!motorData.vehicleMakeModel.trim() || !motorData.vehicleType || !motorData.yearOfManufacture || !motorData.useType)) ||
      (currentStep === 3 && (!motorData.coverType || (motorData.coverType === 'comprehensive' && !(motorData.carValue && motorData.carValue > 0)))) ||
      (currentStep === 4 && !motorData.selectedUnderwriter) ||
      (currentStep === 5 && (
        REQUIRED_MOTOR_DOCS.some((k) => !motorData.uploadedDocs[k]) ||
        (tangerineLineFor(motorData.selectedUnderwriter) !== null && (
          !motorData.lgaOfResidence.trim() ||
          !motorData.vehicleRegistrationDate ||
          (motorData.coverType === 'comprehensive' && !(motorData.mileageKm != null && motorData.mileageKm >= 0)) ||
          (motorData.isBusinessPolicy && !motorData.tin.trim())
        ))
      )) ||
      (currentStep === 6 && (!motorData.fullName.trim() || !motorData.email.includes('@') || motorData.phone.replace(/\D/g, '').length < 11 || !motorData.reviewConfirmed))
    )) ||
    (typedProduct === 'medical' && currentStep === 3 && !medicalData.selectedUnderwriter) ||
    (typedProduct === 'marine' && (
      (currentStep === 1 && (!marineData.cargoCategory || !marineData.cargoDescription.trim() || !(marineData.sumInsured && marineData.sumInsured > 0) || !marineData.voyageFrom.trim() || !marineData.voyageTo.trim())) ||
      (currentStep === 2 && !marineData.coverType) ||
      (currentStep === 3 && (!marineData.fullName.trim() || !marineData.email.includes('@') || marineData.phone.replace(/\D/g, '').length < 11 || !marineData.gender || !marineData.occupation || !marineData.residentialAddress.trim() || !marineData.residentialState || !marineData.idType || !marineData.idNumber.trim())) ||
      (currentStep === 4 && requiredSlotsFor('marine').some((k) => !marineData.uploadedDocs[k])) ||
      (currentStep === 5 && !marineData.reviewConfirmed)
    )) ||
    (typedProduct === 'personal-accident' && (
      (currentStep === 1 && (!personalAccidentData.dateOfBirth || !personalAccidentData.gender || !personalAccidentData.occupation || !(personalAccidentData.sumInsured && personalAccidentData.sumInsured > 0))) ||
      (currentStep === 2 && (!personalAccidentData.beneficiaryName.trim() || !personalAccidentData.beneficiaryRelationship || (personalAccidentData.hasPreExistingCondition && !personalAccidentData.preExistingConditionDetails.trim()))) ||
      (currentStep === 3 && (!personalAccidentData.fullName.trim() || !personalAccidentData.email.includes('@') || personalAccidentData.phone.replace(/\D/g, '').length < 11 || !personalAccidentData.residentialAddress.trim() || !personalAccidentData.residentialState || !personalAccidentData.idType || !personalAccidentData.idNumber.trim())) ||
      (currentStep === 4 && requiredSlotsFor('personal-accident').some((k) => !personalAccidentData.uploadedDocs[k])) ||
      (currentStep === 5 && !personalAccidentData.reviewConfirmed)
    ))

  function goNext() {
    if (currentStep === totalSteps) {
      if (nextDisabled) return
      router.push('/quote/checkout')
      return
    }
    setStep(typedProduct, currentStep + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setStep(typedProduct, currentStep - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <QuoteLayout
      product={typedProduct}
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepTitle={stepConfig?.title ?? ''}
      stepSub={stepConfig?.sub ?? ''}
      onBack={currentStep > 1 ? goBack : undefined}
      onNext={goNext}
      isFinalStep={currentStep === totalSteps}
      nextDisabled={nextDisabled}
      planSelect={(typedProduct === 'motor' && currentStep === 4) || (typedProduct === 'medical' && currentStep === 3)}
    >
      {StepComponent && <StepComponent />}
    </QuoteLayout>
  )
}

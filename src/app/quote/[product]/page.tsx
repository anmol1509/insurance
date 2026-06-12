'use client'
import { use, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import QuoteLayout from '@/components/quote/QuoteLayout'
import { PRODUCT_STEPS } from '@/lib/constants'

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

const VALID_PRODUCTS = ['motor', 'medical', 'travel', 'business'] as const
type Product = (typeof VALID_PRODUCTS)[number]

const STEP_COMPONENTS: Record<Product, React.ComponentType[]> = {
  motor:    [MotorStep1,    MotorStep2,    MotorStep3,    MotorPlanSelect,   MotorDocuments, MotorStep4],
  medical:  [MedicalStep1,  MedicalStep2,  MedicalPlanSelect, MedicalStep3, MedicalReview],
  travel:   [TravelStep1,   TravelStep2,   TravelStep3,   TravelReview],
  business: [BusinessStep1, BusinessStep2, BusinessStep3, BusinessStep4, BusinessReview],
}

export default function QuotePage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  const router = useRouter()

  if (!VALID_PRODUCTS.includes(product as Product)) notFound()

  const typedProduct = product as Product
  const { steps, setActiveProduct, setStep, motorData, medicalData } = useQuoteStore()
  const currentStep = steps[typedProduct]
  const stepConfig = PRODUCT_STEPS[typedProduct][currentStep - 1]
  const totalSteps = PRODUCT_STEPS[typedProduct].length
  const StepComponent = STEP_COMPONENTS[typedProduct][currentStep - 1]

  useEffect(() => {
    setActiveProduct(typedProduct)
  }, [typedProduct, setActiveProduct])

  const REQUIRED_MOTOR_DOCS = ['vehicle_license', 'proof_of_ownership', 'drivers_license']
  const nextDisabled =
    (typedProduct === 'motor' && (
      (currentStep === 1 && !motorData.vehicleMakeModel) ||
      (currentStep === 2 && (!motorData.vehicleMakeModel.trim() || !motorData.vehicleType || !motorData.yearOfManufacture || !motorData.useType)) ||
      (currentStep === 3 && (!motorData.coverType || (motorData.coverType === 'comprehensive' && !(motorData.carValue && motorData.carValue > 0)))) ||
      (currentStep === 4 && !motorData.selectedUnderwriter) ||
      (currentStep === 5 && REQUIRED_MOTOR_DOCS.some((k) => !motorData.uploadedDocs[k])) ||
      (currentStep === 6 && (!motorData.fullName.trim() || !motorData.email.includes('@') || motorData.phone.replace(/\D/g, '').length < 11 || !motorData.reviewConfirmed))
    )) ||
    (typedProduct === 'medical' && currentStep === 3 && !medicalData.selectedUnderwriter)

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

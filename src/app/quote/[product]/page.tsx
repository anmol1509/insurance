'use client'
import { use, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import QuoteLayout from '@/components/quote/QuoteLayout'
import { PRODUCT_STEPS } from '@/lib/constants'

import MotorStep1 from '@/components/quote/steps/motor/MotorStep1'
import MotorStep2 from '@/components/quote/steps/motor/MotorStep2'
import MotorStep3 from '@/components/quote/steps/motor/MotorStep3'
import MotorStep4 from '@/components/quote/steps/motor/MotorStep4'
import MotorReview from '@/components/quote/steps/motor/MotorReview'

import MedicalStep1 from '@/components/quote/steps/medical/MedicalStep1'
import MedicalStep2 from '@/components/quote/steps/medical/MedicalStep2'
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
  motor:    [MotorStep1,    MotorStep2,    MotorStep3,    MotorStep4,    MotorReview],
  medical:  [MedicalStep1,  MedicalStep2,  MedicalStep3,  MedicalReview],
  travel:   [TravelStep1,   TravelStep2,   TravelStep3,   TravelReview],
  business: [BusinessStep1, BusinessStep2, BusinessStep3, BusinessStep4, BusinessReview],
}

export default function QuotePage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)

  if (!VALID_PRODUCTS.includes(product as Product)) notFound()

  const typedProduct = product as Product
  const { steps, setActiveProduct, setStep } = useQuoteStore()
  const currentStep = steps[typedProduct]
  const stepConfig = PRODUCT_STEPS[typedProduct][currentStep - 1]
  const totalSteps = PRODUCT_STEPS[typedProduct].length
  const StepComponent = STEP_COMPONENTS[typedProduct][currentStep - 1]

  useEffect(() => {
    setActiveProduct(typedProduct)
  }, [typedProduct, setActiveProduct])

  function goNext() {
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
    >
      {StepComponent && <StepComponent />}
    </QuoteLayout>
  )
}

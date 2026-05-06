'use client'
import { use, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import QuoteLayout from '@/components/quote/QuoteLayout'
import { PRODUCT_STEPS } from '@/lib/constants'

import MotorQuickQuote from '@/components/quote/steps/motor/MotorQuickQuote'
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

// Motor: step 1 is the full-screen wizard (MotorQuickQuote), not in this array.
// Steps 2-6 map to indices 0-4 here.
const MOTOR_STEPS: React.ComponentType[] = [MotorStep1, MotorStep2, MotorStep3, MotorStep4, MotorReview]

const STEP_COMPONENTS: Record<Exclude<Product, 'motor'>, React.ComponentType[]> = {
  medical:  [MedicalStep1,  MedicalStep2,  MedicalStep3,  MedicalReview],
  travel:   [TravelStep1,   TravelStep2,   TravelStep3,   TravelReview],
  business: [BusinessStep1, BusinessStep2, BusinessStep3, BusinessStep4, BusinessReview],
}

export default function QuotePage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  const router = useRouter()

  if (!VALID_PRODUCTS.includes(product as Product)) notFound()

  const typedProduct = product as Product
  const { steps, setActiveProduct, setStep } = useQuoteStore()
  const currentStep = steps[typedProduct]

  useEffect(() => {
    setActiveProduct(typedProduct)
  }, [typedProduct, setActiveProduct])

  // Motor step 1 = full-screen wizard with its own layout
  if (typedProduct === 'motor' && currentStep === 1) {
    return (
      <MotorQuickQuote onComplete={() => router.push('/quote/result')} />
    )
  }

  // Determine step component for non-wizard steps
  const StepComponent = typedProduct === 'motor'
    ? MOTOR_STEPS[currentStep - 2]  // step 2 → index 0, step 3 → index 1, etc.
    : STEP_COMPONENTS[typedProduct as Exclude<Product, 'motor'>][currentStep - 1]

  const stepConfig = PRODUCT_STEPS[typedProduct][currentStep - 1]
  const totalSteps = PRODUCT_STEPS[typedProduct].length

  function goNext() {
    if (currentStep === totalSteps) {
      router.push(typedProduct === 'motor' ? '/quote/checkout' : '/quote/result')
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
    >
      {StepComponent && <StepComponent />}
    </QuoteLayout>
  )
}

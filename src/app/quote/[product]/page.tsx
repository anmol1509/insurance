'use client'
import { use, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import QuoteLayout from '@/components/quote/QuoteLayout'
import MotorStep1 from '@/components/quote/steps/motor/MotorStep1'
import MotorStep2 from '@/components/quote/steps/motor/MotorStep2'
import MotorStep3 from '@/components/quote/steps/motor/MotorStep3'
import MedicalStep1 from '@/components/quote/steps/medical/MedicalStep1'
import MedicalStep2 from '@/components/quote/steps/medical/MedicalStep2'
import MedicalStep3 from '@/components/quote/steps/medical/MedicalStep3'
import TravelStep1 from '@/components/quote/steps/travel/TravelStep1'
import TravelStep2 from '@/components/quote/steps/travel/TravelStep2'
import TravelStep3 from '@/components/quote/steps/travel/TravelStep3'
import BusinessStep1 from '@/components/quote/steps/business/BusinessStep1'
import BusinessStep2 from '@/components/quote/steps/business/BusinessStep2'
import BusinessStep3 from '@/components/quote/steps/business/BusinessStep3'

const VALID_PRODUCTS = ['motor', 'medical', 'travel', 'business'] as const
type Product = (typeof VALID_PRODUCTS)[number]

const STEP_CONFIGS: Record<Product, { title: string; sub: string }[]> = {
  motor: [
    { title: 'Tell us about your vehicle', sub: 'We need a few details to calculate your premium.' },
    { title: 'Driver details', sub: 'Information about the primary driver.' },
    { title: 'Enhance your cover', sub: 'Optional add-ons to boost your protection.' },
  ],
  medical: [
    { title: 'Your personal details', sub: 'Basic information to set up your policy.' },
    { title: 'Health details', sub: 'Help us understand your health profile.' },
    { title: 'Choose your coverage', sub: 'Select add-ons and your plan tier.' },
  ],
  travel: [
    { title: 'Your details', sub: 'Tell us about the traveller(s).' },
    { title: 'Your trip information', sub: 'Dates, destination, and add-ons.' },
    { title: 'Health declaration', sub: 'A few final health questions.' },
  ],
  business: [
    { title: 'Business information', sub: 'Tell us about your business.' },
    { title: 'Choose your coverage', sub: 'Select the cover that fits your needs.' },
    { title: 'Operations & risk', sub: 'A few questions about your premises.' },
  ],
}

const STEP_COMPONENTS: Record<Product, React.ComponentType[]> = {
  motor: [MotorStep1, MotorStep2, MotorStep3],
  medical: [MedicalStep1, MedicalStep2, MedicalStep3],
  travel: [TravelStep1, TravelStep2, TravelStep3],
  business: [BusinessStep1, BusinessStep2, BusinessStep3],
}

export default function QuotePage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)

  if (!VALID_PRODUCTS.includes(product as Product)) {
    notFound()
  }

  const typedProduct = product as Product
  const { steps, setActiveProduct, setStep } = useQuoteStore()
  const currentStep = steps[typedProduct]

  useEffect(() => {
    setActiveProduct(typedProduct)
  }, [typedProduct, setActiveProduct])

  const stepConfig = STEP_CONFIGS[typedProduct][currentStep - 1]
  const StepComponent = STEP_COMPONENTS[typedProduct][currentStep - 1]
  const totalSteps = 3

  return (
    <QuoteLayout
      product={typedProduct}
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepTitle={stepConfig?.title ?? ''}
      stepSub={stepConfig?.sub ?? ''}
      onBack={currentStep > 1 ? () => setStep(typedProduct, currentStep - 1) : undefined}
      onNext={() => {
        if (currentStep < totalSteps) {
          setStep(typedProduct, currentStep + 1)
        }
      }}
      isFinalStep={currentStep === totalSteps}
    >
      {StepComponent && <StepComponent />}
    </QuoteLayout>
  )
}

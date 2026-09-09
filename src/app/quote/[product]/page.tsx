'use client'
import { use, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quoteStore'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/lib/useHydrated'
import QuoteLayout from '@/components/quote/QuoteLayout'
import QuoteAuthModal from '@/components/quote/QuoteAuthModal'
import { MEDICAL_COVER_OPTIONS, PRODUCT_STEPS } from '@/lib/constants'
import { motorDocSlots } from '@/lib/motorDocuments'
import { motorStep5Missing, motorStep6Missing } from '@/lib/motorStepValidation'
import { requiredSlotsFor } from '@/lib/nsia/documents'

import MotorStep1 from '@/components/quote/steps/motor/MotorStep1'
import MotorStep2 from '@/components/quote/steps/motor/MotorStep2'
import MotorStep3 from '@/components/quote/steps/motor/MotorStep3'
import MotorPlanSelect from '@/components/quote/steps/motor/MotorPlanSelect'
import MotorDocuments from '@/components/quote/steps/motor/MotorDocuments'
import MotorStep4 from '@/components/quote/steps/motor/MotorStep4'

import MedicalCoverFor from '@/components/quote/steps/medical/MedicalCoverFor'
import MedicalStep1 from '@/components/quote/steps/medical/MedicalStep1'
import MedicalStep2 from '@/components/quote/steps/medical/MedicalStep2'
import MedicalPlanSelect from '@/components/quote/steps/medical/MedicalPlanSelect'
import MedicalStep3 from '@/components/quote/steps/medical/MedicalStep3'
import MedicalReview from '@/components/quote/steps/medical/MedicalReview'

import TravelDestination from '@/components/quote/steps/travel/TravelDestination'
import TravelStep1 from '@/components/quote/steps/travel/TravelStep1'
import TravelStep2 from '@/components/quote/steps/travel/TravelStep2'
import TravelStep3 from '@/components/quote/steps/travel/TravelStep3'
import TravelReview from '@/components/quote/steps/travel/TravelReview'

import BusinessTypeStep from '@/components/quote/steps/business/BusinessTypeStep'
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
  medical:  [MedicalCoverFor, MedicalStep1, MedicalStep2, MedicalPlanSelect, MedicalStep3, MedicalReview],
  travel:   [TravelDestination, TravelStep1, TravelStep2, TravelStep3, TravelReview],
  business: [BusinessTypeStep, BusinessStep1, BusinessStep2, BusinessStep3, BusinessStep4, BusinessReview],
  marine:   [MarineStep1, MarineStep2, MarineStep3, MarineDocuments, MarineReview],
  'personal-accident': [PersonalAccidentStep1, PersonalAccidentStep2, PersonalAccidentStep3, PersonalAccidentDocuments, PersonalAccidentReview],
}

export default function QuotePage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  const router = useRouter()

  if (!VALID_PRODUCTS.includes(product as Product)) notFound()

  const typedProduct = product as Product
  const {
    steps, maxSteps, setActiveProduct, setStep, resetQuote,
    setHeroPrefill, updateMedical, updateTravel, updateBusiness,
    motorData, medicalData, travelData, businessData, marineData, personalAccidentData,
  } = useQuoteStore()
  const user = useAuthStore((s) => s.user)
  /**
   * Both stores rehydrate from sessionStorage on the client only, so the
   * first paint must not decide between the gate and the flow — it would
   * disagree with the server-rendered markup.
   */
  const hydrated = useHydrated()

  const currentStep = steps[typedProduct]
  const stepConfig = PRODUCT_STEPS[typedProduct][currentStep - 1]
  const StepComponent = STEP_COMPONENTS[typedProduct][currentStep - 1]

  /**
   * This route never changes URL between steps (they're all client-side
   * state), so a mount here only ever happens when the customer actually
   * (re)opens the flow — a fresh link click, a browser refresh, or the back
   * button — never mid-flow. Always start those over at step 1 with a clean
   * form rather than resuming stale progress from a previous visit.
   */
  useEffect(() => {
    setActiveProduct(typedProduct)
    resetQuote(typedProduct)

    /**
     * Step 1 of every flow asks exactly what the homepage quick-quote widget
     * asks, so when the customer already answered it there, apply the answer
     * and open on step 2 rather than asking again. Motor is the exception:
     * its plate needs a registry lookup first, so MotorStep1 runs that and
     * advances itself once the vehicle comes back.
     */
    const prefill = useQuoteStore.getState().heroPrefill
    if (!prefill || prefill.product !== typedProduct || typedProduct === 'motor') return
    setHeroPrefill(null)
    if (typedProduct === 'medical') {
      const option = MEDICAL_COVER_OPTIONS.find((o) => o.value === prefill.value)
      if (!option) return
      updateMedical({ coverFor: option.value, planType: option.planType, numberOfLives: option.lives })
    }
    if (typedProduct === 'travel')   updateTravel({ destination: prefill.value })
    if (typedProduct === 'business') updateBusiness({ businessType: prefill.value })
    setStep(typedProduct, 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedProduct, setActiveProduct, resetQuote])

  /**
   * Motor's Documents step (raw step 5) has nothing to show for an insurer
   * whose API takes no documents (e.g. Fortis) — rather than making the
   * customer click through an empty step, it's skipped entirely and every
   * step after it is renumbered so the sidebar/progress never show a gap.
   */
  const MOTOR_DOCS_RAW_STEP = 5
  function isMotorStepActive(raw: number): boolean {
    if (raw === MOTOR_DOCS_RAW_STEP) return motorDocSlots(motorData).length > 0
    return true
  }
  const motorRawSteps = PRODUCT_STEPS.motor.map((_, i) => i + 1)
  const motorActiveRaw = motorRawSteps.filter(isMotorStepActive)

  const displaySteps = typedProduct === 'motor'
    ? motorActiveRaw.map((raw) => PRODUCT_STEPS.motor[raw - 1])
    : PRODUCT_STEPS[typedProduct]
  const totalSteps = displaySteps.length
  const displayCurrentStep = typedProduct === 'motor'
    ? Math.max(motorActiveRaw.indexOf(currentStep) + 1, 1)
    : currentStep
  const rawMaxStep = Math.max(maxSteps?.[typedProduct] ?? 1, currentStep)
  const displayMaxStep = typedProduct === 'motor'
    ? Math.max(motorActiveRaw.filter((raw) => raw <= rawMaxStep).length, 1)
    : rawMaxStep
  /** The true last step never gets skipped (only an interior step can be), so this stays a plain raw comparison. */
  const rawTotalSteps = PRODUCT_STEPS[typedProduct].length

  const nextDisabled =
    (typedProduct === 'motor' && (
      (currentStep === 1 && !motorData.vehicleMakeModel) ||
      (currentStep === 2 && (!motorData.vehicleMakeModel.trim() || !motorData.vehicleType || !motorData.yearOfManufacture || !motorData.useType)) ||
      (currentStep === 3 && (!motorData.coverType || (motorData.coverType === 'comprehensive' && !(motorData.carValue && motorData.carValue > 0)))) ||
      (currentStep === 4 && !motorData.selectedUnderwriter) ||
      (currentStep === 5 && motorStep5Missing(motorData).length > 0) ||
      (currentStep === 6 && (motorStep6Missing(motorData).length > 0 || !motorData.reviewConfirmed))
    )) ||
    (typedProduct === 'medical' && (
      (currentStep === 1 && !medicalData.coverFor) ||
      (currentStep === 4 && !medicalData.selectedUnderwriter)
    )) ||
    (typedProduct === 'travel'   && currentStep === 1 && !travelData.destination) ||
    (typedProduct === 'business' && currentStep === 1 && !businessData.businessType) ||
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
    if (currentStep === rawTotalSteps) {
      if (nextDisabled) return
      router.push('/quote/checkout')
      return
    }
    let next = currentStep + 1
    if (typedProduct === 'motor') {
      while (next <= rawTotalSteps && !isMotorStepActive(next)) next++
    }
    setStep(typedProduct, next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * The rail hands back a *display* step number (motor's skipped Documents
   * step is not in that list), so map it back onto the raw step the store
   * keeps. Jumping forward is only offered for steps already reached, and
   * only while the current step is complete, so a customer can never skip
   * past a question the flow still needs answered.
   */
  function goToStep(display: number) {
    const raw = typedProduct === 'motor' ? (motorActiveRaw[display - 1] ?? 1) : display
    if (raw === currentStep) return
    if (raw > currentStep && nextDisabled) return
    setStep(typedProduct, raw)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    let prev = currentStep - 1
    if (typedProduct === 'motor') {
      while (prev >= 1 && !isMotorStepActive(prev)) prev--
    }
    setStep(typedProduct, Math.max(prev, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!hydrated) return <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }} />

  return (
    <>
    {/* The flow renders behind the sign-in popup, which blocks it until verified. */}
    {!user && <QuoteAuthModal product={typedProduct} />}
    <QuoteLayout
      product={typedProduct}
      currentStep={displayCurrentStep}
      totalSteps={totalSteps}
      stepTitle={stepConfig?.title ?? ''}
      stepSub={stepConfig?.sub ?? ''}
      onBack={currentStep > 1 ? goBack : undefined}
      onNext={goNext}
      isFinalStep={currentStep === rawTotalSteps}
      stepsOverride={typedProduct === 'motor' ? displaySteps : undefined}
      nextDisabled={nextDisabled}
      maxStep={displayMaxStep}
      onStepSelect={goToStep}
      planSelect={(typedProduct === 'motor' && currentStep === 4) || (typedProduct === 'medical' && currentStep === 4)}
    >
      {StepComponent && <StepComponent />}
    </QuoteLayout>
    </>
  )
}

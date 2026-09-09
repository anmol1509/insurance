'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X, Car, Heart, Plane, Building2, Ship, HeartPulse } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import StepRail from '@/components/quote/StepRail'
import { PRODUCT_STEPS } from '@/lib/constants'

type Product = 'motor' | 'medical' | 'travel' | 'business' | 'marine' | 'personal-accident'

interface QuoteLayoutProps {
  product: Product
  currentStep: number
  totalSteps: number
  stepTitle: string
  stepSub: string
  onBack?: () => void
  onNext: () => void
  isFinalStep: boolean
  nextLabel?: string
  nextDisabled?: boolean
  planSelect?: boolean
  /** Furthest step reached — the step rail only lets the customer jump to steps at or before it. */
  maxStep: number
  /** Jump straight to a step from the rail. */
  onStepSelect: (step: number) => void
  /** Overrides the default step list — used when a step is skipped (e.g. no documents needed) so the step count renumbers correctly instead of showing a gap. */
  stepsOverride?: readonly { id: number; label: string }[]
  children: React.ReactNode
}

const PRODUCT_ICON = {
  motor:    Car,
  medical:  Heart,
  travel:   Plane,
  business: Building2,
  marine:   Ship,
  'personal-accident': HeartPulse,
}

const PRODUCT_CONFIG = {
  motor:    { color: 'var(--motor-600)',    colorBg: 'var(--motor-50)',    label: 'Motor Insurance'    },
  medical:  { color: 'var(--medical-600)',  colorBg: 'var(--medical-50)',  label: 'Medical Insurance'  },
  travel:   { color: 'var(--travel-600)',   colorBg: 'var(--travel-50)',   label: 'Travel Insurance'   },
  business: { color: 'var(--business-600)', colorBg: 'var(--business-50)', label: 'Business Insurance' },
  marine:   { color: 'var(--marine-600)',   colorBg: 'var(--marine-50)',   label: 'Marine Insurance'   },
  'personal-accident': { color: 'var(--pa-600)', colorBg: 'var(--pa-50)', label: 'Personal Accident Insurance' },
}

export default function QuoteLayout({
  product,
  currentStep,
  totalSteps,
  stepTitle,
  stepSub,
  onBack,
  onNext,
  isFinalStep,
  nextLabel,
  nextDisabled,
  planSelect,
  maxStep,
  onStepSelect,
  stepsOverride,
  children,
}: QuoteLayoutProps) {
  const router = useRouter()
  const config = PRODUCT_CONFIG[product]
  const visibleSteps = stepsOverride ?? PRODUCT_STEPS[product]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center px-4 lg:px-8 h-14 max-w-[1280px] mx-auto">
          <Logo size={28} href="/" />
          <div className="flex-1 flex items-center justify-center gap-2">
            {(() => { const Icon = PRODUCT_ICON[product]; return <Icon className="w-4 h-4" style={{ color: config.color }} /> })()}
            <span className="font-sans text-[13px] hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
              {config.label}
            </span>
            <span className="text-[var(--text-subtle)] hidden sm:inline">·</span>
            <span className="font-sans font-semibold text-[13px] sm:hidden" style={{ color: config.color }}>
              {visibleSteps[currentStep - 1]?.label}
            </span>
            <span className="font-sans font-semibold text-[13px] hidden sm:inline" style={{ color: config.color }}>
              Step {currentStep}/{totalSteps}
            </span>
          </div>
          <Link
            href="/"
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
            title="Exit quote"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </Link>
        </div>
      </div>

      <div className="sticky top-14 z-30">
        <StepRail
          steps={visibleSteps}
          currentStep={currentStep}
          maxStep={maxStep}
          color={config.color}
          colorBg={config.colorBg}
          onSelect={onStepSelect}
        />
      </div>

      <div className="flex-1 px-5 lg:px-20 py-6 lg:py-10">
      <div className={`mx-auto ${planSelect ? 'max-w-[1100px]' : 'max-w-[860px]'}`}>

        <div>
          <main className="min-w-0">
            {planSelect ? (
              <>
                <div className="mb-5">
                  <h2 className="font-display font-bold text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {stepTitle}
                  </h2>
                  <p className="font-sans text-[15px] mt-2" style={{ color: 'var(--text-muted)' }}>{stepSub}</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
                <div className="hidden lg:flex items-center justify-between mt-8 pt-5 border-t border-[var(--border-subtle)]">
                  <AnimatePresence>
                    {onBack && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        type="button"
                        onClick={onBack}
                        className="h-10 px-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm hover:bg-[var(--surface-raised)] transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        ← Back
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <p className="font-sans text-[13px] hidden md:block" style={{ color: 'var(--text-subtle)' }}>
                    Step {currentStep} of {totalSteps} · {config.label}
                  </p>
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled}
                    className="h-12 px-7 rounded-[var(--radius-xl)] font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                    style={{ backgroundColor: 'var(--green-700)' }}
                  >
                    {nextLabel ?? (isFinalStep ? 'Submit →' : 'Next step →')}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-[var(--border-default)] p-8 lg:p-10">
                <div className="mb-8">
                  <h2
                    className="font-display font-bold text-3xl tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stepTitle}
                  </h2>
                  <p className="font-sans text-[15px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    {stepSub}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>

                <div className="hidden lg:flex items-center justify-between mt-10 pt-6 border-t border-[var(--border-subtle)]">
                  <AnimatePresence>
                    {onBack && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        type="button"
                        onClick={onBack}
                        className="h-10 px-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm hover:bg-[var(--surface-raised)] transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        ← Back
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <p className="font-sans text-[13px] hidden md:block" style={{ color: 'var(--text-subtle)' }}>
                    Step {currentStep} of {totalSteps} · {config.label}
                  </p>

                  <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled}
                    className="h-12 px-7 rounded-[var(--radius-xl)] font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                    style={{ backgroundColor: 'var(--green-700)' }}
                  >
                    {nextLabel ?? (isFinalStep ? 'Submit →' : 'Next step →')}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-default)] px-5 py-4 flex gap-3 z-40">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm shrink-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="flex-1 h-12 rounded-[var(--radius-xl)] font-display font-semibold text-[15px] text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--green-700)' }}
          >
            {nextLabel ?? (isFinalStep ? 'Submit →' : 'Next step →')}
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

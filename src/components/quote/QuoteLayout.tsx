'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Lock, Zap, X, Car, Heart, Plane, Building2, Ship, HeartPulse } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import StepCircle from '@/components/ui/StepCircle'
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
  /** Overrides the default step list — used when a step is skipped (e.g. no documents needed) so the sidebar/count renumber correctly instead of showing a gap. */
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
  stepsOverride,
  children,
}: QuoteLayoutProps) {
  const router = useRouter()
  const config = PRODUCT_CONFIG[product]
  const visibleSteps = stepsOverride ?? PRODUCT_STEPS[product]

  const progressPct = (currentStep / totalSteps) * 100

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
        <div className="h-1 bg-[var(--border-subtle)]">
          <motion.div
            className="h-full"
            style={{ backgroundColor: config.color }}
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 lg:px-20 py-6 lg:py-10">
      <div className="max-w-[1280px] mx-auto">

        <div className={`grid gap-8 items-start ${planSelect ? 'lg:grid-cols-[240px_1fr]' : 'lg:grid-cols-[300px_1fr]'}`}>
          <aside className="hidden lg:block">
            <div className="sticky top-[4.5rem] bg-white rounded-2xl border border-[var(--border-default)] p-7">
              <div className="flex items-center gap-3.5 pb-5 border-b border-[var(--border-subtle)]">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: config.colorBg }}
                >
                  {(() => { const Icon = PRODUCT_ICON[product]; return <Icon className="w-5 h-5" style={{ color: config.color }} /> })()}
                </div>
                <div>
                  <p className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>
                    {config.label}
                  </p>
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    Quick quote · {visibleSteps.length} steps
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col">
                {visibleSteps.map((step, i) => {
                  const stepNum = i + 1
                  const stepLabel = step.label
                  const state =
                    stepNum < currentStep ? 'completed' : stepNum === currentStep ? 'active' : 'upcoming'
                  return (
                    <div
                      key={step.id}
                      className="flex gap-3.5 py-3 border-b border-[var(--border-subtle)]"
                    >
                      <StepCircle state={state} number={stepNum} productColor={config.color} />
                      <div className="pt-0.5">
                        <p
                          className="font-sans font-bold text-[10px] uppercase tracking-[0.07em]"
                          style={{
                            color:
                              state === 'upcoming' ? 'var(--text-subtle)' : config.color,
                          }}
                        >
                          Step {stepNum}
                        </p>
                        <p
                          className="font-sans font-medium text-sm"
                          style={{
                            color:
                              state === 'active'
                                ? 'var(--text-primary)'
                                : 'var(--text-muted)',
                          }}
                        >
                          {stepLabel}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { Icon: Shield, label: 'NAICOM' },
                  { Icon: Lock, label: 'SSL Secure' },
                  { Icon: Zap, label: 'Instant cert' },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-sans font-medium text-[11px]"
                    style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            {planSelect ? (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <span
                    className="font-sans font-semibold text-xs px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: config.colorBg, color: config.color }}
                  >
                    Step {currentStep} of {totalSteps}
                  </span>
                  <div className="flex-1 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
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
                <div className="flex items-center gap-4 mb-8">
                  <span
                    className="font-sans font-semibold text-xs px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: config.colorBg, color: config.color }}
                  >
                    Step {currentStep} of {totalSteps}
                  </span>
                  <div className="flex-1 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

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

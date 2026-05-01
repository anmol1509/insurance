'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Zap } from 'lucide-react'
import StepCircle from '@/components/ui/StepCircle'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { PRODUCT_STEPS } from '@/lib/constants'

type Product = 'motor' | 'medical' | 'travel' | 'business'

interface QuoteLayoutProps {
  product: Product
  currentStep: number
  totalSteps: number
  stepTitle: string
  stepSub: string
  onBack?: () => void
  onNext: () => void
  isFinalStep: boolean
  children: React.ReactNode
}

const PRODUCT_CONFIG = {
  motor:    { color: 'var(--motor-600)',    colorBg: 'var(--motor-50)',    label: 'Motor Insurance',    icon: '🚗' },
  medical:  { color: 'var(--medical-600)',  colorBg: 'var(--medical-50)',  label: 'Medical Insurance',  icon: '❤️' },
  travel:   { color: 'var(--travel-600)',   colorBg: 'var(--travel-50)',   label: 'Travel Insurance',   icon: '✈️' },
  business: { color: 'var(--business-600)', colorBg: 'var(--business-50)', label: 'Business Insurance', icon: '🏢' },
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
  children,
}: QuoteLayoutProps) {
  const router = useRouter()
  const config = PRODUCT_CONFIG[product]
  const { calculatedPremium, premiumBreakdown } = useQuoteStore()

  const progressPct = ((currentStep - 1) / totalSteps) * 100

  return (
    <div className="min-h-screen py-10 px-5 lg:px-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[1280px] mx-auto">
        {/* Mobile progress bar */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans font-medium text-sm" style={{ color: config.color }}>
              Step {currentStep} of {totalSteps}
            </p>
            <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
              {config.label}
            </p>
          </div>
          <div className="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-4xl border border-[var(--border-default)] p-7">
              {/* Product header */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-[var(--border-subtle)]">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: config.colorBg }}
                >
                  {config.icon}
                </div>
                <div>
                  <p className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>
                    {config.label}
                  </p>
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    Quick quote · {PRODUCT_STEPS[product].length} steps
                  </p>
                </div>
              </div>

              {/* Step list */}
              <div className="mt-6 flex flex-col">
                {PRODUCT_STEPS[product].map((step, i) => {
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

              {/* Premium estimate */}
              {calculatedPremium && (
                <div className="mt-6">
                  <p className="font-sans font-bold text-[10px] uppercase tracking-[0.07em] mb-3" style={{ color: 'var(--text-subtle)' }}>
                    Your Quote So Far
                  </p>
                  <AnimatePresence>
                    {Object.entries(premiumBreakdown).map(([key, val]) => (
                      <motion.div
                        key={key}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex justify-between py-1.5 border-b border-dashed border-[var(--border-subtle)]"
                      >
                        <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{key}</span>
                        <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                          {formatNaira(val)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div className="mt-2 flex justify-between pt-2 border-t border-[var(--border-default)]">
                    <span className="font-sans font-semibold text-[13px]" style={{ color: config.color }}>
                      Est. premium
                    </span>
                    <span className="font-display font-bold text-base" style={{ color: config.color }}>
                      {formatNaira(calculatedPremium)}
                    </span>
                  </div>
                </div>
              )}

              {/* Trust badges */}
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

          {/* Main content */}
          <main>
            <div className="bg-white rounded-4xl border border-[var(--border-default)] p-8 lg:p-10">
              {/* Top bar */}
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

              {/* Step heading */}
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

              {/* Form content */}
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

              {/* Bottom action bar */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border-subtle)]">
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
                  onClick={() => {
                    if (isFinalStep) {
                      router.push('/quote/result')
                    } else {
                      onNext()
                    }
                  }}
                  className="h-12 px-7 rounded-[var(--radius-xl)] font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md"
                  style={{ backgroundColor: config.color }}
                >
                  {isFinalStep ? 'Get my quote →' : 'Next step →'}
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile sticky bottom bar */}
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
            onClick={() => {
              if (isFinalStep) router.push('/quote/result')
              else onNext()
            }}
            className="flex-1 h-12 rounded-[var(--radius-xl)] font-display font-semibold text-[15px] text-white"
            style={{ backgroundColor: config.color }}
          >
            {isFinalStep ? 'Get my quote →' : 'Next step →'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface StepRailProps {
  steps: readonly { id: number; label: string }[]
  currentStep: number
  /** Furthest step the customer has reached — later steps stay locked. */
  maxStep: number
  color: string
  colorBg: string
  onSelect: (step: number) => void
}

/**
 * Horizontal step list under the quote header. It replaces the old left
 * sidebar and, unlike it, is clickable: any step already reached can be
 * jumped back (or forward) to without walking the flow one Next at a time.
 */
export default function StepRail({ steps, currentStep, maxStep, color, colorBg, onSelect }: StepRailProps) {
  return (
    <div className="border-b bg-white" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-stretch gap-1 overflow-x-auto no-scrollbar py-2">
          {steps.map((step, i) => {
            const num = i + 1
            const state = num < currentStep ? 'completed' : num === currentStep ? 'active' : 'upcoming'
            const reachable = num <= maxStep
            return (
              <button
                key={step.id}
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onSelect(num)}
                title={reachable ? `Go to step ${num}: ${step.label}` : `Step ${num} — not reached yet`}
                className="group shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-colors disabled:cursor-not-allowed enabled:hover:bg-[var(--surface-raised)]"
                style={{ backgroundColor: state === 'active' ? colorBg : 'transparent' }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-sans font-bold text-[11px] border-[1.5px] transition-colors"
                  style={
                    state === 'upcoming'
                      ? { borderColor: 'var(--border-medium)', color: 'var(--text-subtle)' }
                      : state === 'active'
                        ? { borderColor: color, color: 'white', backgroundColor: color }
                        : { borderColor: color, color }
                  }
                >
                  {state === 'completed' ? <Check className="w-3.5 h-3.5" /> : num}
                </span>
                <span
                  className="font-sans font-medium text-[13px] whitespace-nowrap"
                  style={{
                    color: state === 'active' ? color : state === 'completed' ? 'var(--text-secondary)' : 'var(--text-subtle)',
                  }}
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <span className="w-4 h-px ml-1 shrink-0" style={{ backgroundColor: 'var(--border-default)' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>
      <motion.div
        className="h-0.5"
        style={{ backgroundColor: color }}
        initial={{ width: '0%' }}
        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

'use client'
import { useState } from 'react'
import Input from './Input'
import { HelpCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface NINFieldProps {
  value: string
  onChange: (val: string) => void
  error?: string
  productColor?: string
}

export default function NINField({ value, onChange, error, productColor }: NINFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <Input
        label="National Identification Number (NIN)"
        required
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 11)
          onChange(v)
        }}
        placeholder="11-digit NIN"
        hint="As shown on your NIMC slip or national ID card"
        maxLength={11}
        inputMode="numeric"
        error={error}
        productColor={productColor}
      />

      {/* "Why do we ask?" tooltip trigger — sits top-right of the label row */}
      <button
        type="button"
        onClick={() => setShowTooltip(s => !s)}
        className="absolute right-0 top-0 flex items-center gap-1 font-sans text-[11px] font-medium hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        <HelpCircle className="w-3 h-3" />
        Why do we ask?
      </button>

      <AnimatePresence>
        {showTooltip && (
          <>
            {/* Backdrop tap-to-close */}
            <div className="fixed inset-0 z-10" onClick={() => setShowTooltip(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-7 z-20 bg-white rounded-2xl border border-[var(--border-default)] shadow-xl p-4"
            >
              <button
                type="button"
                onClick={() => setShowTooltip(false)}
                className="absolute top-3 right-3 text-[var(--text-subtle)] hover:text-[var(--text-muted)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="font-sans font-semibold text-[13px] mb-1.5 pr-5" style={{ color: 'var(--text-primary)' }}>
                Why we need your NIN
              </p>
              <p className="font-sans text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                NAICOM regulations require insurers to verify policyholder identity using the National Identification Number (NIN) issued by NIMC.
                Your NIN is encrypted in transit and stored securely — we never share it with third parties outside of regulatory compliance.
              </p>
              <p className="font-sans text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                Regulated under NDPR and the Insurance Act 2003.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

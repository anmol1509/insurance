'use client'
import { motion } from 'framer-motion'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { Lock, Shield, Zap, Mail, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import CountUpNumber from '@/components/ui/CountUpNumber'

const paymentMethods = [
  { id: 'paystack', icon: '💳', label: 'Paystack', sub: 'Debit / Credit card' },
  { id: 'bank', icon: '🏦', label: 'Bank Transfer', sub: 'Instant verification' },
  { id: 'ussd', icon: '📱', label: 'USSD', sub: '*737# · *966# · *894#' },
  { id: 'flutterwave', icon: '🔄', label: 'Flutterwave', sub: 'All payment types' },
]

export default function QuoteResultPage() {
  const { calculatedPremium, premiumBreakdown, activeProduct } = useQuoteStore()
  const [selectedPayment, setSelectedPayment] = useState('paystack')

  const total = calculatedPremium ?? 0
  const product = activeProduct ?? 'motor'

  const productColors: Record<string, string> = {
    motor: 'var(--motor-600)',
    medical: 'var(--medical-600)',
    travel: 'var(--travel-600)',
    business: 'var(--business-600)',
  }
  const color = productColors[product]

  return (
    <div className="min-h-screen py-16 px-5" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[740px] mx-auto">
        {/* Success header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2"
            style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 4 L34 10 L34 20 C34 28 27 35 20 37 C13 35 6 28 6 20 L6 10 Z" fill="var(--green-700)" />
              <motion.path
                d="M13 20 L18 25 L27 15"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-extrabold text-[34px] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Your quote is ready
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-sans text-base mt-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Valid for 24 hours · Pay now to receive your certificate instantly
          </motion.p>
        </div>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-4xl border border-[var(--border-default)] p-9 mb-4"
        >
          {/* Top row */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block font-sans font-semibold text-[11px] uppercase tracking-[0.05em] px-3 py-1 rounded-full capitalize" style={{ backgroundColor: 'var(--green-50)', color }}>
                {product} Insurance
              </span>
              <p className="font-sans text-[13px] mt-2" style={{ color: 'var(--text-muted)' }}>
                Policy Ref: SI-2025-0042983
              </p>
            </div>
            <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>
              Generated: {new Date().toLocaleDateString('en-NG')}
            </p>
          </div>

          {/* Premium */}
          <div className="text-center py-8 border-y border-[var(--border-subtle)]">
            <p className="font-sans font-medium text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Annual premium</p>
            <p className="font-display font-extrabold leading-none" style={{ fontSize: '56px', color: 'var(--green-700)' }}>
              <CountUpNumber target={total} duration={1500} prefix="₦" format={(n) => n.toLocaleString('en-NG')} />
            </p>
            <p className="font-sans text-[15px] mt-1" style={{ color: 'var(--text-muted)' }}>12 months coverage</p>
          </div>

          {/* Breakdown */}
          <div className="py-6 border-b border-[var(--border-subtle)]">
            {Object.entries(premiumBreakdown).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2">
                <span className="font-sans text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <span className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>{formatNaira(val)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1 border-t border-[var(--border-default)]">
              <span className="font-sans font-bold text-[15px]" style={{ color: 'var(--green-700)' }}>Total annual premium</span>
              <span className="font-sans font-bold text-[15px]" style={{ color: 'var(--green-700)' }}>{formatNaira(total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-4xl border border-[var(--border-default)] p-8 mb-6"
        >
          <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Choose payment method
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setSelectedPayment(pm.id)}
                className="border-[1.5px] rounded-2xl p-4 flex items-center gap-3 text-left transition-all"
                style={selectedPayment === pm.id
                  ? { borderColor: 'var(--green-700)', backgroundColor: 'var(--green-50)' }
                  : { borderColor: 'var(--border-default)' }
                }
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: 'var(--surface-raised)' }}>
                  {pm.icon}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{pm.label}</p>
                  <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{pm.sub}</p>
                </div>
                {selectedPayment === pm.id && (
                  <div className="ml-auto w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--green-700)' }}>
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="w-full mt-6 h-[58px] rounded-2xl font-display font-bold text-[17px] text-white transition-all"
            style={{ backgroundColor: 'var(--orange-500)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--orange-600)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--orange-500)' }}
          >
            Pay {formatNaira(total)} now →
          </motion.button>

          <div className="flex justify-center gap-5 mt-4">
            {[
              { Icon: Lock, label: '256-bit SSL' },
              { Icon: Shield, label: 'NAICOM Licensed' },
              { Icon: Zap, label: 'Certificate on payment' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />
                <span className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Secondary actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex justify-center items-center gap-4 flex-wrap"
        >
          <button type="button" className="flex items-center gap-2 h-10 px-4 border border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm hover:bg-[var(--surface-raised)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
            <Mail className="w-4 h-4" /> Save quote to email
          </button>
          <button type="button" className="flex items-center gap-2 h-10 px-4 border border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm hover:bg-[var(--surface-raised)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
            <Share2 className="w-4 h-4" /> Share quote link
          </button>
          <Link href={`/quote/${product}`} className="flex items-center gap-2 font-sans text-[13px] hover:underline" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Start over
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus } from 'lucide-react'
import { mockClaims, PRODUCT_COLORS } from '@/lib/mockData'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

const STATUS_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending'> = {
  submitted:    'status-pending',
  under_review: 'status-expiring',
  approved:     'status-active',
  settled:      'status-active',
  rejected:     'status-expired',
}

const STATUS_LABEL: Record<string, string> = {
  submitted:    'Submitted',
  under_review: 'Under Review',
  approved:     'Approved',
  settled:      'Settled',
  rejected:     'Rejected',
}

function ClaimCard({ claim, defaultOpen }: { claim: typeof mockClaims[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const colors = PRODUCT_COLORS[claim.productType]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--surface-raised)] transition-colors"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0"
          style={{ backgroundColor: colors.light }}
        >
          {colors.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
              {claim.type}
            </p>
            <Badge variant={STATUS_VARIANT[claim.status] ?? 'default'}>
              {STATUS_LABEL[claim.status]}
            </Badge>
          </div>
          <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {claim.policyName} · {claim.policyRef}
          </p>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
            {formatNaira(claim.amount)}
          </p>
          <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Reported {new Date(claim.dateReported).toLocaleDateString('en-NG')}
          </p>
        </div>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform"
          style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="font-sans text-[13px] mt-4 mb-5" style={{ color: 'var(--text-secondary)' }}>
                {claim.description}
              </p>

              {/* Timeline */}
              <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-3" style={{ color: 'var(--text-subtle)' }}>
                Timeline
              </p>
              <div className="flex flex-col gap-0">
                {claim.timeline.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                        style={{
                          backgroundColor: step.done ? 'var(--green-700)' : 'var(--border-default)',
                          color: step.done ? 'white' : 'var(--text-muted)',
                        }}
                      >
                        {step.done ? '✓' : '○'}
                      </div>
                      {i < claim.timeline.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ backgroundColor: step.done ? 'var(--green-700)' : 'var(--border-subtle)', opacity: 0.4 }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-sans font-semibold text-[13px]" style={{ color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {step.event}
                      </p>
                      <p className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ClaimsPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Claims
          </h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {mockClaims.length} {mockClaims.length === 1 ? 'claim' : 'claims'} on record
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white"
          style={{ backgroundColor: 'var(--green-700)' }}
        >
          <Plus className="w-4 h-4" /> New claim
        </button>
      </div>

      {mockClaims.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>No claims yet</p>
          <p className="font-sans text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Hopefully it stays that way! If something happens, we're here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {mockClaims.map((claim, i) => (
            <ClaimCard key={claim.id} claim={claim} defaultOpen={i === 0} />
          ))}
        </div>
      )}

      {/* Help strip */}
      <div className="mt-6 p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
        <span className="text-2xl shrink-0">📞</span>
        <div>
          <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--green-700)' }}>Need help with a claim?</p>
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Our claims team is available 24/7.{' '}
            <a href="https://wa.me/2348001234567" className="underline font-medium" style={{ color: 'var(--green-700)' }}>
              Chat on WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

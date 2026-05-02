'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Download, RefreshCw, Eye } from 'lucide-react'
import { mockPolicies, PRODUCT_COLORS } from '@/lib/mockData'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

type Filter = 'all' | 'active' | 'expiring' | 'expired'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'active',   label: 'Active' },
  { key: 'expiring', label: 'Expiring soon' },
  { key: 'expired',  label: 'Expired' },
]

export default function PoliciesPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const shown = filter === 'all' ? mockPolicies : mockPolicies.filter((p) => p.status === filter)

  const statusVariant = (s: string): 'status-active' | 'status-expiring' | 'status-expired' => {
    if (s === 'active') return 'status-active'
    if (s === 'expiring') return 'status-expiring'
    return 'status-expired'
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
          My Policies
        </h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {mockPolicies.length} {mockPolicies.length === 1 ? 'policy' : 'policies'} in total
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? mockPolicies.length : mockPolicies.filter((p) => p.status === f.key).length
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
              style={{
                backgroundColor: filter === f.key ? 'var(--green-700)' : 'white',
                borderColor: filter === f.key ? 'var(--green-700)' : 'var(--border-default)',
                color: filter === f.key ? 'white' : 'var(--text-secondary)',
              }}
            >
              {f.label}
              <span
                className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-raised)',
                  color: filter === f.key ? 'white' : 'var(--text-muted)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Policy cards */}
      <div className="flex flex-col gap-3">
        {shown.length === 0 && (
          <div className="text-center py-16 rounded-2xl border" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>No policies in this category.</p>
            <Link href="/quote/motor" className="inline-block mt-3 font-sans font-semibold text-[14px] hover:underline" style={{ color: 'var(--green-700)' }}>
              Get a new quote →
            </Link>
          </div>
        )}

        {shown.map((policy, i) => {
          const colors = PRODUCT_COLORS[policy.productType]
          const daysLeft = Math.ceil((new Date(policy.expiryDate).getTime() - Date.now()) / 86400000)
          return (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
            >
              {/* Header strip */}
              <div className="h-1.5" style={{ backgroundColor: colors.main }} />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: colors.light }}
                  >
                    {colors.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>
                        {policy.name}
                      </h2>
                      <Badge variant={statusVariant(policy.status)}>
                        {policy.status === 'active' ? 'Active' : policy.status === 'expiring' ? 'Expiring' : 'Expired'}
                      </Badge>
                    </div>
                    <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {policy.insurer} · {policy.ref}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-subtle)' }}>Cover type</p>
                    <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{policy.coverType}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-subtle)' }}>Sum insured</p>
                    <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(policy.sumInsured)}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-subtle)' }}>Premium</p>
                    <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(policy.premium)}/yr</p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-subtle)' }}>Expires</p>
                    <p className="font-sans font-semibold text-[13px]" style={{ color: daysLeft < 30 ? 'var(--error)' : 'var(--text-primary)' }}>
                      {new Date(policy.expiryDate).toLocaleDateString('en-NG')}
                      {daysLeft > 0 && daysLeft <= 60 && <span className="ml-1 font-normal text-[11px]">({daysLeft}d)</span>}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <button type="button"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans font-semibold text-[12px] border transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    <Eye className="w-3.5 h-3.5" /> View details
                  </button>
                  <button type="button"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans font-semibold text-[12px] border transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    <Download className="w-3.5 h-3.5" /> Certificate
                  </button>
                  {(policy.status === 'active' || policy.status === 'expiring') && (
                    <button type="button"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans font-semibold text-[12px] text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--green-700)' }}
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Renew
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

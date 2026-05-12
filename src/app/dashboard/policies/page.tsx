'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Download, RefreshCw, Eye, X, Shield, Check, Calendar, FileText } from 'lucide-react'
import { mockPolicies, PRODUCT_COLORS, Policy } from '@/lib/mockData'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

type Filter = 'all' | 'active' | 'expiring' | 'expired'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'active',   label: 'Active' },
  { key: 'expiring', label: 'Expiring soon' },
  { key: 'expired',  label: 'Expired' },
]

function PolicyDetailModal({ policy, onClose }: { policy: Policy; onClose: () => void }) {
  const colors = PRODUCT_COLORS[policy.productType]
  const daysLeft = Math.ceil((new Date(policy.expiryDate).getTime() - Date.now()) / 86400000)
  const startDate = new Date(policy.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
  const expiryDate = new Date(policy.expiryDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative bg-white w-full sm:max-w-[520px] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: colors.main }} />

        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: colors.light }}>
              {colors.emoji}
            </div>
            <div>
              <h2 className="font-display font-bold text-[18px] leading-tight" style={{ color: 'var(--text-primary)' }}>{policy.name}</h2>
              <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{policy.insurer}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-raised)] transition-colors mt-1">
            <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center gap-2 mb-5">
            <span className="font-mono text-[12px] px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}>
              {policy.ref}
            </span>
            <Badge variant={policy.status === 'active' ? 'status-active' : policy.status === 'expiring' ? 'status-expiring' : 'status-expired'}>
              {policy.status === 'active' ? 'Active' : policy.status === 'expiring' ? 'Expiring soon' : 'Expired'}
            </Badge>
            {daysLeft > 0 && daysLeft <= 60 && (
              <span className="font-sans text-[11px] font-medium px-2 py-1 rounded-lg bg-amber-50 text-amber-700">{daysLeft} days left</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Annual premium', value: formatNaira(policy.premium) + '/yr' },
              { label: 'Sum insured', value: formatNaira(policy.sumInsured) },
              { label: 'Cover type', value: policy.coverType },
              { label: 'Product', value: policy.productType.charAt(0).toUpperCase() + policy.productType.slice(1) + ' Insurance' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 mb-5 flex items-center gap-4" style={{ backgroundColor: colors.light, border: `1px solid ${colors.main}22` }}>
            <Calendar className="w-5 h-5 shrink-0" style={{ color: colors.main }} />
            <div className="flex-1">
              <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-1" style={{ color: colors.main }}>Coverage period</p>
              <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{startDate} → {expiryDate}</p>
            </div>
          </div>

          {Object.keys(policy.details).length > 0 && (
            <div className="mb-5">
              <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-3" style={{ color: 'var(--text-muted)' }}>Policy details</p>
              <div className="rounded-xl border" style={{ borderColor: 'var(--border-default)' }}>
                {Object.entries(policy.details).map(([key, val]) => (
                  <div key={key} className="flex justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{key}</span>
                    <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-3" style={{ color: 'var(--text-muted)' }}>What’s covered</p>
            <div className="flex flex-col gap-2">
              {['Accidental damage', 'Theft & fire', 'Third-party liability', 'NIID auto-registration', 'Roadside assistance'].map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.light }}>
                    <Check className="w-2.5 h-2.5" style={{ color: colors.main }} strokeWidth={3} />
                  </div>
                  <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { onClose(); alert(`Your certificate for ${policy.ref} has been sent to your email on file.`) }}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border font-sans font-semibold text-[13px] transition-colors hover:bg-[var(--surface-raised)]"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              <Download className="w-4 h-4" /> Download Certificate
            </button>
            {(policy.status === 'active' || policy.status === 'expiring') && (
              <Link
                href="/quote/motor"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-sans font-semibold text-[13px] text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: colors.main }}
              >
                <RefreshCw className="w-4 h-4" /> Renew policy
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CertificateModal({ policy, onClose }: { policy: Policy; onClose: () => void }) {
  const colors = PRODUCT_COLORS[policy.productType]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[400px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5" style={{ backgroundColor: colors.main }} />
        <div className="p-6">
          <button type="button" onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-raised)]">
            <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </button>

          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.light }}>
            <FileText className="w-7 h-7" style={{ color: colors.main }} />
          </div>

          <h3 className="font-display font-bold text-[18px] text-center mb-1" style={{ color: 'var(--text-primary)' }}>Certificate ready</h3>
          <p className="font-sans text-[13px] text-center mb-5" style={{ color: 'var(--text-muted)' }}>
            Your digital certificate for <strong style={{ color: 'var(--text-primary)' }}>{policy.ref}</strong> has been issued and delivered to your email.
          </p>

          <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: 'var(--surface-raised)' }}>
            {[
              { label: 'Policy reference', value: policy.ref },
              { label: 'Insurer', value: policy.insurer },
              { label: 'Valid from', value: new Date(policy.startDate).toLocaleDateString('en-NG') },
              { label: 'Valid to', value: new Date(policy.expiryDate).toLocaleDateString('en-NG') },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5">
                <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--green-50)' }}>
            <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--green-700)' }} />
            <span className="font-sans text-[12px]" style={{ color: 'var(--green-700)' }}>NAICOM licensed · Certificate is legally valid</span>
          </div>

          <button type="button" onClick={onClose} className="w-full h-11 rounded-xl font-sans font-semibold text-[13px] text-white" style={{ backgroundColor: colors.main }}>
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function PoliciesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [detailPolicy, setDetailPolicy] = useState<Policy | null>(null)
  const [certPolicy, setCertPolicy] = useState<Policy | null>(null)

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
              <div className="h-1.5" style={{ backgroundColor: colors.main }} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: colors.light }}>
                    {colors.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>{policy.name}</h2>
                      <Badge variant={statusVariant(policy.status)}>
                        {policy.status === 'active' ? 'Active' : policy.status === 'expiring' ? 'Expiring' : 'Expired'}
                      </Badge>
                    </div>
                    <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{policy.insurer} · {policy.ref}</p>
                  </div>
                </div>

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

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <button type="button" onClick={() => setDetailPolicy(policy)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans font-semibold text-[12px] border transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    <Eye className="w-3.5 h-3.5" /> View details
                  </button>
                  <button type="button" onClick={() => setCertPolicy(policy)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans font-semibold text-[12px] border transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    <Download className="w-3.5 h-3.5" /> Certificate
                  </button>
                  {(policy.status === 'active' || policy.status === 'expiring') && (
                    <button type="button" onClick={() => setDetailPolicy(policy)}
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

      <AnimatePresence>
        {detailPolicy && <PolicyDetailModal policy={detailPolicy} onClose={() => setDetailPolicy(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {certPolicy && <CertificateModal policy={certPolicy} onClose={() => setCertPolicy(null)} />}
      </AnimatePresence>
    </div>
  )
}

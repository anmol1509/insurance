'use client'
import { motion } from 'framer-motion'
import { mockPolicies, mockClaims, mockDocuments } from '@/lib/mockData'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'

const ADMIN_STATS = [
  { label: 'Total Policies',    value: '1,284',   delta: '+12 this month', color: 'var(--green-700)', bg: 'var(--green-50)' },
  { label: 'Premium Volume',    value: '₦94.2M',  delta: '+₦8.1M this month', color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Open Claims',       value: '23',      delta: '4 pending approval', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'New Users (30d)',   value: '318',     delta: '+22% vs last month', color: '#0284C7', bg: '#F0F9FF' },
]

const RECENT_CLAIMS = [
  { id: 'CLM-2025-0921', user: 'Emeka Okonkwo',  type: 'Motor – Accidental', amount: 320000, status: 'under_review' as const },
  { id: 'CLM-2025-0908', user: 'Ngozi Adeyemi',   type: 'Medical – Hospitalization', amount: 145000, status: 'submitted' as const },
  { id: 'CLM-2025-0887', user: 'Chukwuemeka Ibe', type: 'Travel – Trip Cancel', amount: 85000,  status: 'approved' as const },
  { id: 'CLM-2025-0871', user: 'Fatima Bello',    type: 'Business – Fire',   amount: 550000, status: 'settled' as const },
]

const STATUS_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending'> = {
  submitted: 'status-pending', under_review: 'status-expiring', approved: 'status-active', settled: 'status-active', rejected: 'status-expired',
}
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved', settled: 'Settled', rejected: 'Rejected',
}

export default function AdminPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[26px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Admin Overview</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>ShopInsurance operations dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {ADMIN_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <p className="font-sans font-medium text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>{s.label}</p>
            <p className="font-display font-bold text-[28px] leading-none mb-1" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            <span className="font-sans text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{s.delta}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent claims */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
            <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Recent Claims</p>
            <a href="/admin/claims" className="font-sans font-semibold text-[12px] hover:underline" style={{ color: '#DC2626' }}>View all →</a>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {RECENT_CLAIMS.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface-raised)] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{c.user}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{c.type} · {c.id}</p>
                </div>
                <p className="font-sans font-semibold text-[13px] shrink-0" style={{ color: 'var(--text-primary)' }}>{formatNaira(c.amount)}</p>
                <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Policy breakdown */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
            <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Policies by Type</p>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {[
              { type: 'motor',    count: 621, pct: 48 },
              { type: 'medical',  count: 318, pct: 25 },
              { type: 'business', count: 218, pct: 17 },
              { type: 'travel',   count: 127, pct: 10 },
            ].map((item) => {
              const c = PRODUCT_COLORS[item.type]
              return (
                <div key={item.type}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{c.emoji} {c.label}</span>
                    <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: c.main }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { motion } from 'framer-motion'
import { formatNaira } from '@/lib/formatters'
import { PRODUCT_COLORS } from '@/lib/mockData'

const MONTHLY = [
  { month: 'Nov', policies: 89,  premium: 7200000 },
  { month: 'Dec', policies: 104, premium: 8900000 },
  { month: 'Jan', policies: 118, premium: 9800000 },
  { month: 'Feb', policies: 97,  premium: 8100000 },
  { month: 'Mar', policies: 132, premium: 11200000 },
  { month: 'Apr', policies: 145, premium: 12400000 },
]

const TOP_INSURERS = [
  { name: 'Leadway Assurance', policies: 312, premium: 28400000 },
  { name: 'Hygeia HMO',        policies: 218, premium: 19800000 },
  { name: 'AXA Mansard',       policies: 187, premium: 14200000 },
  { name: 'NSIA Insurance',    policies: 143, premium: 11600000 },
  { name: 'Cornerstone Ins',   policies: 98,  premium: 7800000 },
]

const maxPolicies = Math.max(...MONTHLY.map((m) => m.policies))

export default function AdminReportsPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Reports</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Platform performance — last 6 months</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-subtle)' }}>Policies Sold per Month</p>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <p className="font-sans text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{m.policies}</p>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.policies / maxPolicies) * 100}%` }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-lg"
                  style={{ backgroundColor: i === MONTHLY.length - 1 ? 'var(--green-700)' : 'var(--green-50)', minHeight: 4 }}
                />
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{m.month}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-subtle)' }}>Premium Volume per Month</p>
          <div className="flex flex-col gap-3">
            {MONTHLY.map((m, i) => {
              const maxP = Math.max(...MONTHLY.map((x) => x.premium))
              return (
                <div key={m.month} className="flex items-center gap-3">
                  <p className="font-sans text-[12px] w-8 shrink-0" style={{ color: 'var(--text-muted)' }}>{m.month}</p>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--surface-raised)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.premium / maxP) * 100}%` }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-lg flex items-center px-2"
                      style={{ backgroundColor: i === MONTHLY.length - 1 ? 'var(--green-700)' : 'var(--green-50)' }}
                    />
                  </div>
                  <p className="font-sans font-semibold text-[12px] w-20 text-right shrink-0" style={{ color: 'var(--text-primary)' }}>
                    ₦{(m.premium / 1_000_000).toFixed(1)}M
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top insurers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
            <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Top Insurers by Volume</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {TOP_INSURERS.map((ins, i) => (
              <div key={ins.name} className="flex items-center gap-4 px-5 py-3.5">
                <p className="font-sans font-bold text-[13px] w-4 shrink-0" style={{ color: 'var(--text-muted)' }}>{i + 1}</p>
                <div className="flex-1">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{ins.name}</p>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{ins.policies} policies</p>
                </div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--green-700)' }}>{formatNaira(ins.premium)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product split */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-subtle)' }}>Revenue by Product</p>
          <div className="flex flex-col gap-4">
            {[
              { type: 'motor',    revenue: 42800000, pct: 45 },
              { type: 'medical',  revenue: 28600000, pct: 30 },
              { type: 'business', revenue: 14300000, pct: 15 },
              { type: 'travel',   revenue: 9500000,  pct: 10 },
            ].map((item, i) => {
              const c = PRODUCT_COLORS[item.type]
              return (
                <div key={item.type}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{c.emoji} {c.label}</span>
                    <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>{formatNaira(item.revenue)}</span>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: c.main }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

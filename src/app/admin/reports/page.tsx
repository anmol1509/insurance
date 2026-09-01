'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import { PRODUCT_COLORS } from '@/lib/mockData'

type Period = '6m' | '12m' | 'ytd'

const MONTHLY_12 = [
  { month: 'Sep', policies: 76,  premium: 6100000 },
  { month: 'Oct', policies: 82,  premium: 6800000 },
  { month: 'Nov', policies: 89,  premium: 7200000 },
  { month: 'Dec', policies: 104, premium: 8900000 },
  { month: 'Jan', policies: 118, premium: 9800000 },
  { month: 'Feb', policies: 97,  premium: 8100000 },
  { month: 'Mar', policies: 132, premium: 11200000 },
  { month: 'Apr', policies: 145, premium: 12400000 },
  { month: 'May', policies: 129, premium: 11800000 },
  { month: 'Jun', policies: 138, premium: 12100000 },
  { month: 'Jul', policies: 151, premium: 13600000 },
  { month: 'Aug', policies: 162, premium: 14900000 },
]

const PERIODS: { key: Period; label: string; slice: number }[] = [
  { key: '6m', label: 'Last 6 months', slice: 6 },
  { key: '12m', label: 'Last 12 months', slice: 12 },
  { key: 'ytd', label: 'Year to date', slice: 8 },
]

const TOP_INSURERS = [
  { name: 'NSIA Insurance',            policies: 342, premium: 29400000 },
  { name: 'Tangerine Insurance',       policies: 268, premium: 21800000 },
  { name: 'AIICO Insurance',           policies: 198, premium: 16200000 },
  { name: 'Fortis Global Insurance',   policies: 121, premium: 9600000 },
]

const REVENUE_BY_PRODUCT = [
  { type: 'motor',    revenue: 42800000, pct: 45 },
  { type: 'medical',  revenue: 28600000, pct: 30 },
  { type: 'business', revenue: 14300000, pct: 15 },
  { type: 'travel',   revenue: 9500000,  pct: 10 },
]

function exportCsv(monthly: typeof MONTHLY_12) {
  const rows = [
    ['Month', 'Policies Sold', 'Premium Volume (NGN)'],
    ...monthly.map((m) => [m.month, String(m.policies), String(m.premium)]),
  ]
  const csv = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `shopinsurance-report-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>('6m')

  const monthly = useMemo(() => {
    const cfg = PERIODS.find((p) => p.key === period)!
    return MONTHLY_12.slice(-cfg.slice)
  }, [period])

  const maxPolicies = Math.max(...monthly.map((m) => m.policies))
  const maxPremium = Math.max(...monthly.map((m) => m.premium))

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Reports</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Platform performance — {PERIODS.find((p) => p.key === period)?.label.toLowerCase()}</p>
        </div>
        <button type="button" onClick={() => exportCsv(monthly)}
          className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{ backgroundColor: 'var(--green-700)' }}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {PERIODS.map((p) => (
          <button key={p.key} type="button" onClick={() => setPeriod(p.key)}
            className="px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
            style={{ backgroundColor: period === p.key ? 'var(--green-700)' : 'white', borderColor: period === p.key ? 'var(--green-700)' : 'var(--border-default)', color: period === p.key ? 'white' : 'var(--text-secondary)' }}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Bar chart */}
        <motion.div key={`policies-${period}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-subtle)' }}>Policies Sold per Month</p>
          <div className="flex items-end gap-3 h-40">
            {monthly.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1" title={`${m.policies} policies in ${m.month}`}>
                <p className="font-sans text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{m.policies}</p>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.policies / maxPolicies) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-lg"
                  style={{ backgroundColor: i === monthly.length - 1 ? 'var(--green-700)' : 'var(--green-50)', minHeight: 4 }}
                />
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{m.month}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium chart */}
        <motion.div key={`premium-${period}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-subtle)' }}>Premium Volume per Month</p>
          <div className="flex flex-col gap-3">
            {monthly.map((m, i) => (
              <div key={m.month} className="flex items-center gap-3">
                <p className="font-sans text-[12px] w-8 shrink-0" style={{ color: 'var(--text-muted)' }}>{m.month}</p>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--surface-raised)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(m.premium / maxPremium) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-lg flex items-center px-2"
                    style={{ backgroundColor: i === monthly.length - 1 ? 'var(--green-700)' : 'var(--green-50)' }}
                  />
                </div>
                <p className="font-sans font-semibold text-[12px] w-20 text-right shrink-0" style={{ color: 'var(--text-primary)' }}>
                  ₦{(m.premium / 1_000_000).toFixed(1)}M
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top insurers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
            <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Top Insurers by Volume</p>
            <Link href="/admin/insurers" className="font-sans font-semibold text-[12px] hover:underline" style={{ color: 'var(--green-700)' }}>View all →</Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {TOP_INSURERS.map((ins, i) => (
              <Link key={ins.name} href="/admin/insurers" className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface-raised)] transition-colors">
                <p className="font-sans font-bold text-[13px] w-4 shrink-0" style={{ color: 'var(--text-muted)' }}>{i + 1}</p>
                <div className="flex-1">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{ins.name}</p>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{ins.policies} policies</p>
                </div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--green-700)' }}>{formatNaira(ins.premium)}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Product split */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="rounded-2xl border p-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-subtle)' }}>Revenue by Product</p>
          <div className="flex flex-col gap-4">
            {REVENUE_BY_PRODUCT.map((item, i) => {
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

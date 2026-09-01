'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { mockPolicies, mockClaims, mockDocuments } from '@/lib/mockData'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'
import { TrendingUp, AlertTriangle, Zap, Bell } from 'lucide-react'

// ─── Static data ────────────────────────────────────────────────────────────

const ADMIN_STATS = [
  { label: 'Total Policies',  value: '1,284',  delta: '+12 this month',       color: 'var(--green-700)', bg: 'var(--green-50)', href: '/admin/policies' },
  { label: 'Premium Volume',  value: '₦94.2M', delta: '+₦8.1M this month',   color: '#7C3AED',          bg: '#F5F3FF',         href: '/admin/reports' },
  { label: 'Open Claims',     value: '23',     delta: '4 pending approval',   color: '#DC2626',          bg: '#FEF2F2',         href: '/admin/claims' },
  { label: 'New Users (30d)', value: '318',    delta: '+22% vs last month',   color: '#0284C7',          bg: '#F0F9FF',         href: '/admin/users' },
]

const REVENUE_DATA = [
  { month: 'Nov', premium: 72.4, claims: 18.2 },
  { month: 'Dec', premium: 81.1, claims: 22.4 },
  { month: 'Jan', premium: 68.3, claims: 15.1 },
  { month: 'Feb', premium: 89.7, claims: 19.8 },
  { month: 'Mar', premium: 94.2, claims: 23.1 },
  { month: 'Apr', premium: 88.5, claims: 20.4 },
]

const FUNNEL_DATA = [
  { label: 'Quotes Started',     count: 2847, pct: 100, color: '#7C3AED' },
  { label: 'Step 2 Reached',     count: 2031, pct: 71,  color: '#7C3AED' },
  { label: 'Quote Generated',    count: 1589, pct: 56,  color: '#059669' },
  { label: 'Plan Selected',      count: 892,  pct: 31,  color: '#059669' },
  { label: 'Payment Initiated',  count: 634,  pct: 22,  color: '#D97706' },
  { label: 'Policy Issued',      count: 481,  pct: 17,  color: '#D97706' },
]

const RECENT_CLAIMS = [
  { id: 'CLM-2025-0921', user: 'Emeka Okonkwo',    type: 'Motor – Accidental',         amount: 320000, status: 'under_review' as const },
  { id: 'CLM-2025-0908', user: 'Ngozi Adeyemi',    type: 'Medical – Hospitalization',   amount: 145000, status: 'submitted'    as const },
  { id: 'CLM-2025-0887', user: 'Chukwuemeka Ibe',  type: 'Travel – Trip Cancel',        amount: 85000,  status: 'approved'     as const },
  { id: 'CLM-2025-0871', user: 'Fatima Bello',     type: 'Business – Fire',             amount: 550000, status: 'settled'      as const },
]

const STATUS_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending'> = {
  submitted:    'status-pending',
  under_review: 'status-expiring',
  approved:     'status-active',
  settled:      'status-active',
  rejected:     'status-expired',
}
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved', settled: 'Settled', rejected: 'Rejected',
}

const ALERTS = [
  {
    icon: '🔴',
    borderColor: '#DC2626',
    bg: '#FEF2F2',
    text: 'High-value claim pending review — CLM-2025-0921 · ₦550,000',
    action: 'Review →',
    href: '/admin/claims',
  },
  {
    icon: '🟡',
    borderColor: '#D97706',
    bg: '#FFFBEB',
    text: 'Motor policy expiring unrenewed — 47 policies expire within 7 days',
    action: 'Send reminders →',
    href: '/admin/policies',
  },
  {
    icon: '🔵',
    borderColor: '#0284C7',
    bg: '#F0F9FF',
    text: 'Some motor insurers are running in demo mode pending real API credentials',
    action: 'Check integrations →',
    href: '/admin/integrations',
  },
]

// ─── Revenue Chart ───────────────────────────────────────────────────────────

const BAR_AREA_HEIGHT = 140  // px — tallest bar fills this
const Y_MAX = 100

function RevenueChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const yLabels = [100, 75, 50, 25, 0]

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={15} style={{ color: '#7C3AED' }} />
          <div>
            <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
              Monthly Premium Volume
            </p>
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Last 6 months</p>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#7C3AED' }} />
            Premium (₦M)
          </span>
          <span className="flex items-center gap-1.5 font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#F97316' }} />
            Claims (₦M)
          </span>
        </div>
      </div>

      {/* Chart area */}
      <div ref={ref} className="px-5 pt-4 pb-5">
        <div className="flex gap-2 items-end">
          {/* Y-axis */}
          <div
            className="flex flex-col justify-between shrink-0 pb-6"
            style={{ height: BAR_AREA_HEIGHT + 24, width: 28 }}
          >
            {yLabels.map((v) => (
              <span key={v} className="font-sans text-[10px] text-right block leading-none" style={{ color: 'var(--text-muted)' }}>
                {v}
              </span>
            ))}
          </div>

          {/* Bar groups */}
          <div className="flex-1 flex items-end gap-1">
            {REVENUE_DATA.map((d, i) => {
              const premH = (d.premium / Y_MAX) * BAR_AREA_HEIGHT
              const claimH = (d.claims / Y_MAX) * BAR_AREA_HEIGHT
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-0">
                  {/* Bars wrapper */}
                  <div className="flex items-end gap-0.5 w-full" style={{ height: BAR_AREA_HEIGHT }}>
                    {/* Premium bar */}
                    <div className="flex-1 flex flex-col items-center justify-end" style={{ height: BAR_AREA_HEIGHT }}>
                      <span
                        className="font-sans font-semibold text-[9px] mb-0.5 leading-none"
                        style={{ color: '#7C3AED' }}
                      >
                        {d.premium}
                      </span>
                      <motion.div
                        className="w-full rounded-t-sm"
                        style={{ backgroundColor: '#7C3AED' }}
                        initial={{ height: 0 }}
                        animate={inView ? { height: premH } : { height: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                      />
                    </div>
                    {/* Claims bar */}
                    <div className="flex-1 flex flex-col items-center justify-end" style={{ height: BAR_AREA_HEIGHT }}>
                      <span
                        className="font-sans font-semibold text-[9px] mb-0.5 leading-none"
                        style={{ color: '#F97316' }}
                      >
                        {d.claims}
                      </span>
                      <motion.div
                        className="w-full rounded-t-sm"
                        style={{ backgroundColor: '#F97316' }}
                        initial={{ height: 0 }}
                        animate={inView ? { height: claimH } : { height: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.05, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  {/* Month label */}
                  <p className="font-sans font-medium text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    {d.month}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Conversion Funnel ───────────────────────────────────────────────────────

function ConversionFunnel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
      >
        <Zap size={15} style={{ color: '#059669' }} />
        <div>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
            Quote Conversion Funnel
          </p>
          <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Last 30 days</p>
        </div>
      </div>

      {/* Funnel rows */}
      <div ref={ref} className="p-5 flex flex-col gap-3">
        {FUNNEL_DATA.map((row, i) => (
          <div key={row.label}>
            {/* Row header */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-sans font-medium text-[12px]" style={{ color: 'var(--text-primary)' }}>
                  {row.label}
                </span>
                <span className="font-sans text-[11px] ml-1.5" style={{ color: 'var(--text-muted)' }}>
                  {row.count.toLocaleString()}
                </span>
              </div>
              <span
                className="font-sans font-bold text-[11px] px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: row.color + '18', color: row.color }}
              >
                {row.pct}%
              </span>
            </div>
            {/* Bar track */}
            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: row.color }}
                initial={{ width: '0%' }}
                animate={inView ? { width: `${row.pct}%` } : { width: '0%' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}

        {/* Overall rate */}
        <div
          className="mt-2 flex items-center justify-center py-2 rounded-xl"
          style={{ backgroundColor: '#F5F3FF' }}
        >
          <p className="font-sans font-semibold text-[12px]" style={{ color: '#7C3AED' }}>
            17% end-to-end conversion
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Alert Center ────────────────────────────────────────────────────────────

function AlertCenter() {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
      >
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: '#DC2626' }} />
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
            Action Required
          </p>
          <span
            className="font-sans font-bold text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#DC2626', color: 'white' }}
          >
            3
          </span>
        </div>
      </div>

      {/* Alert rows */}
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {ALERTS.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-4 px-5 py-3.5"
            style={{ borderLeft: `3px solid ${alert.borderColor}`, backgroundColor: alert.bg + '66' }}
          >
            <span className="text-[16px] shrink-0">{alert.icon}</span>
            <p className="flex-1 font-sans text-[13px]" style={{ color: 'var(--text-primary)' }}>
              {alert.text}
            </p>
            <a
              href={alert.href}
              className="shrink-0 font-sans font-semibold text-[12px] whitespace-nowrap hover:underline"
              style={{ color: alert.borderColor }}
            >
              {alert.action}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-display font-extrabold text-[26px] tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Admin Overview
        </h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          ShopInsurance operations dashboard
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {ADMIN_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={s.href}
              className="block rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
            >
              <p
                className="font-sans font-medium text-[11px] uppercase tracking-[0.07em] mb-1.5"
                style={{ color: 'var(--text-subtle)' }}
              >
                {s.label}
              </p>
              <p
                className="font-display font-bold text-[28px] leading-none mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {s.value}
              </p>
              <span
                className="font-sans text-[11px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                {s.delta}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart + Conversion funnel */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ConversionFunnel />
        </div>
      </div>

      {/* Recent Claims + Policies by Type */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Recent claims */}
        <div
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
          >
            <p
              className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]"
              style={{ color: 'var(--text-subtle)' }}
            >
              Recent Claims
            </p>
            <Link
              href="/admin/claims"
              className="font-sans font-semibold text-[12px] hover:underline"
              style={{ color: '#DC2626' }}
            >
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {RECENT_CLAIMS.map((c) => (
              <Link
                key={c.id}
                href="/admin/claims"
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface-raised)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                    {c.user}
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {c.type} · {c.id}
                  </p>
                </div>
                <p className="font-sans font-semibold text-[13px] shrink-0" style={{ color: 'var(--text-primary)' }}>
                  {formatNaira(c.amount)}
                </p>
                <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Policy breakdown */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
        >
          <div
            className="px-5 py-3.5 border-b"
            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
          >
            <p
              className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]"
              style={{ color: 'var(--text-subtle)' }}
            >
              Policies by Type
            </p>
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
                <Link key={item.type} href="/admin/policies" className="block hover:opacity-80 transition-opacity">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>
                      {c.emoji} {c.label}
                    </span>
                    <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${item.pct}%`, backgroundColor: c.main }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Alert Center */}
      <AlertCenter />
    </div>
  )
}

'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Clock } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'

type Status = 'pending' | 'reminded' | 'renewed' | 'lapsed'
type Window = 'all' | '7' | '30' | '60'

interface Renewal {
  id: string
  ref: string
  customer: string
  productType: 'motor' | 'medical' | 'travel' | 'business'
  name: string
  insurer: string
  premium: number
  expiryDate: string
  remindersSent: number
  status: Status
}

const TODAY = new Date('2026-08-29')

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - TODAY.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

const INITIAL_RENEWALS: Renewal[] = [
  { id: 'RNW-501', ref: 'SI-2025-042983', customer: 'Emeka Okonkwo', productType: 'motor', name: 'Toyota Camry 2020', insurer: 'AIICO Insurance', premium: 87_500, expiryDate: '2026-09-02', remindersSent: 2, status: 'reminded' },
  { id: 'RNW-498', ref: 'SI-2025-012456', customer: 'Ngozi Adeyemi', productType: 'medical', name: 'Family Health Plan', insurer: 'Hygeia HMO', premium: 210_000, expiryDate: '2026-09-05', remindersSent: 1, status: 'reminded' },
  { id: 'RNW-490', ref: 'SI-2025-071122', customer: 'Chukwuemeka Ibe', productType: 'travel', name: 'UK Multi-trip Cover', insurer: 'Tangerine Life', premium: 54_000, expiryDate: '2026-09-08', remindersSent: 0, status: 'pending' },
  { id: 'RNW-483', ref: 'SI-2025-033218', customer: 'Fatima Bello', productType: 'business', name: 'Okonkwo & Sons Office', insurer: 'NSIA Insurance', premium: 95_000, expiryDate: '2026-09-14', remindersSent: 0, status: 'pending' },
  { id: 'RNW-476', ref: 'SI-2025-051009', customer: 'Tunde Fashola', productType: 'motor', name: 'Toyota Hilux 2021', insurer: 'Fortis Global', premium: 61_000, expiryDate: '2026-09-20', remindersSent: 0, status: 'pending' },
  { id: 'RNW-460', ref: 'SI-2025-029341', customer: 'Amara Osei', productType: 'medical', name: 'Individual Standard Plan', insurer: 'Hygeia HMO', premium: 98_000, expiryDate: '2026-09-24', remindersSent: 0, status: 'pending' },
  { id: 'RNW-441', ref: 'SI-2025-018820', customer: 'Grace Umeh', productType: 'motor', name: 'Honda CR-V 2019', insurer: 'Tangerine Motor', premium: 78_000, expiryDate: '2026-08-25', remindersSent: 3, status: 'lapsed' },
  { id: 'RNW-432', ref: 'SI-2025-009911', customer: 'Segun Alabi', productType: 'motor', name: 'Mercedes C200 2020', insurer: 'AIICO Insurance', premium: 145_000, expiryDate: '2026-08-20', remindersSent: 2, status: 'renewed' },
]

const STATUS_VARIANT: Record<Status, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending'> = {
  pending: 'status-pending', reminded: 'status-expiring', renewed: 'status-active', lapsed: 'status-expired',
}
const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pending', reminded: 'Reminded', renewed: 'Renewed', lapsed: 'Lapsed',
}

const WINDOWS: { key: Window; label: string }[] = [
  { key: 'all', label: 'All upcoming' },
  { key: '7', label: 'Next 7 days' },
  { key: '30', label: 'Next 30 days' },
  { key: '60', label: 'Next 60 days' },
]

export default function AdminRenewalsPage() {
  const [renewals, setRenewals] = useState<Renewal[]>(INITIAL_RENEWALS)
  const [windowFilter, setWindowFilter] = useState<Window>('30')

  const shown = renewals.filter((r) => {
    if (windowFilter === 'all') return true
    const days = daysUntil(r.expiryDate)
    return days <= Number(windowFilter)
  })

  function sendReminder(id: string) {
    setRenewals((prev) => prev.map((r) => r.id === id ? { ...r, remindersSent: r.remindersSent + 1, status: 'reminded' } : r))
  }
  function markRenewed(id: string) {
    setRenewals((prev) => prev.map((r) => r.id === id ? { ...r, status: 'renewed' } : r))
  }

  const lapsingSoon = renewals.filter((r) => r.status !== 'renewed' && r.status !== 'lapsed' && daysUntil(r.expiryDate) <= 7).length
  const lapsed = renewals.filter((r) => r.status === 'lapsed').length
  const atRiskPremium = renewals
    .filter((r) => r.status !== 'renewed' && r.status !== 'lapsed')
    .reduce((sum, r) => sum + r.premium, 0)

  const summaryStats = [
    { label: 'Expiring ≤ 7 days', value: lapsingSoon.toString(), color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Lapsed (unrenewed)', value: lapsed.toString(), color: '#991B1B', bg: '#FEE2E2' },
    { label: 'Premium at Risk', value: formatNaira(atRiskPremium), color: '#D97706', bg: '#FFFBEB' },
  ]

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Renewals</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Track upcoming policy expiries and follow up before they lapse</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {summaryStats.map((s) => (
          <div key={s.label} className="rounded-2xl border p-4" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <p className="font-sans font-medium text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>{s.label}</p>
            <p className="font-display font-bold text-[22px] leading-none" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {WINDOWS.map((w) => (
          <button key={w.key} type="button" onClick={() => setWindowFilter(w.key)}
            className="px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
            style={{ backgroundColor: windowFilter === w.key ? '#0284C7' : 'white', borderColor: windowFilter === w.key ? '#0284C7' : 'var(--border-default)', color: windowFilter === w.key ? 'white' : 'var(--text-secondary)' }}>
            {w.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1.2fr_1fr_100px_100px_110px_100px_170px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          {['Policy', 'Customer', 'Premium', 'Expires', 'Days left', 'Status', 'Actions'].map((h) => (
            <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
          ))}
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {shown.map((r, i) => {
            const c = PRODUCT_COLORS[r.productType]
            const days = daysUntil(r.expiryDate)
            const urgent = days <= 7 && r.status !== 'renewed' && r.status !== 'lapsed'
            return (
              <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_100px_100px_110px_100px_170px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
                <div>
                  <span className="font-sans font-medium text-[12px]" style={{ color: c.text }}>{c.emoji} {c.label}</span>
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.ref} · {r.insurer}</p>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{r.customer}</p>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(r.premium)}</p>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{new Date(r.expiryDate).toLocaleDateString('en-NG')}</p>
                <div className="flex items-center gap-1">
                  {urgent && <Clock className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />}
                  <span className="font-sans font-semibold text-[13px]" style={{ color: urgent ? '#DC2626' : 'var(--text-secondary)' }}>
                    {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                  </span>
                </div>
                <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                <div className="flex items-center gap-2">
                  {r.status !== 'renewed' && r.status !== 'lapsed' && (
                    <>
                      <button type="button" title="Send reminder" onClick={() => sendReminder(r.id)}
                        className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border font-sans text-[11px] font-medium transition-colors hover:bg-[#F0F9FF]"
                        style={{ borderColor: 'var(--border-default)', color: '#0284C7' }}>
                        <Bell className="w-3.5 h-3.5" /> Remind {r.remindersSent > 0 && `(${r.remindersSent})`}
                      </button>
                      <button type="button" title="Mark renewed" onClick={() => markRenewed(r.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#DCFCE7] shrink-0"
                        style={{ borderColor: 'var(--border-default)', color: '#16A34A' }}>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {r.status === 'renewed' && (
                    <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Renewed ✓</span>
                  )}
                  {r.status === 'lapsed' && (
                    <span className="font-sans text-[11px]" style={{ color: '#991B1B' }}>{r.remindersSent} reminders sent</span>
                  )}
                </div>
              </motion.div>
            )
          })}
          {shown.length === 0 && (
            <div className="px-5 py-10 text-center font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
              No renewals in this window.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

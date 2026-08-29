'use client'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Clock, Search, ArrowUpDown } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'
import Drawer from '@/components/admin/Drawer'
import Pagination from '@/components/admin/Pagination'

type Status = 'pending' | 'reminded' | 'renewed' | 'lapsed'
type Window = 'all' | '7' | '30' | '60'
type SortKey = 'expiry' | 'premium'

interface ReminderLog { at: string; channel: string }

interface Renewal {
  id: string
  ref: string
  customer: string
  productType: 'motor' | 'medical' | 'travel' | 'business'
  name: string
  insurer: string
  premium: number
  expiryDate: string
  reminders: ReminderLog[]
  status: Status
}

const PAGE_SIZE = 5
const TODAY = new Date('2026-08-29')

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - TODAY.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

const INITIAL_RENEWALS: Renewal[] = [
  { id: 'RNW-501', ref: 'SI-2025-042983', customer: 'Emeka Okonkwo', productType: 'motor', name: 'Toyota Camry 2020', insurer: 'AIICO Insurance', premium: 87_500, expiryDate: '2026-09-02',
    reminders: [{ at: '2026-08-19', channel: 'SMS' }, { at: '2026-08-26', channel: 'Email' }], status: 'reminded' },
  { id: 'RNW-498', ref: 'SI-2025-012456', customer: 'Ngozi Adeyemi', productType: 'medical', name: 'Family Health Plan', insurer: 'Hygeia HMO', premium: 210_000, expiryDate: '2026-09-05',
    reminders: [{ at: '2026-08-22', channel: 'Email' }], status: 'reminded' },
  { id: 'RNW-490', ref: 'SI-2025-071122', customer: 'Chukwuemeka Ibe', productType: 'travel', name: 'UK Multi-trip Cover', insurer: 'Tangerine Life', premium: 54_000, expiryDate: '2026-09-08',
    reminders: [], status: 'pending' },
  { id: 'RNW-483', ref: 'SI-2025-033218', customer: 'Fatima Bello', productType: 'business', name: 'Okonkwo & Sons Office', insurer: 'NSIA Insurance', premium: 95_000, expiryDate: '2026-09-14',
    reminders: [], status: 'pending' },
  { id: 'RNW-476', ref: 'SI-2025-051009', customer: 'Tunde Fashola', productType: 'motor', name: 'Toyota Hilux 2021', insurer: 'Fortis Global', premium: 61_000, expiryDate: '2026-09-20',
    reminders: [], status: 'pending' },
  { id: 'RNW-460', ref: 'SI-2025-029341', customer: 'Amara Osei', productType: 'medical', name: 'Individual Standard Plan', insurer: 'Hygeia HMO', premium: 98_000, expiryDate: '2026-09-24',
    reminders: [], status: 'pending' },
  { id: 'RNW-441', ref: 'SI-2025-018820', customer: 'Grace Umeh', productType: 'motor', name: 'Honda CR-V 2019', insurer: 'Tangerine Motor', premium: 78_000, expiryDate: '2026-08-25',
    reminders: [{ at: '2026-08-11', channel: 'SMS' }, { at: '2026-08-18', channel: 'Email' }, { at: '2026-08-24', channel: 'Call' }], status: 'lapsed' },
  { id: 'RNW-432', ref: 'SI-2025-009911', customer: 'Segun Alabi', productType: 'motor', name: 'Mercedes C200 2020', insurer: 'AIICO Insurance', premium: 145_000, expiryDate: '2026-08-20',
    reminders: [{ at: '2026-08-06', channel: 'SMS' }, { at: '2026-08-13', channel: 'Email' }], status: 'renewed' },
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

function RenewalDrawerContent({ renewal, onRemind, onRenew }: { renewal: Renewal; onRemind: () => void; onRenew: () => void }) {
  const c = PRODUCT_COLORS[renewal.productType]
  const days = daysUntil(renewal.expiryDate)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-sans font-medium text-[12px]" style={{ color: c.text }}>{c.emoji} {c.label}</span>
        <p className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{renewal.name}</p>
        <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{renewal.ref} · {renewal.insurer}</p>
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <Badge variant={STATUS_VARIANT[renewal.status]}>{STATUS_LABEL[renewal.status]}</Badge>
          <span className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(renewal.premium)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Customer</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{renewal.customer}</p>
        </div>
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Expires</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            {new Date(renewal.expiryDate).toLocaleDateString('en-NG')} ({days < 0 ? `${Math.abs(days)}d ago` : `in ${days}d`})
          </p>
        </div>
      </div>

      {renewal.status !== 'renewed' && (
        <div className="flex gap-2">
          <button type="button" onClick={onRemind}
            className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl border font-sans font-medium text-[12px] transition-colors hover:bg-[#F0F9FF]"
            style={{ borderColor: 'var(--border-default)', color: '#0284C7' }}>
            <Bell className="w-3.5 h-3.5" /> Send reminder
          </button>
          <button type="button" onClick={onRenew}
            className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-white font-sans font-medium text-[12px] transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#16A34A' }}>
            <Check className="w-3.5 h-3.5" /> Mark renewed
          </button>
        </div>
      )}

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Reminder history</p>
        {renewal.reminders.length === 0 ? (
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>No reminders sent yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {renewal.reminders.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <Bell className="w-3.5 h-3.5 shrink-0" style={{ color: '#0284C7' }} />
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{r.channel} reminder</p>
                <p className="font-sans text-[11px] ml-auto shrink-0" style={{ color: 'var(--text-muted)' }}>{new Date(r.at).toLocaleDateString('en-NG')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminRenewalsPage() {
  const [renewals, setRenewals] = useState<Renewal[]>(INITIAL_RENEWALS)
  const [windowFilter, setWindowFilter] = useState<Window>('30')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('expiry')
  const [sortDesc, setSortDesc] = useState(false)
  const [page, setPage] = useState(1)
  const [openRenewal, setOpenRenewal] = useState<Renewal | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return renewals
      .filter((r) => windowFilter === 'all' || daysUntil(r.expiryDate) <= Number(windowFilter))
      .filter((r) => !q || r.customer.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const dir = sortDesc ? -1 : 1
        if (sortKey === 'premium') return (a.premium - b.premium) * dir
        return (new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()) * dir
      })
  }, [renewals, windowFilter, query, sortKey, sortDesc])

  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function sendReminder(id: string) {
    setRenewals((prev) => prev.map((r) => r.id === id
      ? { ...r, reminders: [...r.reminders, { at: new Date().toISOString().slice(0, 10), channel: 'Email' }], status: 'reminded' }
      : r))
    setOpenRenewal((prev) => prev && prev.id === id
      ? { ...prev, reminders: [...prev.reminders, { at: new Date().toISOString().slice(0, 10), channel: 'Email' }], status: 'reminded' }
      : prev)
  }
  function markRenewed(id: string) {
    setRenewals((prev) => prev.map((r) => r.id === id ? { ...r, status: 'renewed' } : r))
    setOpenRenewal((prev) => prev && prev.id === id ? { ...prev, status: 'renewed' } : prev)
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc((v) => !v)
    else { setSortKey(key); setSortDesc(false) }
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

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 flex-wrap flex-1">
          {WINDOWS.map((w) => (
            <button key={w.key} type="button" onClick={() => { setWindowFilter(w.key); setPage(1) }}
              className="px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
              style={{ backgroundColor: windowFilter === w.key ? '#0284C7' : 'white', borderColor: windowFilter === w.key ? '#0284C7' : 'var(--border-default)', color: windowFilter === w.key ? 'white' : 'var(--text-secondary)' }}>
              {w.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} placeholder="Search customer, ref…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border font-sans text-[13px] outline-none"
            style={{ borderColor: 'var(--border-default)' }} />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1.2fr_1fr_100px_100px_110px_100px_170px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Policy</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Customer</p>
          <button type="button" onClick={() => toggleSort('premium')} className="flex items-center gap-1 font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: sortKey === 'premium' ? '#0284C7' : 'var(--text-subtle)' }}>
            Premium <ArrowUpDown className="w-3 h-3" />
          </button>
          <button type="button" onClick={() => toggleSort('expiry')} className="flex items-center gap-1 font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: sortKey === 'expiry' ? '#0284C7' : 'var(--text-subtle)' }}>
            Expires <ArrowUpDown className="w-3 h-3" />
          </button>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Days left</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Status</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Actions</p>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {shown.map((r, i) => {
            const c = PRODUCT_COLORS[r.productType]
            const days = daysUntil(r.expiryDate)
            const urgent = days <= 7 && r.status !== 'renewed' && r.status !== 'lapsed'
            return (
              <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => setOpenRenewal(r)}
                className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_100px_100px_110px_100px_170px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center cursor-pointer">
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
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {r.status !== 'renewed' && r.status !== 'lapsed' && (
                    <>
                      <button type="button" title="Send reminder" onClick={() => sendReminder(r.id)}
                        className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border font-sans text-[11px] font-medium transition-colors hover:bg-[#F0F9FF]"
                        style={{ borderColor: 'var(--border-default)', color: '#0284C7' }}>
                        <Bell className="w-3.5 h-3.5" /> Remind {r.reminders.length > 0 && `(${r.reminders.length})`}
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
                    <span className="font-sans text-[11px]" style={{ color: '#991B1B' }}>{r.reminders.length} reminders sent</span>
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

        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </div>

      <Drawer
        open={!!openRenewal}
        onClose={() => setOpenRenewal(null)}
        title={openRenewal?.name ?? ''}
        subtitle={openRenewal?.ref}
        accent="#0284C7"
      >
        {openRenewal && (
          <RenewalDrawerContent
            renewal={openRenewal}
            onRemind={() => sendReminder(openRenewal.id)}
            onRenew={() => markRenewed(openRenewal.id)}
          />
        )}
      </Drawer>
    </div>
  )
}

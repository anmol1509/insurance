'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown, Search, ArrowUpDown, FileText, Plus, Loader2 } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import Drawer from '@/components/admin/Drawer'
import Pagination from '@/components/admin/Pagination'
import { createClaimRecord, fetchClaims, updateClaimRecord } from '@/lib/db/browser'
import type { ClaimInput, ClaimRecord, ClaimStatus } from '@/lib/db/claims'

type StatusFilter = 'all' | ClaimStatus
type SortKey = 'date' | 'amount'

const DEPARTMENTS = [
  'Motor Claims Team',
  'Medical Claims Team',
  'Travel Claims Team',
  'Business Claims Team',
  'Legal Department',
  'Claims Manager',
  'Finance & Settlements',
]

/** Shown only when no database is configured, so the page still demos fully — see docs/policies-dashboard.md. */
const FALLBACK_CLAIMS: ClaimRecord[] = [
  { id: 'fallback-1', code: 'CLM-2025-0921', claimantName: 'Emeka Okonkwo', policyNumber: 'SI-2025-042983', claimType: 'Motor – Accidental Damage', amount: 320000, claimDate: '2025-03-10', status: 'under_review', assignedTo: 'Motor Claims Team',
    description: 'Front bumper and bonnet damage from collision at Lekki toll gate.',
    documents: ['Police report.pdf', 'Repair estimate.pdf', 'Vehicle photos.zip'],
    createdAt: '2025-03-10', updatedAt: '2025-03-14',
    timeline: [
      { date: '2025-03-10', event: 'Claim submitted', done: true },
      { date: '2025-03-11', event: 'Acknowledged by AIICO Insurance', done: true },
      { date: '2025-03-14', event: 'Loss adjuster inspection scheduled', done: true },
      { date: '—', event: 'Approval decision', done: false },
      { date: '—', event: 'Settlement', done: false },
    ] },
  { id: 'fallback-2', code: 'CLM-2025-0908', claimantName: 'Ngozi Adeyemi', policyNumber: 'SI-2025-012456', claimType: 'Medical – Hospitalisation', amount: 145000, claimDate: '2025-04-20', status: 'submitted', assignedTo: null,
    description: 'Child admitted for malaria and typhoid treatment at Lagos Island General Hospital.',
    documents: ['Hospital invoice.pdf', 'Discharge summary.pdf'],
    createdAt: '2025-04-20', updatedAt: '2025-04-20',
    timeline: [
      { date: '2025-04-20', event: 'Claim submitted', done: true },
      { date: '—', event: 'Acknowledged by insurer', done: false },
      { date: '—', event: 'Documents under medical review', done: false },
      { date: '—', event: 'Approval decision', done: false },
      { date: '—', event: 'Settlement', done: false },
    ] },
  { id: 'fallback-3', code: 'CLM-2025-0887', claimantName: 'Chukwuemeka Ibe', policyNumber: 'SI-2025-071122', claimType: 'Travel – Trip Cancellation', amount: 85000, claimDate: '2025-04-15', status: 'approved', assignedTo: 'Travel Claims Team',
    description: 'Trip to Paris cancelled due to visa rejection; claiming pre-paid flight and hotel costs.',
    documents: ['Visa rejection letter.pdf', 'Booking receipts.pdf'],
    createdAt: '2025-04-15', updatedAt: '2025-04-22',
    timeline: [
      { date: '2025-04-15', event: 'Claim submitted', done: true },
      { date: '2025-04-16', event: 'Acknowledged by Tangerine Life', done: true },
      { date: '2025-04-19', event: 'Documents verified', done: true },
      { date: '2025-04-22', event: 'Claim approved — ₦85,000', done: true },
      { date: '—', event: 'Settlement', done: false },
    ] },
  { id: 'fallback-4', code: 'CLM-2025-0871', claimantName: 'Fatima Bello', policyNumber: 'SI-2025-033218', claimType: 'Business – Fire Damage', amount: 550000, claimDate: '2025-03-28', status: 'settled', assignedTo: 'Finance & Settlements',
    description: 'Electrical fault caused fire damage to stock room at Okonkwo & Sons office.',
    documents: ['Fire service report.pdf', 'Loss adjuster report.pdf', 'Stock valuation.xlsx'],
    createdAt: '2025-03-28', updatedAt: '2025-04-12',
    timeline: [
      { date: '2025-03-28', event: 'Claim submitted', done: true },
      { date: '2025-03-29', event: 'Acknowledged by NSIA Insurance', done: true },
      { date: '2025-04-02', event: 'Loss adjuster inspection completed', done: true },
      { date: '2025-04-08', event: 'Claim approved — ₦550,000', done: true },
      { date: '2025-04-12', event: 'Payment settled', done: true },
    ] },
  { id: 'fallback-5', code: 'CLM-2025-0853', claimantName: 'Tunde Fashola', policyNumber: 'SI-2025-051009', claimType: 'Motor – Theft', amount: 1200000, claimDate: '2025-03-15', status: 'rejected', assignedTo: 'Legal Department',
    description: 'Reported vehicle theft from Ikeja car park; insurer investigation found policy lapse at time of loss.',
    documents: ['Police report.pdf', 'Investigation findings.pdf'],
    createdAt: '2025-03-15', updatedAt: '2025-03-29',
    timeline: [
      { date: '2025-03-15', event: 'Claim submitted', done: true },
      { date: '2025-03-16', event: 'Acknowledged by Fortis Global Insurance', done: true },
      { date: '2025-03-25', event: 'Investigation completed', done: true },
      { date: '2025-03-29', event: 'Claim rejected — policy lapsed', done: true },
    ] },
  { id: 'fallback-6', code: 'CLM-2025-0844', claimantName: 'Amara Osei', policyNumber: 'SI-2025-029341', claimType: 'Medical – Surgery', amount: 430000, claimDate: '2025-03-01', status: 'settled', assignedTo: 'Medical Claims Team',
    description: 'Emergency appendectomy at Reddington Hospital, Lagos.',
    documents: ['Hospital invoice.pdf', 'Surgery report.pdf', 'Receipt.pdf'],
    createdAt: '2025-03-01', updatedAt: '2025-03-08',
    timeline: [
      { date: '2025-03-01', event: 'Claim submitted', done: true },
      { date: '2025-03-02', event: 'Acknowledged by Hygeia HMO', done: true },
      { date: '2025-03-05', event: 'Claim approved — ₦430,000', done: true },
      { date: '2025-03-08', event: 'Payment settled to hospital', done: true },
    ] },
]

const STATUS_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending'> = {
  submitted: 'status-pending', under_review: 'status-expiring', approved: 'status-active', settled: 'status-active', rejected: 'status-expired',
}
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved', settled: 'Settled', rejected: 'Rejected',
}

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'settled', label: 'Settled' },
  { key: 'rejected', label: 'Rejected' },
]

const PAGE_SIZE = 4

const emptyForm = { claimantName: '', policyNumber: '', claimType: '', amount: '', description: '' }
type FormState = typeof emptyForm

function ClaimFormModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (input: ClaimInput) => Promise<void> }) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    const e: Record<string, string> = {}
    if (!form.claimantName.trim()) e.claimantName = 'Required'
    if (!form.policyNumber.trim()) e.policyNumber = 'Required'
    if (!form.claimType.trim()) e.claimType = 'Required'
    if (!form.amount || isNaN(Number(form.amount.replace(/,/g, '')))) e.amount = 'Enter a valid amount'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    setServerError(null)
    try {
      await onSubmit({
        claimantName: form.claimantName.trim(),
        policyNumber: form.policyNumber.trim(),
        claimType: form.claimType.trim(),
        amount: Number(form.amount.replace(/,/g, '')),
        description: form.description.trim() || null,
        status: 'submitted',
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Could not save this claim.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Add claim</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Claimant name *</label>
            <input type="text" value={form.claimantName} onChange={(e) => set('claimantName', e.target.value)}
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.claimantName ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.claimantName && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.claimantName}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy number *</label>
            <input type="text" value={form.policyNumber} onChange={(e) => set('policyNumber', e.target.value)} placeholder="e.g. SI-2025-042983"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.policyNumber ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.policyNumber && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.policyNumber}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Claim type *</label>
            <input type="text" value={form.claimType} onChange={(e) => set('claimType', e.target.value)} placeholder="e.g. Motor – Accidental Damage"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.claimType ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.claimType && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.claimType}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Claim amount (₦) *</label>
            <input type="text" inputMode="numeric"
              value={form.amount ? Number(form.amount.replace(/,/g, '')).toLocaleString('en-NG') : ''}
              onChange={(e) => set('amount', e.target.value.replace(/,/g, '').replace(/\D/g, ''))}
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.amount ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.amount && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="What happened?"
              className="w-full rounded-xl border-[1.5px] px-3.5 py-2.5 font-sans text-[14px] outline-none resize-none"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
          </div>

          {serverError && (
            <p className="font-sans text-[12px] px-3 py-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}>{serverError}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-default)' }}>
          <button type="button" onClick={onClose}
            className="h-10 px-5 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button type="button" onClick={submit} disabled={saving}
            className="h-10 px-6 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px disabled:opacity-60"
            style={{ backgroundColor: '#DC2626' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add claim
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function AssignDropdown({ claim, onAssign }: { claim: ClaimRecord; onAssign: (dept: string | null) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg border font-sans text-[12px] font-medium transition-colors hover:bg-[var(--surface-raised)]"
        style={{ borderColor: claim.assignedTo ? 'var(--green-700)' : 'var(--border-default)', color: claim.assignedTo ? 'var(--green-700)' : 'var(--text-muted)', backgroundColor: claim.assignedTo ? 'var(--green-50)' : 'white' }}>
        <span className="max-w-[100px] truncate">{claim.assignedTo ?? 'Assign to…'}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 top-full mt-1.5 z-[70] bg-white rounded-xl border shadow-lg py-1 w-52"
              style={{ borderColor: 'var(--border-default)' }}>
              {claim.assignedTo && (
                <button type="button" onClick={() => { onAssign(null); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left font-sans text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  <X className="w-3.5 h-3.5" />
                  Unassign
                </button>
              )}
              {DEPARTMENTS.map((dept) => (
                <button key={dept} type="button" onClick={() => { onAssign(dept); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left font-sans text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ color: claim.assignedTo === dept ? 'var(--green-700)' : 'var(--text-primary)' }}>
                  <span>{dept}</span>
                  {claim.assignedTo === dept && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ClaimDrawerContent({ claim, onAssign }: { claim: ClaimRecord; onAssign: (dept: string | null) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{claim.claimantName}</p>
        <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{claim.claimType} · Policy {claim.policyNumber}</p>
        <div className="flex items-center gap-2 mt-2.5">
          <Badge variant={STATUS_VARIANT[claim.status]}>{STATUS_LABEL[claim.status]}</Badge>
          <span className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(claim.amount)}</span>
        </div>
      </div>

      {claim.description && (
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Description</p>
          <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{claim.description}</p>
        </div>
      )}

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Assigned to</p>
        <AssignDropdown claim={claim} onAssign={onAssign} />
      </div>

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Timeline</p>
        <div className="flex flex-col gap-3">
          {claim.timeline.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: step.done ? 'var(--green-700)' : 'var(--border-subtle)' }}>
                {step.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <div>
                <p className="font-sans text-[13px]" style={{ color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.event}</p>
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {claim.documents.length > 0 && (
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Documents</p>
          <div className="flex flex-col gap-1.5">
            {claim.documents.map((doc) => (
              <div key={doc} className="flex items-center gap-2.5 px-3 py-2 rounded-xl border" style={{ borderColor: 'var(--border-default)' }}>
                <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="font-sans text-[12px] truncate" style={{ color: 'var(--text-secondary)' }}>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<ClaimRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dbMode, setDbMode] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)
  const [openClaim, setOpenClaim] = useState<ClaimRecord | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  async function load() {
    setLoading(true)
    setLoadError(null)
    try {
      const rows = await fetchClaims()
      setClaims(rows)
      setDbMode(true)
    } catch (error) {
      const err = error as { message?: string } & Error
      if (err.message?.toLowerCase().includes('database is configured')) {
        setDbMode(false)
        setClaims(FALLBACK_CLAIMS)
      } else {
        setLoadError(err.message ?? 'Could not load claims.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return claims
      .filter((c) => filter === 'all' || c.status === filter)
      .filter((c) => !q || c.claimantName.toLowerCase().includes(q) || c.policyNumber.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      .sort((a, b) => {
        const dir = sortDesc ? -1 : 1
        if (sortKey === 'amount') return (a.amount - b.amount) * dir
        return (new Date(a.claimDate).getTime() - new Date(b.claimDate).getTime()) * dir
      })
  }, [claims, filter, query, sortKey, sortDesc])

  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleAdd(input: ClaimInput) {
    if (dbMode) {
      const claim = await createClaimRecord(input)
      setClaims((prev) => [claim, ...prev])
    } else {
      const today = new Date().toISOString().slice(0, 10)
      const claim: ClaimRecord = {
        id: `fallback-${Date.now()}`,
        code: `CLM-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        claimantName: input.claimantName,
        policyNumber: input.policyNumber,
        claimType: input.claimType,
        amount: input.amount,
        claimDate: today,
        status: input.status ?? 'submitted',
        assignedTo: input.assignedTo ?? null,
        description: input.description ?? null,
        timeline: [{ date: today, event: 'Claim submitted', done: true }],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setClaims((prev) => [claim, ...prev])
    }
    setShowAdd(false)
  }

  async function updateStatus(id: string, status: ClaimStatus) {
    if (dbMode) {
      const claim = await updateClaimRecord(id, { status })
      setClaims((prev) => prev.map((c) => c.id === id ? claim : c))
      setOpenClaim((prev) => prev && prev.id === id ? claim : prev)
    } else {
      setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
      setOpenClaim((prev) => prev && prev.id === id ? { ...prev, status } : prev)
    }
  }

  async function updateAssignment(id: string, dept: string | null) {
    if (dbMode) {
      const claim = await updateClaimRecord(id, { assignedTo: dept })
      setClaims((prev) => prev.map((c) => c.id === id ? claim : c))
      setOpenClaim((prev) => prev && prev.id === id ? claim : prev)
    } else {
      setClaims((prev) => prev.map((c) => c.id === id ? { ...c, assignedTo: dept } : c))
      setOpenClaim((prev) => prev && prev.id === id ? { ...prev, assignedTo: dept } : prev)
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc((v) => !v)
    else { setSortKey(key); setSortDesc(true) }
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Claims Queue</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{filtered.length} of {claims.length} claims</p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)}
          className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{ backgroundColor: '#DC2626' }}>
          <Plus className="w-4 h-4" />
          Add claim
        </button>
      </div>

      {!dbMode && !loading && (
        <div className="rounded-xl px-4 py-3 mb-5 font-sans text-[12px]" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
          No database configured — showing sample data that resets on refresh. Set <code className="font-mono px-1 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>POSTGRES_URL</code> to make claims persist for real.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 mb-0 flex-wrap flex-1">
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? claims.length : claims.filter((c) => c.status === f.key).length
            return (
              <button key={f.key} type="button" onClick={() => { setFilter(f.key); setPage(1) }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
                style={{ backgroundColor: filter === f.key ? '#DC2626' : 'white', borderColor: filter === f.key ? '#DC2626' : 'var(--border-default)', color: filter === f.key ? 'white' : 'var(--text-secondary)' }}>
                {f.label}
                <span className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-raised)', color: filter === f.key ? 'white' : 'var(--text-muted)' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <div className="relative w-full sm:w-60 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search claimant, policy, ID…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border font-sans text-[13px] outline-none"
            style={{ borderColor: 'var(--border-default)' }}
          />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1fr_1fr_110px_100px_160px_80px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Claimant</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Type</p>
          <button type="button" onClick={() => toggleSort('amount')} className="flex items-center gap-1 font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: sortKey === 'amount' ? '#DC2626' : 'var(--text-subtle)' }}>
            Amount <ArrowUpDown className="w-3 h-3" />
          </button>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Status</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Assigned to</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Actions</p>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Loading claims…</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-12">
              <p className="font-sans text-[14px]" style={{ color: '#991B1B' }}>{loadError}</p>
            </div>
          ) : shown.map((claim, i) => (
            <motion.div key={claim.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              onClick={() => setOpenClaim(claim)}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_110px_100px_160px_80px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center cursor-pointer">
              <div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{claim.claimantName}</p>
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{claim.code} · {new Date(claim.claimDate).toLocaleDateString('en-NG')}</p>
              </div>
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{claim.claimType}</p>
              <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(claim.amount)}</p>
              <Badge variant={STATUS_VARIANT[claim.status]}>{STATUS_LABEL[claim.status]}</Badge>
              <AssignDropdown claim={claim} onAssign={(dept) => updateAssignment(claim.id, dept)} />
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {(claim.status === 'submitted' || claim.status === 'under_review') && (
                  <>
                    <button type="button" title="Approve" onClick={() => updateStatus(claim.id, 'approved')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#DCFCE7]"
                      style={{ borderColor: 'var(--border-default)', color: '#16A34A' }}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Reject" onClick={() => updateStatus(claim.id, 'rejected')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#FEE2E2]"
                      style={{ borderColor: 'var(--border-default)', color: '#DC2626' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {!loading && !loadError && shown.length === 0 && (
            <div className="px-5 py-10 text-center font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
              No claims match this filter.
            </div>
          )}
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </div>

      <Drawer
        open={!!openClaim}
        onClose={() => setOpenClaim(null)}
        title={openClaim?.code ?? ''}
        subtitle={openClaim ? new Date(openClaim.claimDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined}
      >
        {openClaim && <ClaimDrawerContent claim={openClaim} onAssign={(dept) => updateAssignment(openClaim.id, dept)} />}
      </Drawer>

      <AnimatePresence>
        {showAdd && <ClaimFormModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      </AnimatePresence>
    </div>
  )
}

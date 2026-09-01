'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, ChevronDown, Pencil, Trash2, Eye, RefreshCw, Loader2, ExternalLink } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'
import {
  createPolicyRecord,
  deletePolicyRecord,
  fetchPolicies,
  lookupTangerinePolicy,
  updatePolicyRecord,
  type TangerineLookupResult,
} from '@/lib/db/browser'
import type { PolicyInput, PolicyRecord, PolicyProductType, PolicyStatus } from '@/lib/db/policies'

const INSURERS = [
  'NSIA Insurance', 'Tangerine Insurance', 'AIICO Insurance', 'Fortis Global Insurance',
]

const PRODUCT_TYPES: PolicyProductType[] = ['motor', 'medical', 'travel', 'business', 'marine', 'personal-accident']
const STATUSES: PolicyStatus[] = ['active', 'expiring', 'expired', 'cancelled']

type Filter = 'all' | PolicyProductType

const emptyForm = {
  policyNumber: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  productType: 'motor' as PolicyProductType,
  insurer: '',
  premium: '',
  status: 'active' as PolicyStatus,
  coverStart: '',
  coverEnd: '',
  notes: '',
}

type FormState = typeof emptyForm

function statusVariant(s: string): 'status-active' | 'status-expiring' | 'status-expired' | 'status-cancelled' {
  if (s === 'active') return 'status-active'
  if (s === 'expiring') return 'status-expiring'
  if (s === 'cancelled') return 'status-cancelled'
  return 'status-expired'
}

function PolicyFormModal({
  title,
  submitLabel,
  initial,
  onClose,
  onSubmit,
}: {
  title: string
  submitLabel: string
  initial: FormState
  onClose: () => void
  onSubmit: (input: PolicyInput) => Promise<void>
}) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    const e: Record<string, string> = {}
    if (!form.policyNumber.trim()) e.policyNumber = 'Required'
    if (!form.customerName.trim()) e.customerName = 'Required'
    if (!form.insurer) e.insurer = 'Required'
    if (!form.premium || isNaN(Number(form.premium.replace(/,/g, '')))) e.premium = 'Enter a valid amount'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    setServerError(null)
    try {
      await onSubmit({
        policyNumber: form.policyNumber.trim(),
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim() || null,
        customerPhone: form.customerPhone.trim() || null,
        productType: form.productType,
        insurer: form.insurer,
        premium: Number(form.premium.replace(/,/g, '')),
        status: form.status,
        coverStart: form.coverStart || null,
        coverEnd: form.coverEnd || null,
        notes: form.notes.trim() || null,
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Could not save this policy.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy number *</label>
            <input type="text" value={form.policyNumber} onChange={(e) => set('policyNumber', e.target.value)} placeholder="e.g. SI-2026-042983"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.policyNumber ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.policyNumber && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.policyNumber}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Customer name *</label>
            <input type="text" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="e.g. Emeka Okonkwo"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.customerName ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.customerName && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.customerName}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Customer email</label>
              <input type="email" value={form.customerEmail} onChange={(e) => set('customerEmail', e.target.value)} placeholder="you@example.com"
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Customer phone</label>
              <input type="tel" value={form.customerPhone} onChange={(e) => set('customerPhone', e.target.value)} placeholder="080XXXXXXXX"
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy type *</label>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCT_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => set('productType', t)}
                  className="h-10 rounded-xl font-sans font-semibold text-[11px] border transition-colors px-1"
                  style={{ backgroundColor: form.productType === t ? '#DC2626' : 'white', borderColor: form.productType === t ? '#DC2626' : 'var(--border-default)', color: form.productType === t ? 'white' : 'var(--text-secondary)' }}>
                  {PRODUCT_COLORS[t].emoji} {PRODUCT_COLORS[t].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Insurer *</label>
            <div className="relative">
              <select value={form.insurer} onChange={(e) => set('insurer', e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none"
                style={{ borderColor: errors.insurer ? '#DC2626' : 'var(--border-medium)', color: form.insurer ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <option value="">Select insurer</option>
                {INSURERS.map((ins) => <option key={ins} value={ins}>{ins}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>
            {errors.insurer && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.insurer}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Annual premium (₦) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>₦</span>
                <input type="text" inputMode="numeric"
                  value={form.premium ? Number(form.premium.replace(/,/g, '')).toLocaleString('en-NG') : ''}
                  onChange={(e) => set('premium', e.target.value.replace(/,/g, '').replace(/\D/g, ''))}
                  placeholder="e.g. 87,500"
                  className="w-full h-11 pl-8 pr-4 rounded-xl border-[1.5px] font-sans text-[14px] outline-none transition-colors"
                  style={{ borderColor: errors.premium ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
              </div>
              {errors.premium && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.premium}</p>}
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <div className="relative">
                <select value={form.status} onChange={(e) => set('status', e.target.value as PolicyStatus)}
                  className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cover start</label>
              <input type="date" value={form.coverStart} onChange={(e) => set('coverStart', e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cover end</label>
              <input type="date" value={form.coverEnd} onChange={(e) => set('coverEnd', e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Optional internal notes"
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
            {submitLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function PolicyDetailModal({ policy, onClose }: { policy: PolicyRecord; onClose: () => void }) {
  const colors = PRODUCT_COLORS[policy.productType]
  const rows: [string, string | null][] = [
    ['Policy number', policy.policyNumber],
    ['Customer', policy.customerName],
    ['Email', policy.customerEmail],
    ['Phone', policy.customerPhone],
    ['Insurer', policy.insurer],
    ['Premium', formatNaira(policy.premium)],
    ['Status', policy.status],
    ['Source', policy.source],
    ['Cover start', policy.coverStart],
    ['Cover end', policy.coverEnd],
    ['Notes', policy.notes],
    ['Created', new Date(policy.createdAt).toLocaleString('en-NG')],
    ['Last updated', new Date(policy.updatedAt).toLocaleString('en-NG')],
  ]

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: colors.light }}>{colors.emoji}</div>
            <h2 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>Policy details</h2>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-4">
          {rows.filter(([, v]) => v).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-sans text-[12px] shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="font-sans text-[13px] font-medium text-right" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function LookupPanel({ onSave }: { onSave: (result: TangerineLookupResult) => void }) {
  const [open, setOpen] = useState(false)
  const [line, setLine] = useState<'comprehensive' | 'thirdparty'>('comprehensive')
  const [identifierType, setIdentifierType] = useState<'policyNumber' | 'registrationNumber'>('policyNumber')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TangerineLookupResult | null>(null)

  async function runLookup() {
    if (!value.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const found = await lookupTangerinePolicy({ line, identifierType, value: value.trim() })
      setResult(found)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border mb-5" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-4">
        <div className="text-left">
          <p className="font-sans font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>Look up a policy directly from the insurer</p>
          <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Live check against Tangerine — NSIA and Fortis don&apos;t expose a lookup endpoint in their partner APIs.
          </p>
        </div>
        <ChevronDown className="w-4 h-4 shrink-0 transition-transform" style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <select value={line} onChange={(e) => setLine(e.target.value as typeof line)}
                  className="h-10 rounded-xl border-[1.5px] px-3 font-sans text-[13px] outline-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>
                  <option value="comprehensive">Tangerine Comprehensive</option>
                  <option value="thirdparty">Tangerine Third Party</option>
                </select>
                <select value={identifierType} onChange={(e) => setIdentifierType(e.target.value as typeof identifierType)}
                  className="h-10 rounded-xl border-[1.5px] px-3 font-sans text-[13px] outline-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>
                  <option value="policyNumber">Policy number</option>
                  <option value="registrationNumber">Registration number</option>
                </select>
                <div className="flex gap-2">
                  <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value"
                    className="flex-1 h-10 rounded-xl border-[1.5px] px-3 font-sans text-[13px] outline-none"
                    style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
                  <button type="button" onClick={runLookup} disabled={loading}
                    className="h-10 px-4 rounded-xl font-sans font-semibold text-[12px] text-white flex items-center gap-1.5 shrink-0 disabled:opacity-60"
                    style={{ backgroundColor: '#DC2626' }}>
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    Look up
                  </button>
                </div>
              </div>

              {error && <p className="font-sans text-[12px] mt-3 px-3 py-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}>{error}</p>}

              {result && (
                <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-raised)' }}>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-3">
                    {[
                      ['Policy no', result.policyNumber], ['Insured', result.insuredName],
                      ['Registration', result.registrationNo], ['Status', result.transactionStatus],
                      ['Cover', result.coverDate], ['Expires', result.expirationDate],
                      ['Premium', result.premium], ['Sum assured', result.sumAssured],
                    ].filter(([, v]) => v).map(([label, val]) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span className="font-sans text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button type="button" onClick={() => onSave(result)}
                      className="h-9 px-4 rounded-lg font-sans font-semibold text-[12px] text-white flex items-center gap-1.5"
                      style={{ backgroundColor: '#DC2626' }}>
                      <Plus className="w-3.5 h-3.5" /> Save to our records
                    </button>
                    {result.certificateUrl && (
                      <a href={result.certificateUrl} target="_blank" rel="noopener noreferrer"
                        className="h-9 px-4 rounded-lg font-sans font-semibold text-[12px] border flex items-center gap-1.5"
                        style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
                        <ExternalLink className="w-3.5 h-3.5" /> Certificate
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<PolicyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<PolicyRecord | null>(null)
  const [viewing, setViewing] = useState<PolicyRecord | null>(null)
  const [deleting, setDeleting] = useState<PolicyRecord | null>(null)
  const [prefill, setPrefill] = useState<FormState | null>(null)

  async function load() {
    setLoading(true)
    setLoadError(null)
    setNotConfigured(false)
    try {
      const rows = await fetchPolicies({ productType: filter === 'all' ? undefined : filter, search: search || undefined })
      setPolicies(rows)
    } catch (error) {
      const err = error as { message?: string } & Error
      if (err.message?.toLowerCase().includes('database is configured')) setNotConfigured(true)
      else setLoadError(err.message ?? 'Could not load policies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search])

  async function handleAdd(input: PolicyInput) {
    await createPolicyRecord(input)
    setShowAdd(false)
    setPrefill(null)
    load()
  }

  async function handleEdit(input: PolicyInput) {
    if (!editing) return
    await updatePolicyRecord(editing.id, input)
    setEditing(null)
    load()
  }

  async function handleDelete() {
    if (!deleting) return
    await deletePolicyRecord(deleting.id)
    setDeleting(null)
    load()
  }

  function openFromLookup(result: TangerineLookupResult) {
    setPrefill({
      ...emptyForm,
      policyNumber: result.policyNumber ?? '',
      customerName: result.insuredName ?? '',
      productType: 'motor',
      insurer: result.insurer,
      premium: (result.premium ?? '0').replace(/,/g, ''),
      status: result.transactionStatus?.toLowerCase().includes('active') ? 'active' : 'expired',
      coverEnd: '',
      notes: `Imported from Tangerine ${result.line} lookup (reg. ${result.registrationNo ?? 'n/a'}, txn ${result.transactionReferenceNo ?? 'n/a'}).`,
    })
    setShowAdd(true)
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>All Policies</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{policies.length} policies across all customers</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={load} title="Refresh"
            className="h-10 w-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => { setPrefill(null); setShowAdd(true) }}
            className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <Plus className="w-4 h-4" />
            Add policy
          </button>
        </div>
      </div>

      <LookupPanel onSave={openFromLookup} />

      {notConfigured ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--border-default)', backgroundColor: 'white' }}>
          <p className="font-sans font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>No database configured</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Set <code className="font-mono px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-raised)' }}>POSTGRES_URL</code> to a Postgres connection string to store and manage policy records here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, policy no, insurer…"
                className="w-full h-10 pl-9 pr-4 rounded-xl border font-sans text-[13px] outline-none transition-all"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', ...PRODUCT_TYPES] as Filter[]).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)}
                  className="px-3 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors capitalize"
                  style={{ backgroundColor: filter === f ? '#DC2626' : 'white', borderColor: filter === f ? '#DC2626' : 'var(--border-default)', color: filter === f ? 'white' : 'var(--text-secondary)' }}>
                  {f === 'all' ? 'All types' : PRODUCT_COLORS[f].emoji + ' ' + PRODUCT_COLORS[f].label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_100px_100px_110px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
              {['Policy', 'Customer', 'Insurer', 'Premium', 'Status', ''].map((h) => (
                <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
              ))}
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Loading policies…</p>
                </div>
              ) : loadError ? (
                <div className="text-center py-12">
                  <p className="font-sans text-[14px]" style={{ color: '#991B1B' }}>{loadError}</p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>No policies match your filters.</p>
                </div>
              ) : policies.map((p, i) => {
                const colors = PRODUCT_COLORS[p.productType]
                return (
                  <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_100px_100px_110px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: colors.light }}>{colors.emoji}</div>
                      <div className="min-w-0">
                        <p className="font-sans font-semibold text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>{p.customerName}</p>
                        <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.policyNumber}</p>
                      </div>
                    </div>
                    <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{p.customerEmail ?? p.customerPhone ?? '—'}</p>
                    <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{p.insurer}</p>
                    <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(p.premium)}</p>
                    <Badge variant={statusVariant(p.status)}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge>
                    <div className="flex items-center gap-1 justify-start lg:justify-end">
                      <button type="button" onClick={() => setViewing(p)} title="View"
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white" style={{ color: 'var(--text-muted)' }}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setEditing(p)} title="Edit"
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white" style={{ color: 'var(--text-muted)' }}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setDeleting(p)} title="Remove"
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white" style={{ color: '#DC2626' }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showAdd && (
          <PolicyFormModal
            title="Add Policy"
            submitLabel="Add policy"
            initial={prefill ?? emptyForm}
            onClose={() => { setShowAdd(false); setPrefill(null) }}
            onSubmit={handleAdd}
          />
        )}
        {editing && (
          <PolicyFormModal
            title="Edit Policy"
            submitLabel="Save changes"
            initial={{
              policyNumber: editing.policyNumber,
              customerName: editing.customerName,
              customerEmail: editing.customerEmail ?? '',
              customerPhone: editing.customerPhone ?? '',
              productType: editing.productType,
              insurer: editing.insurer,
              premium: String(editing.premium),
              status: editing.status,
              coverStart: editing.coverStart ?? '',
              coverEnd: editing.coverEnd ?? '',
              notes: editing.notes ?? '',
            }}
            onClose={() => setEditing(null)}
            onSubmit={handleEdit}
          />
        )}
        {viewing && <PolicyDetailModal policy={viewing} onClose={() => setViewing(null)} />}
        {deleting && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
              <h2 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>Remove this policy?</h2>
              <p className="font-sans text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>
                This deletes our record of <strong style={{ color: 'var(--text-primary)' }}>{deleting.policyNumber}</strong> for {deleting.customerName}. This only removes our own record &mdash; it does not cancel anything with the insurer.
              </p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setDeleting(null)}
                  className="h-10 px-5 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
                <button type="button" onClick={handleDelete}
                  className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px"
                  style={{ backgroundColor: '#DC2626' }}>
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

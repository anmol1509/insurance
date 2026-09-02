'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown, Phone, Mail, Search, ArrowUpDown, Send, Plus, Loader2 } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'
import Drawer from '@/components/admin/Drawer'
import Pagination from '@/components/admin/Pagination'
import { addLeadNoteRecord, createLeadRecord, fetchAgents, fetchLeads, updateLeadRecord } from '@/lib/db/browser'
import type { LeadInput, LeadProductType, LeadRecord, LeadStatus } from '@/lib/db/leads'

type StatusFilter = 'all' | LeadStatus
type SortKey = 'date' | 'premium'

/** Used until /admin/agents has real staff in the database — see the Staff & Agents dashboard page. */
const FALLBACK_AGENTS = ['Chidinma Eze', 'Bayo Adekunle', 'Grace Umeh', 'Segun Alabi', 'Sales Team (unassigned pool)']
const PAGE_SIZE = 5

/**
 * Shown only when no database is configured, so the page still demos fully —
 * see docs/policies-dashboard.md. `id` here is just a local key; there is no
 * server row behind it, so mutations in this mode never leave the browser.
 */
const FALLBACK_LEADS: LeadRecord[] = [
  { id: 'fallback-1', code: 'LD-3021', name: 'Ifeoma Nwachukwu', phone: '0803 214 7789', email: 'ifeoma.n@gmail.com', productType: 'motor', summary: 'Honda Accord 2019 · Comprehensive · Abuja', estimatedPremium: 92_000, source: 'Google Ads', createdAt: '2026-08-28', updatedAt: '2026-08-28', status: 'new', assignedTo: null,
    notes: [] },
  { id: 'fallback-2', code: 'LD-3018', name: 'Kelechi Obi', phone: '0706 552 9012', email: 'kelechi.obi@yahoo.com', productType: 'travel', summary: 'Dubai, UAE · 7 days · 2 travellers', estimatedPremium: 38_500, source: 'Facebook', createdAt: '2026-08-28', updatedAt: '2026-08-28', status: 'contacted', assignedTo: 'Bayo Adekunle',
    notes: [{ at: '2026-08-28', text: 'Called, interested but comparing with a competitor quote. Follow up Friday.' }] },
  { id: 'fallback-3', code: 'LD-3005', name: 'Aisha Mohammed', phone: '0812 448 3321', email: 'aisha.m@outlook.com', productType: 'medical', summary: 'Family Standard Plan · 3 lives', estimatedPremium: 165_000, source: 'Organic Search', createdAt: '2026-08-27', updatedAt: '2026-08-27', status: 'quoted', assignedTo: 'Grace Umeh',
    notes: [{ at: '2026-08-27', text: 'Sent quote via email.' }, { at: '2026-08-28', text: 'Requested a payment plan breakdown — sent monthly option.' }] },
  { id: 'fallback-4', code: 'LD-2997', name: 'Emeka Okafor', phone: '0905 331 7654', email: 'e.okafor@gmail.com', productType: 'business', summary: 'Shop premises, Onitsha · Fire & Burglary', estimatedPremium: 74_000, source: 'Referral', createdAt: '2026-08-26', updatedAt: '2026-08-26', status: 'converted', assignedTo: 'Chidinma Eze',
    notes: [{ at: '2026-08-26', text: 'Converted — policy SI-2026-091823 issued.' }] },
  { id: 'fallback-5', code: 'LD-2988', name: 'Blessing Etim', phone: '0701 998 4432', email: 'blessing.etim@gmail.com', productType: 'motor', summary: 'Toyota Hilux 2021 · Third Party · Port Harcourt', estimatedPremium: 45_000, source: 'Instagram', createdAt: '2026-08-25', updatedAt: '2026-08-25', status: 'lost', assignedTo: 'Segun Alabi',
    notes: [{ at: '2026-08-25', text: 'Went with a walk-in agent instead — price sensitive.' }] },
  { id: 'fallback-6', code: 'LD-2975', name: 'Chinedu Ike', phone: '0813 220 5567', email: 'chinedu.ike@gmail.com', productType: 'motor', summary: 'Lexus RX 350 2018 · Comprehensive · Lagos', estimatedPremium: 138_000, source: 'Google Ads', createdAt: '2026-08-24', updatedAt: '2026-08-24', status: 'contacted', assignedTo: 'Bayo Adekunle',
    notes: [{ at: '2026-08-24', text: 'Left voicemail, texted follow-up link.' }] },
  { id: 'fallback-7', code: 'LD-2960', name: 'Funmilayo Adeoye', phone: '0908 776 2210', email: 'funmi.adeoye@yahoo.com', productType: 'travel', summary: 'London, UK · 21 days · 1 traveller', estimatedPremium: 61_000, source: 'Organic Search', createdAt: '2026-08-23', updatedAt: '2026-08-23', status: 'new', assignedTo: null,
    notes: [] },
  { id: 'fallback-8', code: 'LD-2942', name: 'Musa Suleiman', phone: '0806 114 8890', email: 'musa.suleiman@gmail.com', productType: 'business', summary: 'Warehouse, Kano · Comprehensive', estimatedPremium: 210_000, source: 'Referral', createdAt: '2026-08-21', updatedAt: '2026-08-21', status: 'quoted', assignedTo: 'Chidinma Eze',
    notes: [{ at: '2026-08-21', text: 'Awaiting sign-off from their finance team.' }] },
]

const STATUS_VARIANT: Record<LeadStatus, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending' | 'status-cancelled'> = {
  new: 'status-pending', contacted: 'status-expiring', quoted: 'status-pending', converted: 'status-active', lost: 'status-cancelled',
}
const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New', contacted: 'Contacted', quoted: 'Quoted', converted: 'Converted', lost: 'Lost',
}

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'converted', label: 'Converted' },
  { key: 'lost', label: 'Lost' },
]

const PRODUCT_TYPES: LeadProductType[] = ['motor', 'medical', 'travel', 'business']

const emptyForm = { name: '', phone: '', email: '', productType: 'motor' as LeadProductType, summary: '', estimatedPremium: '', source: '' }
type FormState = typeof emptyForm

function LeadFormModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (input: LeadInput) => Promise<void> }) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Enter a valid email'
    if (!form.source.trim()) e.source = 'Required'
    if (!form.estimatedPremium || isNaN(Number(form.estimatedPremium.replace(/,/g, '')))) e.estimatedPremium = 'Enter a valid amount'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    setServerError(null)
    try {
      await onSubmit({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        productType: form.productType,
        summary: form.summary.trim() || null,
        estimatedPremium: Number(form.estimatedPremium.replace(/,/g, '')),
        source: form.source.trim(),
        status: 'new',
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Could not save this lead.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Add lead</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone *</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: errors.phone ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
              {errors.phone && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: errors.email ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
              {errors.email && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Product *</label>
            <div className="grid grid-cols-4 gap-2">
              {PRODUCT_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => set('productType', t)}
                  className="h-10 rounded-xl font-sans font-semibold text-[11px] border transition-colors px-1"
                  style={{ backgroundColor: form.productType === t ? '#7C3AED' : 'white', borderColor: form.productType === t ? '#7C3AED' : 'var(--border-default)', color: form.productType === t ? 'white' : 'var(--text-secondary)' }}>
                  {PRODUCT_COLORS[t].emoji} {PRODUCT_COLORS[t].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Summary</label>
            <input type="text" value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="e.g. Honda Accord 2019 · Comprehensive · Abuja"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Est. premium (₦) *</label>
              <input type="text" inputMode="numeric"
                value={form.estimatedPremium ? Number(form.estimatedPremium.replace(/,/g, '')).toLocaleString('en-NG') : ''}
                onChange={(e) => set('estimatedPremium', e.target.value.replace(/,/g, '').replace(/\D/g, ''))}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: errors.estimatedPremium ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
              {errors.estimatedPremium && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.estimatedPremium}</p>}
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Source *</label>
              <input type="text" value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="e.g. Google Ads"
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: errors.source ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
              {errors.source && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.source}</p>}
            </div>
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
            style={{ backgroundColor: '#7C3AED' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add lead
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function AssignDropdown({ lead, agents, onAssign }: { lead: LeadRecord; agents: string[]; onAssign: (agent: string | null) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg border font-sans text-[12px] font-medium transition-colors hover:bg-[var(--surface-raised)]"
        style={{ borderColor: lead.assignedTo ? 'var(--green-700)' : 'var(--border-default)', color: lead.assignedTo ? 'var(--green-700)' : 'var(--text-muted)', backgroundColor: lead.assignedTo ? 'var(--green-50)' : 'white' }}>
        <span className="max-w-[110px] truncate">{lead.assignedTo ?? 'Assign to…'}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 top-full mt-1.5 z-[70] bg-white rounded-xl border shadow-lg py-1 w-56"
              style={{ borderColor: 'var(--border-default)' }}>
              {lead.assignedTo && (
                <button type="button" onClick={() => { onAssign(null); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left font-sans text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  <X className="w-3.5 h-3.5" /> Unassign
                </button>
              )}
              {agents.map((agent) => (
                <button key={agent} type="button" onClick={() => { onAssign(agent); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left font-sans text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ color: lead.assignedTo === agent ? 'var(--green-700)' : 'var(--text-primary)' }}>
                  <span className="truncate">{agent}</span>
                  {lead.assignedTo === agent && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function LeadDrawerContent({ lead, agents, onAssign, onStatus, onAddNote }: {
  lead: LeadRecord
  agents: string[]
  onAssign: (agent: string | null) => void
  onStatus: (status: LeadStatus) => void
  onAddNote: (text: string) => void
}) {
  const [draft, setDraft] = useState('')
  const c = PRODUCT_COLORS[lead.productType]

  function submitNote() {
    if (!draft.trim()) return
    onAddNote(draft.trim())
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
        <p className="font-sans text-[12px] mt-0.5" style={{ color: c.text }}>{c.emoji} {c.label} · {lead.summary}</p>
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <Badge variant={STATUS_VARIANT[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
          <span className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(lead.estimatedPremium)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <a href={`tel:${lead.phone.replace(/\s/g, '')}`}
          className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl border font-sans font-medium text-[12px] transition-colors hover:bg-[var(--green-50)]"
          style={{ borderColor: 'var(--border-default)', color: 'var(--green-700)' }}>
          <Phone className="w-3.5 h-3.5" /> {lead.phone}
        </a>
        <a href={`mailto:${lead.email}`}
          className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl border font-sans font-medium text-[12px] transition-colors hover:bg-[#F0F9FF]"
          style={{ borderColor: 'var(--border-default)', color: '#0284C7' }}>
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Source</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{lead.source}</p>
        </div>
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Created</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{new Date(lead.createdAt).toLocaleDateString('en-NG')}</p>
        </div>
      </div>

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Assigned to</p>
        <AssignDropdown lead={lead} agents={agents} onAssign={onAssign} />
      </div>

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Update status</p>
        <div className="flex gap-2 flex-wrap">
          {(['new', 'contacted', 'quoted', 'converted', 'lost'] as LeadStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => onStatus(s)}
              className="px-3 py-1.5 rounded-full font-sans font-semibold text-[11px] border transition-colors"
              style={{ backgroundColor: lead.status === s ? '#7C3AED' : 'white', borderColor: lead.status === s ? '#7C3AED' : 'var(--border-default)', color: lead.status === s ? 'white' : 'var(--text-secondary)' }}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>Activity notes</p>
        <div className="flex flex-col gap-2 mb-3">
          {lead.notes.length === 0 && (
            <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>No notes yet.</p>
          )}
          {lead.notes.map((n, i) => (
            <div key={i} className="px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--surface-raised)' }}>
              <p className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{n.text}</p>
              <p className="font-sans text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{new Date(n.at).toLocaleDateString('en-NG')}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitNote() } }}
            placeholder="Log a call, email, or follow-up…"
            className="flex-1 h-9 px-3 rounded-lg border font-sans text-[12px] outline-none"
            style={{ borderColor: 'var(--border-default)' }} />
          <button type="button" onClick={submitNote}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: '#7C3AED' }}>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dbMode, setDbMode] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)
  const [openLead, setOpenLead] = useState<LeadRecord | null>(null)
  const [agentNames, setAgentNames] = useState<string[]>(FALLBACK_AGENTS)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetchAgents({ active: true })
      .then((rows) => {
        if (rows.length > 0) setAgentNames(rows.map((a) => a.name))
      })
      .catch(() => { /* no database configured yet — keep the fallback names */ })
  }, [])

  async function load() {
    setLoading(true)
    setLoadError(null)
    try {
      const rows = await fetchLeads()
      setLeads(rows)
      setDbMode(true)
    } catch (error) {
      const err = error as { message?: string } & Error
      if (err.message?.toLowerCase().includes('database is configured')) {
        setDbMode(false)
        setLeads(FALLBACK_LEADS)
      } else {
        setLoadError(err.message ?? 'Could not load leads.')
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
    return leads
      .filter((l) => filter === 'all' || l.status === filter)
      .filter((l) => !q || l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.phone.includes(q))
      .sort((a, b) => {
        const dir = sortDesc ? -1 : 1
        if (sortKey === 'premium') return (a.estimatedPremium - b.estimatedPremium) * dir
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      })
  }, [leads, filter, query, sortKey, sortDesc])

  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleAdd(input: LeadInput) {
    if (dbMode) {
      const lead = await createLeadRecord(input)
      setLeads((prev) => [lead, ...prev])
    } else {
      const lead: LeadRecord = {
        id: `fallback-${Date.now()}`,
        code: `LD-${Date.now().toString().slice(-4)}`,
        name: input.name,
        phone: input.phone,
        email: input.email,
        productType: input.productType,
        summary: input.summary ?? null,
        estimatedPremium: input.estimatedPremium,
        source: input.source,
        status: input.status ?? 'new',
        assignedTo: input.assignedTo ?? null,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setLeads((prev) => [lead, ...prev])
    }
    setShowAdd(false)
  }

  async function updateStatus(id: string, status: LeadStatus) {
    if (dbMode) {
      const lead = await updateLeadRecord(id, { status })
      setLeads((prev) => prev.map((l) => l.id === id ? lead : l))
      setOpenLead((prev) => prev && prev.id === id ? lead : prev)
    } else {
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
      setOpenLead((prev) => prev && prev.id === id ? { ...prev, status } : prev)
    }
  }

  async function updateAssignment(id: string, agent: string | null) {
    if (dbMode) {
      const lead = await updateLeadRecord(id, { assignedTo: agent })
      setLeads((prev) => prev.map((l) => l.id === id ? lead : l))
      setOpenLead((prev) => prev && prev.id === id ? lead : prev)
    } else {
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, assignedTo: agent } : l))
      setOpenLead((prev) => prev && prev.id === id ? { ...prev, assignedTo: agent } : prev)
    }
  }

  async function addNote(id: string, text: string) {
    if (dbMode) {
      const lead = await addLeadNoteRecord(id, text)
      setLeads((prev) => prev.map((l) => l.id === id ? lead : l))
      setOpenLead((prev) => prev && prev.id === id ? lead : prev)
    } else {
      const note = { at: new Date().toISOString().slice(0, 10), text }
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, notes: [...l.notes, note] } : l))
      setOpenLead((prev) => prev && prev.id === id ? { ...prev, notes: [...prev.notes, note] } : prev)
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc((v) => !v)
    else { setSortKey(key); setSortDesc(true) }
  }

  const converted = leads.filter((l) => l.status === 'converted').length
  const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0
  const unassigned = leads.filter((l) => !l.assignedTo && l.status !== 'converted' && l.status !== 'lost').length

  const summaryStats = [
    { label: 'Total Leads', value: leads.length.toLocaleString(), color: 'var(--green-700)', bg: 'var(--green-50)' },
    { label: 'Awaiting Assignment', value: unassigned.toString(), color: '#D97706', bg: '#FFFBEB' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, color: '#7C3AED', bg: '#F5F3FF' },
  ]

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Leads &amp; Quotes</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Every quote request across all products, from first click to conversion</p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)}
          className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{ backgroundColor: '#7C3AED' }}>
          <Plus className="w-4 h-4" />
          Add lead
        </button>
      </div>

      {!dbMode && !loading && (
        <div className="rounded-xl px-4 py-3 mb-5 font-sans text-[12px]" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
          No database configured — showing sample data that resets on refresh. Set <code className="font-mono px-1 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>POSTGRES_URL</code> to make leads persist for real.
        </div>
      )}

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
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? leads.length : leads.filter((l) => l.status === f.key).length
            return (
              <button key={f.key} type="button" onClick={() => { setFilter(f.key); setPage(1) }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
                style={{ backgroundColor: filter === f.key ? '#7C3AED' : 'white', borderColor: filter === f.key ? '#7C3AED' : 'var(--border-default)', color: filter === f.key ? 'white' : 'var(--text-secondary)' }}>
                {f.label}
                <span className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-raised)', color: filter === f.key ? 'white' : 'var(--text-muted)' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search name, ID, phone…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border font-sans text-[13px] outline-none"
            style={{ borderColor: 'var(--border-default)' }}
          />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1.1fr_1.3fr_100px_100px_120px_160px_110px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Customer</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Product</p>
          <button type="button" onClick={() => toggleSort('premium')} className="flex items-center gap-1 font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: sortKey === 'premium' ? '#7C3AED' : 'var(--text-subtle)' }}>
            Est. Premium <ArrowUpDown className="w-3 h-3" />
          </button>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Source</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Status</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Assigned to</p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>Actions</p>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Loading leads…</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-12">
              <p className="font-sans text-[14px]" style={{ color: '#991B1B' }}>{loadError}</p>
            </div>
          ) : shown.map((lead, i) => {
            const c = PRODUCT_COLORS[lead.productType]
            return (
              <motion.div key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => setOpenLead(lead)}
                className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_100px_100px_120px_160px_110px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center cursor-pointer">
                <div>
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{lead.code} · {new Date(lead.createdAt).toLocaleDateString('en-NG')}</p>
                </div>
                <div>
                  <span className="font-sans font-medium text-[12px]" style={{ color: c.text }}>{c.emoji} {c.label}</span>
                  <p className="font-sans text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{lead.summary}</p>
                </div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(lead.estimatedPremium)}</p>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{lead.source}</p>
                <Badge variant={STATUS_VARIANT[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
                <AssignDropdown lead={lead} agents={agentNames} onAssign={(agent) => updateAssignment(lead.id, agent)} />
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <a href={`tel:${lead.phone.replace(/\s/g, '')}`} title={lead.phone}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[var(--green-50)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--green-700)' }}>
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a href={`mailto:${lead.email}`} title={lead.email}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#F0F9FF]"
                    style={{ borderColor: 'var(--border-default)', color: '#0284C7' }}>
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  {lead.status !== 'converted' && lead.status !== 'lost' && (
                    <button type="button" title="Mark converted" onClick={() => updateStatus(lead.id, 'converted')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#DCFCE7]"
                      style={{ borderColor: 'var(--border-default)', color: '#16A34A' }}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
          {!loading && !loadError && shown.length === 0 && (
            <div className="px-5 py-10 text-center font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
              No leads match this filter.
            </div>
          )}
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </div>

      <Drawer
        open={!!openLead}
        onClose={() => setOpenLead(null)}
        title={openLead?.name ?? ''}
        subtitle={openLead?.code}
        accent="#7C3AED"
      >
        {openLead && (
          <LeadDrawerContent
            lead={openLead}
            agents={agentNames}
            onAssign={(agent) => updateAssignment(openLead.id, agent)}
            onStatus={(status) => updateStatus(openLead.id, status)}
            onAddNote={(text) => addNote(openLead.id, text)}
          />
        )}
      </Drawer>

      <AnimatePresence>
        {showAdd && <LeadFormModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      </AnimatePresence>
    </div>
  )
}

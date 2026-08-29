'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown, Phone, Mail, Search } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'

type Status = 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
type StatusFilter = 'all' | Status

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  productType: 'motor' | 'medical' | 'travel' | 'business'
  summary: string
  estimatedPremium: number
  source: string
  createdAt: string
  status: Status
  assignedTo: string | null
}

const AGENTS = ['Chidinma Eze', 'Bayo Adekunle', 'Grace Umeh', 'Segun Alabi', 'Sales Team (unassigned pool)']

const INITIAL_LEADS: Lead[] = [
  { id: 'LD-3021', name: 'Ifeoma Nwachukwu', phone: '0803 214 7789', email: 'ifeoma.n@gmail.com', productType: 'motor', summary: 'Honda Accord 2019 · Comprehensive · Abuja', estimatedPremium: 92_000, source: 'Google Ads', createdAt: '2026-08-28', status: 'new', assignedTo: null },
  { id: 'LD-3018', name: 'Kelechi Obi', phone: '0706 552 9012', email: 'kelechi.obi@yahoo.com', productType: 'travel', summary: 'Dubai, UAE · 7 days · 2 travellers', estimatedPremium: 38_500, source: 'Facebook', createdAt: '2026-08-28', status: 'contacted', assignedTo: 'Bayo Adekunle' },
  { id: 'LD-3005', name: 'Aisha Mohammed', phone: '0812 448 3321', email: 'aisha.m@outlook.com', productType: 'medical', summary: 'Family Standard Plan · 3 lives', estimatedPremium: 165_000, source: 'Organic Search', createdAt: '2026-08-27', status: 'quoted', assignedTo: 'Grace Umeh' },
  { id: 'LD-2997', name: 'Emeka Okafor', phone: '0905 331 7654', email: 'e.okafor@gmail.com', productType: 'business', summary: 'Shop premises, Onitsha · Fire & Burglary', estimatedPremium: 74_000, source: 'Referral', createdAt: '2026-08-26', status: 'converted', assignedTo: 'Chidinma Eze' },
  { id: 'LD-2988', name: 'Blessing Etim', phone: '0701 998 4432', email: 'blessing.etim@gmail.com', productType: 'motor', summary: 'Toyota Hilux 2021 · Third Party · Port Harcourt', estimatedPremium: 45_000, source: 'Instagram', createdAt: '2026-08-25', status: 'lost', assignedTo: 'Segun Alabi' },
  { id: 'LD-2975', name: 'Chinedu Ike', phone: '0813 220 5567', email: 'chinedu.ike@gmail.com', productType: 'motor', summary: 'Lexus RX 350 2018 · Comprehensive · Lagos', estimatedPremium: 138_000, source: 'Google Ads', createdAt: '2026-08-24', status: 'contacted', assignedTo: 'Bayo Adekunle' },
  { id: 'LD-2960', name: 'Funmilayo Adeoye', phone: '0908 776 2210', email: 'funmi.adeoye@yahoo.com', productType: 'travel', summary: 'London, UK · 21 days · 1 traveller', estimatedPremium: 61_000, source: 'Organic Search', createdAt: '2026-08-23', status: 'new', assignedTo: null },
  { id: 'LD-2942', name: 'Musa Suleiman', phone: '0806 114 8890', email: 'musa.suleiman@gmail.com', productType: 'business', summary: 'Warehouse, Kano · Comprehensive', estimatedPremium: 210_000, source: 'Referral', createdAt: '2026-08-21', status: 'quoted', assignedTo: 'Chidinma Eze' },
]

const STATUS_VARIANT: Record<Status, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending' | 'status-cancelled'> = {
  new: 'status-pending', contacted: 'status-expiring', quoted: 'status-pending', converted: 'status-active', lost: 'status-cancelled',
}
const STATUS_LABEL: Record<Status, string> = {
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

function AssignDropdown({ lead, onAssign }: { lead: Lead; onAssign: (agent: string | null) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
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
              {AGENTS.map((agent) => (
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

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const shown = leads
    .filter((l) => filter === 'all' || l.status === filter)
    .filter((l) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.phone.includes(q)
    })

  function updateStatus(id: string, status: Status) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
  }
  function updateAssignment(id: string, agent: string | null) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, assignedTo: agent } : l))
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
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Leads &amp; Quotes</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Every quote request across all products, from first click to conversion</p>
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
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? leads.length : leads.filter((l) => l.status === f.key).length
            return (
              <button key={f.key} type="button" onClick={() => setFilter(f.key)}
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ID, phone…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border font-sans text-[13px] outline-none"
            style={{ borderColor: 'var(--border-default)' }}
          />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1.1fr_1.3fr_100px_100px_120px_160px_110px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          {['Customer', 'Product', 'Est. Premium', 'Source', 'Status', 'Assigned to', 'Actions'].map((h) => (
            <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
          ))}
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {shown.map((lead, i) => {
            const c = PRODUCT_COLORS[lead.productType]
            return (
              <motion.div key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_100px_100px_120px_160px_110px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
                <div>
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{lead.id} · {new Date(lead.createdAt).toLocaleDateString('en-NG')}</p>
                </div>
                <div>
                  <span className="font-sans font-medium text-[12px]" style={{ color: c.text }}>{c.emoji} {c.label}</span>
                  <p className="font-sans text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{lead.summary}</p>
                </div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(lead.estimatedPremium)}</p>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{lead.source}</p>
                <Badge variant={STATUS_VARIANT[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
                <AssignDropdown lead={lead} onAssign={(agent) => updateAssignment(lead.id, agent)} />
                <div className="flex gap-2">
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
          {shown.length === 0 && (
            <div className="px-5 py-10 text-center font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
              No leads match this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

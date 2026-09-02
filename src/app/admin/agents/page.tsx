'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, ChevronDown, Pencil, Trash2, RefreshCw, Loader2, UserCheck, UserX } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import {
  createAgentRecord,
  deleteAgentRecord,
  fetchAgents,
  updateAgentRecord,
} from '@/lib/db/browser'
import type { AgentInput, AgentRecord, AgentRole } from '@/lib/db/agents'

const ROLES: AgentRole[] = ['sales', 'support', 'claims', 'admin']
const ROLE_LABEL: Record<AgentRole, string> = { sales: 'Sales', support: 'Support', claims: 'Claims', admin: 'Admin' }

const emptyForm = { name: '', email: '', phone: '', role: 'sales' as AgentRole, active: true }
type FormState = typeof emptyForm

function AgentFormModal({
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
  onSubmit: (input: AgentInput) => Promise<void>
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
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Enter a valid email'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    setServerError(null)
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        role: form.role,
        active: form.active,
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Could not save this staff member.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Chidinma Eze"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@company.com"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.email ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }} />
            {errors.email && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="080XXXXXXXX"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Role</label>
            <div className="relative">
              <select value={form.role} onChange={(e) => set('role', e.target.value as AgentRole)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4" />
            <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>Active — appears in the &quot;Assign to&quot; list</span>
          </label>

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

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<AgentRecord | null>(null)
  const [deleting, setDeleting] = useState<AgentRecord | null>(null)

  async function load() {
    setLoading(true)
    setLoadError(null)
    setNotConfigured(false)
    try {
      const rows = await fetchAgents({ search: search || undefined })
      setAgents(rows)
    } catch (error) {
      const err = error as { message?: string } & Error
      if (err.message?.toLowerCase().includes('database is configured')) setNotConfigured(true)
      else setLoadError(err.message ?? 'Could not load staff.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function handleAdd(input: AgentInput) {
    await createAgentRecord(input)
    setShowAdd(false)
    load()
  }

  async function handleEdit(input: AgentInput) {
    if (!editing) return
    await updateAgentRecord(editing.id, input)
    setEditing(null)
    load()
  }

  async function toggleActive(agent: AgentRecord) {
    await updateAgentRecord(agent.id, { active: !agent.active })
    load()
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteAgentRecord(deleting.id)
    setDeleting(null)
    load()
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Staff & Agents</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Feeds the &quot;Assign to&quot; list on Leads and Claims — {agents.filter((a) => a.active).length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={load} title="Refresh"
            className="h-10 w-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setShowAdd(true)}
            className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <Plus className="w-4 h-4" />
            Add staff
          </button>
        </div>
      </div>

      {notConfigured ? (
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--border-default)', backgroundColor: 'white' }}>
          <p className="font-sans font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>No database configured</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Set <code className="font-mono px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-raised)' }}>POSTGRES_URL</code> to a Postgres connection string to manage staff here. Until then, Leads and Claims fall back to their sample assignee names.
          </p>
        </div>
      ) : (
        <>
          <div className="relative max-w-sm mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
              className="w-full h-10 pl-9 pr-4 rounded-xl border font-sans text-[13px] outline-none transition-all"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <div className="hidden lg:grid grid-cols-[1.5fr_1fr_100px_90px_120px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
              {['Staff', 'Phone', 'Role', 'Status', ''].map((h) => (
                <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
              ))}
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Loading staff…</p>
                </div>
              ) : loadError ? (
                <div className="text-center py-12">
                  <p className="font-sans text-[14px]" style={{ color: '#991B1B' }}>{loadError}</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>No staff added yet.</p>
                </div>
              ) : agents.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_100px_90px_120px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
                    <p className="font-sans text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{a.email}</p>
                  </div>
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{a.phone ?? '—'}</p>
                  <p className="font-sans text-[13px] capitalize" style={{ color: 'var(--text-secondary)' }}>{ROLE_LABEL[a.role]}</p>
                  <Badge variant={a.active ? 'status-active' : 'status-cancelled'}>{a.active ? 'Active' : 'Inactive'}</Badge>
                  <div className="flex items-center gap-1 justify-start lg:justify-end">
                    <button type="button" onClick={() => toggleActive(a)} title={a.active ? 'Deactivate' : 'Activate'}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white" style={{ color: a.active ? '#B45309' : '#059669' }}>
                      {a.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={() => setEditing(a)} title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white" style={{ color: 'var(--text-muted)' }}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setDeleting(a)} title="Remove"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white" style={{ color: '#DC2626' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showAdd && (
          <AgentFormModal
            title="Add staff"
            submitLabel="Add staff"
            initial={emptyForm}
            onClose={() => setShowAdd(false)}
            onSubmit={handleAdd}
          />
        )}
        {editing && (
          <AgentFormModal
            title="Edit staff"
            submitLabel="Save changes"
            initial={{ name: editing.name, email: editing.email, phone: editing.phone ?? '', role: editing.role, active: editing.active }}
            onClose={() => setEditing(null)}
            onSubmit={handleEdit}
          />
        )}
        {deleting && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
              <h2 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>Remove this staff member?</h2>
              <p className="font-sans text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>
                This removes <strong style={{ color: 'var(--text-primary)' }}>{deleting.name}</strong> from the staff directory. Consider deactivating instead if they might return.
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

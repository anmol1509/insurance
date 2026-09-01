'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ChevronDown, ChevronUp, Building2, Pencil, Trash2, FileCode2, CheckCircle2, XCircle, FlaskConical } from 'lucide-react'
import Drawer from '@/components/admin/Drawer'
import { MOTOR_PLANS, type MotorPlan } from '@/lib/motorPlans'
import { motorClientInfoConfig, type MotorClientInfoConfig } from '@/lib/motorClientInfo'
import { documentSlotsFor } from '@/lib/nsia/documents'
import { TANGERINE_DOCUMENT_SLOTS } from '@/lib/tangerine/documents'
import { aiicoDocumentSlots } from '@/lib/aiico/documents'
import { initialsFor } from '@/lib/initials'

type InsurerKey = 'nsia' | 'tangerine' | 'aiico' | 'fortis'
type CoverType = 'comprehensive' | 'tpo'
type LiveStatus = Record<InsurerKey, boolean>

interface DocSlot {
  label: string
  required: boolean
}

/**
 * Real technical facts about each integrated insurer's API — same source
 * material as the read-only Integrations page (docs/*-integration.md) —
 * not invented for this form. RC number / contact details for these real
 * companies aren't something this codebase has verified records of, so
 * they're deliberately left off rather than fabricated.
 */
const REAL_INSURERS: { key: InsurerKey; name: string; color: string; docTitle: string; baseUrl: string; authScheme: string }[] = [
  {
    key: 'nsia', name: 'NSIA Insurance', color: '#1D4ED8',
    docTitle: 'NSIA Insurance API — External Integration Guide v1.0',
    baseUrl: 'test-api.nsiainsurance.com/v1/api (test) · live-api.nsiainsurance.com/v1/api (live)',
    authScheme: 'Bearer token — NSIA_ACCESS_TOKEN',
  },
  {
    key: 'tangerine', name: 'Tangerine Insurance', color: '#D97706',
    docTitle: 'Tangerine Comprehensive Motor Insurance API + Tangerine 3rd Party Insurance API',
    baseUrl: 'motor.tangerine.africa/API/ComprehensiveAPI · /API/API',
    authScheme: 'Basic — base64(userid:APIKEY), no "Bearer" prefix per the manual',
  },
  {
    key: 'aiico', name: 'AIICO Insurance', color: '#059669',
    docTitle: 'AIICO Partner API (Motor: Private Third Party, Comprehensive, Renewal)',
    baseUrl: 'portal-staging.aiicoplc.com (staging default) — UAT/production must be set explicitly',
    authScheme: 'Bearer token — pre-issued JWT, no login/refresh endpoint documented',
  },
  {
    key: 'fortis', name: 'Fortis Global Insurance', color: '#7C3AED',
    docTitle: 'Fortis Global External Motor API Documentation',
    baseUrl: 'jjmgloballtd.com/coreinsurance/api',
    authScheme: 'Sanctum token exchange — POST /external-api/auth/login with client ID/secret',
  },
]

const REPRESENTATIVE_PLAN_ID: Record<InsurerKey, string> = {
  nsia: 'nsia-comp', tangerine: 'tangerine-comp', aiico: 'aiico-motor', fortis: 'fortis-comp',
}

const CLIENT_INFO_LABELS: { key: keyof MotorClientInfoConfig; label: string }[] = [
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'nin', label: 'NIN' },
  { key: 'bvn', label: 'BVN' },
  { key: 'gender', label: 'Gender' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'residentialState', label: 'State of Residence' },
  { key: 'corporateToggle', label: 'Individual / Corporate toggle' },
  { key: 'corporateDetails', label: 'Company Name + RC Number' },
]

/** Reuses the exact functions the live quote flow calls — not a re-description of them. */
function docSlotsFor(key: InsurerKey, coverType: CoverType, isCorporate: boolean): DocSlot[] {
  if (key === 'fortis') return []
  if (key === 'nsia') {
    return documentSlotsFor('motor', { isCorporate, isComprehensive: coverType === 'comprehensive' })
      .map((s) => ({ label: s.label, required: s.required }))
  }
  if (key === 'tangerine') {
    return TANGERINE_DOCUMENT_SLOTS.map((s) => ({ label: s.label, required: s.required }))
  }
  return aiicoDocumentSlots(coverType === 'comprehensive' ? 'comprehensive' : 'third-party')
    .map((s) => ({ label: s.label, required: s.required }))
}

function clientInfoFor(key: InsurerKey): MotorClientInfoConfig {
  return motorClientInfoConfig(REPRESENTATIVE_PLAN_ID[key])
}

function insurerKeyOfPlan(p: MotorPlan): InsurerKey | null {
  if (p.nsia) return 'nsia'
  if (p.tangerine != null) return 'tangerine'
  if (p.aiico != null) return 'aiico'
  if (p.fortisGlobal) return 'fortis'
  return null
}

function buildPlanFlags(key: InsurerKey, coverType: CoverType): Partial<MotorPlan> {
  if (key === 'nsia') return { nsia: true }
  if (key === 'tangerine') return { tangerine: coverType === 'comprehensive' ? 'comprehensive' : 'thirdparty' }
  if (key === 'aiico') return { aiico: coverType === 'comprehensive' ? 'comprehensive' : 'third-party' }
  return { fortisGlobal: true }
}

/** Draft spec for an insurer whose backend hasn't been built yet — captures everything a real integration needs, honestly labelled as not-yet-implemented. */
interface DraftInsurer {
  id: string
  name: string
  docTitle: string
  baseUrl: string
  authScheme: string
  configVars: { name: string; required: boolean; notes: string }[]
  documentSlots: DocSlot[]
  clientInfo: MotorClientInfoConfig
  notes: string
  createdAt: string
}

function TagList({ items, onRemove }: { items: string[]; onRemove: (item: string) => void }) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full font-sans text-[12px] border"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}>
          {item}
          <button type="button" onClick={() => onRemove(item)}
            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100" style={{ color: 'var(--text-muted)' }}>
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
    </div>
  )
}

function TagAdder({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [value, setValue] = useState('')
  function submit() {
    if (value.trim()) { onAdd(value.trim()); setValue('') }
  }
  return (
    <div className="flex gap-2">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
        placeholder={placeholder}
        className="flex-1 h-10 rounded-xl border-[1.5px] px-3.5 font-sans text-[13px] outline-none transition-colors"
        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }} />
      <button type="button" onClick={submit}
        className="h-10 px-4 rounded-xl font-sans font-semibold text-[13px] text-white shrink-0" style={{ backgroundColor: '#DC2626' }}>
        Add
      </button>
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      {children}
      {hint && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} type={props.type ?? 'text'}
      className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
      style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
      onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }} />
  )
}

/** Live-computed, not hand-typed: exactly what the real quote flow will ask a customer for this insurer + cover type. */
function RequirementsPreview({ insurerKey, coverType, isCorporate }: { insurerKey: InsurerKey; coverType: CoverType; isCorporate: boolean }) {
  const slots = docSlotsFor(insurerKey, coverType, isCorporate)
  const client = clientInfoFor(insurerKey)
  const requiredClientFields = CLIENT_INFO_LABELS.filter((f) => client[f.key])

  return (
    <div className="rounded-2xl border-2 p-4" style={{ borderColor: 'var(--motor-200)', backgroundColor: 'var(--motor-50)' }}>
      <p className="font-sans font-bold text-[12px] mb-3" style={{ color: 'var(--motor-700)' }}>
        This plan will require (live, from the actual integration code)
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="font-sans font-bold text-[10px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Documents</p>
          {slots.length === 0 ? (
            <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>None — this insurer&apos;s documented payload has no document fields.</p>
          ) : (
            <ul className="space-y-1">
              {slots.map((s) => (
                <li key={s.label} className="font-sans text-[12px] flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: s.required ? '#DC2626' : 'var(--text-muted)' }} />
                  {s.label}{!s.required && ' (optional)'}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="font-sans font-bold text-[10px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Your details fields</p>
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>
            Full Name, Phone, Email, Address always asked{requiredClientFields.length > 0 ? ', plus:' : '.'}
          </p>
          {requiredClientFields.length > 0 && (
            <ul className="space-y-1 mt-1">
              {requiredClientFields.map((f) => (
                <li key={f.key} className="font-sans text-[12px] flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#DC2626' }} />
                  {f.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function PlanModal({
  insurerKey, insurerName, initial, onClose, onSave,
}: {
  insurerKey: InsurerKey
  insurerName: string
  initial?: MotorPlan
  onClose: () => void
  onSave: (plan: MotorPlan) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [coverType, setCoverType] = useState<CoverType>(initial?.coverType ?? 'comprehensive')
  const [multiplier, setMultiplier] = useState(String(initial?.multiplier ?? 1))
  const [badge, setBadge] = useState(initial?.badge ?? '')
  const [claimSettlement, setClaimSettlement] = useState(initial?.claimSettlement ?? '')
  const [responseTime, setResponseTime] = useState(initial?.responseTime ?? '')
  const [excess, setExcess] = useState(initial?.excess ?? '')
  const [repairNetwork, setRepairNetwork] = useState(initial?.repairNetwork ?? '')
  const [features, setFeatures] = useState<string[]>(initial?.features ?? [])
  const [exclusions, setExclusions] = useState<string[]>(initial?.exclusions ?? [])
  const [isCorporatePreview, setIsCorporatePreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!multiplier || isNaN(Number(multiplier)) || Number(multiplier) <= 0) e.multiplier = 'Enter a positive number'
    setErrors(e)
    if (Object.keys(e).length) return

    onSave({
      id: initial?.id ?? `${insurerKey}-${Date.now()}`,
      name: name.trim(),
      insurer: insurerName,
      logo: initial?.logo,
      coverType,
      rating: initial?.rating ?? 4.5,
      reviews: initial?.reviews ?? 0,
      badge: badge.trim() || undefined,
      multiplier: Number(multiplier),
      features,
      exclusions,
      claimSettlement: claimSettlement.trim() || 'N/A',
      responseTime: responseTime.trim() || 'N/A',
      excess: excess.trim() || 'None',
      repairNetwork: repairNetwork.trim() || 'N/A',
      popular: initial?.popular,
      ...buildPlanFlags(insurerKey, coverType),
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>{initial ? 'Edit plan' : 'Add plan'}</h2>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{insurerName} · Motor</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field label="Plan name *">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Comprehensive Gold" />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </Field>

          <Field label="Cover type *" hint="Every real integration here only supports these two lines.">
            <div className="grid grid-cols-2 gap-2">
              {(['comprehensive', 'tpo'] as CoverType[]).map((c) => (
                <button key={c} type="button" onClick={() => setCoverType(c)}
                  className="h-10 rounded-xl font-sans font-medium text-[13px] border transition-colors capitalize"
                  style={{ backgroundColor: coverType === c ? '#DC2626' : 'white', borderColor: coverType === c ? '#DC2626' : 'var(--border-default)', color: coverType === c ? 'white' : 'var(--text-secondary)' }}>
                  {c === 'tpo' ? 'Third Party Only' : 'Comprehensive'}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Pricing multiplier *" hint="Applied to the base premium (5% of car value for comprehensive, ₦20,000 flat for TPO).">
              <TextInput value={multiplier} onChange={(e) => setMultiplier(e.target.value)} inputMode="decimal" placeholder="1.0" />
              {errors.multiplier && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.multiplier}</p>}
            </Field>
            <Field label="Badge (optional)">
              <TextInput value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Most popular" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Claim settlement"><TextInput value={claimSettlement} onChange={(e) => setClaimSettlement(e.target.value)} placeholder="96%" /></Field>
            <Field label="Response time"><TextInput value={responseTime} onChange={(e) => setResponseTime(e.target.value)} placeholder="48 hours" /></Field>
            <Field label="Excess"><TextInput value={excess} onChange={(e) => setExcess(e.target.value)} placeholder="₦25,000" /></Field>
            <Field label="Repair network"><TextInput value={repairNetwork} onChange={(e) => setRepairNetwork(e.target.value)} placeholder="180+ garages" /></Field>
          </div>

          <Field label="Highlighted features">
            <TagAdder placeholder="e.g. Windscreen cover" onAdd={(v) => setFeatures((f) => (f.includes(v) ? f : [...f, v]))} />
            <TagList items={features} onRemove={(v) => setFeatures((f) => f.filter((x) => x !== v))} />
          </Field>

          <Field label="Exclusions">
            <TagAdder placeholder="e.g. Racing & speed testing" onAdd={(v) => setExclusions((f) => (f.includes(v) ? f : [...f, v]))} />
            <TagList items={exclusions} onRemove={(v) => setExclusions((f) => f.filter((x) => x !== v))} />
          </Field>

          {insurerKey === 'nsia' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isCorporatePreview} onChange={(e) => setIsCorporatePreview(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>Preview requirements for a corporate policy (NSIA asks for more)</span>
            </label>
          )}

          <RequirementsPreview insurerKey={insurerKey} coverType={coverType} isCorporate={isCorporatePreview} />
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white" style={{ borderColor: 'var(--border-default)' }}>
          <button type="button" onClick={onClose}
            className="h-10 px-5 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button type="button" onClick={submit}
            className="h-10 px-6 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <Plus className="w-4 h-4" />
            {initial ? 'Save changes' : 'Add plan'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function NewInsurerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (draft: DraftInsurer) => void }) {
  const [name, setName] = useState('')
  const [docTitle, setDocTitle] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [authScheme, setAuthScheme] = useState('')
  const [varName, setVarName] = useState('')
  const [varRequired, setVarRequired] = useState(true)
  const [varNotes, setVarNotes] = useState('')
  const [configVars, setConfigVars] = useState<DraftInsurer['configVars']>([])
  const [slotLabel, setSlotLabel] = useState('')
  const [slotRequired, setSlotRequired] = useState(true)
  const [documentSlots, setDocumentSlots] = useState<DocSlot[]>([])
  const [clientInfo, setClientInfo] = useState<MotorClientInfoConfig>({
    dateOfBirth: true, nin: true, bvn: false, gender: true, occupation: true, residentialState: true, corporateToggle: true, corporateDetails: true,
  })
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addVar() {
    if (!varName.trim()) return
    setConfigVars((v) => [...v, { name: varName.trim(), required: varRequired, notes: varNotes.trim() }])
    setVarName(''); setVarNotes('')
  }

  function addSlot() {
    if (!slotLabel.trim()) return
    setDocumentSlots((s) => [...s, { label: slotLabel.trim(), required: slotRequired }])
    setSlotLabel('')
  }

  function submit() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!baseUrl.trim()) e.baseUrl = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return
    onAdd({
      id: `draft_${Date.now()}`,
      name: name.trim(),
      docTitle: docTitle.trim() || `${name.trim()} — API documentation (title pending)`,
      baseUrl: baseUrl.trim(),
      authScheme: authScheme.trim() || 'Not yet specified',
      configVars,
      documentSlots,
      clientInfo,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>New insurer — technical spec</h2>
            <p className="font-sans text-[12px] mt-0.5 max-w-md" style={{ color: 'var(--text-muted)' }}>
              Captures everything a developer needs to build this insurer&apos;s API client from their documentation — it does not write the integration itself.
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] shrink-0" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <Field label="Company name *">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cornerstone Insurance" />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </Field>

          <Field label="Documentation title" hint="e.g. “Cornerstone Motor API — Partner Integration Guide v2”">
            <TextInput value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Exact title from their API docs" />
          </Field>

          <Field label="Base URL *" hint="Copy this straight from the docs, including test vs. live hosts if both exist.">
            <TextInput value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.insurer.com/v1" />
            {errors.baseUrl && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.baseUrl}</p>}
          </Field>

          <Field label="Authentication scheme" hint="e.g. Bearer token, Basic base64(id:key), OAuth2 client credentials, Sanctum login exchange.">
            <TextInput value={authScheme} onChange={(e) => setAuthScheme(e.target.value)} placeholder="How does their API authenticate requests?" />
          </Field>

          <div>
            <p className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Required environment variables</p>
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 mb-2">
              <TextInput value={varName} onChange={(e) => setVarName(e.target.value)} placeholder="e.g. INSURER_API_KEY" />
              <TextInput value={varNotes} onChange={(e) => setVarNotes(e.target.value)} placeholder="Notes (optional)" />
              <label className="flex items-center gap-1.5 px-2 font-sans text-[12px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={varRequired} onChange={(e) => setVarRequired(e.target.checked)} className="w-4 h-4 rounded" /> Required
              </label>
            </div>
            <button type="button" onClick={addVar} className="h-9 px-4 rounded-xl font-sans font-semibold text-[12px] text-white" style={{ backgroundColor: '#DC2626' }}>Add variable</button>
            {configVars.length > 0 && (
              <div className="space-y-1.5 mt-3">
                {configVars.map((v, i) => (
                  <div key={`${v.name}-${i}`} className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="min-w-0">
                      <code className="font-mono text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{v.name}</code>
                      {v.notes && <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{v.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {v.required && <span className="font-sans text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>Required</span>}
                      <button type="button" onClick={() => setConfigVars((arr) => arr.filter((_, idx) => idx !== i))} style={{ color: 'var(--text-muted)' }}><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Document uploads their API needs</p>
            <div className="grid sm:grid-cols-[1fr_auto] gap-2 mb-2">
              <TextInput value={slotLabel} onChange={(e) => setSlotLabel(e.target.value)} placeholder="e.g. Means of Identification" />
              <label className="flex items-center gap-1.5 px-2 font-sans text-[12px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={slotRequired} onChange={(e) => setSlotRequired(e.target.checked)} className="w-4 h-4 rounded" /> Required
              </label>
            </div>
            <button type="button" onClick={addSlot} className="h-9 px-4 rounded-xl font-sans font-semibold text-[12px] text-white" style={{ backgroundColor: '#DC2626' }}>Add document</button>
            {documentSlots.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {documentSlots.map((s, i) => (
                  <span key={`${s.label}-${i}`} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full font-sans text-[12px] border" style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}>
                    {s.label}{!s.required && ' (optional)'}
                    <button type="button" onClick={() => setDocumentSlots((arr) => arr.filter((_, idx) => idx !== i))} className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100" style={{ color: 'var(--text-muted)' }}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-sans font-medium text-[12px] block mb-2" style={{ color: 'var(--text-secondary)' }}>Customer details their API needs (beyond name/phone/email/address)</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {CLIENT_INFO_LABELS.map((f) => (
                <label key={f.key} className="flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer" style={{ borderColor: 'var(--border-subtle)' }}>
                  <input type="checkbox" checked={clientInfo[f.key]} onChange={(e) => setClientInfo((c) => ({ ...c, [f.key]: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Field label="Notes / known gaps" hint="Anything else worth flagging before someone starts building this — ambiguous docs, missing endpoints, sandbox limitations.">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional"
              className="w-full rounded-xl border-[1.5px] px-3.5 py-2.5 font-sans text-[13px] outline-none resize-none"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }} />
          </Field>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white" style={{ borderColor: 'var(--border-default)' }}>
          <button type="button" onClick={onClose}
            className="h-10 px-5 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button type="button" onClick={submit}
            className="h-10 px-6 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <FileCode2 className="w-4 h-4" />
            Save spec
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function StatusBadge({ configured, demo }: { configured: boolean | null; demo: boolean | null }) {
  if (configured === null) {
    return <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}>Checking…</span>
  }
  if (!configured) {
    return <span className="flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}><XCircle className="w-3 h-3" /> Not configured</span>
  }
  if (demo) {
    return <span className="flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}><FlaskConical className="w-3 h-3" /> Demo mode</span>
  }
  return <span className="flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}><CheckCircle2 className="w-3 h-3" /> Live</span>
}

function InsurerCard({
  insurer, plans, status, demo, onAddPlan, onEditPlan, onRemovePlan, onViewConfig,
}: {
  insurer: (typeof REAL_INSURERS)[number]
  plans: MotorPlan[]
  status: boolean | null
  demo: boolean | null
  onAddPlan: () => void
  onEditPlan: (plan: MotorPlan) => void
  onRemovePlan: (planId: string) => void
  onViewConfig: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const initials = initialsFor(insurer.name)

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
      <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-sans font-bold text-[14px] shrink-0 text-white" style={{ backgroundColor: insurer.color }}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{insurer.name}</p>
            <StatusBadge configured={status} demo={demo} />
          </div>
          <p className="font-sans text-[11px] mt-0.5 truncate italic" style={{ color: 'var(--text-muted)' }}>{insurer.docTitle}</p>
          <p className="font-sans text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{insurer.baseUrl} · {insurer.authScheme}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="font-sans text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}>
            {plans.length} plan{plans.length !== 1 ? 's' : ''}
          </span>
          <button type="button" onClick={onViewConfig}
            className="h-9 px-4 rounded-xl font-sans font-medium text-[12px] border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            Technical config
          </button>
          <button type="button" onClick={onAddPlan}
            className="h-9 px-4 rounded-xl font-sans font-semibold text-[12px] text-white flex items-center gap-1.5 transition-all hover:-translate-y-px"
            style={{ backgroundColor: insurer.color }}>
            <Plus className="w-3.5 h-3.5" /> Add plan
          </button>
          {plans.length > 0 && (
            <button type="button" onClick={() => setExpanded((v) => !v)}
              className="h-9 w-9 rounded-xl flex items-center justify-center border transition-colors hover:bg-[var(--surface-raised)]"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="plans" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div className="border-t divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {plans.map((plan) => (
                <div key={plan.id} className="px-5 py-3.5 flex items-start justify-between gap-3 hover:bg-[var(--surface-raised)] transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{plan.name}</p>
                      <span className="font-sans text-[11px] px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
                        {plan.coverType === 'tpo' ? 'Third Party' : 'Comprehensive'}
                      </span>
                      <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>×{plan.multiplier} multiplier</span>
                      {plan.badge && <span className="font-sans text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>{plan.badge}</span>}
                    </div>
                    {plan.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {plan.features.slice(0, 4).map((f) => (
                          <span key={f} className="font-sans text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)', backgroundColor: 'white' }}>{f}</span>
                        ))}
                        {plan.features.length > 4 && <span className="font-sans text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)', backgroundColor: 'white' }}>+{plan.features.length - 4}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button type="button" onClick={() => onEditPlan(plan)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white border" style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}><Pencil className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => onRemovePlan(plan.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 border" style={{ borderColor: 'var(--border-default)', color: '#DC2626' }}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TechnicalConfigDrawerContent({ insurer }: { insurer: (typeof REAL_INSURERS)[number] }) {
  const client = clientInfoFor(insurer.key)
  const compSlots = docSlotsFor(insurer.key, 'comprehensive', false)
  const tpoSlots = docSlotsFor(insurer.key, 'tpo', false)

  return (
    <div className="space-y-6">
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Base URL</p>
        <p className="font-mono text-[12px]" style={{ color: 'var(--text-primary)' }}>{insurer.baseUrl}</p>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Authentication</p>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{insurer.authScheme}</p>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2" style={{ color: 'var(--text-subtle)' }}>Your details fields this insurer needs</p>
        <div className="flex flex-wrap gap-2">
          {CLIENT_INFO_LABELS.map((f) => (
            <span key={f.key} className="font-sans text-[12px] px-2.5 py-1 rounded-full border flex items-center gap-1.5"
              style={{ borderColor: client[f.key] ? '#059669' : 'var(--border-default)', color: client[f.key] ? '#059669' : 'var(--text-muted)', backgroundColor: client[f.key] ? '#ECFDF5' : 'white' }}>
              {client[f.key] ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {f.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2" style={{ color: 'var(--text-subtle)' }}>Documents — Comprehensive</p>
        {compSlots.length === 0 ? <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>None required.</p> : (
          <ul className="space-y-1">{compSlots.map((s) => <li key={s.label} className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>• {s.label}{!s.required && ' (optional)'}</li>)}</ul>
        )}
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2" style={{ color: 'var(--text-subtle)' }}>Documents — Third Party</p>
        {tpoSlots.length === 0 ? <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>None required.</p> : (
          <ul className="space-y-1">{tpoSlots.map((s) => <li key={s.label} className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>• {s.label}{!s.required && ' (optional)'}</li>)}</ul>
        )}
      </div>
      <p className="font-sans text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
        Read live from this platform&apos;s own integration code — editing these values here would only change this admin view, not the running backend.
      </p>
    </div>
  )
}

function DraftDrawerContent({ draft }: { draft: DraftInsurer }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 px-4 py-3" style={{ borderColor: '#FED7AA', backgroundColor: '#FFFBEB' }}>
        <p className="font-sans font-bold text-[12px]" style={{ color: '#92400E' }}>Draft — not yet implemented</p>
        <p className="font-sans text-[12px] mt-1" style={{ color: '#92400E' }}>This is a captured spec, not a working integration. Building it still needs real API client code, same as NSIA/Tangerine/AIICO/Fortis.</p>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Documentation</p>
        <p className="font-sans text-[13px] italic" style={{ color: 'var(--text-secondary)' }}>{draft.docTitle}</p>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Base URL</p>
        <p className="font-mono text-[12px]" style={{ color: 'var(--text-primary)' }}>{draft.baseUrl}</p>
      </div>
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Authentication</p>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{draft.authScheme}</p>
      </div>
      {draft.configVars.length > 0 && (
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2" style={{ color: 'var(--text-subtle)' }}>Environment variables</p>
          <div className="space-y-1.5">
            {draft.configVars.map((v) => (
              <div key={v.name} className="rounded-xl border p-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{v.name}</code>
                  {v.required && <span className="font-sans text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>Required</span>}
                </div>
                {v.notes && <p className="font-sans text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{v.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {draft.documentSlots.length > 0 && (
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2" style={{ color: 'var(--text-subtle)' }}>Documents needed</p>
          <ul className="space-y-1">{draft.documentSlots.map((s) => <li key={s.label} className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>• {s.label}{!s.required && ' (optional)'}</li>)}</ul>
        </div>
      )}
      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2" style={{ color: 'var(--text-subtle)' }}>Your details fields needed</p>
        <div className="flex flex-wrap gap-2">
          {CLIENT_INFO_LABELS.filter((f) => draft.clientInfo[f.key]).map((f) => (
            <span key={f.key} className="font-sans text-[12px] px-2.5 py-1 rounded-full border" style={{ borderColor: '#059669', color: '#059669', backgroundColor: '#ECFDF5' }}>{f.label}</span>
          ))}
        </div>
      </div>
      {draft.notes && (
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Notes</p>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{draft.notes}</p>
        </div>
      )}
    </div>
  )
}

export default function AdminInsurersPage() {
  const [plans, setPlans] = useState<MotorPlan[]>(() => MOTOR_PLANS.map((p) => ({ ...p })))
  const [drafts, setDrafts] = useState<DraftInsurer[]>([])
  const [status, setStatus] = useState<LiveStatus | null>(null)
  const [demo, setDemo] = useState<LiveStatus | null>(null)

  const [addPlanFor, setAddPlanFor] = useState<InsurerKey | null>(null)
  const [editingPlan, setEditingPlan] = useState<{ key: InsurerKey; plan: MotorPlan } | null>(null)
  const [showNewInsurer, setShowNewInsurer] = useState(false)
  const [configFor, setConfigFor] = useState<InsurerKey | null>(null)
  const [draftOpen, setDraftOpen] = useState<DraftInsurer | null>(null)

  useEffect(() => {
    fetch('/api/motor/insurer-status')
      .then((r) => r.json())
      .then((body) => { if (body?.success) { setStatus(body.data); setDemo(body.demo) } })
      .catch(() => {})
  }, [])

  const plansByInsurer = useMemo(() => {
    const map: Record<InsurerKey, MotorPlan[]> = { nsia: [], tangerine: [], aiico: [], fortis: [] }
    for (const p of plans) {
      const key = insurerKeyOfPlan(p)
      if (key) map[key].push(p)
    }
    return map
  }, [plans])

  function savePlan(key: InsurerKey, plan: MotorPlan) {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === plan.id)
      return exists ? prev.map((p) => (p.id === plan.id ? plan : p)) : [...prev, plan]
    })
    setAddPlanFor(null)
    setEditingPlan(null)
  }

  function removePlan(planId: string) {
    setPlans((prev) => prev.filter((p) => p.id !== planId))
  }

  const totalPlans = plans.length
  const configInsurer = REAL_INSURERS.find((i) => i.key === configFor) ?? null
  const addPlanInsurer = REAL_INSURERS.find((i) => i.key === addPlanFor) ?? null

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Insurers</h1>
          <p className="font-sans text-[14px] mt-0.5 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            The 4 insurers this platform actually integrates with, grounded in their real API docs — plus a spec builder for onboarding the next one.
          </p>
        </div>
        <button type="button" onClick={() => setShowNewInsurer(true)}
          className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{ backgroundColor: '#DC2626' }}>
          <Building2 className="w-4 h-4" />
          New insurer spec
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Insurers integrated', value: REAL_INSURERS.length },
          { label: 'Total plans', value: totalPlans },
          { label: 'Live now', value: status ? REAL_INSURERS.filter((i) => status[i.key] && !demo?.[i.key]).length : '—' },
          { label: 'Draft specs', value: drafts.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: 'var(--border-default)' }}>
            <p className="font-sans text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-8">
        {REAL_INSURERS.map((insurer, i) => (
          <motion.div key={insurer.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <InsurerCard
              insurer={insurer}
              plans={plansByInsurer[insurer.key]}
              status={status ? status[insurer.key] : null}
              demo={demo ? demo[insurer.key] : null}
              onAddPlan={() => setAddPlanFor(insurer.key)}
              onEditPlan={(plan) => setEditingPlan({ key: insurer.key, plan })}
              onRemovePlan={removePlan}
              onViewConfig={() => setConfigFor(insurer.key)}
            />
          </motion.div>
        ))}
      </div>

      {drafts.length > 0 && (
        <div>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-3" style={{ color: 'var(--text-subtle)' }}>Draft integrations — spec captured, not yet built</p>
          <div className="space-y-3">
            {drafts.map((d) => (
              <button key={d.id} type="button" onClick={() => setDraftOpen(d)}
                className="w-full text-left bg-white rounded-2xl border-2 border-dashed px-5 py-4 flex items-center justify-between gap-3 hover:bg-[var(--surface-raised)] transition-colors"
                style={{ borderColor: 'var(--border-medium)' }}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                    <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>Draft</span>
                  </div>
                  <p className="font-sans text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{d.baseUrl}</p>
                </div>
                <FileCode2 className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {addPlanInsurer && (
          <PlanModal
            insurerKey={addPlanInsurer.key}
            insurerName={addPlanInsurer.name}
            onClose={() => setAddPlanFor(null)}
            onSave={(plan) => savePlan(addPlanInsurer.key, plan)}
          />
        )}
        {editingPlan && (
          <PlanModal
            insurerKey={editingPlan.key}
            insurerName={REAL_INSURERS.find((i) => i.key === editingPlan.key)?.name ?? ''}
            initial={editingPlan.plan}
            onClose={() => setEditingPlan(null)}
            onSave={(plan) => savePlan(editingPlan.key, plan)}
          />
        )}
        {showNewInsurer && (
          <NewInsurerModal onClose={() => setShowNewInsurer(false)} onAdd={(draft) => { setDrafts((d) => [draft, ...d]); setShowNewInsurer(false) }} />
        )}
      </AnimatePresence>

      <Drawer open={!!configInsurer} onClose={() => setConfigFor(null)} title={configInsurer?.name ?? ''} subtitle="Technical configuration" accent={configInsurer?.color}>
        {configInsurer && <TechnicalConfigDrawerContent insurer={configInsurer} />}
      </Drawer>

      <Drawer open={!!draftOpen} onClose={() => setDraftOpen(null)} title={draftOpen?.name ?? ''} subtitle="Draft integration spec" accent="#B45309">
        {draftOpen && <DraftDrawerContent draft={draftOpen} />}
      </Drawer>
    </div>
  )
}

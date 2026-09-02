'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, FlaskConical } from 'lucide-react'
import Drawer from '@/components/admin/Drawer'
import { initialsFor } from '@/lib/initials'

type InsurerKey = 'nsia' | 'tangerine' | 'aiico' | 'fortis'

interface PlatformRoute {
  method: string
  path: string
  partnerEndpoint: string
  purpose: string
}

interface ConfigVar {
  name: string
  required: string
  notes: string
}

interface Integration {
  key: InsurerKey
  name: string
  color: string
  docTitle: string
  summary: string
  partnerEndpointCount: number
  config: ConfigVar[]
  routes: PlatformRoute[]
  wiredIn: string[]
  verification: string[]
  knownConstraints: string[]
  sourceFiles: string[]
}

const INTEGRATIONS: Integration[] = [
  {
    key: 'nsia',
    name: 'NSIA Insurance',
    color: '#1D4ED8',
    docTitle: 'NSIA Insurance API — External Integration Guide v1.0',
    summary:
      'Every route maps directly to a numbered section of the guide. Motor is wired end to end; Marine, Personal Accident, Public Liability and Professional Indemnity have full API + mapping + validation support, ready for a quote journey to attach to.',
    partnerEndpointCount: 18,
    config: [
      { name: 'NSIA_ACCESS_TOKEN', required: 'Yes', notes: 'Bearer token issued to the partner account.' },
      { name: 'NSIA_ENV', required: 'No', notes: '"live"/"production" switches to the live base URL (default: test).' },
      { name: 'NSIA_BASE_URL', required: 'No', notes: 'Overrides the base URL entirely.' },
    ],
    routes: [
      { method: 'GET', path: '/api/nsia/check-user', partnerEndpoint: '/insured-client/check-userdetails', purpose: '§5.1 — does a profile already exist?' },
      { method: 'POST', path: '/api/nsia/profile', partnerEndpoint: '/account/profiling-insured-client', purpose: '§5.2 — create profile (checks first)' },
      { method: 'GET', path: '/api/nsia/dropdowns', partnerEndpoint: '/DropDown/*, /mobile/marine-cargo-rating', purpose: '§6, 7.1, 8.1, 10.1 — master data (10 lists)' },
      { method: 'POST', path: '/api/nsia/marine-pricing', partnerEndpoint: '/mobile/marine-pricing-implementation', purpose: '§8.2 — marine premium calculator' },
      { method: 'POST', path: '/api/nsia/submit/{product}', partnerEndpoint: '/mobile/non-life-* (5 products)', purpose: '§7.2, 8.3, 9.2, 10.2, 11.2 — submit an application' },
    ],
    wiredIn: [
      'NSIA Comprehensive and NSIA Third Party listed as selectable Motor plans',
      'Vehicle make dropdown merges NSIA’s own vehicle-brand list ahead of local constants, so submissions carry names NSIA recognises',
      'Documents step switches to NSIA’s own slots when an NSIA plan is picked — comprehensive cover adds 4 vehicle photos + purchase receipt, corporate adds the CAC certificate',
      'Checkout submits the application and shows the returned NSIA policy number on the receipt; a failed submission never shows a success screen',
    ],
    verification: [
      'tsc, eslint and a production build all pass clean',
      'Customer identity resolution (check-then-create) verified to never double-profile the same email on a retry',
      'Every required-document-slot combination (cover type × personal/corporate) checked against the guide’s own table',
    ],
    knownConstraints: [
      'File uploads live in memory for the page session (sessionStorage cannot hold file bytes) — a hard reload asks for re-upload rather than submitting an incomplete application',
      'NIN/NIMC lookup is not integrated (guide recommends it, but leaves the provider choice to the partner)',
      'Motor premium is computed locally — NSIA only publishes a premium calculator for marine',
    ],
    sourceFiles: ['src/lib/nsia/{config,client,api,schemas,mappers,documents,files,browser,types}.ts', 'docs/nsia-integration.md'],
  },
  {
    key: 'tangerine',
    name: 'Tangerine Insurance',
    color: '#D97706',
    docTitle: 'Tangerine Comprehensive Motor Insurance API + Tangerine 3rd Party Insurance API',
    summary:
      'Two manuals, two base URLs, one shared auth scheme. The platform stores vehicle data as free text; a resolver matches it against Tangerine’s own numeric codes by name server-side, so no Tangerine-specific dropdown UI was needed.',
    partnerEndpointCount: 21,
    config: [
      { name: 'TANGERINE_USER_ID', required: 'Yes', notes: 'Same UserID for both product lines.' },
      { name: 'TANGERINE_API_KEY', required: 'Yes', notes: 'base64(userid:APIKEY) — no "Bearer" prefix, per the manual.' },
      { name: 'CLOUDINARY_CLOUD_NAME', required: 'Yes, to submit', notes: 'ImageUrlList takes hosted URLs, not file bytes.' },
      { name: 'CLOUDINARY_UPLOAD_PRESET', required: 'Yes, to submit', notes: 'Must be an unsigned preset.' },
    ],
    routes: [
      { method: 'GET', path: '/api/tangerine/dropdowns', partnerEndpoint: 'GetVehicleColours/EngineCapacityCodes/StateCodes/LGACodes/MakeCodes/ModelCodes (×2 lines)', purpose: 'Master data, cached 1hr' },
      { method: 'POST', path: '/api/tangerine/submit/{product}', partnerEndpoint: 'GenerateComprehensivePolicy / GeneratePolicy', purpose: 'Resolves codes, uploads photos, submits the policy' },
    ],
    wiredIn: [
      'Tangerine Comprehensive and Tangerine Third Party listed as selectable Motor plans',
      'Documents step switches to Tangerine’s own photo slots — front + chassis mandatory, back + side optional',
      'A Tangerine-only fields panel collects LGA, vehicle registration date, mileage (comprehensive only) and TIN (corporate only) — fields no other insurer here asks for',
      'Vehicle photos are uploaded to Cloudinary and the resulting hosted URLs are what Tangerine actually receives',
    ],
    verification: [
      'Make/model splitter tested against multi-word makes (e.g. "Land Rover Discovery") to confirm it isn’t cut short',
      'Colour resolver handles British/American spelling (gray → grey) since the two lists disagree',
      'A resolution failure returns a clear 400 naming the exact field and text that couldn’t be matched, instead of a cryptic Tangerine rejection',
    ],
    knownConstraints: [
      'The manual’s own example responses are inconsistently double-encoded JSON in places — the client unwraps one extra layer defensively, unverified against the live API',
      'The 3rd-party manual advertises 12 endpoints but documents 11 — nothing missing on our side, flagged for later',
      'generateTangAutoPolicy (fixed-premium tiers) and renewThirdPartyPolicy are implemented but have no UI yet — no flat-rate product card or renewals flow to attach them to',
    ],
    sourceFiles: ['src/lib/tangerine/{config,client,api,resolve,images,documents,mappers,schemas,browser,types}.ts', 'docs/tangerine-integration.md'],
  },
  {
    key: 'aiico',
    name: 'AIICO Insurance',
    color: '#059669',
    docTitle: 'AIICO Partner API (Motor: Private Third Party, Comprehensive, Renewal; Life Payments: Renewal)',
    summary:
      'AIICO’s docs cover 6 products; Motor and Life Payments Renewal have been shared and integrated so far. Title/gender/body-type/colour/make/model mismatches between AIICO’s controlled vocabulary and this platform’s free-text fields are resolved server-side at submission time.',
    partnerEndpointCount: 17,
    config: [
      { name: 'AIICO_BASE_URL', required: 'Yes (or AIICO_ENV)', notes: 'UAT/production hosts are not in the docs and must be set explicitly.' },
      { name: 'AIICO_ENV', required: 'No', notes: 'staging (default) / uat / production.' },
      { name: 'AIICO_BEARER_TOKEN', required: 'Yes', notes: 'Pre-issued JWT — AIICO documents no login/refresh flow.' },
    ],
    routes: [
      { method: 'GET', path: '/api/aiico/dropdowns', partnerEndpoint: 'GetTitles / GetGenders / GetBodyTypes / GetColorList / GetManufactureYears / GetVehicleMake(Model)', purpose: 'Master + cascading vehicle data' },
      { method: 'GET', path: '/api/aiico/vehicle-lookup', partnerEndpoint: 'GetVehicleDetails', purpose: 'AutoReg plate lookup' },
      { method: 'GET', path: '/api/aiico/premium', partnerEndpoint: 'ComputeThirdPartyMotorPremium', purpose: 'Third Party fixed-rate lookup' },
      { method: 'POST', path: '/api/aiico/submit/motor', partnerEndpoint: 'PostMotorSchedule → FinalizePartnerPayment', purpose: 'Registers the risk, then confirms payment' },
      { method: 'GET', path: '/api/aiico/renewal', partnerEndpoint: 'GetAutoRenewalDetails', purpose: 'Renewal quote for an existing motor policy' },
      { method: 'POST', path: '/api/aiico/submit/motor-renewal', partnerEndpoint: 'PostMotorRenewalSchedule → FinalizePartnerPayment', purpose: 'Same two-call pattern for motor renewals' },
      { method: 'GET', path: '/api/aiico/life-renewal', partnerEndpoint: 'GetLifePolicyRenewalDetails', purpose: 'Renewal quote for an existing life policy' },
      { method: 'POST', path: '/api/aiico/submit/life-renewal', partnerEndpoint: 'PostLifeRenewalSchedule → FinalizePartnerPayment', purpose: 'Same two-call pattern for life renewals' },
    ],
    wiredIn: [
      'AIICO Comprehensive and AIICO Third Party listed as selectable Motor plans, alongside Fortis/NSIA/Tangerine',
      'A small AIICO-only Title panel feeds GetTitles by name — the only new UI field this integration needed',
      'Vehicle make/model, gender, body type and colour are matched against AIICO’s controlled vocabulary automatically, with no new dropdowns',
      'PostMotorSchedule then FinalizePartnerPayment run back-to-back in one route, called from checkout only after payment is approved',
      '/renewals/life is a standalone self-service page: look up a life policy by number, review what’s due, pay by card via Payloft, then PostLifeRenewalSchedule → FinalizePartnerPayment run automatically once payment is approved',
    ],
    verification: [
      'Drove /api/aiico/submit/motor directly with a full multipart payload (customer + vehicle + payment + fake images) — validated and resolved correctly end to end',
      'With fake credentials pointed at the real staging host, the request reached AIICO and failed only at the sandbox’s own network boundary (confirmed identical via a raw curl to the same host)',
      'Real-browser check: both plans render, selecting one persists correctly, the Title panel and all 4 AIICO document slots render in place of the generic ones',
      'Life renewal routes checked locally: missing policyNo, unconfigured credentials, and invalid submit payloads all return the expected 400/503 with field-level errors',
    ],
    knownConstraints: [
      'No live credentials were available to test a real end-to-end submission',
      'The quote flow doesn’t collect a separate engine number — chassis/VIN is reused as the closest available field',
      'The Comprehensive subclass/cover-type ID is a fixed constant from the docs; AIICO exposes more than one option via GetProductSubClassCoverTypes, to be revisited once the full list is confirmed',
      'Motor Renewal (GetAutoRenewalDetails / PostMotorRenewalSchedule) still has no UI — only Life Renewal got a self-service page so far',
    ],
    sourceFiles: ['src/lib/aiico/{config,client,api,resolve,documents,mappers,schemas,browser,types}.ts', 'docs/aiico-integration.md'],
  },
  {
    key: 'fortis',
    name: 'Fortis Global Insurance',
    color: '#7C3AED',
    docTitle: 'Fortis Global External Motor API Documentation',
    summary:
      'This integration existed before the documentation did, built by reverse-engineering the live API. This pass checked every field against the real spec, added the 3 documented endpoints that were missing, and hardened validation and error handling.',
    partnerEndpointCount: 5,
    config: [
      { name: 'FORTIS_CLIENT_ID', required: 'Yes', notes: 'Docs publish a literal sandbox test value.' },
      { name: 'FORTIS_CLIENT_SECRET', required: 'Yes', notes: 'Docs publish a literal sandbox test value.' },
    ],
    routes: [
      { method: 'GET', path: '/api/fortis/catalog', partnerEndpoint: '/external-api/motor/catalog', purpose: 'Motor products & covers, used by plan select' },
      { method: 'POST', path: '/api/fortis/submit', partnerEndpoint: '/external-api/motor/requests', purpose: 'Submit an application' },
      { method: 'GET', path: '/api/fortis/me', partnerEndpoint: '/external-api/me', purpose: 'Confirms auth + catalog scope (added this pass)' },
      { method: 'GET', path: '/api/fortis/requests', partnerEndpoint: '/external-api/motor/requests', purpose: 'Lists this platform’s own submissions (added this pass)' },
      { method: 'GET', path: '/api/fortis/requests/{id}', partnerEndpoint: '/external-api/motor/requests/{requestRecord}', purpose: 'One submitted request in detail (added this pass)' },
    ],
    wiredIn: [
      'Fortis Global Comprehensive and Third Party listed as selectable Motor plans',
      'Catalog-flattening logic (previously duplicated in 3 places) consolidated into one shared function, used everywhere',
      'Zod validation added to the submit route — a malformed request now fails with a clear 400 instead of reaching Fortis with garbage data',
      'Error responses sanitized to match every other integration on this platform: full detail logged server-side, a generic or Fortis-decline message returned to the caller',
    ],
    verification: [
      'Confirmed the existing catalog + submit routes already matched the documented request/response shape field-for-field before any changes',
      'An unconfigured request and one using the real published test credentials both correctly reach the network boundary and fail only there — confirming the integration code itself is not the problem',
      'Sandbox is explicit in Fortis’s own docs: submissions land in a temporary table pending manual review, never the live policy workflow',
    ],
    knownConstraints: [
      'No live call has succeeded from this environment — the sandbox blocks outbound access to the Fortis host',
      'Whether Fortis’s catalog response is a flat list or a nested tree is still unconfirmed; the parser now handles both shapes defensively',
      '/api/fortis/me, /requests and /requests/{id} have no UI yet — built for completeness, ready to wire in',
    ],
    sourceFiles: ['src/lib/fortis/{config,client,api,catalog,mappers,schemas,http,types}.ts', 'docs/fortis-integration.md'],
  },
]

/** "NSIA Insurance" -> "NS" (keep an all-caps acronym intact) rather than "NI" (first letter of each word). */
type LiveStatus = Record<InsurerKey, boolean>

function StatusBadge({ configured, demo }: { configured: boolean | null; demo: boolean | null }) {
  if (configured === null) {
    return (
      <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
        Checking…
      </span>
    )
  }
  if (!configured) {
    return (
      <span className="flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
        <XCircle className="w-3 h-3" /> Not configured
      </span>
    )
  }
  if (demo) {
    return (
      <span className="flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
        <FlaskConical className="w-3 h-3" /> Demo mode
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
      <CheckCircle2 className="w-3 h-3" /> Live
    </span>
  )
}

export default function AdminIntegrationsPage() {
  const [status, setStatus] = useState<LiveStatus | null>(null)
  const [demo, setDemo] = useState<LiveStatus | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const [openKey, setOpenKey] = useState<InsurerKey | null>(null)

  useEffect(() => {
    fetch('/api/motor/insurer-status')
      .then((r) => r.json())
      .then((body) => {
        if (!body?.success) throw new Error()
        setStatus(body.data)
        setDemo(body.demo)
      })
      .catch(() => setFetchError(true))
  }, [])

  const totalRoutes = INTEGRATIONS.reduce((sum, i) => sum + i.routes.length, 0)
  const totalPartnerEndpoints = INTEGRATIONS.reduce((sum, i) => sum + i.partnerEndpointCount, 0)
  const liveCount = status ? INTEGRATIONS.filter((i) => status[i.key] && !demo?.[i.key]).length : 0
  const demoCount = status ? INTEGRATIONS.filter((i) => status[i.key] && demo?.[i.key]).length : 0

  const open = INTEGRATIONS.find((i) => i.key === openKey) ?? null

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Insurer API Integrations</h1>
        <p className="font-sans text-[14px] mt-0.5 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          Every partner API this platform talks to, built directly from each insurer&apos;s own documentation. Status below is read live from the running platform, not a claim.
        </p>
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border mb-5" style={{ borderColor: '#FED7AA', backgroundColor: '#FFFBEB' }}>
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#B45309' }} />
          <p className="font-sans text-[13px]" style={{ color: '#92400E' }}>Couldn&apos;t reach the live status endpoint — showing integration details without current configuration state.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Insurers integrated', value: INTEGRATIONS.length },
          { label: 'Platform API routes', value: totalRoutes },
          { label: 'Partner endpoints wired', value: totalPartnerEndpoints },
          { label: 'Live now', value: status ? `${liveCount} live · ${demoCount} demo` : '—' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: 'var(--border-default)' }}>
            <p className="font-sans text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((ins, i) => (
          <motion.div
            key={ins.key}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border p-5 flex flex-col"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-display font-bold text-[14px]" style={{ backgroundColor: ins.color }}>
                  {initialsFor(ins.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-[16px] truncate" style={{ color: 'var(--text-primary)' }}>{ins.name}</h3>
                  <p className="font-sans text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{ins.routes.length} platform routes · {ins.partnerEndpointCount} partner endpoints</p>
                </div>
              </div>
              <StatusBadge configured={status ? status[ins.key] : null} demo={demo ? demo[ins.key] : null} />
            </div>

            <p className="font-sans text-[12px] italic mb-2" style={{ color: 'var(--text-muted)' }}>{ins.docTitle}</p>
            <p className="font-sans text-[13px] leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{ins.summary}</p>

            <button
              type="button"
              onClick={() => setOpenKey(ins.key)}
              className="self-start flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-semibold text-[12px] border transition-all hover:-translate-y-px"
              style={{ borderColor: ins.color, color: ins.color }}
            >
              View integration details <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>

      <Drawer
        open={!!open}
        onClose={() => setOpenKey(null)}
        title={open?.name ?? ''}
        subtitle={open?.docTitle}
        accent={open?.color}
      >
        {open && <IntegrationDetail integration={open} />}
      </Drawer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-2.5" style={{ color: 'var(--text-subtle)' }}>{title}</p>
      {children}
    </div>
  )
}

function IntegrationDetail({ integration }: { integration: Integration }) {
  return (
    <div>
      <Section title="Configuration">
        <div className="space-y-2">
          {integration.config.map((c) => (
            <div key={c.name} className="rounded-xl border p-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</code>
                <span className="font-sans text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: c.required === 'Yes' ? '#FEF2F2' : 'var(--surface-raised)', color: c.required === 'Yes' ? '#DC2626' : 'var(--text-muted)' }}>
                  {c.required === 'Yes' ? 'Required' : c.required}
                </span>
              </div>
              <p className="font-sans text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{c.notes}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`Platform routes (${integration.routes.length})`}>
        <div className="space-y-2">
          {integration.routes.map((r) => (
            <div key={r.path} className="rounded-xl border p-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}>{r.method}</span>
                <code className="font-mono text-[12px]" style={{ color: 'var(--text-primary)' }}>{r.path}</code>
              </div>
              <p className="font-sans text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>→ {r.partnerEndpoint}</p>
              <p className="font-sans text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>{r.purpose}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Wired into the platform">
        <ul className="space-y-2">
          {integration.wiredIn.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#059669' }} />
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Verified">
        <ul className="space-y-2">
          {integration.verification.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#1D4ED8' }} />
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Known constraints">
        <ul className="space-y-2">
          {integration.knownConstraints.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#B45309' }} />
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Source">
        <div className="rounded-xl border p-3 font-mono text-[11.5px] leading-relaxed" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}>
          {integration.sourceFiles.map((f) => <div key={f}>{f}</div>)}
        </div>
      </Section>
    </div>
  )
}

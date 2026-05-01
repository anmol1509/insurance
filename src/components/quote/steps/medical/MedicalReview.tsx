'use client'
import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateMedicalPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const UNDERWRITERS = [
  { id: 'leadway',  name: 'Leadway Health',     rating: '4.8', badge: 'Most popular' },
  { id: 'hygeia',   name: 'Hygeia HMO',         rating: '4.7', badge: 'Best network' },
  { id: 'reliance', name: 'Reliance HMO',        rating: '4.6', badge: '' },
  { id: 'aiico',    name: 'AIICO Medical',       rating: '4.5', badge: '' },
]

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

export default function MedicalReview() {
  const { medicalData, updateMedical, setCalculatedPremium } = useQuoteStore()
  const [selectedUnderwriter, setSelectedUnderwriter] = useState(medicalData.selectedUnderwriter ?? 'leadway')

  const { total, breakdown } = calculateMedicalPremium(medicalData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
    updateMedical({ selectedUnderwriter })
  }, [total, selectedUnderwriter])

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--medical-700)' }}>Personal Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="Full Name" value={medicalData.fullName} />
          <Row label="Date of Birth" value={medicalData.dateOfBirth} />
          <Row label="NIN" value={medicalData.nin ? `****${medicalData.nin.slice(-4)}` : undefined} />
          <Row label="Phone" value={medicalData.phone} />
          <Row label="Email" value={medicalData.email} />
          <Row label="Gender" value={medicalData.gender} />
          <Row label="Plan Type" value={medicalData.planType} />
          <Row label="Number of Lives" value={medicalData.numberOfLives} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--medical-700)' }}>Coverage Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="Plan Tier" value={medicalData.planTier} />
          <Row label="Benefits" value={medicalData.benefits.join(', ')} />
          <Row label="Critical Illness" value={medicalData.criticalIllness ? 'Yes' : undefined} />
          <Row label="Dental Cover" value={medicalData.dentalCover ? 'Yes' : undefined} />
          <Row label="Vision Cover" value={medicalData.visionCover ? 'Yes' : undefined} />
          <Row label="Personal Accident Rider" value={medicalData.personalAccidentRider ? 'Yes' : undefined} />
          <Row label="Geo Coverage" value={medicalData.geoCoverage} />
        </div>
      </section>

      <motion.div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-100)' }}
      >
        <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>Estimated annual premium</p>
        <p className="font-display font-extrabold text-[42px] leading-none" style={{ color: 'var(--medical-600)' }}>
          {formatNaira(total)}
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--medical-100)] flex flex-col gap-1.5">
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{formatNaira(v)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--text-primary)' }}>Select Underwriter</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {UNDERWRITERS.map((uw) => {
            const selected = selectedUnderwriter === uw.id
            return (
              <button
                key={uw.id}
                type="button"
                onClick={() => setSelectedUnderwriter(uw.id)}
                className="relative border-[1.5px] rounded-2xl p-4 text-left transition-all"
                style={selected ? { borderColor: 'var(--medical-600)', backgroundColor: 'var(--medical-50)' } : { borderColor: 'var(--border-default)', backgroundColor: 'white' }}
              >
                {uw.badge && (
                  <span className="absolute top-3 right-3 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--green-100)', color: 'var(--green-700)' }}>
                    {uw.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  {selected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--medical-600)' }} />}
                  <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{uw.name}</p>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>★ {uw.rating} · NAICOM Licensed</p>
                <p className="font-display font-bold text-base mt-2" style={{ color: selected ? 'var(--medical-600)' : 'var(--text-primary)' }}>{formatNaira(total)}</p>
              </button>
            )
          })}
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={medicalData.reviewConfirmed}
          onChange={(e) => updateMedical({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all information provided is accurate. I understand that non-disclosure of medical history may render this policy void.
        </span>
      </label>
    </div>
  )
}

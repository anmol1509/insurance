'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateMedicalPremium } from '@/lib/premiumCalculator'
import { motion } from 'framer-motion'

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium text-right max-w-[55%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

export default function MedicalReview() {
  const { medicalData, updateMedical, setCalculatedPremium } = useQuoteStore()
  const { total, breakdown } = calculateMedicalPremium(medicalData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
  }, [total])

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-100)' }}>
        <span className="text-lg">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Please review your details carefully. After submitting, you'll see personalised plans from multiple HMOs and insurers.
        </p>
      </div>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--medical-700)' }}>Personal Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
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
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Plan Tier" value={medicalData.planTier} />
          <Row label="Benefits" value={medicalData.benefits.join(', ')} />
          <Row label="Critical Illness" value={medicalData.criticalIllness ? 'Yes' : undefined} />
          <Row label="Dental Cover" value={medicalData.dentalCover ? 'Yes' : undefined} />
          <Row label="Vision Cover" value={medicalData.visionCover ? 'Yes' : undefined} />
          <Row label="Personal Accident Rider" value={medicalData.personalAccidentRider ? 'Yes' : undefined} />
          <Row label="Geo Coverage" value={medicalData.geoCoverage} />
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

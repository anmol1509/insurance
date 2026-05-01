'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateBusinessPremium } from '@/lib/premiumCalculator'
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

export default function BusinessReview() {
  const { businessData, updateBusiness, setCalculatedPremium } = useQuoteStore()
  const { total, breakdown } = calculateBusinessPremium(businessData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
  }, [total])

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--business-50)', borderColor: 'var(--business-100)' }}>
        <span className="text-lg">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Please review your details carefully. After submitting, you'll see personalised plans from multiple NAICOM-licensed insurers.
        </p>
      </div>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--business-700)' }}>Business Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Business Name" value={businessData.businessName} />
          <Row label="CAC Number" value={businessData.cacNumber} />
          <Row label="Business Type" value={businessData.businessType} />
          <Row label="Business Size" value={businessData.businessSize} />
          <Row label="Employees" value={businessData.numberOfEmployees} />
          <Row label="Annual Revenue" value={businessData.annualRevenue} />
          <Row label="Address" value={businessData.businessAddress} />
          <Row label="State" value={businessData.state} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--business-700)' }}>Covers Selected</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Coverage Items" value={businessData.coverageItems.join(', ').replace(/_/g, ' ') || 'None'} />
          <Row label="Construction Type" value={businessData.constructionType} />
          <Row label="Operating Hours" value={businessData.operatingHours} />
          <Row label="Hazardous Materials" value={businessData.hazardousMaterials ? businessData.hazardousTypes.join(', ') || 'Yes' : 'None'} />
          <Row label="Site Inspection Consent" value={businessData.siteVerificationConsent ? 'Yes' : 'No'} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--business-700)' }}>Director / Contact</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Name" value={businessData.directorName} />
          <Row label="NIN" value={businessData.directorNin ? `****${businessData.directorNin.slice(-4)}` : undefined} />
          <Row label="Phone" value={businessData.directorPhone} />
          <Row label="Email" value={businessData.directorEmail} />
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={businessData.reviewConfirmed}
          onChange={(e) => updateBusiness({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all information above is accurate. I understand that material misrepresentation may void this policy.
        </span>
      </label>
    </div>
  )
}

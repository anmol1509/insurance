'use client'
import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateBusinessPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const UNDERWRITERS = [
  { id: 'leadway',  name: 'Leadway Assurance',    rating: '4.8', badge: 'Most popular' },
  { id: 'zenith',   name: 'Zenith Insurance',     rating: '4.7', badge: '' },
  { id: 'nsia',     name: 'NSIA Insurance',       rating: '4.6', badge: 'Best price' },
  { id: 'custodian',name: 'Custodian Insurance',  rating: '4.5', badge: '' },
]

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
  const [selectedUnderwriter, setSelectedUnderwriter] = useState(businessData.selectedUnderwriter ?? 'leadway')

  const { total, breakdown } = calculateBusinessPremium(businessData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
    updateBusiness({ selectedUnderwriter })
  }, [total, selectedUnderwriter])

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--business-700)' }}>Business Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
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
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="Coverage Items" value={businessData.coverageItems.join(', ').replace(/_/g, ' ') || 'None'} />
          <Row label="Construction Type" value={businessData.constructionType} />
          <Row label="Operating Hours" value={businessData.operatingHours} />
          <Row label="Hazardous Materials" value={businessData.hazardousMaterials ? businessData.hazardousTypes.join(', ') || 'Yes' : 'None'} />
          <Row label="Site Inspection Consent" value={businessData.siteVerificationConsent ? 'Yes' : 'No'} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--business-700)' }}>Director / Contact</h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="Name" value={businessData.directorName} />
          <Row label="NIN" value={businessData.directorNin ? `****${businessData.directorNin.slice(-4)}` : undefined} />
          <Row label="Phone" value={businessData.directorPhone} />
          <Row label="Email" value={businessData.directorEmail} />
        </div>
      </section>

      <motion.div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'var(--business-50)', borderColor: 'var(--business-100)' }}
      >
        <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>Estimated annual premium</p>
        <p className="font-display font-extrabold text-[42px] leading-none" style={{ color: 'var(--business-600)' }}>
          {formatNaira(total)}
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--business-100)] flex flex-col gap-1.5">
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-sans text-[13px] capitalize" style={{ color: 'var(--text-muted)' }}>{k}</span>
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
                style={selected ? { borderColor: 'var(--business-600)', backgroundColor: 'var(--business-50)' } : { borderColor: 'var(--border-default)', backgroundColor: 'white' }}
              >
                {uw.badge && (
                  <span className="absolute top-3 right-3 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--green-100)', color: 'var(--green-700)' }}>
                    {uw.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  {selected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--business-600)' }} />}
                  <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{uw.name}</p>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>★ {uw.rating} · NAICOM Licensed</p>
                <p className="font-display font-bold text-base mt-2" style={{ color: selected ? 'var(--business-600)' : 'var(--text-primary)' }}>{formatNaira(total)}</p>
              </button>
            )
          })}
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

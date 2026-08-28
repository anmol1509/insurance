'use client'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { motion } from 'framer-motion'

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium text-right max-w-[55%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

export default function MarineReview() {
  const { marineData, updateMarine, calculatedPremium } = useQuoteStore()

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--marine-50)', borderColor: 'var(--marine-100)' }}>
        <span className="text-lg">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Please review your details carefully. Your policy is issued directly by NSIA Insurance on submission.
        </p>
      </div>

      {calculatedPremium != null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 p-5 flex items-center justify-between"
          style={{ borderColor: 'var(--marine-100)', backgroundColor: 'var(--marine-50)' }}
        >
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--marine-700)' }}>Premium</h3>
          <span className="font-display font-extrabold text-[22px]" style={{ color: 'var(--marine-600)' }}>
            {formatNaira(calculatedPremium)}
          </span>
        </motion.div>
      )}

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--marine-700)' }}>Shipment Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Cargo Category" value={marineData.cargoCategory} />
          <Row label="Description" value={marineData.cargoDescription} />
          <Row label="Sum Insured" value={marineData.sumInsured != null ? formatNaira(marineData.sumInsured) : undefined} />
          <Row label="Currency" value={marineData.currency} />
          <Row label="Vessel / Carrier" value={marineData.vesselName} />
          <Row label="Voyage" value={marineData.voyageFrom && marineData.voyageTo ? `${marineData.voyageFrom} → ${marineData.voyageTo}` : undefined} />
          <Row label="Packing Type" value={marineData.packingType} />
          <Row label="Number of Packages" value={marineData.numberOfPackages} />
          <Row label="Cover Type" value={marineData.coverType} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--marine-700)' }}>Policyholder Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Full Name" value={marineData.fullName} />
          <Row label="Email" value={marineData.email} />
          <Row label="Phone" value={marineData.phone} />
          <Row label="NIN" value={marineData.nin ? `****${marineData.nin.slice(-4)}` : undefined} />
          <Row label="Address" value={marineData.residentialAddress} />
          <Row label="State" value={marineData.residentialState} />
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={marineData.reviewConfirmed}
          onChange={(e) => updateMarine({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details are correct and I have read and accepted the policy terms and conditions.
        </span>
      </label>
    </div>
  )
}

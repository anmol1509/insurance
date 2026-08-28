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

export default function PersonalAccidentReview() {
  const { personalAccidentData, updatePersonalAccident, calculatedPremium } = useQuoteStore()

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--pa-50)', borderColor: 'var(--pa-100)' }}>
        <span className="text-lg">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Please review your details carefully. Your policy is issued directly by NSIA Insurance on submission.
        </p>
      </div>

      {calculatedPremium != null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 p-5 flex items-center justify-between"
          style={{ borderColor: 'var(--pa-100)', backgroundColor: 'var(--pa-50)' }}
        >
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--pa-700)' }}>Premium</h3>
          <span className="font-display font-extrabold text-[22px]" style={{ color: 'var(--pa-600)' }}>
            {formatNaira(calculatedPremium)}
          </span>
        </motion.div>
      )}

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--pa-700)' }}>About You</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Date of Birth" value={personalAccidentData.dateOfBirth} />
          <Row label="Gender" value={personalAccidentData.gender} />
          <Row label="Occupation" value={personalAccidentData.occupation} />
          <Row label="Coverage Amount" value={personalAccidentData.sumInsured != null ? formatNaira(personalAccidentData.sumInsured) : undefined} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--pa-700)' }}>Beneficiary & Health</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Beneficiary" value={personalAccidentData.beneficiaryName} />
          <Row label="Relationship" value={personalAccidentData.beneficiaryRelationship} />
          <Row label="Pre-existing Condition" value={personalAccidentData.hasPreExistingCondition ? 'Yes' : 'No'} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--pa-700)' }}>Policyholder Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Full Name" value={personalAccidentData.fullName} />
          <Row label="Email" value={personalAccidentData.email} />
          <Row label="Phone" value={personalAccidentData.phone} />
          <Row label="NIN" value={personalAccidentData.nin ? `****${personalAccidentData.nin.slice(-4)}` : undefined} />
          <Row label="Address" value={personalAccidentData.residentialAddress} />
          <Row label="State" value={personalAccidentData.residentialState} />
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={personalAccidentData.reviewConfirmed}
          onChange={(e) => updatePersonalAccident({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details are correct and I have read and accepted the policy terms and conditions.
        </span>
      </label>
    </div>
  )
}

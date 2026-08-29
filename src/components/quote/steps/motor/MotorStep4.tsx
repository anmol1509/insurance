'use client'
import { useQuoteStore } from '@/store/quoteStore'
import type { MotorData } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import NINField from '@/components/ui/NINField'
import { AnimatePresence, motion } from 'framer-motion'
import {
  NIGERIAN_STATES, GENDERS, OCCUPATIONS,
} from '@/lib/constants'
import { MOTOR_PLANS } from '@/lib/motorPlans'
import { motorClientInfoConfig } from '@/lib/motorClientInfo'

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

function ReviewRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium text-right max-w-[55%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const occupationOptions = OCCUPATIONS.map((o) => ({ value: o, label: o }))

export default function MotorStep4() {
  const { motorData, updateMotor, calculatedPremium } = useQuoteStore()
  const config = motorClientInfoConfig(motorData.selectedUnderwriter)
  const selectedPlan = motorData.selectedUnderwriter
    ? MOTOR_PLANS.find((p) => p.id === motorData.selectedUnderwriter)
    : null

  return (
    <div className="space-y-7">
      {selectedPlan && (
        <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
          Showing only the details {selectedPlan.insurer} needs.
        </p>
      )}

      <div className={config.dateOfBirth ? 'grid md:grid-cols-2 gap-5' : ''}>
        <Input
          label="Full Name"
          required
          value={motorData.fullName}
          onChange={(e) => updateMotor({ fullName: e.target.value })}
          placeholder="As on your ID document"
          productColor="var(--motor-600)"
        />
        {config.dateOfBirth && (
          <Input
            label="Date of Birth"
            required
            type="date"
            value={motorData.dateOfBirth}
            onChange={(e) => updateMotor({ dateOfBirth: e.target.value })}
            hint="Must be 18 or older"
            productColor="var(--motor-600)"
          />
        )}
      </div>

      {(config.nin || config.bvn) && (
        <div className={config.nin && config.bvn ? 'grid md:grid-cols-2 gap-5' : ''}>
          {config.nin && (
            <NINField
              value={motorData.nin}
              onChange={(v) => updateMotor({ nin: v })}
              productColor="var(--motor-600)"
            />
          )}
          {config.bvn && (
            <Input
              label="Bank Verification Number (BVN)"
              value={motorData.bvn}
              onChange={(e) => updateMotor({ bvn: e.target.value.replace(/\D/g, '').slice(0, 11) })}
              placeholder="11-digit BVN"
              inputMode="numeric"
              maxLength={11}
              productColor="var(--motor-600)"
            />
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Phone Number"
          required
          prefix="phone"
          value={motorData.phone.replace(/^(\+234|0)/, '')}
          onChange={(e) => updateMotor({ phone: '0' + e.target.value.replace(/\D/g, '') })}
          placeholder="8012345678"
          inputMode="tel"
          productColor="var(--motor-600)"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={motorData.email}
          onChange={(e) => updateMotor({ email: e.target.value })}
          placeholder="you@example.com"
          productColor="var(--motor-600)"
        />
      </div>

      {config.gender && (
        <div>
          <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
            Gender <span className="text-[var(--error)]">*</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            {GENDERS.map((g) => (
              <RadioCard
                key={g}
                label={g}
                selected={motorData.gender === g}
                onClick={() => updateMotor({ gender: g })}
                productColor="var(--motor-600)"
                productColorBg="var(--motor-50)"
              />
            ))}
          </div>
        </div>
      )}

      {(config.occupation || config.residentialState) && (
        <div className={config.occupation && config.residentialState ? 'grid md:grid-cols-2 gap-5' : ''}>
          {config.occupation && (
            <Select
              label="Occupation"
              required
              options={occupationOptions}
              value={motorData.occupation}
              onChange={(v) => updateMotor({ occupation: v })}
              placeholder="Select occupation"
              productColor="var(--motor-600)"
            />
          )}
          {config.residentialState && (
            <Select
              label="State of Residence"
              required
              options={stateOptions}
              value={motorData.residentialState}
              onChange={(v) => updateMotor({ residentialState: v })}
              placeholder="Select state"
              productColor="var(--motor-600)"
            />
          )}
        </div>
      )}

      <Input
        label="Residential Address"
        required
        value={motorData.residentialAddress}
        onChange={(e) => updateMotor({ residentialAddress: e.target.value })}
        placeholder="Full address including street, area"
        productColor="var(--motor-600)"
      />

      {config.corporateToggle && (
        <div>
          <p className="font-sans font-semibold text-[13px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Policy Type <span className="text-[var(--error)]">*</span>
          </p>
          <p className="font-sans text-[12px] mb-3" style={{ color: 'var(--text-muted)' }}>
            Is this policy for an individual or a registered company?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              label="Individual"
              selected={!motorData.isBusinessPolicy}
              onClick={() => updateMotor({ isBusinessPolicy: false })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
            <RadioCard
              label="Corporate"
              selected={motorData.isBusinessPolicy}
              onClick={() => updateMotor({ isBusinessPolicy: true })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {config.corporateToggle && config.corporateDetails && motorData.isBusinessPolicy && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-5 pt-1">
              <Input
                label="Company Name"
                required
                value={motorData.companyName}
                onChange={(e) => updateMotor({ companyName: e.target.value })}
                placeholder="Registered company name"
                productColor="var(--motor-600)"
              />
              <Input
                label="RC Number"
                required
                value={motorData.rcNumber}
                onChange={(e) => updateMotor({ rcNumber: e.target.value })}
                placeholder="CAC registration number"
                productColor="var(--motor-600)"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote summary */}
      <QuoteSummary motorData={motorData} calculatedPremium={calculatedPremium} />

      {/* Confirmation */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={motorData.reviewConfirmed}
          onChange={(e) => updateMotor({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details above are accurate and consent to NAICOM regulatory disclosures.
          I understand my quote will be compared across multiple licensed underwriters.
        </span>
      </label>
    </div>
  )
}

function QuoteSummary({ motorData, calculatedPremium }: {
  motorData: MotorData
  calculatedPremium: number | null
}) {
  const selectedPlan = motorData.selectedUnderwriter
    ? MOTOR_PLANS.find((p) => p.id === motorData.selectedUnderwriter)
    : null

  const carValue = motorData.carValue ?? 0
  const isComp = motorData.coverType === 'comprehensive'
  const tpoBase = 15000

  let finalPremium: number | null = calculatedPremium
  if (!finalPremium && selectedPlan) {
    const base = isComp && carValue > 0 ? Math.round(carValue * 0.05) : tpoBase
    finalPremium = Math.round(base * selectedPlan.multiplier)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="rounded-2xl border-2 p-5 space-y-4"
      style={{ borderColor: 'var(--motor-200)', backgroundColor: 'var(--motor-50)' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base" style={{ color: 'var(--motor-700)' }}>Quote Summary</h3>
        {finalPremium && (
          <div className="text-right">
            <span className="font-display font-extrabold text-[22px] leading-none" style={{ color: 'var(--motor-600)' }}>
              {formatNGN(finalPremium)}
            </span>
            <span className="font-sans font-normal text-[12px] ml-1" style={{ color: 'var(--text-muted)' }}>/yr</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--motor-100)] bg-white px-4 py-1">
        <ReviewRow label="Make & Model" value={motorData.vehicleMakeModel} />
        <ReviewRow label="Year" value={motorData.yearOfManufacture} />
        <ReviewRow label="Cover Type" value={isComp ? 'Comprehensive' : 'Third Party Only'} />
        {isComp && carValue > 0 && <ReviewRow label="Car Value (IDV)" value={formatNGN(carValue)} />}
        {selectedPlan && <ReviewRow label="Insurer" value={selectedPlan.insurer} />}
        {selectedPlan && <ReviewRow label="Plan" value={selectedPlan.name} />}
      </div>
    </motion.div>
  )
}

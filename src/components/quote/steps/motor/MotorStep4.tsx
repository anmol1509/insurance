'use client'
import { useQuoteStore } from '@/store/quoteStore'
import type { MotorData } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import NINField from '@/components/ui/NINField'
import { AnimatePresence, motion } from 'framer-motion'
import { User, Building2, Star } from 'lucide-react'
import {
  NIGERIAN_STATES, GENDERS, MARITAL_STATUSES, OCCUPATIONS, ID_TYPES,
} from '@/lib/constants'
import { MOTOR_PLANS } from '@/lib/motorPlans'

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

function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3 pt-6 pb-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--motor-50)' }}>
        <Icon className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />
      </div>
      <div>
        <h3 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {sub && <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
    </div>
  )
}

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const occupationOptions = OCCUPATIONS.map((o) => ({ value: o, label: o }))
const idTypeOptions = ID_TYPES.map((t) => ({ value: t, label: t }))
const maritalOptions = MARITAL_STATUSES.map((m) => ({ value: m, label: m }))

export default function MotorStep4() {
  const { motorData, updateMotor, calculatedPremium } = useQuoteStore()

  return (
    <div className="space-y-5">
      {/* Quote summary — pinned at top so premium is always visible */}
      <QuoteSummary motorData={motorData} calculatedPremium={calculatedPremium} />

      {/* ── Personal Information ── */}
      <SectionHeader icon={User} title="Personal Information" sub="Your KYC details as they appear on your ID document" />

      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            required
            value={motorData.fullName}
            onChange={(e) => updateMotor({ fullName: e.target.value })}
            placeholder="As on your ID document"
            productColor="var(--motor-600)"
          />
          <Input
            label="Date of Birth"
            required
            type="date"
            value={motorData.dateOfBirth}
            onChange={(e) => updateMotor({ dateOfBirth: e.target.value })}
            hint="Must be 18 or older"
            productColor="var(--motor-600)"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <NINField
            value={motorData.nin}
            onChange={(v) => updateMotor({ nin: v })}
            productColor="var(--motor-600)"
          />
          <Input
            label="Bank Verification Number (BVN)"
            value={motorData.bvn}
            onChange={(e) => updateMotor({ bvn: e.target.value.replace(/\D/g, '').slice(0, 11) })}
            placeholder="11-digit BVN"
            inputMode="numeric"
            maxLength={11}
            productColor="var(--motor-600)"
          />
        </div>

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

        <div className="grid md:grid-cols-2 gap-5">
          <Select
            label="Marital Status"
            required
            options={maritalOptions}
            value={motorData.maritalStatus}
            onChange={(v) => updateMotor({ maritalStatus: v })}
            placeholder="Select marital status"
            productColor="var(--motor-600)"
          />
          <Select
            label="Occupation"
            required
            options={occupationOptions}
            value={motorData.occupation}
            onChange={(v) => updateMotor({ occupation: v })}
            placeholder="Select occupation"
            productColor="var(--motor-600)"
          />
        </div>

        <Input
          label="Residential Address"
          required
          value={motorData.residentialAddress}
          onChange={(e) => updateMotor({ residentialAddress: e.target.value })}
          placeholder="Full address including street, area"
          productColor="var(--motor-600)"
        />

        <Select
          label="State of Residence"
          required
          options={stateOptions}
          value={motorData.residentialState}
          onChange={(v) => updateMotor({ residentialState: v })}
          placeholder="Select state"
          productColor="var(--motor-600)"
        />

        <div className="grid md:grid-cols-2 gap-5">
          <Select
            label="ID Type"
            required
            options={idTypeOptions}
            value={motorData.idType}
            onChange={(v) => updateMotor({ idType: v })}
            placeholder="Select ID type"
            productColor="var(--motor-600)"
          />
          <Input
            label="ID Number"
            required
            value={motorData.idNumber}
            onChange={(e) => updateMotor({ idNumber: e.target.value })}
            placeholder="Enter ID number"
            productColor="var(--motor-600)"
          />
        </div>
      </div>

      {/* ── Policy Type ── */}
      <SectionHeader icon={Building2} title="Policy Type" sub="Is this policy for an individual or a registered company?" />

      <div className="space-y-4">
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

        <AnimatePresence>
          {motorData.isBusinessPolicy && (
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
                <Input
                  label="Contact Person"
                  required
                  value={motorData.contactPerson}
                  onChange={(e) => updateMotor({ contactPerson: e.target.value })}
                  placeholder="Authorised contact name"
                  productColor="var(--motor-600)"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Confirmation ── */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
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

  if (!selectedPlan) return null

  const carValue = motorData.carValue ?? 0
  const isComp = motorData.coverType === 'comprehensive'
  const tpoBase = 15000

  let finalPremium: number | null = calculatedPremium
  if (!finalPremium) {
    const base = isComp && carValue > 0 ? Math.round(carValue * 0.05) : tpoBase
    finalPremium = Math.round(base * selectedPlan.multiplier)
  }

  const planWithExtras = selectedPlan as typeof selectedPlan & { rating?: number; reviews?: number | string }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="rounded-2xl border-2 p-5"
      style={{ borderColor: 'var(--motor-200)', backgroundColor: 'var(--motor-50)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] mb-0.5" style={{ color: 'var(--motor-600)' }}>
            Selected Plan
          </p>
          <h3 className="font-display font-bold text-[17px] leading-tight" style={{ color: 'var(--text-primary)' }}>
            {selectedPlan.name}
          </h3>
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{selectedPlan.insurer}</p>
        </div>
        {finalPremium && (
          <div className="text-right shrink-0">
            <span className="font-display font-extrabold text-[22px] leading-none" style={{ color: 'var(--motor-600)' }}>
              {formatNGN(finalPremium)}
            </span>
            <p className="font-sans font-normal text-[11px]" style={{ color: 'var(--text-muted)' }}>per year</p>
          </div>
        )}
      </div>

      {planWithExtras.rating && (
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className="w-3.5 h-3.5"
              fill={n <= Math.round(planWithExtras.rating!) ? '#F59E0B' : 'none'}
              style={{ color: n <= Math.round(planWithExtras.rating!) ? '#F59E0B' : '#D1D5DB' }}
            />
          ))}
          <span className="font-sans text-[11px] ml-1" style={{ color: 'var(--text-muted)' }}>
            {planWithExtras.rating}{planWithExtras.reviews ? ` · ${planWithExtras.reviews} reviews` : ''}
          </span>
        </div>
      )}

      <div className="rounded-xl border border-[var(--motor-100)] bg-white px-4 py-1">
        <ReviewRow label="Make & Model" value={motorData.vehicleMakeModel} />
        <ReviewRow label="Year" value={motorData.yearOfManufacture} />
        <ReviewRow label="Plate No." value={motorData.registrationNumber} />
        <ReviewRow label="Cover Type" value={isComp ? 'Comprehensive' : 'Third Party Only'} />
        {isComp && carValue > 0 && <ReviewRow label="Car Value (IDV)" value={formatNGN(carValue)} />}
      </div>
    </motion.div>
  )
}

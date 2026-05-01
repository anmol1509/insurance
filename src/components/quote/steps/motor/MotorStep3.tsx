'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import NINField from '@/components/ui/NINField'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { AnimatePresence, motion } from 'framer-motion'
import {
  NIGERIAN_STATES, GENDERS, MARITAL_STATUSES, OCCUPATIONS, ID_TYPES,
} from '@/lib/constants'

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const occupationOptions = OCCUPATIONS.map((o) => ({ value: o, label: o }))
const idTypeOptions = ID_TYPES.map((t) => ({ value: t, label: t }))
const maritalOptions = MARITAL_STATUSES.map((m) => ({ value: m, label: m }))

export default function MotorStep3() {
  const { motorData, updateMotor } = useQuoteStore()

  return (
    <div className="space-y-7">
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

      {/* Gender */}
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

      {/* Business policy toggle */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Is this a business / corporate policy?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            For vehicles owned by a registered company
          </p>
        </div>
        <ToggleSwitch
          checked={motorData.isBusinessPolicy}
          onChange={(v) => updateMotor({ isBusinessPolicy: v })}
          productColor="var(--motor-600)"
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
  )
}

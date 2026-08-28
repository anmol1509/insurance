'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import NINField from '@/components/ui/NINField'
import { NIGERIAN_STATES, GENDERS, OCCUPATIONS, ID_TYPES } from '@/lib/constants'

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const occupationOptions = OCCUPATIONS.map((o) => ({ value: o, label: o }))
const idTypeOptions = ID_TYPES.map((t) => ({ value: t, label: t }))

export default function MarineStep3() {
  const { marineData, updateMarine } = useQuoteStore()

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          required
          value={marineData.fullName}
          onChange={(e) => updateMarine({ fullName: e.target.value })}
          placeholder="As on your ID document"
          productColor="var(--marine-600)"
        />
        <Input
          label="Date of Birth"
          required
          type="date"
          value={marineData.dateOfBirth}
          onChange={(e) => updateMarine({ dateOfBirth: e.target.value })}
          hint="Must be 18 or older"
          productColor="var(--marine-600)"
        />
      </div>

      <NINField
        value={marineData.nin}
        onChange={(v) => updateMarine({ nin: v })}
        productColor="var(--marine-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Phone Number"
          required
          prefix="phone"
          value={marineData.phone.replace(/^(\+234|0)/, '')}
          onChange={(e) => updateMarine({ phone: '0' + e.target.value.replace(/\D/g, '') })}
          placeholder="8012345678"
          inputMode="tel"
          productColor="var(--marine-600)"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={marineData.email}
          onChange={(e) => updateMarine({ email: e.target.value })}
          placeholder="you@example.com"
          productColor="var(--marine-600)"
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
              selected={marineData.gender === g}
              onClick={() => updateMarine({ gender: g })}
              productColor="var(--marine-600)"
              productColorBg="var(--marine-50)"
            />
          ))}
        </div>
      </div>

      <Select
        label="Occupation"
        required
        options={occupationOptions}
        value={marineData.occupation}
        onChange={(v) => updateMarine({ occupation: v })}
        placeholder="Select occupation"
        productColor="var(--marine-600)"
      />

      <Input
        label="Residential Address"
        required
        value={marineData.residentialAddress}
        onChange={(e) => updateMarine({ residentialAddress: e.target.value })}
        placeholder="Full address including street, area"
        productColor="var(--marine-600)"
      />

      <Select
        label="State of Residence"
        required
        options={stateOptions}
        value={marineData.residentialState}
        onChange={(v) => updateMarine({ residentialState: v })}
        placeholder="Select state"
        productColor="var(--marine-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="ID Type"
          required
          options={idTypeOptions}
          value={marineData.idType}
          onChange={(v) => updateMarine({ idType: v })}
          placeholder="Select ID type"
          productColor="var(--marine-600)"
        />
        <Input
          label="ID Number"
          required
          value={marineData.idNumber}
          onChange={(e) => updateMarine({ idNumber: e.target.value })}
          placeholder="Enter ID number"
          productColor="var(--marine-600)"
        />
      </div>
    </div>
  )
}

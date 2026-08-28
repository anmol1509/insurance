'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import NINField from '@/components/ui/NINField'
import { NIGERIAN_STATES, ID_TYPES } from '@/lib/constants'

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const idTypeOptions = ID_TYPES.map((t) => ({ value: t, label: t }))

export default function PersonalAccidentStep3() {
  const { personalAccidentData, updatePersonalAccident } = useQuoteStore()

  return (
    <div className="space-y-7">
      <Input
        label="Full Name"
        required
        value={personalAccidentData.fullName}
        onChange={(e) => updatePersonalAccident({ fullName: e.target.value })}
        placeholder="As on your ID document"
        productColor="var(--pa-600)"
      />

      <NINField
        value={personalAccidentData.nin}
        onChange={(v) => updatePersonalAccident({ nin: v })}
        productColor="var(--pa-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Phone Number"
          required
          prefix="phone"
          value={personalAccidentData.phone.replace(/^(\+234|0)/, '')}
          onChange={(e) => updatePersonalAccident({ phone: '0' + e.target.value.replace(/\D/g, '') })}
          placeholder="8012345678"
          inputMode="tel"
          productColor="var(--pa-600)"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={personalAccidentData.email}
          onChange={(e) => updatePersonalAccident({ email: e.target.value })}
          placeholder="you@example.com"
          productColor="var(--pa-600)"
        />
      </div>

      <Input
        label="Residential Address"
        required
        value={personalAccidentData.residentialAddress}
        onChange={(e) => updatePersonalAccident({ residentialAddress: e.target.value })}
        placeholder="Full address including street, area"
        productColor="var(--pa-600)"
      />

      <Select
        label="State of Residence"
        required
        options={stateOptions}
        value={personalAccidentData.residentialState}
        onChange={(v) => updatePersonalAccident({ residentialState: v })}
        placeholder="Select state"
        productColor="var(--pa-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="ID Type"
          required
          options={idTypeOptions}
          value={personalAccidentData.idType}
          onChange={(v) => updatePersonalAccident({ idType: v })}
          placeholder="Select ID type"
          productColor="var(--pa-600)"
        />
        <Input
          label="ID Number"
          required
          value={personalAccidentData.idNumber}
          onChange={(e) => updatePersonalAccident({ idNumber: e.target.value })}
          placeholder="Enter ID number"
          productColor="var(--pa-600)"
        />
      </div>
    </div>
  )
}

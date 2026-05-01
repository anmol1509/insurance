'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import NINField from '@/components/ui/NINField'
import { AnimatePresence, motion } from 'framer-motion'
import { OCCUPATIONS } from '@/lib/constants'

const occupationOptions = OCCUPATIONS.map((o) => ({ value: o, label: o }))

const planTypes = [
  { id: 'individual' as const, label: 'Individual', sub: '1 person' },
  { id: 'family' as const, label: 'Family', sub: '2–6 lives' },
  { id: 'group' as const, label: 'Group', sub: '7+ lives' },
]

export default function MedicalStep1() {
  const { medicalData, updateMedical } = useQuoteStore()
  const isGroup = medicalData.planType === 'group'
  const isFamily = medicalData.planType === 'family'

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          required
          value={medicalData.fullName}
          onChange={(e) => updateMedical({ fullName: e.target.value })}
          placeholder="As on your ID document"
          productColor="var(--medical-600)"
        />
        <Input
          label="Date of Birth"
          required
          type="date"
          value={medicalData.dateOfBirth}
          onChange={(e) => updateMedical({ dateOfBirth: e.target.value })}
          hint="Must be 18 or older"
          productColor="var(--medical-600)"
        />
      </div>

      <NINField
        value={medicalData.nin}
        onChange={(v) => updateMedical({ nin: v })}
        productColor="var(--medical-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Phone Number"
          required
          prefix="phone"
          value={medicalData.phone.replace(/^(\+234|0)/, '')}
          onChange={(e) => updateMedical({ phone: '0' + e.target.value.replace(/\D/g, '') })}
          placeholder="8012345678"
          inputMode="tel"
          productColor="var(--medical-600)"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={medicalData.email}
          onChange={(e) => updateMedical({ email: e.target.value })}
          placeholder="you@example.com"
          productColor="var(--medical-600)"
        />
      </div>

      {/* Gender */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Gender <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(['male', 'female', 'other'] as const).map((g) => (
            <RadioCard
              key={g}
              label={g.charAt(0).toUpperCase() + g.slice(1)}
              selected={medicalData.gender === g}
              onClick={() => updateMedical({ gender: g })}
              productColor="var(--medical-600)"
              productColorBg="var(--medical-50)"
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Occupation"
          required
          options={occupationOptions}
          value={medicalData.occupation}
          onChange={(v) => updateMedical({ occupation: v })}
          placeholder="Select occupation"
          productColor="var(--medical-600)"
        />
        <Input
          label="Occupation Category"
          value={medicalData.occupationCategory}
          onChange={(e) => updateMedical({ occupationCategory: e.target.value })}
          placeholder="e.g. Professional, Manual, Clerical"
          productColor="var(--medical-600)"
        />
      </div>

      {/* Plan type */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Plan type <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {planTypes.map((p) => (
            <RadioCard
              key={p.id}
              label={p.label}
              priceHint={p.sub}
              selected={medicalData.planType === p.id}
              onClick={() => updateMedical({ planType: p.id })}
              productColor="var(--medical-600)"
              productColorBg="var(--medical-50)"
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(isFamily || isGroup) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-3 gap-5 pt-1">
              <Input
                label="Number of Lives"
                required
                type="number"
                value={medicalData.numberOfLives}
                onChange={(e) => updateMedical({ numberOfLives: Number(e.target.value) })}
                hint={isGroup ? 'Minimum 7 for group plans' : '2–6 for family plans'}
                productColor="var(--medical-600)"
              />
              <Input
                label="Min Age in Group"
                type="number"
                value={medicalData.minAge ?? ''}
                onChange={(e) => updateMedical({ minAge: Number(e.target.value) })}
                placeholder="e.g. 18"
                productColor="var(--medical-600)"
              />
              <Input
                label="Max Age in Group"
                type="number"
                value={medicalData.maxAge ?? ''}
                onChange={(e) => updateMedical({ maxAge: Number(e.target.value) })}
                placeholder="e.g. 65"
                productColor="var(--medical-600)"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

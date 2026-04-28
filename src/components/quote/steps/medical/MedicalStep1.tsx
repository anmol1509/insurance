'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'

const planTypes = [
  { id: 'individual', label: 'Individual', sub: 'Cover for one person' },
  { id: 'family', label: 'Family', sub: 'You + spouse + children' },
  { id: 'group', label: 'Group/Corporate', sub: 'Multiple employees' },
]

const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
]

const maritalOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]

export default function MedicalStep1() {
  const { medicalData, updateMedical } = useQuoteStore()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Full Name" required value={medicalData.fullName} onChange={(e) => updateMedical({ fullName: e.target.value })} placeholder="e.g. Adaeze Okonkwo" />
        <Input label="Date of Birth" required type="date" value={medicalData.dob} onChange={(e) => updateMedical({ dob: e.target.value })} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Occupation" value={medicalData.occupation} onChange={(e) => updateMedical({ occupation: e.target.value })} placeholder="e.g. Engineer" />
        <Select label="Marital Status" options={maritalOptions} value={medicalData.maritalStatus} onChange={(v) => updateMedical({ maritalStatus: v })} placeholder="Select status" />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Gender</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {genderOptions.map((g) => (
            <RadioCard key={g.id} label={g.label} selected={medicalData.gender === g.id} onClick={() => updateMedical({ gender: g.id as typeof medicalData.gender })} productColor="var(--medical-600)" productColorBg="var(--medical-50)" />
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Plan Type <span style={{ color: 'var(--error)' }}>*</span></p>
        <div className="grid sm:grid-cols-3 gap-3">
          {planTypes.map((pt) => (
            <RadioCard key={pt.id} label={pt.label} subLabel={pt.sub} selected={medicalData.planType === pt.id} onClick={() => updateMedical({ planType: pt.id as typeof medicalData.planType })} productColor="var(--medical-600)" productColorBg="var(--medical-50)" />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(medicalData.planType === 'family' || medicalData.planType === 'group') && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <Input label="Number of lives covered" required type="number" value={medicalData.numberOfLives || ''} onChange={(e) => updateMedical({ numberOfLives: Number(e.target.value) })} placeholder="e.g. 4" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Phone Number" required prefix="phone" type="tel" value={medicalData.phone} onChange={(e) => updateMedical({ phone: e.target.value })} placeholder="8012345678" />
        <Input label="Email Address" required type="email" value={medicalData.email} onChange={(e) => updateMedical({ email: e.target.value })} placeholder="you@example.com" />
      </div>
    </div>
  )
}

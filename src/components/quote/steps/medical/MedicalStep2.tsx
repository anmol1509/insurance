'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'
import Select from '@/components/ui/Select'

const conditionChips = ['Diabetes', 'Hypertension', 'Asthma', 'Heart condition', 'Cancer', 'HIV', 'Other']
const activityOptions = [
  { id: 'sedentary', label: 'Sedentary', sub: 'Mostly desk work' },
  { id: 'active', label: 'Active', sub: 'Regular exercise' },
  { id: 'very_active', label: 'Very Active', sub: 'Daily intense exercise' },
]
const freqOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'rarely', label: 'Rarely' },
]

function ToggleRow({ label, checked, onToggle, color = 'var(--medical-600)' }: { label: string; checked: boolean; onToggle: () => void; color?: string }) {
  return (
    <div className="flex justify-between items-center p-5 rounded-xl border" style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}>
      <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <button type="button" onClick={onToggle} className="relative w-11 h-6 rounded-full transition-colors duration-200" style={{ backgroundColor: checked ? color : 'var(--border-medium)' }}>
        <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ x: checked ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </button>
    </div>
  )
}

export default function MedicalStep2() {
  const { medicalData, updateMedical } = useQuoteStore()

  const toggleCondition = (c: string) => {
    const current = medicalData.conditions
    updateMedical({ conditions: current.includes(c) ? current.filter((x) => x !== c) : [...current, c] })
  }

  return (
    <div className="space-y-5">
      <ToggleRow label="Do you smoke?" checked={medicalData.smokes} onToggle={() => updateMedical({ smokes: !medicalData.smokes })} />
      <AnimatePresence>
        {medicalData.smokes && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <Select label="How often?" options={freqOptions} value={medicalData.smokingFrequency} onChange={(v) => updateMedical({ smokingFrequency: v })} placeholder="Select frequency" />
          </motion.div>
        )}
      </AnimatePresence>

      <ToggleRow label="Do you drink alcohol?" checked={medicalData.drinksAlcohol} onToggle={() => updateMedical({ drinksAlcohol: !medicalData.drinksAlcohol })} />
      <AnimatePresence>
        {medicalData.drinksAlcohol && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <Select label="How often?" options={freqOptions} value={medicalData.alcoholFrequency} onChange={(v) => updateMedical({ alcoholFrequency: v })} placeholder="Select frequency" />
          </motion.div>
        )}
      </AnimatePresence>

      <ToggleRow label="Do you have any pre-existing conditions?" checked={medicalData.preexistingConditions} onToggle={() => updateMedical({ preexistingConditions: !medicalData.preexistingConditions })} />
      <AnimatePresence>
        {medicalData.preexistingConditions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden space-y-4">
            <div>
              <p className="font-sans font-semibold text-xs text-[var(--text-secondary)] mb-2">Select conditions (optional)</p>
              <div className="flex flex-wrap gap-2">
                {conditionChips.map((c) => {
                  const selected = medicalData.conditions.includes(c)
                  return (
                    <button key={c} type="button" onClick={() => toggleCondition(c)} className="border-[1.5px] rounded-full px-3 py-1.5 font-sans text-xs transition-all" style={selected ? { backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-600)', color: 'var(--medical-600)' } : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>
            <textarea className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--medical-600)]" value={medicalData.conditionDetails} onChange={(e) => updateMedical({ conditionDetails: e.target.value })} placeholder="Describe your conditions and current treatment..." />
          </motion.div>
        )}
      </AnimatePresence>

      <ToggleRow label="High-risk occupation (e.g. construction, mining, offshore)?" checked={medicalData.highRiskOccupation} onToggle={() => updateMedical({ highRiskOccupation: !medicalData.highRiskOccupation })} />

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Physical Activity Level</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {activityOptions.map((a) => (
            <RadioCard key={a.id} label={a.label} subLabel={a.sub} selected={medicalData.activityLevel === a.id} onClick={() => updateMedical({ activityLevel: a.id as typeof medicalData.activityLevel })} productColor="var(--medical-600)" productColorBg="var(--medical-50)" />
          ))}
        </div>
      </div>

      <ToggleRow label="Are you currently on prescription medication?" checked={medicalData.takingMedication} onToggle={() => updateMedical({ takingMedication: !medicalData.takingMedication })} />
      <AnimatePresence>
        {medicalData.takingMedication && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <textarea className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--medical-600)]" value={medicalData.medications} onChange={(e) => updateMedical({ medications: e.target.value })} placeholder="List current medications..." />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

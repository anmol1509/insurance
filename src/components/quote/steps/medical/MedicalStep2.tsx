'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { AnimatePresence, motion } from 'framer-motion'

const conditions = [
  'Diabetes', 'Hypertension', 'Asthma', 'Cancer', 'Heart disease',
  'HIV/AIDS', 'Kidney disease', 'Epilepsy', 'Mental health condition', 'Other',
]

const hobbies = [
  'Swimming', 'Running', 'Cycling', 'Gym/Weightlifting', 'Martial arts',
  'Football', 'Motorcycling', 'Mountain climbing', 'None',
]

export default function MedicalStep2() {
  const { medicalData, updateMedical } = useQuoteStore()

  function toggleCondition(c: string) {
    const curr = medicalData.conditions
    updateMedical({ conditions: curr.includes(c) ? curr.filter((x) => x !== c) : [...curr, c] })
  }

  function toggleHobby(h: string) {
    const curr = medicalData.hobbies
    updateMedical({ hobbies: curr.includes(h) ? curr.filter((x) => x !== h) : [...curr, h] })
  }

  return (
    <div className="space-y-7">
      {/* Smoking */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Do you smoke?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Cigarettes, pipes, e-cigarettes, or any tobacco product
          </p>
        </div>
        <ToggleSwitch
          checked={medicalData.smokes}
          onChange={(v) => updateMedical({ smokes: v })}
          productColor="var(--medical-600)"
        />
      </div>

      <AnimatePresence>
        {medicalData.smokes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Smoking frequency
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Daily', 'Occasionally', 'Rarely'].map((f) => (
                  <RadioCard
                    key={f}
                    label={f}
                    selected={medicalData.smokingFrequency === f}
                    onClick={() => updateMedical({ smokingFrequency: f })}
                    productColor="var(--medical-600)"
                    productColorBg="var(--medical-50)"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alcohol */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Do you drink alcohol?
        </p>
        <ToggleSwitch
          checked={medicalData.drinksAlcohol}
          onChange={(v) => updateMedical({ drinksAlcohol: v })}
          productColor="var(--medical-600)"
        />
      </div>

      <AnimatePresence>
        {medicalData.drinksAlcohol && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3 pt-1">
              {['Socially', 'Regularly', 'Heavily'].map((f) => (
                <RadioCard
                  key={f}
                  label={f}
                  selected={medicalData.alcoholFrequency === f}
                  onClick={() => updateMedical({ alcoholFrequency: f })}
                  productColor="var(--medical-600)"
                  productColorBg="var(--medical-50)"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-existing conditions */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Any pre-existing medical conditions?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Honesty is required. Non-disclosure may void the policy.
          </p>
        </div>
        <ToggleSwitch
          checked={medicalData.preexistingConditions}
          onChange={(v) => updateMedical({ preexistingConditions: v })}
          productColor="var(--medical-600)"
        />
      </div>

      <AnimatePresence>
        {medicalData.preexistingConditions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Select all that apply
              </p>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => {
                  const sel = medicalData.conditions.includes(c)
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all"
                      style={
                        sel
                          ? { borderColor: 'var(--medical-600)', backgroundColor: 'var(--medical-50)', color: 'var(--medical-600)' }
                          : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                      }
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
              <div>
                <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
                  Describe your condition(s) and current treatment
                </label>
                <textarea
                  className="w-full min-h-[90px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--medical-600)]"
                  value={medicalData.conditionDetails}
                  onChange={(e) => updateMedical({ conditionDetails: e.target.value })}
                  placeholder="Include diagnosis date, medications, and current status…"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medication */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Currently taking any medication?
        </p>
        <ToggleSwitch
          checked={medicalData.takingMedication}
          onChange={(v) => updateMedical({ takingMedication: v })}
          productColor="var(--medical-600)"
        />
      </div>

      <AnimatePresence>
        {medicalData.takingMedication && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
                List medications and dosages
              </label>
              <textarea
                className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--medical-600)]"
                value={medicalData.medications}
                onChange={(e) => updateMedical({ medications: e.target.value })}
                placeholder="e.g. Metformin 500mg twice daily…"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity level */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Physical activity level
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'sedentary' as const, label: 'Sedentary', sub: 'Office/desk work' },
            { id: 'lightly_active' as const, label: 'Light', sub: 'Walks, light exercise' },
            { id: 'active' as const, label: 'Active', sub: 'Regular gym/sport' },
            { id: 'very_active' as const, label: 'Very Active', sub: 'Daily intense exercise' },
          ].map((a) => (
            <RadioCard
              key={a.id}
              label={a.label}
              priceHint={a.sub}
              selected={medicalData.activityLevel === a.id}
              onClick={() => updateMedical({ activityLevel: a.id })}
              productColor="var(--medical-600)"
              productColorBg="var(--medical-50)"
            />
          ))}
        </div>
      </div>

      {/* Hobbies */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-1" style={{ color: 'var(--text-secondary)' }}>
          Regular hobbies / activities
        </p>
        <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
          High-risk activities may affect underwriting
        </p>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((h) => {
            const sel = medicalData.hobbies.includes(h)
            return (
              <button
                key={h}
                type="button"
                onClick={() => toggleHobby(h)}
                className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all"
                style={
                  sel
                    ? { borderColor: 'var(--medical-600)', backgroundColor: 'var(--medical-50)', color: 'var(--medical-600)' }
                    : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                }
              >
                {h}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

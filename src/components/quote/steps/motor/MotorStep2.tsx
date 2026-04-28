'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'

const expOptions = [
  { id: '0-5', label: '0–5 years' },
  { id: '6-10', label: '6–10 years' },
  { id: '10+', label: '10+ years' },
]

const securityChips = [
  { id: 'gps', label: 'GPS Tracker' },
  { id: 'immobiliser', label: 'Immobiliser' },
  { id: 'alarm', label: 'Alarm System' },
  { id: 'dashcam', label: 'Dash Camera' },
]

export default function MotorStep2() {
  const { motorData, updateMotor } = useQuoteStore()

  const toggleSecurity = (id: string) => {
    const current = motorData.securityFeatures
    updateMotor({
      securityFeatures: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Driver's License Number"
          value={motorData.licenseNumber}
          onChange={(e) => updateMotor({ licenseNumber: e.target.value })}
          placeholder="e.g. FKJ-20130001"
        />
        <Input
          label="Age of Primary Driver"
          type="number"
          value={motorData.driverAge ?? ''}
          onChange={(e) => updateMotor({ driverAge: Number(e.target.value) })}
          placeholder="e.g. 35"
        />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Years of driving experience
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {expOptions.map((o) => (
            <RadioCard
              key={o.id}
              label={o.label}
              selected={motorData.yearsExperience === o.id}
              onClick={() => updateMotor({ yearsExperience: o.id as typeof motorData.yearsExperience })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          ))}
        </div>
      </div>

      {/* Previous accidents toggle */}
      <div
        className="flex justify-between items-center p-5 rounded-xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
          Any previous accidents in the last 3 years?
        </p>
        <button
          type="button"
          onClick={() => updateMotor({ previousAccidents: !motorData.previousAccidents })}
          className="relative w-11 h-6 rounded-full transition-colors duration-200"
          style={{ backgroundColor: motorData.previousAccidents ? 'var(--motor-600)' : 'var(--border-medium)' }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ x: motorData.previousAccidents ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {motorData.previousAccidents && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
                Please briefly describe the most recent incident
              </label>
              <textarea
                className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--motor-600)]"
                value={motorData.previousAccidentsDetails}
                onChange={(e) => updateMotor({ previousAccidentsDetails: e.target.value })}
                placeholder="Describe the incident..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim free toggle */}
      <div
        className="flex justify-between items-center p-5 rounded-xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
          No claims in the last 12 months?
        </p>
        <button
          type="button"
          onClick={() => updateMotor({ claimFree: !motorData.claimFree })}
          className="relative w-11 h-6 rounded-full transition-colors duration-200"
          style={{ backgroundColor: motorData.claimFree ? 'var(--motor-600)' : 'var(--border-medium)' }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ x: motorData.claimFree ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {motorData.claimFree && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}
            >
              <span className="text-lg">✓</span>
              <p className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>
                You may qualify for a claim-free discount on your premium.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security features */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Security features installed on vehicle (optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {securityChips.map((chip) => {
            const selected = motorData.securityFeatures.includes(chip.id)
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleSecurity(chip.id)}
                className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all duration-200"
                style={
                  selected
                    ? { backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-600)', color: 'var(--motor-600)' }
                    : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                }
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

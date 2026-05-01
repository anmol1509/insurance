'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { AnimatePresence, motion } from 'framer-motion'

export default function TravelStep3() {
  const { travelData, updateTravel } = useQuoteStore()

  return (
    <div className="space-y-7">
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
            Non-disclosure may invalidate your travel policy
          </p>
        </div>
        <ToggleSwitch
          checked={travelData.preexistingConditions}
          onChange={(v) => updateTravel({ preexistingConditions: v })}
          productColor="var(--travel-600)"
        />
      </div>

      <AnimatePresence>
        {travelData.preexistingConditions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
                Describe your condition(s) <span className="text-[var(--error)]">*</span>
              </label>
              <textarea
                className="w-full min-h-[90px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--travel-600)]"
                value={travelData.conditionDetails}
                onChange={(e) => updateTravel({ conditionDetails: e.target.value })}
                placeholder="Include the condition, current treatment, and whether it is stable…"
              />
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
          Currently taking any prescription medication?
        </p>
        <ToggleSwitch
          checked={travelData.takingMedication}
          onChange={(v) => updateTravel({ takingMedication: v })}
          productColor="var(--travel-600)"
        />
      </div>

      <AnimatePresence>
        {travelData.takingMedication && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
                List medications
              </label>
              <textarea
                className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--travel-600)]"
                value={travelData.medications}
                onChange={(e) => updateTravel({ medications: e.target.value })}
                placeholder="e.g. Insulin, Aspirin…"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medical emergency cover */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Include medical emergency / evacuation cover?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Recommended for all international travel
          </p>
        </div>
        <ToggleSwitch
          checked={travelData.medicalEmergencyCover}
          onChange={(v) => updateTravel({ medicalEmergencyCover: v })}
          productColor="var(--travel-600)"
        />
      </div>

      {/* Emergency contact */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Emergency contact (someone staying behind)
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Contact Name"
            required
            value={travelData.emergencyContactName}
            onChange={(e) => updateTravel({ emergencyContactName: e.target.value })}
            placeholder="Full name"
            productColor="var(--travel-600)"
          />
          <Input
            label="Contact Phone"
            required
            prefix="phone"
            value={travelData.emergencyContactPhone.replace(/^(\+234|0)/, '')}
            onChange={(e) => updateTravel({ emergencyContactPhone: '0' + e.target.value.replace(/\D/g, '') })}
            placeholder="8012345678"
            inputMode="tel"
            productColor="var(--travel-600)"
          />
        </div>
      </div>

      {/* ECOWAS declaration */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--travel-50)', borderColor: 'var(--travel-100)' }}
      >
        <span className="text-lg mt-0.5">✈️</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          By proceeding you confirm you are fit to travel and agree to the insurer's health declaration terms.
        </p>
      </div>
    </div>
  )
}

'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { AnimatePresence, motion } from 'framer-motion'
import { DRIVING_EXPERIENCE_OPTIONS, SECURITY_FEATURES } from '@/lib/constants'

export default function MotorStep2() {
  const { motorData, updateMotor } = useQuoteStore()

  const toggleSecurity = (feat: string) => {
    const current = motorData.securityFeatures
    const isNone = feat === 'None of the above'

    if (isNone) {
      updateMotor({ securityFeatures: current.includes(feat) ? [] : [feat] })
      return
    }
    const without = current.filter((x) => x !== 'None of the above')
    updateMotor({
      securityFeatures: without.includes(feat)
        ? without.filter((x) => x !== feat)
        : [...without, feat],
    })
  }

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Driver's License Number"
          required
          value={motorData.licenseNumber}
          onChange={(e) => updateMotor({ licenseNumber: e.target.value })}
          placeholder="e.g. FKJ-20130001"
          productColor="var(--motor-600)"
        />
        <Input
          label="License Expiry Date"
          required
          type="date"
          value={motorData.licenseExpiry}
          onChange={(e) => updateMotor({ licenseExpiry: e.target.value })}
          productColor="var(--motor-600)"
        />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Years of driving experience <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DRIVING_EXPERIENCE_OPTIONS.map((opt) => (
            <RadioCard
              key={opt}
              label={opt}
              selected={motorData.drivingExperience === opt}
              onClick={() => updateMotor({ drivingExperience: opt })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          ))}
        </div>
      </div>

      {/* Claims history */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Any insurance claims in the last 3 years?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Honest disclosure is required under NAICOM regulations
          </p>
        </div>
        <ToggleSwitch
          checked={motorData.claimsHistory}
          onChange={(v) => updateMotor({ claimsHistory: v })}
          productColor="var(--motor-600)"
        />
      </div>

      <AnimatePresence>
        {motorData.claimsHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
                Describe the most recent claim <span className="text-[var(--error)]">*</span>
              </label>
              <textarea
                className="w-full min-h-[90px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--motor-600)]"
                value={motorData.claimsDetail}
                onChange={(e) => updateMotor({ claimsDetail: e.target.value })}
                placeholder="Date, nature of incident, amount claimed…"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security features — underwriting requirement, not premium factor */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-1" style={{ color: 'var(--text-secondary)' }}>
          Security features installed on the vehicle <span className="text-[var(--error)]">*</span>
        </p>
        <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
          Required for underwriting assessment. Select all that apply.
        </p>
        <div className="flex flex-wrap gap-2">
          {SECURITY_FEATURES.map((feat) => {
            const selected = motorData.securityFeatures.includes(feat)
            return (
              <button
                key={feat}
                type="button"
                onClick={() => toggleSecurity(feat)}
                className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all duration-200"
                style={
                  selected
                    ? { backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-600)', color: 'var(--motor-600)' }
                    : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                }
              >
                {feat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

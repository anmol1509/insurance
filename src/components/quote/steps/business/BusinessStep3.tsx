'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { AnimatePresence, motion } from 'framer-motion'

const constructionTypes = [
  { value: 'concrete',       label: 'Concrete / Block' },
  { value: 'steel',          label: 'Steel Frame' },
  { value: 'wood',           label: 'Wood / Timber' },
  { value: 'mixed',          label: 'Mixed Construction' },
  { value: 'temporary',      label: 'Temporary / Container' },
]

const fireProtectionLevels = [
  { value: 'none',         label: 'None' },
  { value: 'basic',        label: 'Basic (extinguishers)' },
  { value: 'sprinkler',    label: 'Sprinkler system' },
  { value: 'full',         label: 'Full detection & suppression' },
]

const operatingHoursOptions = [
  { id: 'standard' as const, label: 'Standard',  sub: 'Mon–Fri, 8am–5pm' },
  { id: 'extended' as const, label: 'Extended',  sub: 'Including weekends/evenings' },
  { id: '247' as const,      label: '24/7',      sub: 'Round-the-clock operations' },
]

const hazardTypes = [
  'Flammable liquids', 'Explosives', 'Chemicals', 'Gases', 'Heavy machinery',
  'High-voltage equipment', 'Food processing', 'Waste handling',
]

export default function BusinessStep3() {
  const { businessData, updateBusiness } = useQuoteStore()

  function toggleHazard(h: string) {
    const curr = businessData.hazardousTypes
    updateBusiness({ hazardousTypes: curr.includes(h) ? curr.filter((x) => x !== h) : [...curr, h] })
  }

  return (
    <div className="space-y-7">
      <Select
        label="Construction Type"
        required
        options={constructionTypes}
        value={businessData.constructionType}
        onChange={(v) => updateBusiness({ constructionType: v })}
        placeholder="Select construction type"
        productColor="var(--business-600)"
      />

      <Select
        label="Fire Protection Level"
        required
        options={fireProtectionLevels}
        value={businessData.fireProtectionLevel}
        onChange={(v) => updateBusiness({ fireProtectionLevel: v })}
        placeholder="Select protection level"
        productColor="var(--business-600)"
      />

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Operating hours <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {operatingHoursOptions.map((o) => (
            <RadioCard
              key={o.id}
              label={o.label}
              priceHint={o.sub}
              selected={businessData.operatingHours === o.id}
              onClick={() => updateBusiness({ operatingHours: o.id })}
              productColor="var(--business-600)"
              productColorBg="var(--business-50)"
            />
          ))}
        </div>
      </div>

      {/* Hazardous materials */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Do you handle or store hazardous materials?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Including chemicals, flammables, or heavy machinery
          </p>
        </div>
        <ToggleSwitch
          checked={businessData.hazardousMaterials}
          onChange={(v) => updateBusiness({ hazardousMaterials: v })}
          productColor="var(--business-600)"
        />
      </div>

      <AnimatePresence>
        {businessData.hazardousMaterials && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              <p className="font-sans font-semibold text-[13px] mb-2" style={{ color: 'var(--text-secondary)' }}>
                Select all that apply
              </p>
              <div className="flex flex-wrap gap-2">
                {hazardTypes.map((h) => {
                  const sel = businessData.hazardousTypes.includes(h)
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => toggleHazard(h)}
                      className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all"
                      style={
                        sel
                          ? { borderColor: 'var(--business-600)', backgroundColor: 'var(--business-50)', color: 'var(--business-600)' }
                          : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                      }
                    >
                      {h}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Site verification */}
      <div
        className="flex justify-between items-center p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
      >
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Consent to site inspection / risk survey?
          </p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            May be required for business covers above ₦50M
          </p>
        </div>
        <ToggleSwitch
          checked={businessData.siteVerificationConsent}
          onChange={(v) => updateBusiness({ siteVerificationConsent: v })}
          productColor="var(--business-600)"
        />
      </div>

      <div>
        <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
          Additional information (optional)
        </label>
        <textarea
          className="w-full min-h-[100px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--business-600)]"
          value={businessData.additionalInfo}
          onChange={(e) => updateBusiness({ additionalInfo: e.target.value })}
          placeholder="Any other details the underwriter should know about your operations, premises, or risk factors…"
        />
      </div>
    </div>
  )
}

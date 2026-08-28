'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { BENEFICIARY_RELATIONSHIPS } from '@/lib/constants'
import { AnimatePresence, motion } from 'framer-motion'

const relationshipOptions = BENEFICIARY_RELATIONSHIPS.map((r) => ({ value: r, label: r }))

export default function PersonalAccidentStep2() {
  const { personalAccidentData, updatePersonalAccident } = useQuoteStore()

  return (
    <div className="space-y-7">
      <section>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--pa-700)' }}>Beneficiary</h3>
        <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Who should receive the benefit if a claim is paid on your policy.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Beneficiary full name"
            required
            value={personalAccidentData.beneficiaryName}
            onChange={(e) => updatePersonalAccident({ beneficiaryName: e.target.value })}
            placeholder="e.g. Jane Doe"
            productColor="var(--pa-600)"
          />
          <Select
            label="Relationship to you"
            required
            options={relationshipOptions}
            value={personalAccidentData.beneficiaryRelationship}
            onChange={(v) => updatePersonalAccident({ beneficiaryRelationship: v })}
            placeholder="Select relationship"
            productColor="var(--pa-600)"
          />
          <Input
            label="Beneficiary phone"
            prefix="phone"
            value={personalAccidentData.beneficiaryPhone.replace(/^(\+234|0)/, '')}
            onChange={(e) => updatePersonalAccident({ beneficiaryPhone: '0' + e.target.value.replace(/\D/g, '') })}
            placeholder="8012345678"
            inputMode="tel"
            productColor="var(--pa-600)"
          />
          <Input
            label="Beneficiary email"
            type="email"
            value={personalAccidentData.beneficiaryEmail}
            onChange={(e) => updatePersonalAccident({ beneficiaryEmail: e.target.value })}
            placeholder="jane@example.com"
            productColor="var(--pa-600)"
          />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--pa-700)' }}>Health declaration</h3>
        <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Do you have any pre-existing medical conditions?</p>
            <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Required by NSIA for underwriting.</p>
          </div>
          <ToggleSwitch
            checked={personalAccidentData.hasPreExistingCondition}
            onChange={(checked) => updatePersonalAccident({ hasPreExistingCondition: checked })}
            productColor="var(--pa-600)"
          />
        </div>

        <AnimatePresence>
          {personalAccidentData.hasPreExistingCondition && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }} className="overflow-hidden"
            >
              <div className="pt-4">
                <Input
                  label="Please describe your condition(s)"
                  required
                  value={personalAccidentData.preExistingConditionDetails}
                  onChange={(e) => updatePersonalAccident({ preExistingConditionDetails: e.target.value })}
                  placeholder="e.g. Diabetes, diagnosed 2019"
                  productColor="var(--pa-600)"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}

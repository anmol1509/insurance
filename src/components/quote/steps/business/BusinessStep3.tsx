'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'

const constructionTypes = [
  { id: 'concrete', label: 'Block/Concrete' },
  { id: 'steel', label: 'Steel Frame' },
  { id: 'wood', label: 'Combustible/Wood' },
  { id: 'mixed', label: 'Mixed Construction' },
]

const fireChips = ['Fire extinguishers', 'Smoke alarms', 'Sprinkler system', 'Fire hydrant', 'None']
const securityChips = ['Security guards', 'CCTV cameras', 'Alarm system', 'Perimeter fence', 'Security dogs']

const opHours = [
  { id: 'standard', label: 'Standard 9-5' },
  { id: 'extended', label: 'Extended hours' },
  { id: '247', label: '24/7 operations' },
]

function ChipGroup({ chips, selected, onToggle, color }: { chips: string[]; selected: string[]; onToggle: (c: string) => void; color: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => {
        const sel = selected.includes(c)
        return (
          <button key={c} type="button" onClick={() => onToggle(c)} className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all" style={sel ? { backgroundColor: 'var(--business-50)', borderColor: color, color } : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>
            {c}
          </button>
        )
      })}
    </div>
  )
}

export default function BusinessStep3() {
  const { businessData, updateBusiness } = useQuoteStore()

  const toggleFire = (c: string) => {
    const cur = businessData.fireProtection
    updateBusiness({ fireProtection: cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c] })
  }

  const toggleSecurity = (c: string) => {
    const cur = businessData.securityMeasures
    updateBusiness({ securityMeasures: cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c] })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Construction Type</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {constructionTypes.map((ct) => (
            <RadioCard key={ct.id} label={ct.label} selected={businessData.constructionType === ct.id} onClick={() => updateBusiness({ constructionType: ct.id })} productColor="var(--business-600)" productColorBg="var(--business-50)" />
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Fire Protection Measures</p>
        <ChipGroup chips={fireChips} selected={businessData.fireProtection} onToggle={toggleFire} color="var(--business-600)" />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Security Measures</p>
        <ChipGroup chips={securityChips} selected={businessData.securityMeasures} onToggle={toggleSecurity} color="var(--business-600)" />
      </div>

      <div className="flex justify-between items-center p-5 rounded-xl border" style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}>
        <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Are there hazardous materials on premises?</p>
        <button type="button" onClick={() => updateBusiness({ hazardousMaterials: !businessData.hazardousMaterials })} className="relative w-11 h-6 rounded-full transition-colors duration-200" style={{ backgroundColor: businessData.hazardousMaterials ? 'var(--business-600)' : 'var(--border-medium)' }}>
          <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ x: businessData.hazardousMaterials ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </button>
      </div>

      <AnimatePresence>
        {businessData.hazardousMaterials && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden space-y-3">
            <div className="flex gap-3 p-4 rounded-r-xl" style={{ backgroundColor: '#FFFBEB', borderLeft: '4px solid var(--warning)' }}>
              <span className="text-lg shrink-0">⚠️</span>
              <p className="font-sans font-bold text-sm" style={{ color: '#92400E' }}>This triggers a manual site inspection before policy issuance.</p>
            </div>
            <textarea className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none" value={businessData.hazardousDetails} onChange={(e) => updateBusiness({ hazardousDetails: e.target.value })} placeholder="Describe hazardous materials on premises..." />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Operating Hours</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {opHours.map((o) => (
            <RadioCard key={o.id} label={o.label} selected={businessData.operatingHours === o.id} onClick={() => updateBusiness({ operatingHours: o.id as typeof businessData.operatingHours })} productColor="var(--business-600)" productColorBg="var(--business-50)" />
          ))}
        </div>
      </div>

      <div>
        <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">Additional Information (optional)</label>
        <textarea className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none focus:border-[var(--business-600)]" value={businessData.additionalInfo} onChange={(e) => updateBusiness({ additionalInfo: e.target.value })} placeholder="Any other relevant information about your business..." />
      </div>

      <button type="button" onClick={() => updateBusiness({ confirmed: !businessData.confirmed })} className="w-full flex items-start gap-4 p-5 rounded-xl border-[1.5px] text-left transition-all" style={businessData.confirmed ? { borderColor: 'var(--green-700)', backgroundColor: 'var(--green-50)' } : { borderColor: 'var(--border-medium)', backgroundColor: 'var(--surface)' }}>
        <div className="w-5 h-5 rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 mt-0.5" style={businessData.confirmed ? { backgroundColor: 'var(--green-700)', borderColor: 'var(--green-700)' } : { borderColor: 'var(--border-medium)' }}>
          {businessData.confirmed && <span className="text-white text-[10px]">✓</span>}
        </div>
        <p className="font-sans font-medium text-sm" style={{ color: businessData.confirmed ? 'var(--green-700)' : 'var(--text-primary)' }}>
          I confirm all information provided is accurate and complete
        </p>
      </button>
    </div>
  )
}

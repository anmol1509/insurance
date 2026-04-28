'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import { AnimatePresence, motion } from 'framer-motion'

function ToggleRow({ label, checked, onToggle, disabled, note, color = 'var(--travel-600)' }: { label: string; checked: boolean; onToggle: () => void; disabled?: boolean; note?: string; color?: string }) {
  return (
    <div className={`p-5 rounded-xl border ${disabled ? 'opacity-80' : ''}`} style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}>
      <div className="flex justify-between items-center">
        <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <button type="button" onClick={disabled ? undefined : onToggle} disabled={disabled} className="relative w-11 h-6 rounded-full transition-colors duration-200" style={{ backgroundColor: checked ? color : 'var(--border-medium)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ x: checked ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </button>
      </div>
      {note && <p className="font-sans text-xs mt-2" style={{ color: '#92400E' }}>{note}</p>}
    </div>
  )
}

export default function TravelStep3() {
  const { travelData, updateTravel } = useQuoteStore()
  const isSchengen = travelData.destination === 'schengen'

  return (
    <div className="space-y-6">
      <ToggleRow label="Any pre-existing medical conditions?" checked={travelData.preexistingConditions} onToggle={() => updateTravel({ preexistingConditions: !travelData.preexistingConditions })} />
      <AnimatePresence>
        {travelData.preexistingConditions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <textarea className="w-full min-h-[80px] p-4 border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-md)] font-sans text-sm resize-y outline-none" value={travelData.conditionDetails} onChange={(e) => updateTravel({ conditionDetails: e.target.value })} placeholder="Describe your conditions..." />
          </motion.div>
        )}
      </AnimatePresence>

      <ToggleRow label="Currently on prescription medication?" checked={travelData.takingMedication} onToggle={() => updateTravel({ takingMedication: !travelData.takingMedication })} />

      <ToggleRow
        label="Medical Emergency Coverage"
        checked={isSchengen ? true : travelData.medicalEmergencyCover}
        onToggle={() => !isSchengen && updateTravel({ medicalEmergencyCover: !travelData.medicalEmergencyCover })}
        disabled={isSchengen}
        note={isSchengen ? 'Required for Schengen visa compliance. Cannot be unchecked.' : undefined}
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Emergency Contact Name" value={travelData.emergencyContactName} onChange={(e) => updateTravel({ emergencyContactName: e.target.value })} placeholder="e.g. Ngozi Eze" />
        <Input label="Emergency Contact Phone" prefix="phone" type="tel" value={travelData.emergencyContactPhone} onChange={(e) => updateTravel({ emergencyContactPhone: e.target.value })} placeholder="8012345678" />
      </div>

      <button
        type="button"
        onClick={() => updateTravel({ confirmed: !travelData.confirmed })}
        className="w-full flex items-start gap-4 p-5 rounded-xl border-[1.5px] text-left transition-all"
        style={travelData.confirmed ? { borderColor: 'var(--green-700)', backgroundColor: 'var(--green-50)' } : { borderColor: 'var(--border-medium)', backgroundColor: 'var(--surface)' }}
      >
        <div className="w-5 h-5 rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 mt-0.5" style={travelData.confirmed ? { backgroundColor: 'var(--green-700)', borderColor: 'var(--green-700)' } : { borderColor: 'var(--border-medium)' }}>
          {travelData.confirmed && <span className="text-white text-[10px]">✓</span>}
        </div>
        <p className="font-sans font-medium text-sm" style={{ color: travelData.confirmed ? 'var(--green-700)' : 'var(--text-primary)' }}>
          I confirm all information provided is accurate and complete
        </p>
      </button>
    </div>
  )
}

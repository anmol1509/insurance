'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Select from '@/components/ui/Select'

/**
 * AIICO's PostMotorSchedule requires a Title (Mr, Mrs, Dr, ...) that no
 * other insurer on this platform asks for — shown only when an AIICO plan
 * is selected. The value is matched against AIICO's own title list
 * server-side at submission time, so the UI only ever deals in plain text.
 */
const TITLE_OPTIONS = ['Mr', 'Mrs', 'Miss', 'Doctor', 'Chief', 'Elder', 'Professor', 'Clergyman', 'Honorable', 'Excellency', 'Master']

export default function AiicoMotorDetails() {
  const { motorData, updateMotor } = useQuoteStore()

  return (
    <div className="space-y-5 rounded-2xl border p-5" style={{ borderColor: 'var(--motor-100)', backgroundColor: 'var(--motor-50)' }}>
      <p className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-700)' }}>
        A few extra details AIICO needs
      </p>

      <Select
        label="Title"
        required
        value={motorData.title}
        onChange={(value) => updateMotor({ title: value })}
        options={TITLE_OPTIONS.map((title) => ({ value: title, label: title }))}
        placeholder="Select a title"
        productColor="var(--motor-600)"
      />
    </div>
  )
}

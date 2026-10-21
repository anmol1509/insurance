'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'

/**
 * The one extra detail NSIA needs for a motor policy that nothing else on
 * the platform asks for: how many people the vehicle carries. NSIA's core
 * system rejects a motor policy without it (even though its API answers
 * "created"), and the figure affects how the policy is rated — so it is
 * asked, not guessed. Shown only when an NSIA plan is selected.
 */
export default function NsiaMotorDetails() {
  const { motorData, updateMotor } = useQuoteStore()

  return (
    <div className="space-y-5 rounded-2xl border p-5" style={{ borderColor: 'var(--motor-100)', backgroundColor: 'var(--motor-50)' }}>
      <p className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-700)' }}>
        One more detail NSIA needs
      </p>

      <Input
        label="Number of seats"
        required
        type="number"
        value={motorData.numberOfSeats ?? ''}
        onChange={(e) => updateMotor({ numberOfSeats: e.target.value ? Number(e.target.value) : null })}
        placeholder="e.g. 5"
        hint="How many people the vehicle carries, driver included — 5 for most saloon cars. It is on your vehicle licence."
        productColor="var(--motor-600)"
      />
    </div>
  )
}

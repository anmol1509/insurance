'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'

/**
 * Extra fields Tangerine's generate-policy endpoints need that no other
 * insurer on this platform asks for (guide: comprehensive §10, 3rd party §9)
 * — shown only when a Tangerine plan is selected, so other insurers never
 * see this UI.
 */
export default function TangerineMotorDetails() {
  const { motorData, updateMotor } = useQuoteStore()
  const isComprehensive = motorData.coverType === 'comprehensive'

  return (
    <div className="space-y-5 rounded-2xl border p-5" style={{ borderColor: 'var(--motor-100)', backgroundColor: 'var(--motor-50)' }}>
      <p className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-700)' }}>
        A few extra details Tangerine needs
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Local Government Area (LGA)"
          required
          value={motorData.lgaOfResidence}
          onChange={(e) => updateMotor({ lgaOfResidence: e.target.value })}
          placeholder="e.g. Ikeja"
          hint="As it appears on your official documents"
          productColor="var(--motor-600)"
        />
        <Input
          label="Vehicle registration date"
          required
          type="date"
          value={motorData.vehicleRegistrationDate}
          onChange={(e) => updateMotor({ vehicleRegistrationDate: e.target.value })}
          productColor="var(--motor-600)"
        />
      </div>

      {isComprehensive && (
        <Input
          label="Current vehicle mileage (km)"
          required
          type="number"
          value={motorData.mileageKm ?? ''}
          onChange={(e) => updateMotor({ mileageKm: e.target.value ? Number(e.target.value) : null })}
          placeholder="e.g. 45000"
          productColor="var(--motor-600)"
        />
      )}

      {motorData.isBusinessPolicy && (
        <Input
          label="Tax Identification Number (TIN)"
          required
          value={motorData.tin}
          onChange={(e) => updateMotor({ tin: e.target.value })}
          placeholder="Company TIN"
          productColor="var(--motor-600)"
        />
      )}
    </div>
  )
}

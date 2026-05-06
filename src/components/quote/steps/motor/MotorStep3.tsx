'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import NINField from '@/components/ui/NINField'

export default function MotorStep3() {
  const { motorData, updateMotor } = useQuoteStore()
  const hasDocuments = Object.keys(motorData.uploadedDocs ?? {}).length > 0

  return (
    <div className="space-y-7">
      {hasDocuments && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
          style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
        >
          <span className="text-lg shrink-0">✨</span>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Fields have been pre-filled from your uploaded documents. Review each field and edit anything that needs correcting.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          required
          value={motorData.fullName}
          onChange={(e) => updateMotor({ fullName: e.target.value })}
          placeholder="As on your ID document"
          productColor="var(--motor-600)"
        />
        <Input
          label="Date of Birth"
          required
          type="date"
          value={motorData.dateOfBirth}
          onChange={(e) => updateMotor({ dateOfBirth: e.target.value })}
          hint="Must be 18 or older"
          productColor="var(--motor-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Phone Number"
          required
          prefix="phone"
          value={motorData.phone.replace(/^(\+234|0)/, '')}
          onChange={(e) => updateMotor({ phone: '0' + e.target.value.replace(/\D/g, '') })}
          placeholder="8012345678"
          inputMode="tel"
          productColor="var(--motor-600)"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={motorData.email}
          onChange={(e) => updateMotor({ email: e.target.value })}
          placeholder="you@example.com"
          productColor="var(--motor-600)"
        />
      </div>

      <NINField
        value={motorData.nin}
        onChange={(v) => updateMotor({ nin: v })}
        productColor="var(--motor-600)"
      />
    </div>
  )
}

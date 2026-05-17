'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'
import { motion } from 'framer-motion'

const DOC_SLOTS = [
  { key: 'vehicle_license',    label: 'Vehicle License (Registration Certificate)', required: true },
  { key: 'proof_of_ownership', label: 'Proof of Ownership (Vehicle Particulars)',   required: true },
  { key: 'drivers_license',    label: "Driver's License Copy",                       required: true },
  { key: 'proof_of_address',   label: 'Proof of Address (Utility bill / bank statement)', required: false },
  { key: 'vehicle_photos',     label: 'Vehicle Photographs (front, rear, sides)',   required: false },
]

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium text-right max-w-[55%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function MotorReview() {
  const { motorData, updateMotor, calculatedPremium, setStep } = useQuoteStore()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function handleUpload(key: string, file: File) {
    updateMotor({
      uploadedDocs: {
        ...motorData.uploadedDocs,
        [key]: { name: file.name, size: file.size, status: 'uploaded' },
      },
    })
  }

  function handleRemove(key: string) {
    const docs = { ...motorData.uploadedDocs }
    delete docs[key]
    updateMotor({ uploadedDocs: docs })
  }

  const carValue = motorData.carValue ?? 0
  const isComprehensive = motorData.coverType === 'comprehensive'
  const premiumDisplay = calculatedPremium
    ? formatNGN(calculatedPremium)
    : isComprehensive && carValue > 0
      ? formatNGN(Math.round(carValue * 0.05))
      : 'From ₦15,000'

  return (
    <div className="space-y-7">
      {/* Documents */}
      <div>
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border mb-5"
          style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
        >
          <span className="text-lg shrink-0">📋</span>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Required per NAICOM/NSIA guidelines. Files must be clear and legible.
            Accepted formats: PDF, JPG, PNG (max 5 MB each).
          </p>
        </div>

        <DocumentUploadZone
          slots={DOC_SLOTS}
          uploadedDocs={motorData.uploadedDocs}
          onUpload={handleUpload}
          onRemove={handleRemove}
          productColor="var(--motor-600)"
          productColorBg="var(--motor-50)"
        />
      </div>

      {/* Quote summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border-2 p-5"
        style={{ borderColor: 'var(--motor-200)', backgroundColor: 'var(--motor-50)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--motor-700)' }}>Your Quote Summary</h3>
          <span
            className="font-display font-extrabold text-[22px]"
            style={{ color: 'var(--motor-600)' }}
          >
            {premiumDisplay}
            <span className="font-sans font-normal text-[12px] ml-1" style={{ color: 'var(--text-muted)' }}>/yr</span>
          </span>
        </div>
        <div className="text-sm font-sans" style={{ color: 'var(--motor-700)' }}>
          {motorData.vehicleMakeModel} · {motorData.yearOfManufacture} · {motorData.coverType === 'comprehensive' ? 'Comprehensive' : 'Third Party Only'}
        </div>
      </motion.div>

      {/* Details review */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Vehicle Details</h3>
          <button type="button" onClick={() => setStep('motor', 1)} className="font-sans font-medium text-[12px] hover:underline" style={{ color: 'var(--motor-600)' }}>Edit</button>
        </div>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Registration No." value={motorData.registrationNumber} />
          <Row label="Make & Model" value={motorData.vehicleMakeModel} />
          <Row label="Year" value={motorData.yearOfManufacture} />
          <Row label="Fuel Type" value={motorData.fuelType} />
          <Row label="Use" value={motorData.useType === 'private' ? 'Personal use' : 'Commercial use'} />
          <Row label="Cover Type" value={motorData.coverType === 'comprehensive' ? 'Comprehensive' : 'Third Party Only'} />
          <Row label="Car Value (IDV)" value={carValue > 0 ? formatNGN(carValue) : null} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Policyholder</h3>
          <button type="button" onClick={() => setStep('motor', 4)} className="font-sans font-medium text-[12px] hover:underline" style={{ color: 'var(--motor-600)' }}>Edit</button>
        </div>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Full Name" value={motorData.fullName} />
          <Row label="Phone" value={motorData.phone} />
          <Row label="Email" value={motorData.email} />
          <Row label="NIN" value={motorData.nin ? `****${motorData.nin.slice(-4)}` : undefined} />
          <Row label="Address" value={motorData.residentialAddress} />
          <Row label="State" value={motorData.residentialState} />
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={motorData.reviewConfirmed}
          onChange={(e) => updateMotor({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details above are accurate and consent to NAICOM regulatory disclosures.
          I understand my quote will be compared across multiple licensed underwriters.
        </span>
      </label>
    </div>
  )
}

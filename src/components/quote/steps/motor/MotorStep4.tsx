'use client'
import { useQuoteStore } from '@/store/quoteStore'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'

const DOC_SLOTS = [
  { key: 'vehicle_license',    label: 'Vehicle License (Reg. Certificate)', required: true },
  { key: 'proof_of_ownership', label: 'Proof of Ownership (Particulars)',   required: true },
  { key: 'drivers_license',    label: "Driver's License Copy",              required: true },
]

export default function MotorStep4() {
  const { motorData, updateMotor } = useQuoteStore()

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

  const requiredUploaded = DOC_SLOTS
    .filter((s) => s.required)
    .every((s) => !!motorData.uploadedDocs[s.key])

  return (
    <div className="space-y-6">
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <span className="text-lg">📋</span>
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

      {!requiredUploaded && (
        <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
          * Required documents must be uploaded before proceeding to review.
        </p>
      )}
    </div>
  )
}

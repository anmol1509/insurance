'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'

const DOC_SLOTS = [
  { key: 'vehicle_license',    label: 'Vehicle License (Registration Certificate)', required: true },
  { key: 'proof_of_ownership', label: 'Proof of Ownership (Vehicle Particulars)',   required: true },
  { key: 'drivers_license',    label: "Driver's License Copy",                       required: true },
  { key: 'proof_of_address',   label: 'Proof of Address (Utility bill / bank statement)', required: false },
  { key: 'vehicle_photos',     label: 'Vehicle Photographs (front, rear, sides)',   required: false },
]

export default function MotorDocuments() {
  const { motorData, updateMotor } = useQuoteStore()

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

  return (
    <div className="space-y-5">
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
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
  )
}

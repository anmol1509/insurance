'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const DOC_SLOTS = [
  { key: 'vehicle_license',    label: 'Vehicle License (Registration Certificate)', required: true },
  { key: 'proof_of_ownership', label: 'Proof of Ownership (Vehicle Particulars)',   required: true },
  { key: 'drivers_license',    label: "Driver's License Copy",                       required: true },
  { key: 'proof_of_address',   label: 'Proof of Address (Utility bill / bank statement)', required: false },
  { key: 'vehicle_photos',     label: 'Vehicle Photographs (front, rear, sides)',   required: false },
]

const REQUIRED_KEYS = ['vehicle_license', 'proof_of_ownership', 'drivers_license']

export default function MotorDocuments() {
  const { motorData, updateMotor } = useQuoteStore()

  const uploadedRequired = REQUIRED_KEYS.filter((k) => motorData.uploadedDocs[k]).length
  const totalRequired = REQUIRED_KEYS.length
  const allRequired = uploadedRequired === totalRequired

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
      {/* Upload progress counter */}
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 py-3.5 rounded-2xl border-2"
        style={{
          borderColor: allRequired ? 'var(--motor-300)' : 'var(--border-default)',
          backgroundColor: allRequired ? 'var(--motor-50)' : 'white',
          transition: 'border-color 0.3s, background-color 0.3s',
        }}
      >
        <div>
          <p className="font-sans font-bold text-[13px]" style={{ color: allRequired ? 'var(--motor-700)' : 'var(--text-primary)' }}>
            {allRequired
              ? 'All required documents uploaded'
              : `${uploadedRequired} of ${totalRequired} required documents uploaded`}
          </p>
          <div className="flex gap-1.5 mt-2">
            {REQUIRED_KEYS.map((k) => (
              <div
                key={k}
                className="h-1.5 w-14 rounded-full"
                style={{
                  backgroundColor: motorData.uploadedDocs[k] ? 'var(--motor-600)' : 'var(--border-medium)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: allRequired ? 'var(--motor-600)' : 'var(--surface-raised)',
            transition: 'background-color 0.3s',
          }}
        >
          {allRequired
            ? <CheckCircle2 className="w-5 h-5 text-white" />
            : <span className="font-display font-bold text-[15px]" style={{ color: 'var(--text-muted)' }}>{uploadedRequired}/{totalRequired}</span>}
        </div>
      </motion.div>

      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <span className="text-lg shrink-0">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Required per NAICOM/NSIA guidelines. Files must be clear and legible.
          Accepted formats: PDF, JPG, PNG (max 5 MB each). Drag &amp; drop supported.
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

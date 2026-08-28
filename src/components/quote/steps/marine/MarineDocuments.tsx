'use client'
import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { documentSlotsFor, requiredSlotsFor } from '@/lib/nsia/documents'
import { validateUpload } from '@/lib/nsia/files'
import { getDocumentFile, putDocumentFile, removeDocumentFile } from '@/store/documentFiles'

const SLOTS = documentSlotsFor('marine').map((entry) => ({
  key: entry.slot,
  label: entry.label,
  hint: entry.hint,
  required: entry.required,
}))
const REQUIRED_KEYS = requiredSlotsFor('marine')

export default function MarineDocuments() {
  const { marineData, updateMarine } = useQuoteStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const uploadedRequired = REQUIRED_KEYS.filter((k) => marineData.uploadedDocs[k]).length
  const totalRequired = REQUIRED_KEYS.length
  const allRequired = uploadedRequired === totalRequired

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const stale = Object.keys(marineData.uploadedDocs).filter((key) => !getDocumentFile(key))
    if (stale.length === 0) return
    const docs = { ...marineData.uploadedDocs }
    stale.forEach((key) => delete docs[key])
    updateMarine({ uploadedDocs: docs })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleUpload(key: string, file: File) {
    const problem = await validateUpload(file)
    if (problem) {
      setErrors((prev) => ({ ...prev, [key]: problem }))
      return
    }
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    putDocumentFile(key, file)
    updateMarine({
      uploadedDocs: { ...marineData.uploadedDocs, [key]: { name: file.name, size: file.size, status: 'uploaded' } },
    })
  }

  function handleRemove(key: string) {
    removeDocumentFile(key)
    const docs = { ...marineData.uploadedDocs }
    delete docs[key]
    updateMarine({ uploadedDocs: docs })
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 py-3.5 rounded-2xl border-2"
        style={{
          borderColor: allRequired ? 'var(--marine-100)' : 'var(--border-default)',
          backgroundColor: allRequired ? 'var(--marine-50)' : 'white',
          transition: 'border-color 0.3s, background-color 0.3s',
        }}
      >
        <div>
          <p className="font-sans font-bold text-[13px]" style={{ color: allRequired ? 'var(--marine-700)' : 'var(--text-primary)' }}>
            {allRequired
              ? 'All required documents uploaded'
              : `${uploadedRequired} of ${totalRequired} required documents uploaded`}
          </p>
          <div className="flex gap-1.5 mt-2">
            {REQUIRED_KEYS.map((k) => (
              <div
                key={k}
                className="h-1.5 w-14 rounded-full"
                style={{ backgroundColor: marineData.uploadedDocs[k] ? 'var(--marine-600)' : 'var(--border-medium)', transition: 'background-color 0.3s' }}
              />
            ))}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: allRequired ? 'var(--marine-600)' : 'var(--surface-raised)', transition: 'background-color 0.3s' }}
        >
          {allRequired
            ? <CheckCircle2 className="w-5 h-5 text-white" />
            : <span className="font-display font-bold text-[15px]" style={{ color: 'var(--text-muted)' }}>{uploadedRequired}/{totalRequired}</span>}
        </div>
      </motion.div>

      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--marine-50)', borderColor: 'var(--marine-100)' }}
      >
        <span className="text-lg shrink-0">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Required by NSIA to issue your marine cargo certificate. Accepted formats: PDF, JPG, PNG (max 5 MB each).
        </p>
      </div>

      <DocumentUploadZone
        slots={SLOTS}
        uploadedDocs={marineData.uploadedDocs}
        onUpload={handleUpload}
        onRemove={handleRemove}
        errors={errors}
        productColor="var(--marine-600)"
        productColorBg="var(--marine-50)"
      />
    </div>
  )
}

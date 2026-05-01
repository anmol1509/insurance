'use client'
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle2, X } from 'lucide-react'

interface DocSlot {
  key: string
  label: string
  required?: boolean
}

interface DocumentUploadZoneProps {
  slots: DocSlot[]
  uploadedDocs: Record<string, { name: string; size: number; status: 'uploaded' | 'pending' }>
  onUpload: (key: string, file: File) => void
  onRemove: (key: string) => void
  productColor?: string
  productColorBg?: string
}

export default function DocumentUploadZone({
  slots,
  uploadedDocs,
  onUpload,
  onRemove,
  productColor = 'var(--green-700)',
  productColorBg = 'var(--green-50)',
}: DocumentUploadZoneProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  return (
    <div className="flex flex-col gap-4">
      {slots.map((slot) => {
        const doc = uploadedDocs[slot.key]
        const uploaded = !!doc

        return (
          <div
            key={slot.key}
            className="rounded-2xl border-[1.5px] border-dashed transition-colors"
            style={{
              borderColor: uploaded ? productColor : 'var(--border-medium)',
              backgroundColor: uploaded ? productColorBg : 'var(--surface-raised)',
            }}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              ref={(el) => { inputRefs.current[slot.key] = el }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(slot.key, file)
                e.target.value = ''
              }}
            />

            <AnimatePresence mode="wait">
              {uploaded ? (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: productColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {doc.name}
                    </p>
                    <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                      {(doc.size / 1024).toFixed(0)} KB · {slot.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(slot.key)}
                    className="p-1 rounded-full hover:bg-[var(--border-subtle)] transition-colors"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="empty"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => inputRefs.current[slot.key]?.click()}
                  className="w-full flex items-center gap-4 px-5 py-5 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--border-subtle)' }}
                  >
                    <Upload className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {slot.label}
                      {slot.required && <span style={{ color: 'var(--error)' }}> *</span>}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Click to upload · PDF, JPG or PNG
                    </p>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

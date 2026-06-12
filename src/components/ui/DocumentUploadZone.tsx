'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle2, X, FileText, Image as ImageIcon } from 'lucide-react'

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

function FileTypeIcon({ name, productColor, productColorBg }: { name: string; productColor: string; productColorBg: string }) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') {
    return (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEF2F2' }}>
        <FileText className="w-5 h-5 text-red-500" />
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: productColorBg }}>
      <ImageIcon className="w-5 h-5" style={{ color: productColor }} />
    </div>
  )
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
  const [draggingOver, setDraggingOver] = useState<string | null>(null)

  function handleDrop(key: string, e: React.DragEvent) {
    e.preventDefault()
    setDraggingOver(null)
    const file = e.dataTransfer.files?.[0]
    if (file && ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      onUpload(key, file)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {slots.map((slot) => {
        const doc = uploadedDocs[slot.key]
        const uploaded = !!doc
        const isOver = draggingOver === slot.key

        return (
          <div
            key={slot.key}
            className="rounded-2xl border-[1.5px] border-dashed"
            style={{
              borderColor: isOver ? productColor : (uploaded ? productColor : 'var(--border-medium)'),
              backgroundColor: isOver ? productColorBg : (uploaded ? productColorBg : 'var(--surface-raised)'),
              boxShadow: isOver ? `0 0 0 3px color-mix(in srgb, ${productColor} 15%, transparent)` : 'none',
              transition: 'border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
            }}
            onDragOver={(e) => { e.preventDefault(); setDraggingOver(slot.key) }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDraggingOver(null) }}
            onDrop={(e) => handleDrop(slot.key, e)}
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
                  <FileTypeIcon name={doc.name} productColor={productColor} productColorBg={productColorBg} />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {doc.name}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {(doc.size / 1024).toFixed(0)} KB · {slot.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3 h-3" style={{ color: productColor }} />
                      <span className="font-sans text-[11px] font-medium" style={{ color: productColor }}>Uploaded successfully</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(slot.key)}
                    className="p-1.5 rounded-full hover:bg-red-50 transition-colors shrink-0"
                    title="Remove file"
                  >
                    <X className="w-4 h-4 text-red-400" />
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
                    style={{
                      backgroundColor: isOver ? productColorBg : 'var(--border-subtle)',
                      transform: isOver ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.15s, background-color 0.15s',
                    }}
                  >
                    <Upload className="w-5 h-5" style={{ color: isOver ? productColor : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {slot.label}
                      {slot.required && <span style={{ color: 'var(--error)' }}> *</span>}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {isOver ? 'Drop file here to upload' : 'Click to upload or drag & drop · PDF, JPG, PNG'}
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

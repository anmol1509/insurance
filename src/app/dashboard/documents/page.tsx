'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Upload, FileText, Award, Receipt, Paperclip } from 'lucide-react'
import { mockDocuments, PRODUCT_COLORS } from '@/lib/mockData'
import Badge from '@/components/ui/Badge'

const TYPE_ICON: Record<string, React.ElementType> = {
  certificate:     Award,
  policy_schedule: FileText,
  receipt:         Receipt,
  claim_form:      FileText,
  uploaded:        Paperclip,
}

const TYPE_LABEL: Record<string, string> = {
  certificate:     'Certificate',
  policy_schedule: 'Policy Schedule',
  receipt:         'Receipt',
  claim_form:      'Claim Form',
  uploaded:        'Uploaded',
}

type Filter = 'all' | 'certificate' | 'policy_schedule' | 'receipt' | 'uploaded'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',            label: 'All' },
  { key: 'certificate',    label: 'Certificates' },
  { key: 'policy_schedule', label: 'Schedules' },
  { key: 'receipt',        label: 'Receipts' },
  { key: 'uploaded',       label: 'Uploaded' },
]

export default function DocumentsPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const shown = filter === 'all' ? mockDocuments : mockDocuments.filter((d) => d.type === filter)

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Documents
          </h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {mockDocuments.length} documents stored securely
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-semibold text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? mockDocuments.length : mockDocuments.filter((d) => d.type === f.key).length
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
              style={{
                backgroundColor: filter === f.key ? 'var(--green-700)' : 'white',
                borderColor: filter === f.key ? 'var(--green-700)' : 'var(--border-default)',
                color: filter === f.key ? 'white' : 'var(--text-secondary)',
              }}
            >
              {f.label}
              {count > 0 && (
                <span
                  className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-raised)',
                    color: filter === f.key ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Document list */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        {shown.length === 0 ? (
          <div className="text-center py-14">
            <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>No documents in this category.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {shown.map((doc, i) => {
              const colors = PRODUCT_COLORS[doc.productType]
              const Icon = TYPE_ICON[doc.type] ?? FileText
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.light }}
                  >
                    <Icon className="w-4 h-4" style={{ color: colors.main }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>
                      {doc.name}
                    </p>
                    <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {doc.policyRef} · {doc.size} · {new Date(doc.uploadedAt).toLocaleDateString('en-NG')}
                    </p>
                  </div>

                  <Badge variant={doc.productType as 'motor' | 'medical' | 'travel' | 'business'}>
                    {TYPE_LABEL[doc.type]}
                  </Badge>

                  <button
                    type="button"
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[var(--green-50)] hover:border-[var(--green-100)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <p className="font-sans text-[11px] text-center mt-4" style={{ color: 'var(--text-subtle)' }}>
        Documents are encrypted and stored securely in compliance with NDPR.
      </p>
    </div>
  )
}

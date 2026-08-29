'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/** Lightweight page controls for admin list tables. */
export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  if (total === 0) return null

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t flex-wrap gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
      <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-raised)]"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button key={p} type="button" onClick={() => onPageChange(p)}
            className="min-w-[32px] h-8 px-2 rounded-lg font-sans font-semibold text-[12px] transition-colors"
            style={{ backgroundColor: p === page ? '#DC2626' : 'transparent', color: p === page ? 'white' : 'var(--text-secondary)' }}>
            {p}
          </button>
        ))}
        <button type="button" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-raised)]"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

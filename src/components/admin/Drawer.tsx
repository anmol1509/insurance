'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  accent?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

/** Slide-in detail panel used across admin list pages for row drill-downs. */
export default function Drawer({ open, onClose, title, subtitle, accent = '#DC2626', children, footer }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80]" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[90] w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b shrink-0" style={{ borderColor: 'var(--border-default)', borderTop: `3px solid ${accent}` }}>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-[18px] truncate" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                {subtitle && <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
              </div>
              <button type="button" onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-[var(--surface-raised)]"
                style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 border-t shrink-0" style={{ borderColor: 'var(--border-default)' }}>
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

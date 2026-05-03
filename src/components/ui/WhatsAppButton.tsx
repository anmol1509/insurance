'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const WA_NUMBER = '2348001234567'
const WA_MESSAGE = encodeURIComponent('Hi ShopInsurance! I need help with an insurance quote.')

export default function WhatsAppButton() {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 md:right-6 z-[55] flex flex-col items-end gap-2">
      <AnimatePresence>
        {tooltipVisible && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-xl border border-[var(--border-default)] px-4 py-3 max-w-[220px] relative"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setDismissed(true) }}
              className="absolute top-2 right-2 text-[var(--text-subtle)] hover:text-[var(--text-muted)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="font-sans font-semibold text-[13px] pr-4" style={{ color: 'var(--text-primary)' }}>
              Chat with us on WhatsApp
            </p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Instant replies · Mon–Sat 8am–8pm
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* WhatsApp icon SVG */}
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </div>
  )
}

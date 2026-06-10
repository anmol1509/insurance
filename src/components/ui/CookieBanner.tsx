'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const STORAGE_KEY = 'si_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem(STORAGE_KEY, 'accepted'); setVisible(false) }
  const decline = () => { localStorage.setItem(STORAGE_KEY, 'declined'); setVisible(false) }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 right-0 z-[60] px-3 pointer-events-none bottom-[4.75rem] md:bottom-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="max-w-[640px] mx-auto bg-white rounded-full shadow-lg border border-[var(--border-default)] pl-4 pr-1.5 py-1.5 flex items-center gap-3 pointer-events-auto">
            <p className="font-sans text-[12px] leading-snug flex-1 min-w-0" style={{ color: 'var(--text-secondary)' }}>
              We use cookies — see our{' '}
              <Link href="/privacy" className="underline" style={{ color: 'var(--green-700)' }}>Privacy Policy</Link>.
              <span className="hidden sm:inline"> NDPR compliant.</span>
            </p>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={decline}
                className="h-8 px-3 rounded-full font-sans font-medium text-[12px] hover:bg-[var(--surface-raised)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                Decline
              </button>
              <button
                type="button"
                onClick={accept}
                className="h-8 px-4 rounded-full font-sans font-semibold text-[12px] text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--green-700)' }}
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

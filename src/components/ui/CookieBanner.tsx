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
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
        >
          <div className="max-w-[780px] mx-auto bg-white rounded-2xl shadow-2xl border border-[var(--border-default)] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
            <div className="text-2xl shrink-0">🍪</div>
            <p className="font-sans text-[13px] leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
              We use cookies to improve your experience and for analytics. By continuing, you agree to our{' '}
              <Link href="/privacy" className="underline" style={{ color: 'var(--green-700)' }}>Privacy Policy</Link>
              {' '}and{' '}
              <Link href="/terms" className="underline" style={{ color: 'var(--green-700)' }}>Terms</Link>.
              We comply with the Nigeria Data Protection Regulation (NDPR).
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={decline}
                className="h-9 px-4 rounded-xl border font-sans font-medium text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
              >
                Decline
              </button>
              <button
                type="button"
                onClick={accept}
                className="h-9 px-5 rounded-xl font-sans font-semibold text-[13px] text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--green-700)' }}
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

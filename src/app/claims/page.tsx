'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ClaimsPage() {
  return (
    <div className="min-h-screen py-20 px-5 lg:px-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[800px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl" style={{ backgroundColor: 'var(--green-50)' }}>
            🛡
          </div>
          <h1 className="font-display font-extrabold text-4xl tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            File a Claim
          </h1>
          <p className="font-sans text-base mb-8" style={{ color: 'var(--text-muted)' }}>
            Start your claims process here. We aim to process all claims within 24 hours.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center h-12 px-8 bg-[var(--green-700)] text-white rounded-[var(--radius-xl)] font-sans font-semibold text-sm hover:-translate-y-px hover:shadow-md transition-all"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

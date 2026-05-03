'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, ArrowRight, Shield, Calendar } from 'lucide-react'
import Link from 'next/link'
import { mockPolicies, PRODUCT_COLORS } from '@/lib/mockData'
import { formatNaira } from '@/lib/formatters'

export default function RenewalsPage() {
  const [query, setQuery] = useState('')

  const expiringSoon = mockPolicies.filter(p => {
    const daysLeft = Math.ceil((new Date(p.expiryDate).getTime() - Date.now()) / 86400000)
    return daysLeft <= 60
  })

  const filtered = expiringSoon.filter(p =>
    p.ref.toLowerCase().includes(query.toLowerCase()) ||
    p.productType.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[860px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Renew a policy
        </h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Policies expiring within 60 days
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by policy number or type…"
          className="w-full h-11 pl-10 pr-4 rounded-2xl border font-sans text-[14px] outline-none"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <RefreshCw className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-subtle)' }} />
          <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>No policies due for renewal</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((policy, i) => {
            const colors = PRODUCT_COLORS[policy.productType]
            const daysLeft = Math.ceil((new Date(policy.expiryDate).getTime() - Date.now()) / 86400000)
            const urgent = daysLeft <= 14
            return (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border p-5 flex items-center gap-4"
                style={{ borderColor: urgent ? colors.main : 'var(--border-default)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: colors.light }}>
                  {colors.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                    {policy.productType.charAt(0).toUpperCase() + policy.productType.slice(1)} Insurance
                  </p>
                  <p className="font-sans text-[12px] mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Shield className="w-3 h-3" /> {policy.ref}
                    <span className="mx-1">·</span>
                    <Calendar className="w-3 h-3" />
                    <span style={{ color: urgent ? 'var(--error)' : 'var(--text-muted)' }}>
                      {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
                    </span>
                  </p>
                </div>
                <div className="text-right shrink-0 mr-2">
                  <p className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                    {formatNaira(policy.premium)}
                  </p>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>/yr</p>
                </div>
                <Link
                  href={`/quote/${policy.productType}`}
                  className="shrink-0 flex items-center gap-1 px-4 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
                  style={{ backgroundColor: colors.main }}
                >
                  Renew <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className="mt-8 p-5 rounded-2xl border text-center" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
        <p className="font-sans font-semibold text-[14px] mb-1" style={{ color: 'var(--green-700)' }}>Need a new policy instead?</p>
        <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>Get a fresh quote in under 3 minutes.</p>
        <Link
          href="/quote/motor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white"
          style={{ backgroundColor: 'var(--green-700)' }}
        >
          Get a quote →
        </Link>
      </div>
    </div>
  )
}

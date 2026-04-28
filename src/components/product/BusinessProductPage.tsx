'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Tag from '@/components/ui/Tag'
import CheckboxCard from '@/components/ui/CheckboxCard'
import { formatNaira } from '@/lib/formatters'

const coverageOptions = [
  { id: 'fire_perils', label: 'Fire & Special Perils', sub: 'Fire, lightning, explosion, and allied perils', price: 50000, defaultChecked: true },
  { id: 'burglary', label: 'Burglary & Theft', sub: 'Forcible entry/exit, theft by employees', price: 35000, defaultChecked: true },
  { id: 'liability', label: 'Third Party Liability', sub: 'Legal liability to third parties visiting your premises', price: 45000, defaultChecked: false },
  { id: 'gpa', label: 'Group Personal Accident', sub: 'Death and disability benefit per employee', price: 8000, defaultChecked: false },
  { id: 'health', label: 'Employee Health Cover', sub: 'Basic HMO plan for your team', price: 12000, defaultChecked: false },
]

export default function BusinessProductPage() {
  const [selected, setSelected] = useState<string[]>(['fire_perils', 'burglary'])

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const total = coverageOptions.filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + o.price, 0)

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Tag variant="business">Business Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Protect what you<br />built from scratch.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-8" style={{ color: 'var(--text-muted)' }}>
              Fire & perils, burglary, liability, and GPA for every Nigerian business.
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/business" className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: 'var(--business-600)' }}>
                Get business quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Starting from ₦50,000/year</p>
            </div>
          </motion.div>
          <div className="hidden lg:flex justify-center">
            <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--business-50)' }}>
              <svg viewBox="0 0 160 160" width="140" fill="none">
                <rect x="30" y="60" width="100" height="90" rx="6" fill="var(--business-100)" />
                <rect x="50" y="20" width="60" height="44" rx="6" fill="var(--business-100)" />
                {[0,1,2].map(r => [0,1,2,3].map(c => (
                  <rect key={`${r}-${c}`} x={40+c*20} y={68+r*22} width="12" height="14" rx="2" fill="var(--business-600)" opacity="0.7" />
                )))}
                <rect x="65" y="100" width="30" height="50" rx="3" fill="var(--business-700)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage builder */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Build your custom cover
          </h2>
          <p className="font-sans text-base mb-8" style={{ color: 'var(--text-muted)' }}>Your premium updates live.</p>

          <div className="max-w-[680px] flex flex-col gap-3">
            {coverageOptions.map((opt) => (
              <CheckboxCard
                key={opt.id}
                label={opt.label}
                subLabel={opt.sub}
                priceTag={`+${formatNaira(opt.price)}/yr`}
                checked={selected.includes(opt.id)}
                onChange={() => toggle(opt.id)}
                productColor="var(--business-600)"
                productColorBg="var(--business-50)"
              />
            ))}
          </div>

          {/* Live premium card */}
          <div
            className="max-w-[680px] mt-4 px-6 py-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--business-600)' }}
          >
            <div>
              <p className="font-sans font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Estimated annual premium:</p>
              <p className="font-display font-bold text-[28px] text-white">{formatNaira(total)}</p>
            </div>
            <Link
              href="/quote/business"
              className="h-11 px-5 bg-white rounded-xl font-sans font-semibold text-sm flex items-center shrink-0"
              style={{ color: 'var(--business-600)' }}
            >
              Get this quote →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--business-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Secure your business today</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Custom coverage for every Nigerian business, big or small.</p>
          <Link href="/quote/business" className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px]" style={{ color: 'var(--business-600)' }}>
            Get business quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}

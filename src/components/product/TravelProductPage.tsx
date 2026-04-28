'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import Tag from '@/components/ui/Tag'
import PlanCard from '@/components/ui/PlanCard'

const destinations = [
  { id: 'schengen', label: '🌍 Schengen/Europe' },
  { id: 'uk', label: '🇬🇧 UK' },
  { id: 'usa_canada', label: '🇺🇸 USA/Canada' },
  { id: 'africa', label: '🌍 Africa' },
  { id: 'asia', label: '🌏 Asia' },
  { id: 'worldwide', label: '🌐 Worldwide' },
]

export default function TravelProductPage() {
  const [selectedDest, setSelectedDest] = useState('schengen')

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Tag variant="travel">Travel Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Travel the world,<br />worry-free.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-6" style={{ color: 'var(--text-muted)' }}>
              Schengen-compliant plans, medical emergencies, baggage protection. Certificate ready for visa applications.
            </p>
            {/* Schengen badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-8 border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Check className="w-5 h-5 shrink-0" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>
                Schengen EU-compliant · Meets €30,000 minimum medical coverage requirement
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/travel" className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: 'var(--travel-600)' }}>
                Get travel quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Starting from ₦8,000/trip</p>
            </div>
          </motion.div>
          <div className="hidden lg:flex justify-center">
            <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--travel-50)' }}>
              <svg viewBox="0 0 160 160" width="140" fill="none">
                <circle cx="80" cy="80" r="65" stroke="var(--travel-100)" strokeWidth="4" />
                <path d="M20 80 Q80 20 140 80 Q80 140 20 80" fill="var(--travel-100)" />
                <path d="M40 60 L120 60" stroke="var(--travel-600)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M60 40 L130 80 L80 100 Z" fill="var(--travel-600)" />
                <circle cx="60" cy="40" r="5" fill="var(--travel-700)" />
                <circle cx="130" cy="80" r="5" fill="var(--travel-700)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Destination selector */}
      <section className="py-8 px-5 lg:px-20 border-b border-[var(--border-default)] bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Where are you going?</p>
          <div className="flex flex-wrap gap-2">
            {destinations.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDest(d.id)}
                className="border-[1.5px] rounded-full px-4 py-2 font-sans font-medium text-[13px] transition-all duration-200"
                style={selectedDest === d.id
                  ? { backgroundColor: 'var(--travel-600)', borderColor: 'var(--travel-600)', color: 'white' }
                  : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                }
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>
            Choose your plan
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <PlanCard tier="Economy" price="₦8,000" period="/trip" description="Africa travel with basic medical and baggage cover." features={['Africa coverage', '₦2M medical cover', 'Basic baggage', 'NIID certificate']} featured={false} productColor="var(--travel-600)" productColorBg="var(--travel-50)" onSelect={() => { window.location.href = '/quote/travel' }} />
            <PlanCard tier="Schengen/Worldwide" price="₦22,000" period="/trip" description="EU/Worldwide with €30K+ medical, cancellation, and baggage." features={['€30,000+ medical', 'Trip cancellation', 'Baggage protection', 'Schengen compliant', 'Flight delay cover']} featured={true} productColor="var(--travel-600)" productColorBg="var(--travel-50)" onSelect={() => { window.location.href = '/quote/travel' }} />
            <PlanCard tier="Multi-trip Annual" price="₦85,000" period="/year" description="Unlimited trips worldwide, all cover included." features={['Unlimited trips', 'Worldwide cover', 'All Schengen benefits', 'Priority support']} featured={false} productColor="var(--travel-600)" productColorBg="var(--travel-50)" onSelect={() => { window.location.href = '/quote/travel' }} />
          </div>
        </div>
      </section>

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--travel-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Ready to travel with confidence?</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Get your Schengen-compliant certificate in minutes.</p>
          <Link href="/quote/travel" className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px]" style={{ color: 'var(--travel-600)' }}>
            Get travel quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}

'use client'
import { motion } from 'framer-motion'
import WavyUnderline from '@/components/ui/WavyUnderline'

const testimonials = [
  {
    quote:
      'ShopInsurance made buying cover effortless. My certificate arrived before I left the office.',
    name: 'Chiamaka Obi',
    product: 'Motor Insurance',
    bg: 'var(--orange-500)',
    textColor: 'white',
    nameColor: 'white',
    productBadgeBg: 'rgba(255,255,255,0.2)',
    productBadgeText: 'white',
    large: true,
  },
  {
    quote:
      'From quote to certificate in under 5 minutes. Absolutely outstanding service.',
    name: 'Yemi Adeyemi',
    product: 'Medical Insurance',
    bg: 'var(--green-700)',
    textColor: 'rgba(255,255,255,0.9)',
    nameColor: 'white',
    productBadgeBg: 'rgba(255,255,255,0.2)',
    productBadgeText: 'white',
    large: false,
  },
  {
    quote:
      'Got my Schengen travel insurance in minutes! The whole process was smooth and transparent.',
    name: 'Kola Fashola',
    product: 'Travel Insurance',
    bg: 'var(--medical-50)',
    textColor: 'var(--text-secondary)',
    nameColor: 'var(--text-primary)',
    productBadgeBg: 'var(--medical-100)',
    productBadgeText: 'var(--medical-700)',
    large: false,
  },
  {
    quote:
      'My business needed quick coverage and ShopInsurance delivered instantly.',
    name: 'Tunde Balogun',
    product: 'Business Insurance',
    bg: 'white',
    textColor: 'var(--text-secondary)',
    nameColor: 'var(--text-primary)',
    productBadgeBg: 'var(--business-50)',
    productBadgeText: 'var(--business-700)',
    large: false,
  },
  {
    quote:
      'I found exactly the cover I needed at a price I could afford.',
    name: 'Ngozi Eze',
    product: 'Medical Insurance',
    bg: 'var(--business-50)',
    textColor: 'var(--text-secondary)',
    nameColor: 'var(--text-primary)',
    productBadgeBg: 'var(--business-100)',
    productBadgeText: 'var(--business-700)',
    large: false,
    bigQuote: true,
  },
]

export default function TestimonialsSection() {
  const [first, ...rest] = testimonials

  return (
    <section style={{ backgroundColor: 'var(--page-bg)' }} className="py-20 px-5 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="font-display font-extrabold text-5xl lg:text-[48px] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            <em
              className="not-italic font-serif italic relative"
              style={{ color: 'var(--orange-500)' }}
            >
              Real
              <span className="absolute -bottom-3 left-0 w-full">
                <WavyUnderline color="var(--orange-500)" width={80} />
              </span>
            </em>{' '}
            customers, real stories.
          </h2>
          <p
            className="font-sans text-[17px] max-w-[540px] mx-auto mt-5"
            style={{ color: 'var(--text-muted)' }}
          >
            Join thousands of Nigerians who trust ShopInsurance for fast, fair, and transparent
            cover.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr] gap-4">
          {/* Large featured card (spans 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="md:row-span-2 rounded-4xl p-9 flex flex-col"
            style={{ backgroundColor: first.bg }}
          >
            <div className="flex-1">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                className="font-display font-semibold text-[22px] leading-snug"
                style={{ color: first.textColor }}
              >
                &ldquo;{first.quote}&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="font-display font-bold text-[18px]" style={{ color: first.nameColor }}>
                {first.name}
              </p>
              <span
                className="inline-block mt-1 font-sans text-xs px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: first.productBadgeBg,
                  color: first.productBadgeText,
                }}
              >
                {first.product}
              </span>
            </div>
          </motion.div>

          {/* Middle and right cards */}
          {rest.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.08 }}
              className="rounded-4xl p-7 border border-[var(--border-default)] flex flex-col justify-between"
              style={{
                backgroundColor: t.bg,
                border: ['white', 'var(--medical-50)', 'var(--business-50)'].includes(t.bg)
                  ? '1px solid var(--border-default)'
                  : 'none',
              }}
            >
              {!t.bigQuote && i < 2 && (
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      style={{
                        color: t.bg === 'var(--green-700)' ? 'rgba(255,255,255,0.9)' : '#FBBF24',
                        fontSize: '15px',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              <p
                className={`font-sans leading-relaxed ${t.bigQuote ? 'font-display font-bold text-[26px]' : 'text-sm italic'}`}
                style={{ color: t.textColor }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4">
                <p className="font-display font-semibold text-sm" style={{ color: t.nameColor }}>
                  {t.name}
                </p>
                <p className="font-sans text-xs mt-1" style={{ color: t.textColor, opacity: 0.7 }}>
                  {!t.bigQuote && 'ShopInsurance customer'}
                  {t.bigQuote && t.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'ShopInsurance made buying cover effortless. My certificate arrived before I left the office.',
    name: 'Chiamaka Obi',
    product: 'Motor Insurance',
  },
  {
    quote: 'From quote to certificate in under 5 minutes. Absolutely outstanding service.',
    name: 'Yemi Adeyemi',
    product: 'Medical Insurance',
  },
  {
    quote: 'Got my Schengen travel insurance in minutes. Transparent pricing, no surprises.',
    name: 'Kola Fashola',
    product: 'Travel Insurance',
  },
  {
    quote: 'My business needed quick coverage and ShopInsurance delivered without any hassle.',
    name: 'Tunde Balogun',
    product: 'Business Insurance',
  },
  {
    quote: 'I found exactly the cover I needed at a price I could afford. Highly recommended.',
    name: 'Ngozi Eze',
    product: 'Medical Insurance',
  },
  {
    quote: 'The digital certificate was in my inbox within 2 minutes of payment. Impressive.',
    name: 'Emeka Chukwu',
    product: 'Motor Insurance',
  },
]

export default function TestimonialsSection() {
  return (
    <section style={{ backgroundColor: 'var(--page-bg)' }} className="py-20 px-5 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--green-700)' }}>
            Customer Reviews
          </p>
          <h2
            className="font-display font-extrabold text-4xl lg:text-[44px] tracking-tight max-w-[520px]"
            style={{ color: 'var(--text-primary)' }}
          >
            Trusted by thousands of Nigerians.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-[var(--border-default)] p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#FBBF24">
                    <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="font-sans text-[14px] leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

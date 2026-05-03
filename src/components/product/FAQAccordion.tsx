'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface Props {
  faqs: FAQItem[]
  productColor: string
}

export default function FAQAccordion({ faqs, productColor }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 px-5 lg:px-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          {/* Left heading */}
          <div className="lg:sticky lg:top-28">
            <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--text-subtle)' }}>
              FAQ
            </p>
            <h2 className="font-display font-extrabold text-[28px] md:text-[34px] tracking-tight leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Common questions answered
            </h2>
            <p className="font-sans text-[14px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Can&apos;t find your answer? Our team is available 24/7.
            </p>
            <a
              href="https://wa.me/2348001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Right accordion */}
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden transition-colors"
                style={{
                  borderColor: open === i ? productColor : 'var(--border-default)',
                  backgroundColor: 'white',
                }}
              >
                <button
                  type="button"
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-sans font-semibold text-[14px] leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200"
                    style={{
                      color: open === i ? productColor : 'var(--text-muted)',
                      transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-[13px] leading-relaxed px-5 pb-5" style={{ color: 'var(--text-muted)' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

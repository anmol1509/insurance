'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'Is ShopInsurance licensed and regulated in Nigeria?',
    a: 'Yes. ShopInsurance is a registered insurance broker licensed by NAICOM (National Insurance Commission of Nigeria) under Licence No. LIC/INS/NIA/2024/0042. Every underwriter on our platform is independently NAICOM-licensed. We also comply with NDPR data protection regulations and are registered with the CAC (RC 1234567).',
  },
  {
    q: 'How quickly will I get my insurance certificate?',
    a: 'Motor, travel, and most medical policies issue a digital certificate within 3 minutes of payment confirmation. The certificate is sent to your email, accessible in your dashboard, and is NIID-registered for motor policies. Business policies may require up to 4 business hours for underwriting review.',
  },
  {
    q: 'Can I compare quotes from multiple insurers at once?',
    a: 'Absolutely — that\'s the core of ShopInsurance. After you complete the quote form, we display plans from all our partner insurers side-by-side, ranked by popularity, price, or star rating. You can also use our comparison tool to put up to 3 plans head-to-head on a single screen.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major Nigerian payment methods including bank transfer, debit/credit cards (Visa, Mastercard, Verve), USSD (*894#, *737#), and mobile money through Paystack and Flutterwave. All transactions are encrypted with 256-bit SSL.',
  },
  {
    q: 'How do I file a claim if something goes wrong?',
    a: 'Log in to your dashboard and click "File a Claim". You\'ll fill in the incident details, upload supporting documents (photos, police report, medical report etc.), and submit. Your insurer will acknowledge within 24 hours. You can track claim status in real time on your dashboard. For emergencies, call our 24/7 helpline: +234 800 123 4567.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Your data is protected under Nigeria\'s NDPR (Nigeria Data Protection Regulation). We use bank-grade AES-256 encryption for stored data, TLS 1.3 for data in transit, and never sell or share your information with third parties without your explicit consent. Our privacy policy is available at shopinsurance.com.ng/privacy.',
  },
  {
    q: 'Can I buy insurance for someone else (gift a policy)?',
    a: 'Yes. During the quote flow, you can specify a different named insured (e.g., insuring your parent\'s car or buying travel cover for a family member). The certificate will be issued in their name. Corporate accounts can bulk-purchase policies for employees.',
  },
  {
    q: 'What happens if I need to cancel my policy?',
    a: 'You can cancel your policy at any time from your dashboard. A pro-rata refund is calculated based on unused coverage days, minus a 10% short-rate penalty (per NAICOM guidelines). Refunds are processed to your original payment method within 5–7 business days.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20">
        <div className="max-w-[720px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--text-subtle)' }}>
              FAQ
            </p>
            <h2 className="font-display font-extrabold text-[32px] md:text-[40px] tracking-tight leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Everything you need to know
            </h2>
            <p className="font-sans text-[16px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Can&apos;t find your answer? Speak to our team 24/7 on WhatsApp or call +234 800 123 4567.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden transition-all duration-200"
                style={{
                  borderColor: open === i ? 'var(--border-medium)' : 'var(--border-default)',
                  backgroundColor: 'white',
                }}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{
                      color: 'var(--text-muted)',
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
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p
                        className="font-sans text-[14px] leading-relaxed px-5 pb-5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Support CTA */}
          <div
            className="mt-10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--green-900)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-sans font-bold text-[14px] text-white">Still have questions?</p>
                <p className="font-sans text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Our team replies in under 2 minutes on WhatsApp</p>
              </div>
            </div>
            <a
              href="https://wa.me/2348001234567?text=Hi%20ShopInsurance%2C%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 rounded-full font-sans font-semibold text-[13px] transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

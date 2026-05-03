'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react'

const OFFICES = [
  {
    city: 'Lagos',
    address: '33, Victoria Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos.',
    color: 'var(--motor-600)',
    bg: 'var(--motor-50)',
  },
  {
    city: 'Abuja',
    address: 'Suite 5005, Plot 264, Ahmadu Bello Way, Mabushi, Abuja.',
    color: 'var(--medical-600)',
    bg: 'var(--medical-50)',
  },
  {
    city: 'Ibadan',
    address: 'Standard Villa, Forest Hill Estate New Jericho GRA, Jericho Ibadan, Oyo State.',
    color: 'var(--travel-600)',
    bg: 'var(--travel-50)',
  },
]

const PHONES = ['+234 803 330 5567', '+234 802 352 8091', '+234 802 412 5946']

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!email.includes('@')) e.email = 'Valid email required'
    if (!message.trim()) e.message = 'Please write a message'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1600)
  }

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }} className="min-h-screen">
      {/* Hero band */}
      <div className="bg-white border-b border-[var(--border-default)]">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-14 lg:py-20">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--green-700)' }}>
            Contact Us
          </p>
          <h1 className="font-display font-extrabold text-[36px] lg:text-[48px] tracking-tight leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            We're here to help.
          </h1>
          <p className="font-sans text-[16px] max-w-lg" style={{ color: 'var(--text-muted)' }}>
            Whether it's a quote, a claim, or a question about your policy — reach us by phone, email, or drop into any of our offices.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

          {/* LEFT — contact form */}
          <div>
            <div className="bg-white rounded-3xl border border-[var(--border-default)] p-7 lg:p-10">
              <h2 className="font-display font-bold text-[22px] mb-1" style={{ color: 'var(--text-primary)' }}>
                Send us a message
              </h2>
              <p className="font-sans text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
                We'll get back to you within one business day.
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'var(--green-50)' }}>
                    <Check className="w-8 h-8" style={{ color: 'var(--green-700)' }} strokeWidth={2.5}/>
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                    Message sent!
                  </h3>
                  <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                    Thanks {name.split(' ')[0]}. Our team will reply to <strong>{email}</strong> within one business day.
                  </p>
                  <button type="button" onClick={() => { setSent(false); setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('') }}
                    className="mt-5 h-10 px-6 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Emeka Okafor"
                        className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors focus:border-[var(--green-700)]"
                        style={{ borderColor: errors.name ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}/>
                      {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email address *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                        className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors focus:border-[var(--green-700)]"
                        style={{ borderColor: errors.email ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}/>
                      {errors.email && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="080XXXXXXXX"
                        className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors focus:border-[var(--green-700)]"
                        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}/>
                    </div>
                    <div>
                      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)}
                        className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors focus:border-[var(--green-700)]"
                        style={{ borderColor: 'var(--border-medium)', color: subject ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        <option value="">Select a topic</option>
                        <option>Get a quote</option>
                        <option>Policy enquiry</option>
                        <option>Claims assistance</option>
                        <option>Renewals</option>
                        <option>Complaint</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message *</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                      placeholder="Tell us how we can help you…"
                      className="w-full rounded-xl border-[1.5px] px-3.5 py-3 font-sans text-[14px] outline-none transition-colors focus:border-[var(--green-700)] resize-none"
                      style={{ borderColor: errors.message ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}/>
                    {errors.message && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={sending}
                    className="h-12 rounded-xl font-sans font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-60"
                    style={{ backgroundColor: 'var(--green-700)' }}>
                    {sending ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"/>
                    ) : (
                      <><Send className="w-4 h-4"/>Send message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT — contact details */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-[5rem]">

            {/* Phone */}
            <div className="bg-white rounded-3xl border border-[var(--border-default)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
                  <Phone className="w-5 h-5" style={{ color: 'var(--green-700)' }}/>
                </div>
                <h3 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>Call us</h3>
              </div>
              <div className="flex flex-col gap-2">
                {PHONES.map(p => (
                  <a key={p} href={`tel:${p.replace(/\s/g,'')}`}
                    className="font-sans font-semibold text-[15px] hover:underline"
                    style={{ color: 'var(--green-700)' }}>
                    {p}
                  </a>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl border border-[var(--border-default)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
                  <Mail className="w-5 h-5" style={{ color: 'var(--green-700)' }}/>
                </div>
                <h3 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>Email us</h3>
              </div>
              <a href="mailto:info@standardinsgroup.com"
                className="font-sans font-semibold text-[15px] hover:underline"
                style={{ color: 'var(--green-700)' }}>
                info@standardinsgroup.com
              </a>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-3xl border border-[var(--border-default)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
                  <Clock className="w-5 h-5" style={{ color: 'var(--green-700)' }}/>
                </div>
                <h3 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>Office hours</h3>
              </div>
              <p className="font-sans text-[14px]" style={{ color: 'var(--text-primary)' }}>
                <strong>Monday – Friday</strong>
              </p>
              <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>9:00 AM – 5:00 PM WAT</p>
              <p className="font-sans text-[13px] mt-2 px-3 py-1.5 rounded-lg inline-block" style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}>
                Closed weekends & public holidays
              </p>
            </div>

            {/* Offices */}
            <div className="bg-white rounded-3xl border border-[var(--border-default)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
                  <MapPin className="w-5 h-5" style={{ color: 'var(--green-700)' }}/>
                </div>
                <h3 className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>Our offices</h3>
              </div>
              <div className="flex flex-col gap-3">
                {OFFICES.map(o => (
                  <div key={o.city} className="flex gap-3 p-3.5 rounded-2xl" style={{ backgroundColor: o.bg }}>
                    <div className="w-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: o.color, minHeight: 16 }}/>
                    <div>
                      <p className="font-sans font-bold text-[13px]" style={{ color: o.color }}>{o.city}</p>
                      <p className="font-sans text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{o.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

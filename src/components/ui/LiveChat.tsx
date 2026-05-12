'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ChevronUp } from 'lucide-react'

interface Message { id: number; from: 'bot' | 'user'; text: string }

const INITIAL_MESSAGES: Message[] = [
  { id: 1, from: 'bot', text: "Hi there 👋 I'm ShopBot. How can I help you today?" },
  { id: 2, from: 'bot', text: 'You can ask me about motor, health, travel or business insurance.' },
]

const BOT_REPLIES: Record<string, string> = {
  motor:    'Motor insurance starts from ₦15,000/yr. Get an instant quote at /quote/motor — takes under 3 minutes!',
  car:      'Motor insurance starts from ₦15,000/yr. Get an instant quote at /quote/motor — takes under 3 minutes!',
  health:   'Health plans from top HMOs like Hygeia and Leadway Health start from ₦50,000/yr. Want me to help you compare?',
  medical:  'Health plans from top HMOs like Hygeia and Leadway Health start from ₦50,000/yr. Want me to help you compare?',
  travel:   'Schengen-compliant travel insurance starts from ₦28,000. We issue your certificate in under 5 minutes.',
  business: 'Business cover (fire, burglary, liability) starts from ₦120,000/yr for a typical Lagos SME.',
  claim:    "To file a claim, go to /claims or WhatsApp us on +234 800 123 4567. We'll guide you through every step.",
  renew:    "To renew your policy, visit /renewals and enter your policy number. We'll pull up your details instantly.",
  price:    'Prices depend on your specific details, but you can get an instant personalised quote in under 3 minutes — no obligation!',
  hello:    'Hello! Great to have you here. Ask me anything about insurance or type "motor", "health", "travel", or "business" to get started.',
  hi:       'Hello! Great to have you here. How can I help?',
}

function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (lower.includes(key)) return reply
  }
  return "Thanks for your message! A human agent will follow up shortly. Or WhatsApp us at +234 800 123 4567 for instant help."
}

export default function LiveChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(100)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: nextId.current++, from: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { id: nextId.current++, from: 'bot', text: getBotReply(text) }])
    }, 1000 + Math.random() * 600)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[calc(10rem+env(safe-area-inset-bottom,0px))] md:bottom-[5.5rem] right-4 md:right-6 z-[55] w-[calc(100vw-2rem)] md:w-[340px] max-w-[340px] bg-white rounded-3xl shadow-2xl border border-[var(--border-default)] overflow-hidden flex flex-col"
            style={{ height: 460 }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--green-700)' }}>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/degunlqed/image/upload/v1778555938/Screenshot_2026-05-12_at_8.48.47_AM_ghpcye.png" alt="ShopBot" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="font-sans font-semibold text-[14px] text-white">ShopBot</p>
                  <p className="font-sans text-[11px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                    Online · Typical reply under 1 min
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[80%] px-3.5 py-2.5 rounded-2xl font-sans text-[13px] leading-relaxed"
                    style={msg.from === 'user'
                      ? { backgroundColor: 'var(--green-700)', color: 'white', borderBottomRightRadius: 4 }
                      : { backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)', borderBottomLeftRadius: 4 }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-3.5 py-2.5 rounded-2xl bg-[var(--surface-raised)] flex gap-1 items-center" style={{ borderBottomLeftRadius: 4 }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type a message…"
                className="flex-1 h-10 rounded-xl border border-[var(--border-medium)] px-3 font-sans text-[13px] outline-none focus:border-[var(--green-700)]"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: 'var(--green-700)' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-[calc(18rem+env(safe-area-inset-bottom,0px))] md:bottom-[9.5rem] right-4 md:right-6 z-[55] w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--green-700)', color: 'white' }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-[calc(10.5rem+env(safe-area-inset-bottom,0px))] md:bottom-[5rem] right-4 md:right-6 z-[55] w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundColor: open ? 'var(--green-700)' : 'transparent' }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/degunlqed/image/upload/v1778555938/Screenshot_2026-05-12_at_8.48.47_AM_ghpcye.png" alt="ShopBot" className="w-10 h-10 rounded-full object-cover" />
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </>
  )
}

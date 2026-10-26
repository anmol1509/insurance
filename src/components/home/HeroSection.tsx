'use client'

import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Car,
  Heart,
  Plane,
  BriefcaseBusiness,
  ShieldCheck,
  Zap,
  LockKeyhole,
  History,
  Headphones,
} from 'lucide-react'
import BlurText from '@/components/motion/BlurText'
import { useQuoteStore } from '@/store/quoteStore'
import HeroQuoteSelect from './HeroQuoteSelect'
import { NEW_CAR_PREFILL } from '@/lib/motorRegistration'
import s from './homepage.module.css'

const tabs = [
  {
    key: 'motor',
    label: 'Motor',
    sub: 'Car insurance',
    icon: Car,
    accent: '#00864a',
    wash: '#eff9f3',
    title: 'Buy insurance with confidence.',
    highlight: 'Claim stress free.',
    description:
      'Compare plans from top insurers, find the cover that fits and manage everything online — quickly, securely and without stress.',
    badge: 'Cover for your car',
    detail: 'For the road ahead',
    alt: 'White SUV in front of a tropical city skyline and cable-stayed bridge',
  },
  {
    key: 'medical',
    label: 'Medical',
    sub: 'Health insurance',
    icon: Heart,
    accent: '#0864e8',
    wash: '#edf7ff',
    title: 'Better health.',
    highlight: 'Brighter tomorrows.',
    description:
      'Compare health insurance plans and find the right cover for you and your family — with care for the moments that matter.',
    badge: 'Care for your family',
    detail: 'Explore health plans',
    alt: 'A smiling Nigerian family outside a modern healthcare building',
  },
  {
    key: 'travel',
    label: 'Travel',
    sub: 'Travel insurance',
    icon: Plane,
    accent: '#ce8200',
    wash: '#fff8e9',
    title: 'Explore the world.',
    highlight: 'Worry-free.',
    description:
      'Compare travel insurance plans for your international trips and set off on your next adventure with peace of mind.',
    badge: 'Cover beyond borders',
    detail: 'For your next adventure',
    alt: 'Traveler overlooking the blue sea and white houses of Santorini',
  },
  {
    key: 'business',
    label: 'Business',
    sub: 'Business insurance',
    icon: BriefcaseBusiness,
    accent: '#7040bd',
    wash: '#f6f1ff',
    title: 'Protect what',
    highlight: 'you’ve built.',
    description:
      'Compare business insurance plans for your assets, people and operations — so you can focus on growth.',
    badge: 'Cover for your business',
    detail: 'People, assets & operations',
    alt: 'Nigerian business owner working at a laptop in a bright modern office',
  },
] as const

type Product = (typeof tabs)[number]['key']

export default function HeroSection() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<Product>('motor')
  const [values, setValues] = useState<Record<Product, string>>({
    motor: '',
    medical: '',
    travel: '',
    business: '',
  })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const setHeroPrefill = useQuoteStore((state) => state.setHeroPrefill)
  const hero = tabs.find((tab) => tab.key === active)!
  function startQuote(value = values[active]) {
    const answer = value.trim()
    setHeroPrefill(answer ? { product: active, value: answer } : null)
    router.push(`/quote/${active}`)
  }
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index + tabs.length - 1) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : null
    if (next === null) return
    event.preventDefault()
    setActive(tabs[next].key)
    tabRefs.current[next]?.focus()
  }
  return (
    <section
      className={s.hero}
      style={{ '--accent': hero.accent, '--wash': hero.wash } as CSSProperties}
      aria-label="Find your insurance"
    >
      <div className={s.heroScenery} key={active}>
        <Image
          src={`/home/photos/${active}.webp`}
          alt={hero.alt}
          fill
          sizes="(max-width: 700px) 650px, 1050px"
          preload={active === 'motor'}
          className={s.heroPhoto}
        />
      </div>
      <div className={`${s.container} ${s.heroInner}`}>
        <motion.div
          className={s.heroCopy}
          key={active}
          initial={reduceMotion ? false : { opacity: 0.3, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <span className={s.heroEyebrow}>
            {active === 'motor'
              ? 'Insurance made simple, for you'
              : `${hero.label} Insurance`}
          </span>
          <h1>
            <BlurText text={hero.title} />
            <br />
            <em>
              <BlurText text={hero.highlight} delay={0.35} />
            </em>
          </h1>
          <p>{hero.description}</p>
        </motion.div>
        <div className={`${s.floatBadge} ${s.coverBadge}`}>
          <span>
            <ShieldCheck />
          </span>
          <div>
            {hero.badge}
            <small>{hero.detail}</small>
          </div>
        </div>
        <div className={`${s.floatBadge} ${s.claimBadge}`}>
          <span>
            <Zap />
          </span>
          <div>
            Help with claims<small>Every step of the way</small>
          </div>
        </div>
        <div className={`${s.floatBadge} ${s.supportBadge}`}>
          <span>
            <Headphones />
          </span>
          <div>
            Real people.<small>Here when you need us.</small>
          </div>
        </div>
        <div className={s.quoteWrap} id="get-quote">
          <div className={s.tabs} role="tablist" aria-label="Insurance type">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                id={`tab-${tab.key}`}
                ref={(element) => {
                  tabRefs.current[i] = element
                }}
                type="button"
                role="tab"
                aria-selected={active === tab.key}
                aria-controls="quote-panel"
                tabIndex={active === tab.key ? 0 : -1}
                onKeyDown={(event) => onTabKey(event, i)}
                onClick={() => setActive(tab.key)}
                className={active === tab.key ? s.activeTab : ''}
              >
                <tab.icon size={22} />
                <span>
                  {tab.label}
                  <small>{tab.sub}</small>
                </span>
              </button>
            ))}
          </div>
          <div
            className={s.quoteCard}
            id="quote-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
          >
            <div className={s.quoteHeading}>
              <div>
                <h2>
                  Get a{' '}
                  {active === 'motor'
                    ? 'car'
                    : active === 'medical'
                      ? 'health'
                      : active}{' '}
                  insurance quote
                </h2>
                <p>
                  {active === 'motor'
                    ? 'Enter your car number to compare quotes from top insurers.'
                    : 'Tell us a few details to find the right cover for you.'}
                </p>
              </div>
              <Link href="/login">
                <History size={16} />
                Retrieve saved quote
              </Link>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                startQuote()
              }}
              className={s.quoteForm}
            >
              {active === 'motor' ? (
                <div className={s.plateField}>
                  <span className={s.flag} aria-label="Nigeria" />
                  <input
                    aria-label="Car registration number"
                    placeholder="Enter your car number (e.g. LND 123 AB)"
                    value={values.motor}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        motor: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              ) : (
                <HeroQuoteSelect
                  key={active}
                  product={active}
                  value={values[active]}
                  onChange={(value) => setValues((previous) => ({ ...previous, [active]: value }))}
                  accent={hero.accent}
                  wash={hero.wash}
                />
              )}
              <button type="submit" className={s.button}>
                Get Quotes <ArrowRight size={17} />
              </button>
            </form>
            {active === 'motor' && (
              <button
                className={s.newCar}
                onClick={() => startQuote(NEW_CAR_PREFILL)}
              >
                Brand-new car without a plate? Start here
              </button>
            )}
            <div className={s.quoteBenefits}>
              <span>
                <Zap />
                Online quotes
              </span>
              <span>
                <ShieldCheck />
                Compare insurers
              </span>
              <span>
                <LockKeyhole />
                Your details, handled with care
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

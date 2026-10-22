import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Signal,
  BatteryFull,
} from 'lucide-react'
import s from './homepage.module.css'
const steps = [
  ['Enter your details', 'Share basic information about your cover.'],
  ['Compare quotes', 'See available plans from insurers.'],
  ['Choose & buy', 'Select the plan that works for you.'],
]
export default function HowItWorksSection() {
  return (
    <section className={s.how} aria-labelledby="how-title">
      <div className={s.howCopy}>
        <p className={s.eyebrow}>How it works</p>
        <h2 id="how-title">
          Get a personalised quote.
          <br />
          In a few simple steps.
        </h2>
        <p>
          Clear choices. Simple steps.
          <br />
          Cover for what matters.
        </p>
        <ol>
          {steps.map(([title, text], index) => (
            <li key={title}>
              <span>{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/#get-quote" className={s.button}>
          Get Your Free Quote <ArrowRight size={17} />
        </Link>
      </div>
      <div className={s.phoneScene}>
        <div
          className={s.phone}
          aria-label="Preview of the mobile quote experience"
        >
          <div className={s.phoneStatus}>
            <b>9:41</b>
            <span>
              <Signal size={10} />
              <BatteryFull size={13} />
            </span>
          </div>
          <div className={s.phoneNotch} />
          <div className={s.phoneScreen}>
            <div className={s.phoneBrand}>
              <ShieldCheck size={19} />
              ShopInsurance
            </div>
            <h3>Car Insurance</h3>
            <p>Let’s find your cover.</p>
            <div className={s.phoneInput}>
              Enter your car number<span>LND 123 AB</span>
            </div>
            <Link href="/quote/motor" className={s.button}>
              Get Quotes <ArrowRight size={12} />
            </Link>
            <h4>Why choose us?</h4>
            {[
              'Compare cover',
              'Clear prices',
              'Online convenience',
              'Helpful support',
            ].map((text) => (
              <p className={s.phoneCheck} key={text}>
                <Check size={12} />
                {text}
              </p>
            ))}
            <small>Illustrative quote screen</small>
          </div>
          <div className={s.phoneHome} />
        </div>
      </div>
    </section>
  )
}

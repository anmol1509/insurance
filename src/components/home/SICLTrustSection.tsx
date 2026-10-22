import { CheckCircle2 } from 'lucide-react'
import s from './homepage.module.css'
const facts = [
  ['4', 'Insurance categories'],
  ['You choose', 'Compare cover & costs'],
  ['Online', 'Manage your policies'],
  ['Human', 'Support when you need it'],
]
export default function SICLTrustSection() {
  return (
    <section id="about" className={s.about}>
      <div className={s.container}>
        <div className={s.aboutCopy}>
          <p className={s.eyebrow}>About Shapinsurance</p>
          <h2>
            A simpler way to find
            <br />
            insurance in Nigeria.
          </h2>
          <p>
            We make insurance simple, transparent and accessible. Compare plans,
            buy online and manage your policies with ease — all in one place.
          </p>
        </div>
        <div className={s.aboutFacts}>
          {facts.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className={s.aboutChecks}>
          {[
            'Motor, medical, travel & business',
            'Compare insurance plans',
            'Manage policies online',
            'Dedicated customer support',
          ].map((text) => (
            <span key={text}>
              <CheckCircle2 size={17} />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Headphones, ShieldCheck } from 'lucide-react'
import s from './homepage.module.css'
export default function ClaimsSupportSection() {
  return (
    <section className={s.claims} aria-labelledby="claims-title">
      <div className={s.claimsPhoto}>
        <Image
          src="/home/photos/claims.webp"
          alt="Woman using her phone at home"
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
        />
        <div className={s.claimsNotification}>
          <CheckCircle2 />
          <div>
            <strong>Here to help</strong>
            <span>
              Guidance for your claim,
              <br />
              every step of the way.
            </span>
          </div>
        </div>
      </div>
      <div className={s.claimsCopy}>
        <p className={s.eyebrow}>Stress-free claims</p>
        <h2 id="claims-title">Need to make a claim?</h2>
        <p>Our team is here to help you with the next step.</p>
        <div className={s.claimsActions}>
          <Link href="/claims" className={s.button}>
            Start a Claim <ArrowRight size={16} />
          </Link>
          <Link href="/contact">Talk to support</Link>
        </div>
        <div className={s.claimsBenefits}>
          <span>
            <ShieldCheck />
            Clear guidance
          </span>
          <span>
            <Headphones />
            Dedicated support
          </span>
          <span>
            <CheckCircle2 />
            Simple next steps
          </span>
        </div>
      </div>
    </section>
  )
}

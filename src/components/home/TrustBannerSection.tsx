import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import s from './homepage.module.css'
export default function TrustBannerSection() {
  return (
    <section className={s.finalCta}>
      <div className={s.container}>
        <div>
          <h2>
            A more confident
            <br />
            tomorrow starts here.
          </h2>
          <p>
            Find insurance for your life, your family
            <br />
            and everything you’re building.
          </p>
          <Link href="/#get-quote" className={s.button}>
            Get a Quote <ArrowRight size={15} />
          </Link>
        </div>
        <ShieldCheck className={s.ctaShield} aria-hidden="true" />
        <div className={s.ctaCategories}>
          {[
            ['Motor', 'For the road ahead'],
            ['Medical', 'For those you love'],
            ['Travel', 'For your next adventure'],
            ['Business', 'For what you’re building'],
          ].map(([title, text]) => (
            <Link href={`/quote/${title.toLowerCase()}`} key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

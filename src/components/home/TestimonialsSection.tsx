import Link from 'next/link'
import { ArrowRight, MessageSquareQuote } from 'lucide-react'
import s from './homepage.module.css'
// Publish customer quotes here only after their wording and consent are approved.
export default function TestimonialsSection() {
  return (
    <section className={s.testimonials}>
      <div className={s.container}>
        <div className={s.sectionHeading}>
          <div>
            <p className={s.eyebrow}>Customer stories</p>
            <h2>Your experience matters.</h2>
          </div>
          <Link href="/contact" className={s.textButton}>
            Share your experience <ArrowRight size={14} />
          </Link>
        </div>
        <div className={s.reviewEmpty}>
          <MessageSquareQuote size={34} />
          <div>
            <h3>Real stories deserve a place here.</h3>
            <p>
              Customer reviews will appear here when they’re available. Already
              used Shapinsurance? We’d love to hear from you.
            </p>
          </div>
          <Link href="/contact">
            Tell us how it went <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

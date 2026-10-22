import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  Files,
  Zap,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import s from './homepage.module.css'
export default function AppDownloadSection() {
  return (
    <section className={s.app} aria-labelledby="app-title">
      <p className={s.eyebrow}>Mobile app · Coming soon</p>
      <h2 id="app-title">
        Insurance in your
        <br />
        <em>pocket, always accessible.</em>
      </h2>
      <p>
        Buy, renew, manage and make claims —<br />
        anytime, anywhere.
      </p>
      <div className={s.appAvailability}>
        <Smartphone size={31} />
        <div>
          <strong>A little closer to your cover.</strong>
          <span>
            Our mobile app is on its way.
            <br />
            Use your dashboard online today.
          </span>
        </div>
      </div>
      <Link href="/dashboard" className={s.textButton}>
        Open your dashboard <ArrowRight size={14} />
      </Link>
      <ul>
        {[
          [Files, 'Manage your policies'],
          [Zap, 'Compare insurance quotes'],
          [ShieldCheck, 'Keep track of claims'],
          [Bell, 'Review policy renewals'],
        ].map(([Icon, text]) => {
          const FeatureIcon = Icon as typeof Files
          return (
            <li key={String(text)}>
              <span>
                <FeatureIcon size={15} />
              </span>
              {String(text)}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

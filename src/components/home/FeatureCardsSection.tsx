import { Search, Tag, Zap, Headphones } from 'lucide-react'
import s from './homepage.module.css'
const benefits = [
  {
    icon: Search,
    title: 'Compare easily',
    description: 'Get quotes from multiple insurers in one place.',
  },
  {
    icon: Tag,
    title: 'Clear prices',
    description: 'Compare cover and costs with transparent pricing.',
  },
  {
    icon: Zap,
    title: 'Online convenience',
    description: 'Buy, renew and manage your policies digitally.',
  },
  {
    icon: Headphones,
    title: 'Dedicated support',
    description: 'Real people, ready to help when you need it.',
  },
]
export default function FeatureCardsSection() {
  return (
    <section className={s.benefits} aria-label="Why choose ShopInsurance">
      <div className={s.container}>
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title}>
            <span className={s.roundIcon}>
              <Icon size={25} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

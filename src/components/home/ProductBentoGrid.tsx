import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import s from './homepage.module.css'
const products = [
  {
    key: 'motor',
    name: 'Car Insurance',
    description: 'Comprehensive, third party and more.',
    alt: 'White SUV on a city road',
  },
  {
    key: 'medical',
    name: 'Health Insurance',
    description: 'Explore care for you and your family.',
    alt: 'Smiling family together',
  },
  {
    key: 'travel',
    name: 'Travel Insurance',
    description: 'Find cover for wherever you go.',
    alt: 'Traveler on a Mediterranean holiday',
  },
  {
    key: 'business',
    name: 'Business Insurance',
    description: 'Protect your people and what you’re building.',
    alt: 'Business owner working in his office',
  },
]
export default function ProductBentoGrid() {
  return (
    <section id="products" className={s.products}>
      <div className={s.container}>
        <div className={s.sectionHeading}>
          <div>
            <p className={s.eyebrow}>Our products</p>
            <h2>What would you like to insure?</h2>
          </div>
          <Link className={s.textButton} href="/#get-quote">
            Compare plans <ArrowRight size={15} />
          </Link>
        </div>
        <div className={s.productGrid}>
          {products.map((product) => (
            <Link
              key={product.key}
              href={`/${product.key}`}
              className={`${s.productCard} ${s[product.key]}`}
            >
              <div className={s.productImage}>
                <Image
                  src={`/home/photos/${product.key}.webp`}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 280px"
                />
              </div>
              <div className={s.productContent}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

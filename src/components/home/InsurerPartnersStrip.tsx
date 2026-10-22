import Image from 'next/image'
import s from './homepage.module.css'

const PARTNERS = [
  {
    name: 'AIICO Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-14_nfoe7t.jpg',
  },
  {
    name: 'FGI Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-12_ovaz7m.jpg',
  },
  {
    name: 'NSIA Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-13_ew0ijl.jpg',
  },
  {
    name: 'SUNU Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-53-36_h3rmxo.jpg',
  },
  {
    name: 'Tangerine Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-22-00-57_j7kn4g.jpg',
  },
]

export default function InsurerPartnersStrip() {
  return (
    <section id="partners" className={s.partners}>
      <div className={s.container}>
        <div className={s.partnerTitle}>
          <h2>Our Insurance Partners</h2>
          <p>Compare cover from our existing insurance partners.</p>
        </div>
        <div className={s.partnerLogos}>
          {PARTNERS.map(({ name }, index) => (
            <div key={name} className={s.partnerLogo}>
              <Image
                src={`/home/partners/partner-${index}.webp`}
                alt={name}
                width={190}
                height={66}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

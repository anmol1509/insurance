'use client'

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
    <section
      className="py-10"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'white' }}
    >
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20">
        <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.12em] text-center mb-7" style={{ color: 'var(--text-subtle)' }}>
          Partnered with Nigeria&apos;s leading NAICOM-licensed insurers
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {PARTNERS.map(({ name, logo }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2.5 px-5 py-4 rounded-2xl border shrink-0"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface-raised)', minWidth: 140 }}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border flex items-center justify-center p-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={name} className="w-full h-full object-contain" />
              </div>
              <span className="font-sans font-semibold text-[12px] text-center whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

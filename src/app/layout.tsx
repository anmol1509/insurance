import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, Lora } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://shopinsurance.com.ng'),
  title: {
    default: "ShopInsurance — Nigeria's Smartest Insurance Platform",
    template: '%s | ShopInsurance',
  },
  description:
    'Get instant quotes for motor, medical, travel and business insurance. NAICOM licensed. NIID registered. Pay with Paystack or Flutterwave. Certificate in 3 minutes.',
  keywords: [
    'insurance Nigeria',
    'motor insurance Nigeria',
    'health insurance Nigeria',
    'travel insurance Nigeria',
    'business insurance Nigeria',
    'NAICOM licensed insurer',
    'NIID certificate',
    'car insurance Lagos',
    'cheapest motor insurance Nigeria',
    'HMO Nigeria',
    'Schengen travel insurance Nigeria',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://shopinsurance.com.ng',
    siteName: 'ShopInsurance',
    title: "ShopInsurance — Nigeria's Smartest Insurance Platform",
    description: 'Instant quotes. Digital certificates. Real claims support.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'ShopInsurance — Nigeria insurance comparison platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@shopinsurance_ng',
    site: '@shopinsurance_ng',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://shopinsurance.com.ng' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

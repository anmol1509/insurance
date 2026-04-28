import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, Lora } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

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
    'travel insurance',
    'business insurance',
    'NAICOM',
    'NIID',
    'car insurance Lagos',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://shopinsurance.com.ng',
    siteName: 'ShopInsurance',
    title: "ShopInsurance — Nigeria's Smartest Insurance Platform",
    description: 'Instant quotes. Digital certificates. Real claims support.',
  },
  twitter: { card: 'summary_large_image', creator: '@shopinsurance_ng' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

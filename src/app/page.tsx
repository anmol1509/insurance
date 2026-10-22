import type { Metadata } from 'next'
import styles from '@/components/home/homepage.module.css'
import HeroSection from '@/components/home/HeroSection'
import ProductBentoGrid from '@/components/home/ProductBentoGrid'
import InsurerPartnersStrip from '@/components/home/InsurerPartnersStrip'
import SICLTrustSection from '@/components/home/SICLTrustSection'
import TrustStatsSection from '@/components/home/TrustStatsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FeatureCardsSection from '@/components/home/FeatureCardsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import AppDownloadSection from '@/components/home/AppDownloadSection'
import FAQSection from '@/components/home/FAQSection'
import TrustBannerSection from '@/components/home/TrustBannerSection'
import ClaimsSupportSection from '@/components/home/ClaimsSupportSection'

export const metadata: Metadata = {
  title: { absolute: 'ShopInsurance — Confident cover, stress-free claims' },
  description:
    'Compare motor, medical, travel and business insurance. Find cover that fits, manage your policies online and get help with claims.',
  openGraph: {
    title: 'ShopInsurance — Confident cover, stress-free claims',
    description:
      'Compare insurance, manage your policies and get help with claims in one place.',
    siteName: 'ShopInsurance',
  },
}

export default function HomePage() {
  return (
    <div className={styles.home}>
      <HeroSection />
      <FeatureCardsSection />
      <InsurerPartnersStrip />
      <SICLTrustSection />
      <ProductBentoGrid />
      <TrustStatsSection />
      <div className={styles.howApp}>
        <HowItWorksSection />
        <AppDownloadSection />
      </div>
      <ClaimsSupportSection />
      <TestimonialsSection />
      <FAQSection />
      <TrustBannerSection />
    </div>
  )
}

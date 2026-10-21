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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCardsSection />
      <InsurerPartnersStrip />
      <SICLTrustSection />
      <ProductBentoGrid />
      <TrustStatsSection />
      <HowItWorksSection />
      <AppDownloadSection />
      <ClaimsSupportSection />
      <TestimonialsSection />
      <FAQSection />
      <TrustBannerSection />
    </>
  )
}

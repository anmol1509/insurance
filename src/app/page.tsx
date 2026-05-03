import HeroSection from '@/components/home/HeroSection'
import ProductBentoGrid from '@/components/home/ProductBentoGrid'
import PressSection from '@/components/home/PressSection'
import InsurerPartnersStrip from '@/components/home/InsurerPartnersStrip'
import TrustStatsSection from '@/components/home/TrustStatsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FeatureCardsSection from '@/components/home/FeatureCardsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import AppDownloadSection from '@/components/home/AppDownloadSection'
import FAQSection from '@/components/home/FAQSection'
import TrustBannerSection from '@/components/home/TrustBannerSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PressSection />
      <InsurerPartnersStrip />
      <ProductBentoGrid />
      <TrustStatsSection />
      <HowItWorksSection />
      <FeatureCardsSection />
      <TestimonialsSection />
      <AppDownloadSection />
      <FAQSection />
      <TrustBannerSection />
    </>
  )
}

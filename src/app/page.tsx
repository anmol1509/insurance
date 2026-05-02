import HeroSection from '@/components/home/HeroSection'
import ProductBentoGrid from '@/components/home/ProductBentoGrid'
import PressSection from '@/components/home/PressSection'
import TrustStatsSection from '@/components/home/TrustStatsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FeatureCardsSection from '@/components/home/FeatureCardsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import TrustBannerSection from '@/components/home/TrustBannerSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PressSection />
      <ProductBentoGrid />
      <TrustStatsSection />
      <HowItWorksSection />
      <FeatureCardsSection />
      <TestimonialsSection />
      <TrustBannerSection />
    </>
  )
}

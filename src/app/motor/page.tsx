import type { Metadata } from 'next'
import MotorProductPage from '@/components/product/MotorProductPage'

export const metadata: Metadata = {
  title: 'Motor Insurance',
  description: 'Compare motor insurance options for your vehicle. Review comprehensive and third-party cover, policy benefits and insurer requirements with ShopInsurance.',
}

export default function MotorPage() {
  return <MotorProductPage />
}

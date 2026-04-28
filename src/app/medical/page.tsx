import type { Metadata } from 'next'
import MedicalProductPage from '@/components/product/MedicalProductPage'

export const metadata: Metadata = {
  title: 'Medical Insurance',
  description: 'Cashless health insurance at 500+ hospitals. Individual, family, and group plans. Get covered instantly.',
}

export default function MedicalPage() {
  return <MedicalProductPage />
}

export interface MotorPlan {
  id: string
  name: string
  insurer: string
  logo?: string
  coverType: 'comprehensive' | 'tpo'
  rating: number
  reviews: number
  badge?: string
  multiplier: number
  features: string[]
  exclusions: string[]
  claimSettlement: string
  responseTime: string
  popular?: boolean
}

export const MOTOR_PLANS: MotorPlan[] = [
  {
    id: 'aiico-motor',
    name: 'AIICO Comprehensive',
    insurer: 'AIICO Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-14_nfoe7t.jpg',
    coverType: 'comprehensive',
    rating: 4.8,
    reviews: 2341,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['NIID auto-registered', '24/7 roadside assist', 'Towing included', 'Windscreen cover', 'Flood & fire protection', 'Courtesy car'],
    exclusions: ['Racing & speed testing', 'Wear & tear', 'Mechanical breakdown', 'Unlicensed driver'],
    claimSettlement: '98%',
    responseTime: '24 hours',
    popular: true,
  },
  {
    id: 'fgi-motor',
    name: 'FGI Comprehensive',
    insurer: 'FGI Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-12_ovaz7m.jpg',
    coverType: 'comprehensive',
    rating: 4.7,
    reviews: 1892,
    badge: 'Best value',
    multiplier: 0.91,
    features: ['NIID auto-registered', 'Towing included', 'Cashless claims', 'Windscreen cover', 'Flood & fire', 'Online policy management'],
    exclusions: ['Racing & speed testing', 'Wear & tear', 'Drunk driving', 'War & terrorism'],
    claimSettlement: '96%',
    responseTime: '48 hours',
  },
  {
    id: 'nsia-motor',
    name: 'NSIA Comprehensive',
    insurer: 'NSIA Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-13_ew0ijl.jpg',
    coverType: 'comprehensive',
    rating: 4.6,
    reviews: 1534,
    multiplier: 1.08,
    features: ['New-for-old replacement', 'International coverage', 'Priority claims desk', 'NIID registered', '24/7 support', 'Windscreen cover'],
    exclusions: ['Racing', 'Wear & tear', 'Mechanical failure', 'Unlicensed driver'],
    claimSettlement: '97%',
    responseTime: '24 hours',
  },
  {
    id: 'sunu-motor',
    name: 'SUNU Third Party Only',
    insurer: 'SUNU Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-53-36_h3rmxo.jpg',
    coverType: 'tpo',
    rating: 4.5,
    reviews: 987,
    badge: 'Lowest price',
    multiplier: 1.0,
    features: ['Third party bodily injury', 'Property damage liability', 'NIID registered', 'Online certificate', 'NAICOM licensed'],
    exclusions: ['Own vehicle damage', 'Theft of own vehicle', 'Fire damage to own vehicle'],
    claimSettlement: '94%',
    responseTime: '48 hours',
    popular: true,
  },
  {
    id: 'leadway-tpo',
    name: 'Leadway Third Party',
    insurer: 'Leadway Assurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-14_nfoe7t.jpg',
    coverType: 'tpo',
    rating: 4.6,
    reviews: 1230,
    multiplier: 1.2,
    features: ['Third party bodily injury', 'Property damage liability', 'NIID auto-registered', 'Digital certificate', 'NAICOM licensed', '24/7 claims hotline'],
    exclusions: ['Own vehicle damage', 'Theft of own vehicle', 'Fire damage to own vehicle', 'Medical expenses'],
    claimSettlement: '95%',
    responseTime: '48 hours',
  },
  {
    id: 'nsia-tpo',
    name: 'NSIA Third Party Plus',
    insurer: 'NSIA Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-13_ew0ijl.jpg',
    coverType: 'tpo',
    rating: 4.4,
    reviews: 890,
    multiplier: 1.45,
    features: ['Third party bodily injury', 'Property damage liability', 'NIID registered', 'Passenger liability', 'NAICOM licensed', 'Priority claims desk'],
    exclusions: ['Own vehicle damage', 'Theft', 'Fire to own car', 'Flood damage'],
    claimSettlement: '93%',
    responseTime: '72 hours',
  },
]

/**
 * Every plan here must be backed by a real, documented insurer API —
 * Tangerine, NSIA, Fortis Global, and AIICO are the only four. No
 * catalog-only/mock plans: a plan customers can pay for has to be one
 * this platform can actually submit.
 */
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
  excess: string
  repairNetwork: string
  popular?: boolean
  fortisGlobal?: boolean
  /** Submitted to NSIA Insurance through their partner API. */
  nsia?: boolean
  /** Submitted to Tangerine through their partner API. */
  tangerine?: 'comprehensive' | 'thirdparty'
  /** Submitted to AIICO through their partner API. */
  aiico?: 'comprehensive' | 'third-party'
}

export const MOTOR_PLANS: MotorPlan[] = [
  {
    id: 'tangerine-comp',
    name: 'Tangerine Comprehensive',
    insurer: 'Tangerine Insurance',
    coverType: 'comprehensive',
    rating: 4.5,
    reviews: 764,
    badge: 'Direct insurer',
    multiplier: 1.0,
    tangerine: 'comprehensive',
    features: ['NIID auto-registered', 'Instant temporary certificate', 'Flood & fire protection', 'Theft cover', 'Online certificate reprint', 'Digital claims tracking'],
    exclusions: ['Racing & speed testing', 'Wear & tear', 'Drunk driving', 'War & terrorism'],
    claimSettlement: '93%',
    responseTime: '30 days (final approval)',
    excess: '\u20a625,000',
    repairNetwork: '150+ garages',
  },
  {
    id: 'tangerine-tpo',
    name: 'Tangerine Third Party',
    insurer: 'Tangerine Insurance',
    coverType: 'tpo',
    rating: 4.4,
    reviews: 512,
    badge: 'Direct insurer',
    multiplier: 1.0,
    tangerine: 'thirdparty',
    features: ['Third party bodily injury', 'Property damage liability', 'NIID auto-registered', 'Instant digital certificate', 'NAICOM licensed', 'Online certificate reprint'],
    exclusions: ['Own vehicle damage', 'Theft of own vehicle', 'Fire damage to own vehicle', 'Medical expenses'],
    claimSettlement: '91%',
    responseTime: '24 hours',
    excess: 'None',
    repairNetwork: 'N/A \u00b7 third party',
  },
  {
    id: 'nsia-comp',
    name: 'NSIA Comprehensive',
    insurer: 'NSIA Insurance',
    coverType: 'comprehensive',
    rating: 4.6,
    reviews: 1487,
    badge: 'Direct insurer',
    multiplier: 1.0,
    nsia: true,
    features: ['NIID auto-registered', 'Towing included', 'Windscreen cover', 'Flood & fire protection', 'Cashless claims', 'Instant policy number'],
    exclusions: ['Racing & speed testing', 'Wear & tear', 'Drunk driving', 'War & terrorism'],
    claimSettlement: '97%',
    responseTime: '48 hours',
    excess: '\u20a625,000',
    repairNetwork: '200+ garages',
  },
  {
    id: 'nsia-tpo',
    name: 'NSIA Third Party',
    insurer: 'NSIA Insurance',
    coverType: 'tpo',
    rating: 4.5,
    reviews: 992,
    badge: 'Direct insurer',
    multiplier: 1.0,
    nsia: true,
    features: ['Third party bodily injury', 'Property damage liability', 'NIID auto-registered', 'Digital certificate', 'NAICOM licensed', 'Instant policy number'],
    exclusions: ['Own vehicle damage', 'Theft of own vehicle', 'Fire damage to own vehicle', 'Medical expenses'],
    claimSettlement: '95%',
    responseTime: '48 hours',
    excess: 'None',
    repairNetwork: 'N/A \u00b7 third party',
  },
  {
    id: 'fortis-comp',
    name: 'Fortis Global Comprehensive',
    insurer: 'Fortis Global Insurance',
    coverType: 'comprehensive',
    rating: 4.7,
    reviews: 1203,
    badge: 'Direct insurer',
    multiplier: 1.0,
    fortisGlobal: true,
    features: ['NIID auto-registered', 'Towing included', 'Cashless claims', 'Windscreen cover', 'Flood & fire protection', 'Online policy management'],
    exclusions: ['Racing & speed testing', 'Wear & tear', 'Drunk driving', 'War & terrorism'],
    claimSettlement: '96%',
    responseTime: '48 hours',
    excess: '₦25,000',
    repairNetwork: '180+ garages',
  },
  {
    id: 'fortis-tpo',
    name: 'Fortis Global Third Party',
    insurer: 'Fortis Global Insurance',
    coverType: 'tpo',
    rating: 4.5,
    reviews: 876,
    badge: 'Direct insurer',
    multiplier: 1.0,
    fortisGlobal: true,
    features: ['Third party bodily injury', 'Property damage liability', 'NIID auto-registered', 'Digital certificate', 'NAICOM licensed', '24/7 claims hotline'],
    exclusions: ['Own vehicle damage', 'Theft of own vehicle', 'Fire damage to own vehicle', 'Medical expenses'],
    claimSettlement: '94%',
    responseTime: '48 hours',
    excess: 'None',
    repairNetwork: 'N/A · third party',
  },
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
    aiico: 'comprehensive',
    features: ['NIID auto-registered', '24/7 roadside assist', 'Towing included', 'Windscreen cover', 'Flood & fire protection', 'Courtesy car'],
    exclusions: ['Racing & speed testing', 'Wear & tear', 'Mechanical breakdown', 'Unlicensed driver'],
    claimSettlement: '98%',
    responseTime: '24 hours',
    excess: '₦20,000',
    repairNetwork: '250+ garages',
    popular: true,
  },
  {
    id: 'aiico-tpo',
    name: 'AIICO Third Party',
    insurer: 'AIICO Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-14_nfoe7t.jpg',
    coverType: 'tpo',
    rating: 4.7,
    reviews: 1685,
    badge: 'Direct insurer',
    multiplier: 1.0,
    aiico: 'third-party',
    features: ['Third party bodily injury', 'Property damage liability up to ₦3 million', 'NIID auto-registered', 'Digital certificate', 'NAICOM licensed'],
    exclusions: ['Own vehicle damage', 'Theft of own vehicle', 'Fire damage to own vehicle', 'Medical expenses'],
    claimSettlement: '97%',
    responseTime: '24 hours',
    excess: 'None',
    repairNetwork: 'N/A · third party',
  },
]

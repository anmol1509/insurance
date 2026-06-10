export interface MedicalPlan {
  id: string
  name: string
  insurer: string
  logo?: string
  networkTier: 'standard' | 'wide' | 'premium'
  annualLimit: string
  consultation: string
  pharmacy: string
  dental: string
  hospitalization: string
  pricePerPerson: number
  features: string[]
  exclusions: string[]
  rating: number
  reviews: number
  badge?: string
  popular?: boolean
}

export const MEDICAL_PLANS: MedicalPlan[] = [
  {
    id: 'aiico-health-executive',
    name: 'AIICO Health Executive',
    insurer: 'AIICO Insurance',
    logo: 'https://res.cloudinary.com/degunlqed/image/upload/v1778556699/PHOTO-2026-05-09-20-50-14_nfoe7t.jpg',
    networkTier: 'wide',
    annualLimit: '₦5,000,000',
    consultation: '₦500 copay',
    pharmacy: '10% copay',
    dental: '₦100,000/yr',
    hospitalization: '100% covered',
    pricePerPerson: 120000,
    features: ['Direct billing at 400+ hospitals', 'Dental & optical included', 'Maternity cover included', 'Chronic disease management', 'Specialist referrals covered', 'Worldwide emergency cover', '24/7 telemedicine', 'Physiotherapy & rehabilitation'],
    exclusions: ['Cosmetic procedures', 'Experimental treatments', 'War & terrorism injuries', 'Pre-existing conditions (first 12 months)'],
    rating: 4.8,
    reviews: 3241,
    badge: 'Most popular',
    popular: true,
  },
  {
    id: 'hygeia-advantage',
    name: 'Hygeia HMO Advantage',
    insurer: 'Hygeia HMO',
    networkTier: 'wide',
    annualLimit: '₦4,500,000',
    consultation: '₦200 copay',
    pharmacy: '15% copay',
    dental: '₦75,000/yr',
    hospitalization: '100% covered',
    pricePerPerson: 105000,
    features: ['700+ accredited hospitals', 'Dental & optical included', 'Maternity cover included', 'Diagnostics covered (X-Ray, MRI, CT)', 'Specialist referrals covered', 'Ambulance services', 'Mental health support', 'Basic dental included'],
    exclusions: ['Cosmetic surgery', 'Experimental treatments', 'War injuries', 'HIV/AIDS treatment (first year)'],
    rating: 4.7,
    reviews: 2187,
    badge: 'Best rated',
  },
  {
    id: 'tht-gold',
    name: 'THT Gold Plan',
    insurer: 'Total Health Trust (THT)',
    networkTier: 'standard',
    annualLimit: '₦3,000,000',
    consultation: 'Free (GP)',
    pharmacy: '20% copay',
    dental: '₦50,000/yr',
    hospitalization: '90% covered',
    pricePerPerson: 78000,
    features: ['300+ hospitals nationwide', 'Free GP consultations', 'Basic dental included', 'Lab & diagnostics covered', 'Maternity care (optional add-on)', 'Online health portal', 'Family planning cover'],
    exclusions: ['Specialist without referral', 'Cosmetic procedures', 'Experimental drugs', 'Pre-existing conditions (first 6 months)'],
    rating: 4.6,
    reviews: 1543,
    badge: 'Best value',
  },
  {
    id: 'reliance-standard',
    name: 'Reliance HMO Standard',
    insurer: 'Reliance HMO',
    networkTier: 'standard',
    annualLimit: '₦2,000,000',
    consultation: '₦300 copay',
    pharmacy: '20% copay',
    dental: 'Not included',
    hospitalization: '80% covered',
    pricePerPerson: 52000,
    features: ['200+ hospital network', 'Lab & diagnostics covered', 'Antenatal care', 'Emergency care', 'NAICOM licensed', '24/7 claims hotline'],
    exclusions: ['Dental & optical', 'Specialist without referral', 'Cosmetic surgery', 'Experimental treatments', 'Maternity (first year)'],
    rating: 4.5,
    reviews: 987,
  },
  {
    id: 'leadway-health-plus',
    name: 'Leadway Health Plus',
    insurer: 'Leadway Assurance',
    networkTier: 'premium',
    annualLimit: '₦10,000,000',
    consultation: 'Free (all specialists)',
    pharmacy: '5% copay',
    dental: '₦200,000/yr',
    hospitalization: '100% covered',
    pricePerPerson: 250000,
    features: ['1,000+ hospitals worldwide', 'Unlimited specialist access', 'Dental, optical & orthodontics', 'Full maternity package', 'Mental health & therapy', 'Worldwide emergency cover', 'Executive health screening', 'Chronic disease management'],
    exclusions: ['Cosmetic & aesthetic procedures', 'Experimental treatments', 'War & terrorism'],
    rating: 4.9,
    reviews: 4102,
    badge: 'Premium',
  },
]

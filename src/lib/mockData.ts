export interface Policy {
  id: string
  ref: string
  productType: 'motor' | 'medical' | 'travel' | 'business'
  name: string
  insurer: string
  coverType: string
  sumInsured: number
  premium: number
  startDate: string
  expiryDate: string
  status: 'active' | 'expiring' | 'expired'
  certificateUrl?: string
  details: Record<string, string>
}

export interface Claim {
  id: string
  policyRef: string
  policyName: string
  productType: 'motor' | 'medical' | 'travel' | 'business'
  type: string
  dateReported: string
  incidentDate: string
  amount: number
  status: 'submitted' | 'under_review' | 'approved' | 'settled' | 'rejected'
  description: string
  timeline: { date: string; event: string; done: boolean }[]
}

export interface QuoteRecord {
  id: string
  productType: 'motor' | 'medical' | 'travel' | 'business'
  summary: string
  estimatedPremium: number
  createdAt: string
  status: 'draft' | 'submitted' | 'converted'
  expiresAt: string
}

export interface Document {
  id: string
  policyRef: string
  name: string
  type: 'certificate' | 'policy_schedule' | 'receipt' | 'claim_form' | 'uploaded'
  productType: 'motor' | 'medical' | 'travel' | 'business'
  size: string
  uploadedAt: string
}

export const mockPolicies: Policy[] = [
  {
    id: 'pol_001',
    ref: 'SI-2025-042983',
    productType: 'motor',
    name: 'Toyota Camry 2020',
    insurer: 'Leadway Assurance',
    coverType: 'Comprehensive',
    sumInsured: 3_500_000,
    premium: 87_500,
    startDate: '2024-12-15',
    expiryDate: '2025-12-15',
    status: 'active',
    details: { 'Reg. No.': 'LND 452 KA', 'Engine Cap.': '2500cc', 'Use Type': 'Private', 'State': 'Lagos' },
  },
  {
    id: 'pol_002',
    ref: 'SI-2025-012456',
    productType: 'medical',
    name: 'Family Health Plan',
    insurer: 'Hygeia HMO',
    coverType: 'Family Standard',
    sumInsured: 5_000_000,
    premium: 210_000,
    startDate: '2024-08-01',
    expiryDate: '2025-08-01',
    status: 'expiring',
    details: { 'Plan Tier': 'Standard', 'Lives Covered': '4', 'Network': '700+ hospitals', 'Geo Coverage': 'Nationwide' },
  },
  {
    id: 'pol_003',
    ref: 'SI-2025-033218',
    productType: 'business',
    name: 'Okonkwo & Sons Office',
    insurer: 'NSIA Insurance',
    coverType: 'Fire & Burglary',
    sumInsured: 10_000_000,
    premium: 95_000,
    startDate: '2025-01-10',
    expiryDate: '2026-01-10',
    status: 'active',
    details: { 'Business Type': 'Retail', 'Location': 'Ikeja, Lagos', 'Construction': 'Concrete', 'Employees': '8' },
  },
]

export const mockClaims: Claim[] = [
  {
    id: 'clm_001',
    policyRef: 'SI-2025-042983',
    policyName: 'Toyota Camry 2020',
    productType: 'motor',
    type: 'Accidental Damage',
    dateReported: '2025-03-10',
    incidentDate: '2025-03-08',
    amount: 320_000,
    status: 'settled',
    description: 'Front bumper and bonnet damage from collision at Lekki toll gate.',
    timeline: [
      { date: '2025-03-10', event: 'Claim submitted', done: true },
      { date: '2025-03-11', event: 'Acknowledged by Leadway Assurance', done: true },
      { date: '2025-03-14', event: 'Loss adjuster inspection completed', done: true },
      { date: '2025-03-18', event: 'Claim approved — ₦320,000', done: true },
      { date: '2025-03-22', event: 'Payment settled to repair workshop', done: true },
    ],
  },
  {
    id: 'clm_002',
    policyRef: 'SI-2025-012456',
    policyName: 'Family Health Plan',
    productType: 'medical',
    type: 'Hospitalisation',
    dateReported: '2025-04-20',
    incidentDate: '2025-04-19',
    amount: 145_000,
    status: 'under_review',
    description: 'Child admitted for malaria and typhoid treatment at Lagos Island General Hospital.',
    timeline: [
      { date: '2025-04-20', event: 'Claim submitted', done: true },
      { date: '2025-04-21', event: 'Acknowledged by Hygeia HMO', done: true },
      { date: '2025-04-23', event: 'Documents under medical review', done: true },
      { date: '—', event: 'Approval decision', done: false },
      { date: '—', event: 'Settlement', done: false },
    ],
  },
]

export const mockQuotes: QuoteRecord[] = [
  {
    id: 'qte_001',
    productType: 'motor',
    summary: 'Toyota Camry 2020 · Comprehensive · Lagos',
    estimatedPremium: 87_500,
    createdAt: '2024-12-12',
    status: 'converted',
    expiresAt: '2024-12-13',
  },
  {
    id: 'qte_002',
    productType: 'travel',
    summary: 'Paris, France · 14 days · 1 traveller',
    estimatedPremium: 42_000,
    createdAt: '2025-04-01',
    status: 'submitted',
    expiresAt: '2025-04-02',
  },
  {
    id: 'qte_003',
    productType: 'medical',
    summary: 'Family Standard Plan · 4 lives',
    estimatedPremium: 210_000,
    createdAt: '2024-07-28',
    status: 'converted',
    expiresAt: '2024-07-29',
  },
]

export const mockDocuments: Document[] = [
  { id: 'doc_001', policyRef: 'SI-2025-042983', name: 'Motor Certificate — Toyota Camry', type: 'certificate', productType: 'motor', size: '124 KB', uploadedAt: '2024-12-15' },
  { id: 'doc_002', policyRef: 'SI-2025-042983', name: 'Policy Schedule — Comprehensive Cover', type: 'policy_schedule', productType: 'motor', size: '248 KB', uploadedAt: '2024-12-15' },
  { id: 'doc_003', policyRef: 'SI-2025-012456', name: 'Medical Certificate — Family Plan', type: 'certificate', productType: 'medical', size: '98 KB', uploadedAt: '2024-08-01' },
  { id: 'doc_004', policyRef: 'SI-2025-033218', name: 'Business Insurance Schedule', type: 'policy_schedule', productType: 'business', size: '310 KB', uploadedAt: '2025-01-10' },
  { id: 'doc_005', policyRef: 'SI-2025-042983', name: 'Payment Receipt — ₦87,500', type: 'receipt', productType: 'motor', size: '56 KB', uploadedAt: '2024-12-15' },
]

export const PRODUCT_COLORS: Record<string, { main: string; light: string; text: string; label: string; emoji: string }> = {
  motor:    { main: 'var(--motor-600)',    light: 'var(--motor-50)',    text: 'var(--motor-700)',    label: 'Motor',    emoji: '🚗' },
  medical:  { main: 'var(--medical-600)',  light: 'var(--medical-50)',  text: 'var(--medical-700)',  label: 'Medical',  emoji: '❤️' },
  travel:   { main: 'var(--travel-600)',   light: 'var(--travel-50)',   text: 'var(--travel-700)',   label: 'Travel',   emoji: '✈️' },
  business: { main: 'var(--business-600)', light: 'var(--business-50)', text: 'var(--business-700)', label: 'Business', emoji: '🏢' },
}

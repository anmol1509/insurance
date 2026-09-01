/**
 * The five real AIICO Travel variants, from AIICO's documented
 * `GetTravelSubClassCoverTypes` endpoint (see docs/aiico-integration.md
 * and `getTravelSubClassCoverTypes` in `src/lib/aiico/api.ts`) — Africa,
 * Gold, Premium, Schengen, and Schengen Plus. No other insurer has a
 * documented Travel API yet, so unlike `motorPlans.ts` this only lists
 * AIICO for now rather than mixing in catalog-only competitors.
 *
 * `subclassSectCovtypeId` is kept on each plan for when a
 * `PostTravelSchedule`-equivalent endpoint is documented and this can be
 * submitted the same way Motor is; until then selecting a plan here only
 * carries the estimated premium into checkout, same as before.
 */
export interface TravelPlan {
  id: string
  name: string
  insurer: string
  coverType: string
  rating: number
  reviews: number
  badge?: string
  multiplier: number
  features: string[]
  exclusions: string[]
  claimSettlement: string
  responseTime: string
  popular?: boolean
  /** AIICO's `subclassSectCovtypeId` for this variant, under the single Travel `productId` (`cb00e3f3-9feb-e711-a2be-005056a02281`). */
  aiico: string
}

/** Common to every AIICO Travel variant — from AIICO's own "Why AIICO International Plans?" product overview. */
const AIICO_TRAVEL_FEATURES = [
  'Emergency medical expenses cover',
  'Repatriation on medical grounds',
  'Emergency evacuation',
  'Loss of baggage cover',
  'Loss of money cover',
  'Missed / cancelled flights cover',
  'Repatriation of mortal remains',
]

const AIICO_TRAVEL_EXCLUSIONS = ['Pre-existing conditions', 'War & terrorism', 'Intentional self-harm', 'Extreme/adventure sports (unless added)']

export const TRAVEL_PLANS: TravelPlan[] = [
  {
    id: 'aiico-travel-africa',
    name: 'AIICO Travel Africa',
    insurer: 'AIICO Insurance',
    coverType: 'travel-africa',
    rating: 4.8,
    reviews: 480,
    badge: 'Direct insurer',
    multiplier: 1.0,
    aiico: 'e14948cf-5207-417d-ce95-08dbe0359d81',
    features: [...AIICO_TRAVEL_FEATURES, 'Africa Travel cover'],
    exclusions: AIICO_TRAVEL_EXCLUSIONS,
    claimSettlement: '98%',
    responseTime: '24 hours',
  },
  {
    id: 'aiico-travel-gold',
    name: 'AIICO Travel Gold',
    insurer: 'AIICO Insurance',
    coverType: 'travel-gold',
    rating: 4.8,
    reviews: 610,
    badge: 'Direct insurer',
    multiplier: 1.0,
    aiico: 'ace552b8-65ab-46ce-ce90-08dbe0359d81',
    features: [...AIICO_TRAVEL_FEATURES, 'Gold Travel cover'],
    exclusions: AIICO_TRAVEL_EXCLUSIONS,
    claimSettlement: '98%',
    responseTime: '24 hours',
  },
  {
    id: 'aiico-travel-premium',
    name: 'AIICO Travel Premium',
    insurer: 'AIICO Insurance',
    coverType: 'travel-premium',
    rating: 4.9,
    reviews: 390,
    badge: 'Direct insurer',
    multiplier: 1.0,
    aiico: 'bf67e9f9-0d0f-4b58-ce91-08dbe0359d81',
    features: [...AIICO_TRAVEL_FEATURES, 'Premium Travel benefit', 'Benefit Premium cover'],
    exclusions: AIICO_TRAVEL_EXCLUSIONS,
    claimSettlement: '98%',
    responseTime: '24 hours',
  },
  {
    id: 'aiico-travel-schengen',
    name: 'AIICO Travel Schengen',
    insurer: 'AIICO Insurance',
    coverType: 'travel-schengen',
    rating: 4.8,
    reviews: 1450,
    badge: 'Most popular',
    multiplier: 1.0,
    popular: true,
    aiico: '38660a5f-3daa-44b9-ce94-08dbe0359d81',
    features: [...AIICO_TRAVEL_FEATURES, 'Schengen visa compliant'],
    exclusions: AIICO_TRAVEL_EXCLUSIONS,
    claimSettlement: '98%',
    responseTime: '24 hours',
  },
  {
    id: 'aiico-travel-schengen-plus',
    name: 'AIICO Travel Schengen Plus',
    insurer: 'AIICO Insurance',
    coverType: 'travel-schengen-plus',
    rating: 4.9,
    reviews: 275,
    badge: 'Direct insurer',
    multiplier: 1.0,
    aiico: '0c62ce0d-51fc-ee11-aaf4-000d3a1cf10e',
    features: [...AIICO_TRAVEL_FEATURES, 'Schengen visa compliant', 'Extended Schengen Plus benefit'],
    exclusions: AIICO_TRAVEL_EXCLUSIONS,
    claimSettlement: '98%',
    responseTime: '24 hours',
  },
]

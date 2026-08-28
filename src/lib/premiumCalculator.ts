import type { MotorData, MedicalData, TravelData, BusinessData, MarineData, PersonalAccidentData } from '@/store/quoteStore'

export function calculateMotorPremium(data: MotorData): { total: number; breakdown: Record<string, number> } {
  if (!data.marketValueRange || !data.coverType) return { total: 0, breakdown: {} }

  const vehicleValue = Number(data.marketValueRange) || 0
  if (!vehicleValue) return { total: 0, breakdown: {} }

  const rates: Record<string, number> = { comprehensive: 0.05, tpft: 0.025, tpo: 0.012 }
  let base = vehicleValue * rates[data.coverType]
  if (data.coverType === 'tpo') base = Math.max(base, 15000)

  const useMultiplier: Record<string, number> = { private: 1, own_goods: 1.2, commercial: 1.4, hired: 1.6 }
  base *= useMultiplier[data.useType ?? 'private']

  if (data.claimsHistory) base *= 1.15

  const levy = Math.round(base * 0.01)
  const stampDuty = 370

  return {
    total: Math.round(base + levy + stampDuty),
    breakdown: {
      'Base premium': Math.round(base),
      'NAICOM levy (1%)': levy,
      'Stamp duty': stampDuty,
    },
  }
}

export function calculateMedicalPremium(data: MedicalData): { total: number; breakdown: Record<string, number> } {
  const tierBase: Record<string, number> = { basic: 45000, standard: 120000, premium: 280000 }
  const base = tierBase[data.planTier ?? 'standard']

  const riders: Record<string, number> = {}
  if (data.criticalIllness) riders['Critical illness rider'] = 30000
  if (data.dentalCover) riders['Dental cover'] = 8000
  if (data.visionCover) riders['Vision cover'] = 6000
  if (data.personalAccidentRider) riders['Personal accident rider'] = 15000

  const riderTotal = Object.values(riders).reduce((s, v) => s + v, 0)
  const lives = Math.max(1, data.numberOfLives)
  const total = Math.round((base + riderTotal) * lives)

  return {
    total,
    breakdown: {
      [`${data.planTier ?? 'standard'} plan`]: base * lives,
      ...Object.fromEntries(Object.entries(riders).map(([k, v]) => [k, v * lives])),
    },
  }
}

export function calculateTravelPremium(data: TravelData): { total: number; breakdown: Record<string, number> } {
  const destRates: Record<string, number> = {
    schengen: 900, uk: 700, usa_canada: 800, africa: 400, asia: 600, worldwide: 1100,
  }
  const dayRate = destRates[data.destination] ?? 500

  const depDate = data.departureDate ? new Date(data.departureDate) : new Date()
  const retDate = data.returnDate ? new Date(data.returnDate) : new Date()
  const days = Math.max(1, Math.ceil((retDate.getTime() - depDate.getTime()) / 86400000))
  const travellers = Math.max(1, data.numberOfTravellers)
  const base = dayRate * days * travellers

  const addonPrices: Record<string, number> = {
    cancellation: 3500, baggage: 2800, flight_delay: 1500, adventure_sports: 4000,
  }
  const addonTotal = (data.addons ?? []).reduce((sum, a) => sum + (addonPrices[a] ?? 0), 0)

  return {
    total: Math.round(base + addonTotal),
    breakdown: {
      'Base premium': Math.round(base),
      ...(data.addons ?? []).reduce(
        (acc, a) => ({ ...acc, [a.replace(/_/g, ' ')]: addonPrices[a] ?? 0 }),
        {} as Record<string, number>
      ),
    },
  }
}

export function calculateBusinessPremium(data: BusinessData): { total: number; breakdown: Record<string, number> } {
  const itemPrices: Record<string, number> = {
    fire_perils: 50000, burglary: 35000, householders: 28000, gpa: 8000,
  }
  const total = data.coverageItems.reduce((sum, item) => sum + (itemPrices[item] ?? 0), 0)
  const breakdown = data.coverageItems.reduce(
    (acc, item) => ({ ...acc, [item.replace(/_/g, ' ')]: itemPrices[item] ?? 0 }),
    {} as Record<string, number>
  )
  return { total, breakdown }
}

/**
 * Local estimate used only until NSIA's own marine calculator (guide §8.2,
 * wired via `calculateNsiaMarinePremium`) responds. Rates approximate the
 * cover types NSIA lists for `/DropDown/marine-cover-type`.
 */
export function calculateMarineFallbackPremium(data: MarineData): { total: number; breakdown: Record<string, number> } {
  const sumInsured = data.sumInsured ?? 0
  if (!sumInsured || !data.coverType) return { total: 0, breakdown: {} }

  const rates: Record<string, number> = {
    'All Risks': 0.025,
    'With Average': 0.02,
    'Free from Particular Average (FPA)': 0.015,
    'Institute Cargo Clause A': 0.025,
    'Institute Cargo Clause B': 0.02,
    'Institute Cargo Clause C': 0.015,
  }
  const rate = rates[data.coverType] ?? 0.02
  const base = Math.max(sumInsured * rate, 10000)

  return {
    total: Math.round(base),
    breakdown: { 'Estimated base premium': Math.round(base) },
  }
}

/**
 * NSIA does not publish a personal accident calculator, so this platform
 * prices it directly: a sum-insured rate, loaded for higher-risk occupations.
 */
export function calculatePersonalAccidentPremium(data: PersonalAccidentData): { total: number; breakdown: Record<string, number> } {
  const sumInsured = data.sumInsured ?? 0
  if (!sumInsured) return { total: 0, breakdown: {} }

  const highRiskOccupations = ['Driver', 'Police/Military', 'Construction', 'Farmer']
  const rate = highRiskOccupations.includes(data.occupation) ? 0.012 : 0.006

  const base = Math.max(sumInsured * rate, 5000)
  const stampDuty = 200

  return {
    total: Math.round(base + stampDuty),
    breakdown: {
      'Base premium': Math.round(base),
      'Stamp duty': stampDuty,
    },
  }
}

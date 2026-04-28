import type { MotorData, MedicalData, TravelData, BusinessData } from '@/store/quoteStore'

export function calculateMotorPremium(data: MotorData): { total: number; breakdown: Record<string, number> } {
  if (!data.vehicleValue || !data.coverType) return { total: 0, breakdown: {} }

  const rates: Record<string, number> = {
    comprehensive: 0.05,
    tpft: 0.025,
    tpo: 0.012,
  }

  let base = data.vehicleValue * rates[data.coverType]
  if (data.coverType === 'tpo') base = Math.max(base, 15000)

  const useMultiplier: Record<string, number> = {
    private: 1, own_goods: 1.2, commercial: 1.4, hired: 1.6,
  }
  base *= useMultiplier[data.useType ?? 'private']

  if (data.yearsExperience === '10+') base *= 0.9
  if (data.yearsExperience === '0-5') base *= 1.1
  if (data.previousAccidents) base *= 1.15
  if (data.claimFree) base *= 0.92

  const securityDiscount = data.securityFeatures.length * 0.02
  base *= 1 - Math.min(securityDiscount, 0.08)

  const addonPrices: Record<string, number> = {
    roadside: 5000, excess_waiver: 8000, courtesy_car: 6000,
    personal_accident: 4000, flood_extension: 7500,
  }
  const addonTotal = data.addons.reduce((sum, a) => sum + (addonPrices[a] ?? 0), 0)

  const subtotal = base + addonTotal
  const levy = Math.round(subtotal * 0.01)
  const stampDuty = 370

  const breakdown: Record<string, number> = {
    'Base premium': Math.round(base),
    ...data.addons.reduce((acc, a) => ({ ...acc, [a.replace('_', ' ')]: addonPrices[a] ?? 0 }), {}),
    'NAICOM levy (1%)': levy,
    'Stamp duty': stampDuty,
  }

  return { total: Math.round(subtotal + levy + stampDuty), breakdown }
}

export function calculateMedicalPremium(data: MedicalData): { total: number; breakdown: Record<string, number> } {
  const tierBase: Record<string, number> = { basic: 45000, standard: 120000, premium: 280000 }
  const base = tierBase[data.planTier ?? 'standard']

  const addonPrices: Record<string, number> = {
    personal_accident: 15000, critical_illness: 30000, dental: 8000, vision: 6000,
  }
  const addonTotal = data.addons.reduce((sum, a) => sum + (addonPrices[a] ?? 0), 0)
  const lives = data.numberOfLives > 1 ? data.numberOfLives : 1
  const total = Math.round((base + addonTotal) * lives)

  return {
    total,
    breakdown: {
      [`${data.planTier ?? 'standard'} plan`]: base * lives,
      ...data.addons.reduce((acc, a) => ({ ...acc, [a]: (addonPrices[a] ?? 0) * lives }), {}),
    },
  }
}

export function calculateTravelPremium(data: TravelData): { total: number; breakdown: Record<string, number> } {
  const destRates: Record<string, number> = {
    schengen: 900, uk: 700, usa_canada: 800, africa: 400, asia: 600, worldwide: 1100,
  }
  const dayRate = destRates[data.destination ?? 'africa'] ?? 500

  const depDate = data.departureDate ? new Date(data.departureDate) : new Date()
  const retDate = data.returnDate ? new Date(data.returnDate) : new Date()
  const days = Math.max(1, Math.ceil((retDate.getTime() - depDate.getTime()) / 86400000))
  const travellers = Math.max(1, data.numberOfTravellers)

  const base = dayRate * days * travellers

  const addonPrices: Record<string, number> = {
    cancellation: 3500, baggage: 2800, flight_delay: 1500, adventure_sports: 4000,
  }
  const addonTotal = data.addons.reduce((sum, a) => sum + (addonPrices[a] ?? 0), 0)
  const total = Math.round(base + addonTotal)

  return {
    total,
    breakdown: {
      'Base premium': base,
      ...data.addons.reduce((acc, a) => ({ ...acc, [a]: addonPrices[a] ?? 0 }), {}),
    },
  }
}

export function calculateBusinessPremium(data: BusinessData): { total: number; breakdown: Record<string, number> } {
  const itemPrices: Record<string, number> = {
    fire_perils: 50000, burglary: 35000, liability: 45000, gpa: 8000, health: 12000,
  }
  const total = data.coverageItems.reduce((sum, item) => sum + (itemPrices[item] ?? 0), 0)
  const breakdown = data.coverageItems.reduce(
    (acc, item) => ({ ...acc, [item.replace('_', ' ')]: itemPrices[item] ?? 0 }),
    {} as Record<string, number>
  )
  return { total, breakdown }
}

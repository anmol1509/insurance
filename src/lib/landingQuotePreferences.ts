import type { BusinessData, TravelData } from '@/store/quoteStore'

const covers = new Set(['fire_perils', 'burglary', 'householders', 'gpa'])
const addons = new Set(['cancellation', 'baggage', 'flight_delay', 'adventure_sports'])
const industries = new Set(['Retail / Trading', 'Food & Hospitality', 'Construction', 'Technology'])

/** Only carry supported, non-personal landing-page selections into a fresh quote. */
export function landingQuotePreferences(search: string): { travel: Partial<TravelData>; business: Partial<BusinessData> } {
  const params = new URLSearchParams(search)
  const travel: Partial<TravelData> = {}
  const business: Partial<BusinessData> = {}
  const trip = params.get('trip')
  if (trip === 'single' || trip === 'multi_annual') travel.tripType = trip
  const travellers = Number(params.get('travellers'))
  if (Number.isInteger(travellers) && travellers >= 1 && travellers <= 20) travel.numberOfTravellers = travellers
  if (params.has('addons')) travel.addons = [...new Set((params.get('addons') ?? '').split(',').filter(x => addons.has(x)))]
  if (params.has('covers')) business.coverageItems = [...new Set((params.get('covers') ?? '').split(',').filter(x => covers.has(x)))]
  const industry = params.get('industry')
  if (industry && industries.has(industry)) business.businessType = industry
  return { travel, business }
}

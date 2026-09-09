export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
]

export const VEHICLE_MAKES = [
  'Toyota','Honda','Mercedes-Benz','BMW','Hyundai','Kia','Ford','Nissan',
  'Mitsubishi','Volkswagen','Lexus','Innoson','Peugeot','Suzuki','Mazda',
  'Isuzu','Renault','Land Rover','Jeep','Volvo','Other',
]

export const VEHICLE_COLOURS = [
  'White','Silver','Black','Gray','Red','Blue','Green',
  'Gold/Champagne','Brown','Yellow','Orange','Other',
]

export const COLOUR_SWATCHES: Record<string, string> = {
  White: '#FFFFFF', Silver: '#C0C0C0', Black: '#1C1C1C', Gray: '#808080',
  Red: '#DC2626', Blue: '#2563EB', Green: '#16A34A', 'Gold/Champagne': '#D4AF37',
  Brown: '#92400E', Yellow: '#FBBF24', Orange: '#F97316', Other: '#9CA3AF',
}

export const VEHICLE_TYPES = [
  'Saloon','SUV','Pickup Truck','Tanker','Bus/Minibus',
  'Motorcycle','Heavy Truck','Trailer','Other',
]

export const ENGINE_CAPACITIES = [
  'Under 1000cc','1000–1499cc','1500–1999cc','2000–2499cc',
  '2500–2999cc','3000–3499cc','3500cc and above',
]

export const MARKET_VALUE_RANGES = [
  { label: 'Under ₦2M',       value: 'under_2m',    midpoint: 1500000 },
  { label: '₦2M – ₦5M',      value: '2m_5m',        midpoint: 3500000 },
  { label: '₦5M – ₦10M',     value: '5m_10m',       midpoint: 7500000 },
  { label: '₦10M – ₦15M',    value: '10m_15m',      midpoint: 12500000 },
  { label: '₦15M – ₦20M',    value: '15m_20m',      midpoint: 17500000 },
  { label: '₦20M – ₦30M',    value: '20m_30m',      midpoint: 25000000 },
  { label: '₦30M – ₦50M',    value: '30m_50m',      midpoint: 40000000 },
  { label: '₦50M – ₦100M',   value: '50m_100m',     midpoint: 75000000 },
  { label: 'Above ₦100M',     value: 'above_100m',   midpoint: 150000000 },
]

export const DRIVING_EXPERIENCE_OPTIONS = [
  'Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years',
]

export const SECURITY_FEATURES = [
  'GPS Tracker / Vehicle Tracker','Immobiliser','Alarm System',
  'Dash Camera','Central Locking','None of the above',
]

export const ID_TYPES = [
  'National ID Card (NIN)','International Passport',
  "Driver's License","Voter's Card",'NIMC Card',
]

export const MARITAL_STATUSES = ['Single','Married','Divorced','Widowed']

export const GENDERS = ['Male','Female','Other']

export const OCCUPATIONS = [
  'Accountant','Architect','Business owner','Civil servant','Doctor','Driver',
  'Engineer','Farmer','IT Professional','Journalist','Lawyer','Lecturer',
  'Manager','Marketing/Sales','Nurse','Pharmacist','Police/Military',
  'Retiree','Student','Teacher','Trader','Other',
]

/** Fallback lists used when the live NSIA dropdown (guide §6, 8.1) is unavailable. */
export const MARINE_COVER_TYPES = [
  'All Risks', 'With Average', 'Free from Particular Average (FPA)',
  'Institute Cargo Clause A', 'Institute Cargo Clause B', 'Institute Cargo Clause C',
]

export const MARINE_CARGO_CATEGORIES = ['Import Cargo', 'Export Cargo', 'Local Transit']

export const MARINE_PACKING_TYPES = ['Containerized', 'Bulk', 'Palletized', 'Loose', 'Crated']

export const MARINE_CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR']

export const BENEFICIARY_RELATIONSHIPS = [
  'Spouse', 'Child', 'Parent', 'Sibling', 'Other next of kin',
]

/**
 * The single question each product's quick-quote widget asks on the homepage,
 * and the first step of the flow itself — shared so an answer given on the
 * homepage maps straight onto the flow's data and is never asked twice.
 */
export const MEDICAL_COVER_OPTIONS = [
  { value: 'individual', label: 'Just me',          sub: '1 life',    planType: 'individual', lives: 1 },
  { value: 'couple',     label: 'Me + spouse',      sub: '2 lives',   planType: 'family',     lives: 2 },
  { value: 'family',     label: 'Family',           sub: '3–6 lives', planType: 'family',     lives: 4 },
  { value: 'group',      label: 'Group / company',  sub: '7+ lives',  planType: 'group',      lives: 7 },
] as const

export const TRAVEL_DESTINATIONS = [
  { value: 'schengen',   label: 'Schengen',     sub: 'EU / Europe' },
  { value: 'uk',         label: 'United Kingdom', sub: 'UK only' },
  { value: 'usa_canada', label: 'USA / Canada', sub: 'North America' },
  { value: 'africa',     label: 'Africa',       sub: 'African countries' },
  { value: 'asia',       label: 'Asia',         sub: 'Asia-Pacific & Middle East' },
  { value: 'worldwide',  label: 'Worldwide',    sub: 'Any destination' },
] as const

export const BUSINESS_TYPES = [
  'Retail / Trading', 'Manufacturing', 'Food & Hospitality', 'Professional Services',
  'Construction', 'Technology', 'Healthcare', 'Education', 'Logistics / Transport', 'Other',
] as const

export const PRODUCT_STEPS = {
  motor: [
    { id: 1, label: 'Your car',        title: 'Find your car',                  sub: 'Enter your registration plate to auto-fill your vehicle details.' },
    { id: 2, label: 'Car details',     title: 'Confirm your car details',       sub: 'We pre-filled these from the registry — check and edit if needed.' },
    { id: 3, label: 'Value & cover',   title: 'Car value & cover type',         sub: 'Set the insured value and choose comprehensive or third-party cover.' },
    { id: 4, label: 'Choose plan',     title: 'Compare & choose a plan',        sub: 'Pick the licensed insurer and cover that best suits your needs.' },
    { id: 5, label: 'Documents',       title: 'Upload your documents',          sub: 'Required documents for your policy under NAICOM guidelines.' },
    { id: 6, label: 'Your details',    title: 'Your personal information',      sub: 'Complete your KYC details and review your quote before submitting.' },
  ],
  medical: [
    { id: 1, label: 'Who needs cover', title: 'Who needs cover?',               sub: 'Tell us who the policy is for — you can change this later.' },
    { id: 2, label: 'Personal info',  title: 'Your personal details',           sub: 'Basic information to set up your policy.' },
    { id: 3, label: 'Health details', title: 'Health information',              sub: 'Help us understand your health profile.' },
    { id: 4, label: 'Choose plan',    title: 'Compare & choose a plan',         sub: 'Pick the health insurer and cover that best suits your needs.' },
    { id: 5, label: 'Coverage',       title: 'Additional coverage options',     sub: 'Select extra benefits and riders for your policy.' },
    { id: 6, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  travel: [
    { id: 1, label: 'Destination',    title: 'Where are you travelling?',       sub: 'Pick the region you are travelling to — you can change this later.' },
    { id: 2, label: 'Traveller info', title: 'Your travel details',             sub: 'Tell us about the traveller(s).' },
    { id: 3, label: 'Trip details',   title: 'Trip & coverage options',         sub: 'Dates, destination and cover.' },
    { id: 4, label: 'Health info',    title: 'Health declaration',              sub: 'A few health questions required by the insurer.' },
    { id: 5, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  business: [
    { id: 1, label: 'Business type',  title: 'What type of business?',          sub: 'Pick the closest match — you can change this later.' },
    { id: 2, label: 'Business info',  title: 'Business details',                sub: 'Tell us about your business.' },
    { id: 3, label: 'Coverage',       title: 'Select your covers',              sub: 'Your premium updates live as you add covers.' },
    { id: 4, label: 'Risk details',   title: 'Risk assessment',                 sub: 'A few questions about your premises and operations.' },
    { id: 5, label: 'Contact info',   title: 'Director / contact details',      sub: 'KYC information for the authorised signatory.' },
    { id: 6, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  marine: [
    { id: 1, label: 'Shipment',       title: 'Cargo & shipment details',        sub: 'Tell us what is being shipped and how.' },
    { id: 2, label: 'Cover',          title: 'Choose your cover & premium',     sub: 'We calculate your premium live with NSIA Insurance.' },
    { id: 3, label: 'Your details',   title: 'Policyholder details',            sub: 'Your information for the insurance certificate.' },
    { id: 4, label: 'Documents',      title: 'Upload your documents',           sub: 'Required documents for your NSIA marine policy.' },
    { id: 5, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before submitting.' },
  ],
  'personal-accident': [
    { id: 1, label: 'About you',      title: 'About you',                       sub: 'A few details we need for accident cover.' },
    { id: 2, label: 'Beneficiary',    title: 'Beneficiary & health',            sub: 'Who should be paid, and a quick health check.' },
    { id: 3, label: 'Your details',   title: 'Policyholder details',            sub: 'Your information for the insurance certificate.' },
    { id: 4, label: 'Documents',      title: 'Upload your documents',           sub: 'Required documents for your NSIA personal accident policy.' },
    { id: 5, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before submitting.' },
  ],
} as const

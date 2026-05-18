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

export const PRODUCT_STEPS = {
  motor: [
    { id: 1, label: 'Your car',        title: 'Find your car',                  sub: 'Enter your registration plate to auto-fill your vehicle details.' },
    { id: 2, label: 'Car details',     title: 'Confirm your car details',       sub: 'We pre-filled these from the registry — check and edit if needed.' },
    { id: 3, label: 'Value & cover',   title: 'Car value & cover type',         sub: 'Set the insured value and choose comprehensive or third-party cover.' },
    { id: 4, label: 'Choose plan',     title: 'Compare & choose a plan',        sub: 'Pick the licensed insurer and cover that best suits your needs.' },
    { id: 5, label: 'Your details',    title: 'Your personal information',      sub: 'Required for KYC verification under NAICOM regulations.' },
    { id: 6, label: 'Documents',       title: 'Documents & review',             sub: 'Upload required documents and confirm your details.' },
  ],
  medical: [
    { id: 1, label: 'Personal info',  title: 'Your personal details',           sub: 'Basic information to set up your policy.' },
    { id: 2, label: 'Health details', title: 'Health information',              sub: 'Help us understand your health profile.' },
    { id: 3, label: 'Coverage',       title: 'Choose your coverage',            sub: 'Select the benefits that suit your needs.' },
    { id: 4, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  travel: [
    { id: 1, label: 'Traveller info', title: 'Your travel details',             sub: 'Tell us about the traveller(s).' },
    { id: 2, label: 'Trip details',   title: 'Trip & coverage options',         sub: 'Dates, destination and cover.' },
    { id: 3, label: 'Health info',    title: 'Health declaration',              sub: 'A few health questions required by the insurer.' },
    { id: 4, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  business: [
    { id: 1, label: 'Business info',  title: 'Business details',                sub: 'Tell us about your business.' },
    { id: 2, label: 'Coverage',       title: 'Select your covers',              sub: 'Your premium updates live as you add covers.' },
    { id: 3, label: 'Risk details',   title: 'Risk assessment',                 sub: 'A few questions about your premises and operations.' },
    { id: 4, label: 'Contact info',   title: 'Director / contact details',      sub: 'KYC information for the authorised signatory.' },
    { id: 5, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
} as const

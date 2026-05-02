export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: number
  publishedAt: string
  author: { name: string; role: string }
  coverEmoji: string
  content: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'cheapest-motor-insurance-lagos-2025',
    title: 'Cheapest Motor Insurance in Lagos 2025: A Complete Comparison',
    excerpt:
      "Third-party cover starts at ₦15,000 — but is it enough? We compare every NAICOM-licensed insurer so you know exactly what you're paying for.",
    category: 'Motor',
    readTime: 7,
    publishedAt: '2025-04-18',
    author: { name: 'Chidi Okafor', role: 'Insurance Analyst' },
    coverEmoji: '🚗',
    tags: ['motor insurance', 'Lagos', 'cheap car insurance Nigeria', 'NIID'],
    content: `
## What does Nigerian law require?

Under the Insurance Act 2003 and the Motor Vehicles (Third Party Insurance) Act, every vehicle on Nigerian roads must carry at minimum a **Third Party Only (TPO)** policy. Driving without one is a criminal offence that can result in a ₦250,000 fine or six months' imprisonment.

## The three cover types explained

| Cover Type | What it pays | Typical annual premium |
|-----------|--------------|----------------------|
| Third Party Only (TPO) | Injury/death/damage to other people and property | ₦15,000 – ₦25,000 |
| Third Party Fire & Theft (TPF&T) | TPO + your car if stolen or burnt | ₦35,000 – ₦60,000 |
| Comprehensive | Everything above + your own vehicle in accidents | ₦65,000 – ₦180,000+ |

## Key factors that change your premium

1. **Market value of your car** — insurers use declared value, not purchase price
2. **Driver age** — under-25 drivers attract a loading of up to 20%
3. **Claims history** — a claim in the last 3 years typically adds 15%
4. **Use type** — private use is cheaper than commercial or hire purchase
5. **State** — Lagos and Abuja have higher base rates than smaller states

## Our top picks for 2025

**Best overall:** Leadway Assurance — strong claims record (98%), NIID auto-registration, and 24/7 roadside assistance.

**Best budget:** Zenith General Insurance — starting from ₦15,000 for TPO, claims processed within 48 hours.

**Best for new cars:** AXA Mansard — new-for-old replacement guarantee for vehicles under 3 years old.

## How to get the lowest price

The single most effective way to save is to **compare multiple insurers** before buying. Prices for identical cover can vary by 20–30% across NAICOM-licensed providers. Use ShopInsurance to get instant quotes from all major insurers in under 3 minutes.
    `.trim(),
  },
  {
    slug: 'niid-certificate-what-you-need-to-know',
    title: 'NIID Certificate: What It Is and Why Nigerian Drivers Need It',
    excerpt:
      "The NIID sticker on your windscreen isn't just for show. Here's what it proves, how to get one instantly, and what happens if you don't have it.",
    category: 'Motor',
    readTime: 5,
    publishedAt: '2025-04-10',
    author: { name: 'Funke Adewale', role: 'Regulatory Affairs Writer' },
    coverEmoji: '📋',
    tags: ['NIID', 'motor insurance Nigeria', 'insurance certificate', 'NAICOM'],
    content: `
## What is the NIID?

The **Nigerian Insurers Industry Database (NIID)** is a centralised platform managed by the Nigerian Insurers Association (NIA) that records every valid motor insurance policy in the country. When you buy a motor policy, your insurer registers it on the NIID and issues a tamper-proof certificate.

## Why it matters

Traffic officers, VIO (Vehicle Inspection Officers), and police checkpoints can now verify your insurance in real-time by scanning the QR code on your windscreen sticker or checking the NIID portal. Fake certificates — once rampant — are immediately flagged.

## What information appears on the certificate

- Vehicle registration number
- Policy number and insurer name
- Cover type (TPO, TPF&T, or Comprehensive)
- Policy start and expiry dates
- NIID verification QR code

## How to get yours instantly

When you buy through ShopInsurance, your certificate is issued digitally within **3 minutes** of payment. You can:
- Download the PDF immediately
- Print the windscreen sticker
- Share by email or WhatsApp

Your policy is simultaneously registered on the NIID — no manual registration required.

## What if your certificate is expired?

An expired NIID certificate is treated the same as no insurance at all. Renew at least a week before expiry to avoid any gap in cover. ShopInsurance sends automatic renewal reminders 30 days before your policy expires.
    `.trim(),
  },
  {
    slug: 'travel-insurance-schengen-visa-nigeria',
    title: 'Travel Insurance for Schengen Visa: What Nigerians Need to Know',
    excerpt:
      'EU embassies require minimum €30,000 medical cover. We explain exactly what to buy, what to avoid, and the cheapest compliant options from Nigeria.',
    category: 'Travel',
    readTime: 8,
    publishedAt: '2025-03-28',
    author: { name: 'Amara Eze', role: 'Travel & Insurance Writer' },
    coverEmoji: '✈️',
    tags: ['Schengen travel insurance', 'EU visa Nigeria', 'travel insurance Lagos'],
    content: `
## The Schengen requirement

All 26 Schengen-area countries require proof of travel insurance as part of the visa application. The policy must:

- Cover medical emergencies and hospitalisation up to **€30,000 minimum**
- Include emergency repatriation to Nigeria
- Be valid for the entire duration of your stay plus entry/exit days
- Come from an insurer recognised in the destination country

## Common mistakes that get applications rejected

1. **Insufficient cover** — some insurers offer €10,000 or €15,000 plans. These will fail the Schengen test.
2. **Wrong dates** — policy must cover arrival and departure days, not just the nights you're staying
3. **Excluded activities** — if you plan to ski or do adventure sports, standard cover may not apply
4. **Domestic-only insurer** — some Nigerian HMOs offer "international" cover that doesn't meet Schengen criteria

## What to look for when buying

✅ Medical cover: €30,000 minimum (€50,000 recommended for peace of mind)
✅ Repatriation of remains
✅ 24/7 emergency assistance line with English-speaking operators
✅ Policy document in English (embassies require this)
✅ Clear start/end dates matching your visa application

## Our recommended plans

All travel plans on ShopInsurance are Schengen-compliant and issued in under 5 minutes. AXA Mansard's Travel policy offers €50,000 medical cover and is accepted by all EU embassies. Prices start from ₦28,000 for a 2-week trip.
    `.trim(),
  },
  {
    slug: 'hmo-vs-health-insurance-nigeria',
    title: "HMO vs Health Insurance in Nigeria: What's the Real Difference?",
    excerpt:
      'Confused by HMO, NHIS, and private health insurance? This plain-language guide explains which is right for your family or business.',
    category: 'Medical',
    readTime: 6,
    publishedAt: '2025-03-14',
    author: { name: 'Dr. Yemi Adeyemi', role: 'Healthcare Finance Contributor' },
    coverEmoji: '❤️',
    tags: ['HMO Nigeria', 'health insurance Nigeria', 'NHIS', 'medical cover'],
    content: `
## The short answer

An **HMO (Health Maintenance Organisation)** is the company that manages your healthcare — they maintain a network of hospitals and pay bills directly (cashless). **Health insurance** is the financial product that funds your care. In Nigeria, most people use these terms interchangeably, but the distinction matters when choosing cover.

## NHIS vs Private HMO

| | NHIS | Private HMO |
|--|------|-------------|
| Cost | Subsidised (employer contributes) | Market rate |
| Network | Government facilities mainly | Private hospitals included |
| Processing speed | Slow | Fast (hours not weeks) |
| Maternity cover | Basic | Often comprehensive |
| Best for | Formal-sector employees | Self-employed, SMEs, families |

## Key things to check before buying

1. **Hospital network** — confirm your preferred hospital is accredited. Hygeia has 700+ facilities; some smaller HMOs cover fewer than 50.
2. **Waiting period** — most plans have a 30-90 day waiting period for pre-existing conditions
3. **Annual limit** — typical family plans cap at ₦5m–₦20m per year. Understand what happens if you exceed it
4. **Maternity rider** — often sold separately; check exclusions for caesarean sections
5. **Dental and vision** — almost always optional add-ons, not included by default

## What a plan on ShopInsurance covers

All medical plans listed on ShopInsurance are from NAICOM-licensed HMOs. You can compare networks, limits, and pricing side-by-side — and get covered in under 10 minutes.
    `.trim(),
  },
  {
    slug: 'business-insurance-nigeria-sme-guide',
    title: 'Business Insurance in Nigeria: The Complete Guide for SMEs',
    excerpt:
      "Fire, theft, liability, employee injury — Nigerian SMEs face real risks but most have zero cover. Here's what you need and how to get it affordably.",
    category: 'Business',
    readTime: 9,
    publishedAt: '2025-02-27',
    author: { name: 'Kola Fashola', role: 'SME Finance Writer' },
    coverEmoji: '🏢',
    tags: ['business insurance Nigeria', 'SME insurance', 'fire insurance Lagos', 'liability cover'],
    content: `
## Why most Nigerian SMEs have no cover — and why that's changing

A 2024 survey by the NIA found that fewer than 12% of Nigerian SMEs carry any form of business insurance. The main reasons: perceived cost, complexity of policies, and lack of awareness. Yet 70% of businesses that suffer a major uninsured loss never reopen.

## The core covers every business needs

### 1. Fire and Special Perils
Covers your building, stock, and equipment against fire, flood, lightning, and explosion. This is the most fundamental cover and is legally required for businesses above a certain size.

### 2. Burglary and Theft
Pays for stolen stock, equipment, and cash following a break-in. Note: standard policies cover forced entry only — internal theft requires a separate Fidelity Guarantee policy.

### 3. Public Liability
If a customer slips in your shop or is injured on your premises, you're legally liable. This cover pays legal costs and damages. Essential for any business with customer footfall.

### 4. Employers' Liability
Required by law under the Employees' Compensation Act 2010 if you have more than one employee. Covers medical costs and compensation for work-related injuries.

### 5. Business Interruption
If your premises are damaged and you can't trade, this cover replaces your lost gross profit and pays fixed costs (rent, salaries) while you rebuild.

## What does it cost?

A basic combined policy for a typical Lagos retail SME starts from around ₦120,000/year — less than ₦10,000/month. Compare that to the average burglary loss of ₦2.5m.

## How to buy on ShopInsurance

Complete our 5-minute business quote form, select your covers, and compare prices from Leadway, Zenith, NSIA, and Custodian Insurance. All policies include NAICOM-regulated certificate delivery.
    `.trim(),
  },
  {
    slug: 'how-to-file-insurance-claim-nigeria',
    title: 'How to File an Insurance Claim in Nigeria (Step-by-Step Guide)',
    excerpt:
      "Most Nigerians never claim — not because they don't have losses, but because they don't know how. This guide walks you through every step.",
    category: 'Guides',
    readTime: 6,
    publishedAt: '2025-02-10',
    author: { name: 'Ngozi Eze', role: 'Claims Consultant' },
    coverEmoji: '📝',
    tags: ['insurance claim Nigeria', 'how to claim motor insurance', 'NAICOM claims'],
    content: `
## Step 1: Notify your insurer immediately

Most policies require you to notify your insurer within **24–48 hours** of an incident. Late notification can be used to reduce or deny your claim. Call the emergency line on your certificate, then follow up in writing (email or WhatsApp).

## Step 2: Document everything

For motor claims:
- Take photos of all damage from multiple angles
- Get the other driver's name, registration, and insurer details
- Note the date, time, location, and weather conditions
- Obtain a police report (essential for claims above ₦500,000)

For property/business claims:
- Photograph all damaged items before touching them
- Keep all receipts, purchase records, and valuations
- Do not discard damaged items until your loss adjuster has assessed them

## Step 3: Complete the claim form

Your insurer will send a claim notification form. Fill it in fully and honestly. Any material misrepresentation — even minor — can void the claim under Nigerian insurance law.

## Step 4: Loss adjuster assessment

For significant claims, your insurer appoints an independent loss adjuster to assess the damage. Cooperate fully. The adjuster's report directly determines your payout.

## Step 5: Settlement

Under NAICOM guidelines, insurers must acknowledge claims within 5 working days and settle within **90 days** of receiving all required documents. If your claim is delayed, you can escalate to NAICOM directly.

## What can cause a claim to be rejected?

- Policy lapsed at the time of the incident
- Exclusion applies (e.g., driving under the influence)
- Delay in notification
- Incomplete documentation
- Material misrepresentation on the original application

## ShopInsurance claims support

If you bought your policy through ShopInsurance, our claims team will guide you through the entire process at no extra cost. Contact us via WhatsApp or the claims portal.
    `.trim(),
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category)
}

const CATEGORY_COLORS: Record<string, string> = {
  Motor:    'var(--motor-600)',
  Medical:  'var(--medical-600)',
  Travel:   'var(--travel-600)',
  Business: 'var(--business-600)',
  Guides:   'var(--green-700)',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? 'var(--green-700)'
}

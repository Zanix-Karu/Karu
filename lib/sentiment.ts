const FREE_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'aol.com', 'mail.com', 'protonmail.com', 'live.com', 'ymail.com',
  'yahoo.fr', 'hotmail.fr', 'orange.fr', 'wanadoo.fr',
])

const FLEET_KEYWORDS = ['fleet', 'rental', 'rentals', 'location', 'auto', 'transport',
  'voyageur', 'voiture', 'véhicule', 'cars', 'leasing', 'hire', 'motors', 'drive']

const PREMIUM_KEYWORDS = ['luxury', 'luxe', 'premium', 'vip', 'executive', 'prestige',
  'elite', 'deluxe', 'business', 'corporate', 'entreprise']

export interface LeadScore {
  total: number      // 0–100
  tier: 'HOT' | 'WARM' | 'COLD'
  breakdown: {
    typeScore: number
    fleetScore: number
    contactScore: number
    emailScore: number
    profileScore: number
    keywordScore: number
  }
  segment: string
  flags: string[]
}

export function scoreEntry(entry: {
  type: string
  vehicle_count?: string | null
  phone?: string | null
  business_name?: string | null
  business_email?: string | null
  email: string
  city: string
}): LeadScore {
  const flags: string[] = []
  let total = 0

  // Type (max 30)
  const typeScore = entry.type === 'vendor' ? 30 : 10
  total += typeScore
  if (entry.type === 'vendor') flags.push('VENDOR')

  // Fleet size (max 25)
  let fleetScore = 0
  if (entry.type === 'vendor') {
    if (entry.vehicle_count === '21+') { fleetScore = 25; flags.push('LARGE_FLEET') }
    else if (entry.vehicle_count === '6-20') { fleetScore = 15; flags.push('MID_FLEET') }
    else if (entry.vehicle_count === '1-5') { fleetScore = 5; flags.push('SOLO') }
  }
  total += fleetScore

  // Contact completeness (max 10)
  const contactScore = entry.phone ? 10 : 0
  total += contactScore
  if (entry.phone) flags.push('HAS_PHONE')

  // Email quality (max 20)
  let emailScore = 0
  const emailDomain = entry.email.split('@')[1]?.toLowerCase() ?? ''
  const bizDomain = entry.business_email?.split('@')[1]?.toLowerCase() ?? ''
  const hasCorporateEmail = entry.business_email && !FREE_DOMAINS.has(bizDomain)
  const hasPersonalCorpEmail = !FREE_DOMAINS.has(emailDomain)

  if (hasCorporateEmail) { emailScore = 20; flags.push('CORPORATE_EMAIL') }
  else if (hasPersonalCorpEmail) { emailScore = 10; flags.push('NON_FREE_EMAIL') }
  total += emailScore

  // Profile completeness (max 5)
  const profileScore = entry.business_name ? 5 : 0
  total += profileScore
  if (entry.business_name) flags.push('HAS_BIZNAME')

  // Keyword signals in business name (max 10)
  let keywordScore = 0
  const nameLC = (entry.business_name ?? '').toLowerCase()
  if (PREMIUM_KEYWORDS.some(k => nameLC.includes(k))) { keywordScore = 10; flags.push('PREMIUM_SIGNAL') }
  else if (FLEET_KEYWORDS.some(k => nameLC.includes(k))) { keywordScore = 5; flags.push('FLEET_SIGNAL') }
  total += keywordScore

  // Clamp
  total = Math.min(100, Math.max(0, total))

  const tier: LeadScore['tier'] = total >= 65 ? 'HOT' : total >= 35 ? 'WARM' : 'COLD'

  let segment = 'Browser'
  if (entry.type === 'vendor') {
    if (entry.vehicle_count === '21+') segment = 'Fleet Operator'
    else if (entry.vehicle_count === '6-20') segment = 'SME Operator'
    else segment = 'Solo Operator'
  } else {
    segment = entry.city === 'douala' ? 'Traveller (DLA)' : entry.city === 'yaounde' ? 'Traveller (YAO)' : 'Traveller'
  }

  return {
    total,
    tier,
    breakdown: { typeScore, fleetScore, contactScore, emailScore, profileScore, keywordScore },
    segment,
    flags,
  }
}

export function tierColor(tier: 'HOT' | 'WARM' | 'COLD'): string {
  return tier === 'HOT' ? '#E8A020' : tier === 'WARM' ? '#2EA8FF' : '#3D5065'
}

export type OppType = 'job' | 'casting' | 'grant' | 'competition' | 'festival' | 'fellowship' | 'residency' | 'commission'
export type ServiceType = 'production' | 'equipment' | 'location' | 'studio' | 'creative' | 'distribution'
export type OrderStatus = 'pending' | 'active' | 'delivered' | 'revision' | 'completed' | 'disputed'
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled'

export type Opportunity = {
  id: string
  type: OppType
  title: string
  org: string
  orgType: string
  orgVerified: boolean
  location: string
  pay: string
  deadline: string
  match: number
  matchReasons: string[]
  saved: boolean
  tags: string[]
  desc: string
  requirements: string[]
}

export type HubService = {
  id: string
  type: ServiceType
  title: string
  provider: string
  providerRating: number
  providerJobs: number
  price: string
  priceUnit: string
  location: string
  image: string
  tags: string[]
  verified: boolean
  desc: string
}

export type HubOrder = {
  id: string
  title: string
  type: 'buyer' | 'seller'
  counterparty: string
  amount: number
  status: OrderStatus
  dueDate: string
  deliverables: string[]
  progress: number
}

export type Application = {
  id: string
  oppTitle: string
  oppType: OppType
  org: string
  appliedDate: string
  status: 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
}

export type HubContract = {
  id: string
  title: string
  counterparty: string
  value: number
  status: ContractStatus
  created: string
  milestones: { label: string; amount: number; done: boolean }[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1', type: 'casting', title: 'Lead Actor — Short Film "Lagos Dreams"',
    org: 'Nairobi Film Collective', orgType: 'Production House', orgVerified: true, location: 'Nairobi, Kenya',
    pay: 'KES 15,000', deadline: '20 Aug 2026', match: 94,
    matchReasons: ['Your Passport lists 3 years of acting credits', 'You speak Swahili and English fluently', 'Your availability matches Aug–Sep 2026'],
    saved: false,
    tags: ['Acting', 'Drama', 'Nairobi'], desc: 'Seeking a lead actor for a 3-week shoot exploring urban youth culture in Nairobi and Mombasa.',
    requirements: ['Age 22–35', 'Swahili & English fluency', 'Prior film experience', 'Available Aug–Sep 2026'],
  },
  {
    id: 'o2', type: 'grant', title: 'Kenya Film Commission Grant 2026',
    org: 'Kenya Film Commission', orgType: 'Government Body', orgVerified: true, location: 'Kenya',
    pay: 'KES 250,000', deadline: '1 Sep 2026', match: 91,
    matchReasons: ['You are a verified Kenyan citizen on Passport', 'Your Studio has an original unpublished screenplay', 'You are under the 35-year eligibility cutoff'],
    saved: true,
    tags: ['Documentary', 'Short Film', 'Grant'], desc: 'Supporting emerging Kenyan filmmakers with production grants for original short films and documentaries.',
    requirements: ['Kenyan citizen', 'Original screenplay', 'Budget plan required', 'Under 35 years old'],
  },
  {
    id: 'o3', type: 'job', title: 'Freelance Cinematographer',
    org: 'Savannah Media House', orgType: 'Media Company', orgVerified: true, location: 'Nairobi / Remote',
    pay: 'KES 8,000/day', deadline: 'Open', match: 88,
    matchReasons: ['Cinematography is your top-rated Passport skill', 'Your portfolio shows 4 documentary credits', 'You\'ve listed availability for travel'],
    saved: false,
    tags: ['Cinematography', 'Freelance', 'Documentary'], desc: 'Ongoing projects require a skilled cinematographer with documentary and commercial experience.',
    requirements: ['Own camera equipment', '3+ years experience', 'Portfolio required', 'Available for travel'],
  },
  {
    id: 'o4', type: 'festival', title: 'DIFF 2026 — Film Submissions',
    org: 'Durban International Film Festival', orgType: 'Festival', orgVerified: true, location: 'Durban, South Africa',
    pay: 'Prize + Distribution', deadline: '15 Sep 2026', match: 82,
    matchReasons: ['Your Studio project "Nairobi Nights" was completed after Jan 2025', 'It matches the African-made eligibility rule', 'Delivery format matches your last export'],
    saved: false,
    tags: ['Festival', 'Short Film', 'Feature'], desc: 'Africa\'s premier film festival invites submissions from African filmmakers across all genres.',
    requirements: ['African-made film', 'Completed after Jan 2025', 'English subtitles', 'DCP or ProRes'],
  },
  {
    id: 'o5', type: 'competition', title: 'Safaricom Music Video Challenge',
    org: 'Safaricom PLC', orgType: 'Corporate', orgVerified: true, location: 'Kenya',
    pay: 'KES 500,000 prize pool', deadline: '30 Aug 2026', match: 79,
    matchReasons: ['You\'re a Kenyan-based director on Passport', 'Your Studio has music-video-length projects', 'Your average delivery resolution meets the 1080p bar'],
    saved: false,
    tags: ['Music Video', 'Competition', 'Commercial'], desc: 'Create a 3-minute music video for an emerging Kenyan artist. Judged on creativity, production value, and storytelling.',
    requirements: ['Kenyan director', 'Min 1080p delivery', 'Original concept', 'Under 3 minutes'],
  },
  {
    id: 'o6', type: 'fellowship', title: 'Africa Media Fellowship 2026',
    org: 'Africa Media Centre', orgType: 'NGO', orgVerified: false, location: 'Lagos, Nigeria',
    pay: 'USD 5,000 + mentorship', deadline: '10 Sep 2026', match: 76,
    matchReasons: ['Your Passport lists 3+ years of media experience', 'You\'ve marked English as a working language', 'Your profile is tagged African national'],
    saved: true,
    tags: ['Fellowship', 'Journalism', 'Documentary'], desc: '6-month fellowship for emerging African media professionals covering conflict, climate, and culture.',
    requirements: ['3+ years media experience', 'Proposal required', 'African national', 'English proficiency'],
  },
]

export const SERVICES: HubService[] = [
  {
    id: 's1', type: 'equipment', title: 'RED Komodo 6K Cinema Camera Package',
    provider: 'ProGear Kenya', providerRating: 4.9, providerJobs: 142, price: 'KES 12,000', priceUnit: '/day',
    location: 'Nairobi, Kenya', verified: true,
    image: 'https://images.unsplash.com/photo-1617440168937-c6497eaa8db5?w=400&h=240&fit=crop&auto=format',
    tags: ['Cinema Camera', '6K', 'Lenses Included'], desc: 'Full cinema package: RED Komodo 6K, prime lens set, follow focus, matte box, batteries, and cards.',
  },
  {
    id: 's2', type: 'studio', title: 'Full Production Studio — Day Rate',
    provider: 'Nairobi Studios Ltd', providerRating: 4.8, providerJobs: 89, price: 'KES 35,000', priceUnit: '/day',
    location: 'Karen, Nairobi', verified: true,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=240&fit=crop&auto=format',
    tags: ['Cyclorama', 'Sound Stage', 'Control Room'], desc: '500 sqm sound stage with cyclorama wall, 3-point lighting grid, green screen, and production office.',
  },
  {
    id: 's3', type: 'location', title: 'Rooftop Nairobi CBD — Golden Hour Shoots',
    provider: 'Location Scout KE', providerRating: 4.7, providerJobs: 56, price: 'KES 8,000', priceUnit: '/half day',
    location: 'Westlands, Nairobi', verified: false,
    image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=240&fit=crop&auto=format',
    tags: ['Rooftop', 'Skyline', 'Golden Hour'], desc: 'Panoramic CBD rooftop with unobstructed skyline. Perfect for music videos, commercials, and drama.',
  },
  {
    id: 's4', type: 'creative', title: 'Professional Script Editing & Development',
    provider: 'Amara Osei-Wusu', providerRating: 5.0, providerJobs: 34, price: 'KES 15,000', priceUnit: '/script',
    location: 'Remote', verified: true,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=240&fit=crop&auto=format',
    tags: ['Screenwriting', 'Development', 'Story'], desc: 'Award-winning screenwriter offers script coverage, rewriting, and story development for short and feature films.',
  },
  {
    id: 's5', type: 'production', title: 'Full Video Production Crew Package',
    provider: 'East African Film Co.', providerRating: 4.8, providerJobs: 203, price: 'KES 85,000', priceUnit: '/day',
    location: 'Nairobi, Kenya', verified: true,
    image: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=400&h=240&fit=crop&auto=format',
    tags: ['Director', 'DP', 'Crew', 'Equipment'], desc: 'Complete production crew: director of photography, gaffer, sound recordist, grip, and production assistant.',
  },
]

export const ORDERS: HubOrder[] = [
  {
    id: 'ord1', title: 'Script Development — "Swahili Sunrise"', type: 'buyer',
    counterparty: 'Amara Osei-Wusu', amount: 15000, status: 'active',
    dueDate: '2026-08-20', progress: 60,
    deliverables: ['First draft', 'Revision pass', 'Final polish'],
  },
  {
    id: 'ord2', title: 'Cinematography — "Lagos Dreams" Short Film', type: 'seller',
    counterparty: 'Nairobi Film Collective', amount: 45000, status: 'active',
    dueDate: '2026-09-05', progress: 30,
    deliverables: ['3-week shoot', 'Raw footage delivery', 'DIT services'],
  },
  {
    id: 'ord3', title: 'RED Komodo Camera Rental — 3 Days', type: 'buyer',
    counterparty: 'ProGear Kenya', amount: 36000, status: 'completed',
    dueDate: '2026-08-05', progress: 100,
    deliverables: ['Camera package', 'Insurance coverage', 'Technical support'],
  },
]

export const APPLICATIONS: Application[] = [
  { id: 'a1', oppTitle: 'Lead Actor — Short Film "Lagos Dreams"', oppType: 'casting', org: 'Nairobi Film Collective', appliedDate: '2026-08-05', status: 'shortlisted' },
  { id: 'a2', oppTitle: 'Kenya Film Commission Grant 2026', oppType: 'grant', org: 'Kenya Film Commission', appliedDate: '2026-08-01', status: 'reviewing' },
  { id: 'a3', oppTitle: 'Africa Media Fellowship 2026', oppType: 'fellowship', org: 'Africa Media Centre', appliedDate: '2026-07-28', status: 'submitted' },
  { id: 'a4', oppTitle: 'Documentary Cinematographer — Savannah Series', oppType: 'job', org: 'Savannah Media House', appliedDate: '2026-07-20', status: 'accepted' },
]

export const CONTRACTS: HubContract[] = [
  {
    id: 'ct1', title: 'Cinematography Services — Lagos Dreams',
    counterparty: 'Nairobi Film Collective', value: 45000, status: 'signed', created: '2026-08-07',
    milestones: [
      { label: 'Pre-production & equipment check', amount: 5000, done: true },
      { label: 'Principal photography (Week 1)', amount: 15000, done: true },
      { label: 'Principal photography (Week 2)', amount: 15000, done: false },
      { label: 'Principal photography (Week 3) + delivery', amount: 10000, done: false },
    ],
  },
]

export const OPP_TYPE_META: Record<OppType, { label: string; icon: string; color: string }> = {
  job:         { label: 'Job',         icon: '💼', color: '#2980b9' },
  casting:     { label: 'Casting',     icon: '🎭', color: '#e74c3c' },
  grant:       { label: 'Grant',       icon: '🏆', color: '#f39c12' },
  competition: { label: 'Competition', icon: '🥇', color: '#e67e22' },
  festival:    { label: 'Festival',    icon: '🌍', color: '#9b59b6' },
  fellowship:  { label: 'Fellowship',  icon: '🎓', color: '#16a085' },
  residency:   { label: 'Residency',   icon: '🏡', color: '#1abc9c' },
  commission:  { label: 'Commission',  icon: '🎨', color: '#e91e8c' },
}

export const SVC_TYPE_META: Record<ServiceType, { label: string; icon: string; color: string }> = {
  production:  { label: 'Production',  icon: '🎬', color: '#9b59b6' },
  equipment:   { label: 'Equipment',   icon: '📷', color: '#2980b9' },
  location:    { label: 'Location',    icon: '📍', color: '#27ae60' },
  studio:      { label: 'Studio',      icon: '🎙️', color: '#e74c3c' },
  creative:    { label: 'Creative',    icon: '✍️', color: '#f39c12' },
  distribution:{ label: 'Distribution',icon: '📡', color: '#1abc9c' },
}

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'Pending',    color: '#f39c12' },
  active:    { label: 'Active',     color: '#2980b9' },
  delivered: { label: 'Delivered',  color: '#9b59b6' },
  revision:  { label: 'Revision',   color: '#e67e22' },
  completed: { label: 'Completed',  color: '#1abc9c' },
  disputed:  { label: 'Disputed',   color: '#e74c3c' },
}

export const APP_STATUS_META: Record<Application['status'], { label: string; color: string }> = {
  submitted:   { label: 'Submitted',   color: '#5dade2' },
  reviewing:   { label: 'Reviewing',   color: '#f39c12' },
  shortlisted: { label: 'Shortlisted', color: '#9b59b6' },
  rejected:    { label: 'Rejected',    color: '#e74c3c' },
  accepted:    { label: 'Accepted',    color: '#1abc9c' },
}

// ─── Passport summary (Section 8 — applications auto-populate from Passport) ──

export const HUB_PASSPORT_SUMMARY = {
  name: 'Amani Otieno',
  skills: ['Cinematography', 'Colour Grading', 'Documentary Directing', 'Swahili & English'],
  experience: '4 years — freelance & production house work',
  credits: ['"Nairobi Nights" (2025) — Director of Photography', '"Coastal Echoes" (2024) — Cinematographer'],
  portfolioProjects: ['Nairobi Nights', 'Swahili Sunrise (draft)', 'Coastal Echoes'],
  education: 'Kenyatta University — Film & TV Production',
  certificates: ['Pwani Learn — Cinematography Fundamentals'],
}

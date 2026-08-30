// ─── Pwani Passport — Data Types & Mock Data ──────────────────────────────────

export type VerificationStatus = 'not-started' | 'pending' | 'approved' | 'needs-info' | 'rejected'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type PortfolioType = 'film' | 'series' | 'photography' | 'music' | 'podcast' | 'article' | 'course' | 'award' | 'certificate' | 'other'
export type CreditType = 'film' | 'tv' | 'theatre' | 'music' | 'podcast' | 'commercial' | 'ngo' | 'short'
export type AvailabilityStatus = 'available' | 'freelance' | 'full-time' | 'contract' | 'volunteer' | 'not-available'
export type VisibilityLevel = 'public' | 'followers' | 'organizations' | 'collaborators' | 'private'
export type TimelineCategory = 'education' | 'project' | 'award' | 'certification' | 'employment' | 'workshop' | 'festival' | 'speaking' | 'mentorship'

export interface PassportProfile {
  id: string
  name: string
  username: string
  bio: string
  pronouns?: string
  photo: string
  coverImage: string
  website?: string
  country: string
  city: string
  languages: string[]
  primaryProfession: string
  availability: AvailabilityStatus
  trustScore: number
  completionPct: number
  followers: number
  following: number
  passportId: string
  verificationStatus: VerificationStatus
  verifiedAt?: string
  socialLinks: { platform: string; url: string; icon: string }[]
  joinedAt: string
}

export interface PortfolioItem {
  id: string
  title: string
  type: PortfolioType
  thumbnail: string
  description: string
  role: string
  year: number
  organization?: string
  link?: string
  featured: boolean
  credits?: string[]
  tags: string[]
}

export interface Skill {
  id: string
  name: string
  category: string
  level: SkillLevel
  endorsements: number
  verified: boolean
  relatedProjects: string[]
  certificates: string[]
}

export interface Credit {
  id: string
  title: string
  type: CreditType
  role: string
  organization: string
  year: number
  verified: boolean
  linkedPassports: string[]
  country: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issuedDate: string
  credentialId: string
  verified: boolean
  source: 'pwani-learn' | 'external' | 'manual'
  imageUrl?: string
  skills: string[]
}

export interface Recommendation {
  id: string
  authorName: string
  authorRole: string
  authorAvatar: string
  authorVerified: boolean
  relationship: string
  body: string
  date: string
  hidden: boolean
  skills: string[]
}

export interface TimelineEntry {
  id: string
  category: TimelineCategory
  title: string
  organization: string
  location?: string
  startDate: string
  endDate?: string
  description?: string
  icon: string
  verified: boolean
}

export interface TrustScore {
  total: number
  breakdown: {
    verification: number
    portfolioCompleteness: number
    communityReputation: number
    collaborationRating: number
    projectCompletion: number
    learningProgress: number
    professionalConduct: number
  }
  history: { date: string; score: number }[]
  level: 'starter' | 'rising' | 'established' | 'trusted' | 'elite'
}

export interface ActivityEntry {
  id: string
  type: 'portfolio_added' | 'verification_approved' | 'recommendation_received' | 'certificate_earned' | 'portfolio_updated' | 'skill_endorsed' | 'credit_added' | 'trust_score_up'
  description: string
  time: string
  icon: string
  metadata?: string
}

export interface AICoachSuggestion {
  id: string
  category: 'profile' | 'skills' | 'portfolio' | 'learning' | 'opportunity' | 'collaboration'
  title: string
  description: string
  reason: string
  icon: string
  actionLabel: string
  priority: 'high' | 'medium' | 'low'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PROFILE: PassportProfile = {
  id: 'pp1',
  name: 'Amara Osei-Wusu',
  username: 'amara.creates',
  bio: 'Award-winning filmmaker & visual storyteller from Nairobi. Passionate about amplifying East African narratives on the global stage. Director of Nairobi Nights (2026).',
  pronouns: 'She/Her',
  photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format',
  coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=300&fit=crop&auto=format',
  website: 'https://amaracreates.com',
  country: 'Kenya',
  city: 'Nairobi',
  languages: ['Swahili', 'English', 'French'],
  primaryProfession: 'Film Director & Producer',
  availability: 'freelance',
  trustScore: 87,
  completionPct: 82,
  followers: 18400,
  following: 624,
  passportId: 'PP-KE-2024-0042891',
  verificationStatus: 'approved',
  verifiedAt: 'March 2026',
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/amara.creates', icon: '📸' },
    { platform: 'X / Twitter', url: 'https://twitter.com/amara_creates', icon: '🐦' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/amaraosei', icon: '💼' },
    { platform: 'IMDb', url: 'https://imdb.com/name/nm0000000', icon: '🎬' },
  ],
  joinedAt: 'October 2024',
}

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: 'po1', title: 'Nairobi Nights', type: 'series', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=240&fit=crop', description: 'A gripping crime thriller set in Nairobi\'s underground world. Season 1 premiered on Pwani Play to 248K views.', role: 'Director & Producer', year: 2026, organization: 'Chemichemi Studios', link: 'https://pwaniplay.com/nairobi-nights', featured: true, credits: ['Zara Mutua', 'Juma Kariuki'], tags: ['Drama', 'Thriller', 'Kenya'] },
  { id: 'po2', title: 'Mama Afrika', type: 'film', thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=240&fit=crop', description: 'Documentary celebrating the women who shaped African history across six countries.', role: 'Director', year: 2026, organization: 'Pan-Africa Films', featured: false, tags: ['Documentary', 'Women', 'History'] },
  { id: 'po3', title: 'Sound of Mombasa', type: 'music', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop', description: 'Musical journey through Mombasa\'s rich coastal soundscape — Taarab, Benga, and Genge.', role: 'Director / Music Supervisor', year: 2026, featured: false, tags: ['Music', 'Documentary', 'Coast'] },
  { id: 'po4', title: 'AFIFF Best Short Film', type: 'award', thumbnail: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=400&h=240&fit=crop', description: 'Best Short Film at the Africa International Film Festival 2025.', role: 'Director', year: 2025, organization: 'AFIFF', featured: false, tags: ['Award', 'Short Film'] },
  { id: 'po5', title: 'Studio Masters — Cinematography', type: 'course', thumbnail: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&h=240&fit=crop', description: 'Masterclass on cinematography for African storytellers — 4,200 enrolled on Pwani Learn.', role: 'Course Instructor', year: 2025, organization: 'Pwani Learn', featured: false, tags: ['Education', 'Cinematography'] },
  { id: 'po6', title: 'City Pulse — Photography Series', type: 'photography', thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=240&fit=crop', description: '36-photo series documenting daily life in Nairobi\'s neighborhoods.', role: 'Photographer', year: 2024, featured: false, tags: ['Photography', 'Urban', 'Nairobi'] },
]

export const MOCK_SKILLS: Skill[] = [
  { id: 'sk1', name: 'Film Directing', category: 'Production', level: 'expert', endorsements: 84, verified: true, relatedProjects: ['Nairobi Nights', 'Mama Afrika'], certificates: ['Directing Masterclass – NFVS'] },
  { id: 'sk2', name: 'Producing', category: 'Production', level: 'advanced', endorsements: 62, verified: true, relatedProjects: ['Nairobi Nights'], certificates: [] },
  { id: 'sk3', name: 'Cinematography', category: 'Technical', level: 'advanced', endorsements: 48, verified: true, relatedProjects: ['City Pulse', 'Mama Afrika'], certificates: ['Studio Masters — Cinematography'] },
  { id: 'sk4', name: 'Screenwriting', category: 'Creative', level: 'advanced', endorsements: 36, verified: false, relatedProjects: ['Nairobi Nights'], certificates: [] },
  { id: 'sk5', name: 'Color Grading', category: 'Post-Production', level: 'intermediate', endorsements: 24, verified: false, relatedProjects: ['Nairobi Nights'], certificates: [] },
  { id: 'sk6', name: 'Photography', category: 'Visual Arts', level: 'expert', endorsements: 71, verified: true, relatedProjects: ['City Pulse'], certificates: ['Photography Foundations – Pwani Learn'] },
  { id: 'sk7', name: 'Course Instruction', category: 'Education', level: 'intermediate', endorsements: 18, verified: false, relatedProjects: ['Studio Masters'], certificates: [] },
  { id: 'sk8', name: 'Documentary Filmmaking', category: 'Production', level: 'expert', endorsements: 55, verified: true, relatedProjects: ['Mama Afrika', 'Sound of Mombasa'], certificates: [] },
]

export const MOCK_CREDITS: Credit[] = [
  { id: 'cr1', title: 'Nairobi Nights', type: 'tv', role: 'Creator / Director', organization: 'Pwani Play / Chemichemi Studios', year: 2026, verified: true, linkedPassports: ['Zara Mutua', 'Juma Kariuki'], country: 'Kenya' },
  { id: 'cr2', title: 'Mama Afrika', type: 'film', role: 'Director', organization: 'Pan-Africa Films', year: 2026, verified: true, linkedPassports: [], country: 'Kenya / Tanzania' },
  { id: 'cr3', title: 'Sound of Mombasa', type: 'music', role: 'Director / Music Supervisor', organization: 'Pwani Play', year: 2026, verified: false, linkedPassports: [], country: 'Kenya' },
  { id: 'cr4', title: 'Coastal Dreams', type: 'short', role: 'Director', organization: 'Nairobi Film School', year: 2025, verified: true, linkedPassports: [], country: 'Kenya' },
  { id: 'cr5', title: 'Voices of the Savanna', type: 'ngo', role: 'Cinematographer', organization: 'WildLife Kenya', year: 2024, verified: true, linkedPassports: ['Kofi Mensah'], country: 'Kenya' },
  { id: 'cr6', title: 'The Inheritance', type: 'theatre', role: 'Visual Director', organization: 'Kenya National Theatre', year: 2024, verified: false, linkedPassports: [], country: 'Kenya' },
]

export const MOCK_CERTIFICATES: Certificate[] = [
  { id: 'ce1', title: 'Advanced Film Directing', issuer: 'Pwani Learn', issuedDate: 'June 2026', credentialId: 'PL-DIR-2026-0042', verified: true, source: 'pwani-learn', imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300&h=180&fit=crop', skills: ['Film Directing', 'Storytelling'] },
  { id: 'ce2', title: 'Cinematography Masterclass', issuer: 'Pwani Learn', issuedDate: 'March 2026', credentialId: 'PL-CIN-2026-0088', verified: true, source: 'pwani-learn', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=180&fit=crop', skills: ['Cinematography', 'Color Grading'] },
  { id: 'ce3', title: 'Digital Storytelling for Africa', issuer: 'Africa Media Institute', issuedDate: 'Jan 2026', credentialId: 'AMI-DSA-2026-112', verified: true, source: 'external', skills: ['Screenwriting', 'Storytelling'] },
  { id: 'ce4', title: 'Documentary Filmmaking', issuer: 'Nairobi Film School', issuedDate: 'Sep 2025', credentialId: 'NFS-DOC-2025-0234', verified: true, source: 'manual', imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=180&fit=crop', skills: ['Documentary Filmmaking'] },
  { id: 'ce5', title: 'Photography Foundations', issuer: 'Pwani Learn', issuedDate: 'Jun 2025', credentialId: 'PL-PHO-2025-0067', verified: true, source: 'pwani-learn', skills: ['Photography'] },
]

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 're1', authorName: 'Kofi Mensah', authorRole: 'Award-Winning Cinematographer', authorAvatar: '🎥', authorVerified: true, relationship: 'Collaborator on "Nairobi Nights"', body: 'Amara is one of the most visionary directors I have had the privilege of working with. Her ability to blend authentic African storytelling with cinematic excellence is extraordinary. Nairobi Nights wouldn\'t have been the same without her creative leadership.', date: 'July 2026', hidden: false, skills: ['Film Directing', 'Creative Leadership'] },
  { id: 're2', authorName: 'Dr. Fatima Al-Rashid', authorRole: 'Head of Film Studies, Nairobi University', authorAvatar: '🎓', authorVerified: true, relationship: 'Educator', body: 'As a guest lecturer in our film program, Amara brought real-world expertise that transformed how our students think about African cinema. Her passion for the craft is infectious.', date: 'May 2026', hidden: false, skills: ['Course Instruction', 'Mentorship'] },
  { id: 're3', authorName: 'Zanele Mokoena', authorRole: 'Head of Original Content, Pwani Play', authorAvatar: '📺', authorVerified: true, relationship: 'Professional — Content Partner', body: 'Amara\'s Nairobi Nights broke viewership records for debut content on our platform. She delivers on time, within budget, and with a quality that surpasses expectations every single time.', date: 'August 2026', hidden: false, skills: ['Producing', 'Project Management'] },
]

export const MOCK_TIMELINE: TimelineEntry[] = [
  { id: 'tl1', category: 'project', title: 'Nairobi Nights — Series Premiere', organization: 'Pwani Play', location: 'Nairobi, Kenya', startDate: 'Jul 2026', description: 'Season 1 premiere — 248K views in first month.', icon: '📺', verified: true },
  { id: 'tl2', category: 'award', title: 'AFIFF Best Short Film Award', organization: 'Africa International Film Festival', location: 'Lagos, Nigeria', startDate: 'Oct 2025', description: 'Received for "Coastal Dreams" (2025).', icon: '🏆', verified: true },
  { id: 'tl3', category: 'certification', title: 'Advanced Film Directing', organization: 'Pwani Learn', startDate: 'Jun 2025', icon: '📜', verified: true },
  { id: 'tl4', category: 'employment', title: 'Head of Visual Content', organization: 'Chemichemi Studios', location: 'Nairobi, Kenya', startDate: 'Jan 2024', endDate: 'Present', description: 'Leading all visual production for East Africa\'s premier storytelling studio.', icon: '🎬', verified: true },
  { id: 'tl5', category: 'festival', title: 'Zanzibar Film Festival — Selection', organization: 'ZANIFF', location: 'Zanzibar', startDate: 'Jul 2025', description: '"Coastal Dreams" official selection.', icon: '🎪', verified: false },
  { id: 'tl6', category: 'education', title: 'Bachelor of Film & Media Arts', organization: 'Nairobi Film School', location: 'Nairobi, Kenya', startDate: 'Sep 2018', endDate: 'Jun 2022', description: 'Graduated with First Class Honours.', icon: '🎓', verified: true },
  { id: 'tl7', category: 'speaking', title: 'Keynote: African Cinema Forward', organization: 'Kenya Film Commission', location: 'Nairobi, Kenya', startDate: 'Apr 2026', icon: '🎙️', verified: true },
  { id: 'tl8', category: 'workshop', title: 'Directing Intensive — NFVS', organization: 'Nairobi Film & Video School', startDate: 'Aug 2023', endDate: 'Sep 2023', icon: '🏫', verified: true },
]

export const MOCK_TRUST_SCORE: TrustScore = {
  total: 87,
  breakdown: {
    verification: 95,
    portfolioCompleteness: 82,
    communityReputation: 88,
    collaborationRating: 91,
    projectCompletion: 85,
    learningProgress: 78,
    professionalConduct: 94,
  },
  history: [
    { date: 'Jan', score: 62 },
    { date: 'Feb', score: 65 },
    { date: 'Mar', score: 70 },
    { date: 'Apr', score: 74 },
    { date: 'May', score: 78 },
    { date: 'Jun', score: 82 },
    { date: 'Jul', score: 87 },
  ],
  level: 'trusted',
}

export const MOCK_ACTIVITY: ActivityEntry[] = [
  { id: 'ac1', type: 'recommendation_received', description: 'Zanele Mokoena wrote you a recommendation', time: '2h ago', icon: '⭐', metadata: 'Head of Original Content, Pwani Play' },
  { id: 'ac2', type: 'trust_score_up', description: 'Trust Score increased to 87 (+5 pts)', time: '3h ago', icon: '📈', metadata: 'Verification + new recommendation' },
  { id: 'ac3', type: 'certificate_earned', description: 'Advanced Film Directing certificate imported', time: '1d ago', icon: '📜', metadata: 'Pwani Learn' },
  { id: 'ac4', type: 'skill_endorsed', description: 'Kofi Mensah endorsed Film Directing', time: '2d ago', icon: '👍', metadata: '84 total endorsements' },
  { id: 'ac5', type: 'verification_approved', description: 'Government ID verification approved', time: '5d ago', icon: '✅', metadata: 'ID verified' },
  { id: 'ac6', type: 'portfolio_added', description: '"Sound of Mombasa" added to portfolio', time: '1 week ago', icon: '🎵', metadata: 'Music project' },
  { id: 'ac7', type: 'credit_added', description: 'Nairobi Nights credit verified', time: '2 weeks ago', icon: '🎬', metadata: 'TV Series — Creator/Director' },
]

export const AI_COACH_SUGGESTIONS: AICoachSuggestion[] = [
  { id: 'ai1', category: 'profile', title: 'Add Your Rates & Availability', description: 'Profiles with rates get 3× more collaboration requests. You\'re set to "Freelance" but haven\'t listed a rate range.', reason: 'Based on your 18K followers and verified status', icon: '💰', actionLabel: 'Update Availability', priority: 'high' },
  { id: 'ai2', category: 'portfolio', title: 'Feature "Nairobi Nights" More Prominently', description: 'Your most-viewed project isn\'t featured first. Pinning it could increase profile visits by up to 40%.', reason: 'Analytics show 78% of visitors click the first item', icon: '📌', actionLabel: 'Reorder Portfolio', priority: 'high' },
  { id: 'ai3', category: 'skills', title: 'Add "Visual Development" Skill', description: 'Your portfolio and credits indicate VD skills but it\'s missing from your listed skills.', reason: 'Detected from 3 portfolio items and 2 credits', icon: '🎨', actionLabel: 'Add Skill', priority: 'medium' },
  { id: 'ai4', category: 'learning', title: 'Complete Script-to-Screen Course', description: 'You\'re 68% through the Script-to-Screen Masterclass on Pwani Learn. Completing it would add 8 Trust Score points.', reason: 'In-progress certificate detected from Pwani Learn', icon: '📚', actionLabel: 'Continue Learning', priority: 'medium' },
  { id: 'ai5', category: 'opportunity', title: 'Apply: Sundance Co-Pro Lab', description: 'You match 94% of eligibility criteria for the Sundance 2027 Co-Production Lab for African Filmmakers.', reason: 'Based on your credits, verification, and location', icon: '🌟', actionLabel: 'View Opportunity', priority: 'high' },
  { id: 'ai6', category: 'collaboration', title: 'Connect with Wanjiru Kamau', description: 'A Nairobi-based composer whose style matches your recent projects. 12 mutual connections.', reason: 'Musical aesthetic analysis of "Sound of Mombasa"', icon: '🤝', actionLabel: 'View Profile', priority: 'low' },
]

export const SKILL_LEVEL_COLORS: Record<SkillLevel, { bg: string; text: string; label: string }> = {
  beginner: { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)', label: 'Beginner' },
  intermediate: { bg: 'rgba(41,128,185,0.15)', text: '#5dade2', label: 'Intermediate' },
  advanced: { bg: 'rgba(26,188,156,0.15)', text: '#1abc9c', label: 'Advanced' },
  expert: { bg: 'rgba(243,156,18,0.15)', text: '#f8c471', label: 'Expert' },
}

export const CREDIT_TYPE_LABELS: Record<CreditType, { icon: string; label: string }> = {
  film: { icon: '🎬', label: 'Film' },
  tv: { icon: '📺', label: 'TV / Series' },
  theatre: { icon: '🎭', label: 'Theatre' },
  music: { icon: '🎵', label: 'Music' },
  podcast: { icon: '🎙️', label: 'Podcast' },
  commercial: { icon: '📡', label: 'Commercial' },
  ngo: { icon: '🌍', label: 'NGO / Social' },
  short: { icon: '⚡', label: 'Short Film' },
}

export const AVAILABILITY_OPTIONS: { key: AvailabilityStatus; icon: string; label: string; color: string }[] = [
  { key: 'available', icon: '🟢', label: 'Available for Work', color: '#1abc9c' },
  { key: 'freelance', icon: '🔵', label: 'Freelance / Contract', color: '#2980b9' },
  { key: 'full-time', icon: '🟡', label: 'Open to Full-Time', color: '#f39c12' },
  { key: 'contract', icon: '🟠', label: 'Contract Only', color: '#e67e22' },
  { key: 'volunteer', icon: '🤲', label: 'Volunteer Projects', color: '#9b59b6' },
  { key: 'not-available', icon: '🔴', label: 'Not Available', color: '#e74c3c' },
]

export const TRUST_LEVELS: Record<TrustScore['level'], { icon: string; label: string; color: string; min: number }> = {
  starter: { icon: '🌱', label: 'Starter', color: 'rgba(255,255,255,0.4)', min: 0 },
  rising: { icon: '⭐', label: 'Rising', color: '#5dade2', min: 40 },
  established: { icon: '🌟', label: 'Established', color: '#1abc9c', min: 60 },
  trusted: { icon: '💎', label: 'Trusted', color: '#f8c471', min: 80 },
  elite: { icon: '👑', label: 'Elite', color: '#f39c12', min: 95 },
}

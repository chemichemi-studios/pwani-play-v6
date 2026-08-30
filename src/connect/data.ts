// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'creator' | 'student' | 'educator' | 'freelancer' | 'production_company' | 'ngo' | 'broadcaster' | 'brand' | 'government'
export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'following'
export type PostType = 'update' | 'announcement' | 'behind_scenes' | 'news' | 'opportunity' | 'discussion' | 'milestone'
export type CommunityCategory = 'film' | 'music' | 'podcast' | 'animation' | 'photography' | 'writing' | 'entrepreneurship' | 'education'
export type EventType = 'workshop' | 'festival' | 'screening' | 'networking' | 'training' | 'livestream'
export type OpportunityType = 'casting' | 'job' | 'grant' | 'competition' | 'festival' | 'collaboration'
export type MentorSessionType = 'video_call' | 'voice_call' | 'chat' | 'in_person'

export interface ConnectProfile {
  id: string
  name: string
  username: string
  photo: string
  coverPhoto?: string
  role: UserRole
  profession: string
  headline: string
  city: string
  country: string
  skills: string[]
  verified: boolean
  connectionStatus: ConnectionStatus
  mutualConnections: number
  followerCount: number
  connectionCount: number
  bio: string
  availability: 'available' | 'busy' | 'open_to_work' | 'not_available'
  languages: string[]
  passportVerified: boolean
  reputationScore: number
}

export interface Post {
  id: string
  author: ConnectProfile
  type: PostType
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  liked: boolean
  saved: boolean
  tags: string[]
}

export interface Comment {
  id: string
  author: ConnectProfile
  content: string
  timestamp: string
  likes: number
}

export interface Community {
  id: string
  name: string
  description: string
  category: CommunityCategory
  coverImage: string
  memberCount: number
  postCount: number
  isJoined: boolean
  isPrivate: boolean
  moderators: string[]
  tags: string[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'voice' | 'portfolio' | 'project_link'
  read: boolean
  reactions?: { emoji: string; count: number }[]
}

export interface Conversation {
  id: string
  type: 'direct' | 'group' | 'community'
  participant?: ConnectProfile
  participants?: ConnectProfile[]
  name?: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isPinned: boolean
  isRequest: boolean
  messages: ChatMessage[]
}

export interface ConnectEvent {
  id: string
  title: string
  type: EventType
  organizer: ConnectProfile
  date: string
  time: string
  location: string
  isOnline: boolean
  description: string
  capacity: number
  registered: number
  isRegistered: boolean
  isSaved: boolean
  image: string
  tags: string[]
  price: number | null
}

export interface ProductionTeam {
  id: string
  name: string
  projectTitle: string
  description: string
  coverImage: string
  members: { profile: ConnectProfile; role: string; joinedAt: string }[]
  openRoles: string[]
  status: 'recruiting' | 'active' | 'completed'
  deadline?: string
  tags: string[]
}

export interface Mentor {
  id: string
  profile: ConnectProfile
  expertise: string[]
  sessionTypes: MentorSessionType[]
  rating: number
  reviewCount: number
  sessionRate: number | null
  availableSlots: number
  isSaved: boolean
  languages: string[]
  bio: string
}

export interface Opportunity {
  id: string
  type: OpportunityType
  title: string
  organization: ConnectProfile
  location: string
  isRemote: boolean
  deadline: string
  description: string
  requirements: string[]
  compensation: string | null
  tags: string[]
  isSaved: boolean
  applicantCount: number
  postedAt: string
}

export interface ConnectNotification {
  id: string
  type: 'connection_request' | 'connection_accepted' | 'community_invite' | 'new_message' | 'event_reminder' | 'project_invite' | 'mention' | 'recommendation' | 'new_follower' | 'post_reaction'
  actor: ConnectProfile
  content: string
  timestamp: string
  read: boolean
  actionable: boolean
}

// ─── Mock Profiles ────────────────────────────────────────────────────────────

export const PROFILES: ConnectProfile[] = [
  {
    id: 'p1', name: 'Amara Osei-Wusu', username: 'amara_creates', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&auto=format',
    coverPhoto: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=240&fit=crop&auto=format',
    role: 'creator', profession: 'Cinematographer & Director', headline: 'Telling African stories through light and motion', city: 'Nairobi', country: 'Kenya', verified: true,
    connectionStatus: 'connected', mutualConnections: 12, followerCount: 4280, connectionCount: 340,
    skills: ['Cinematography', 'Directing', 'Color Grading', 'Documentary', 'Short Film'], availability: 'open_to_work',
    languages: ['English', 'Swahili'], passportVerified: true, reputationScore: 94,
    bio: 'Award-winning cinematographer with 8 years capturing East Africa\'s stories. Former ZIFF judge, three-time Pan African Film Festival official selection.'
  },
  {
    id: 'p2', name: 'Fatima Hassan', username: 'fatima_lens', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format',
    coverPhoto: 'https://images.unsplash.com/photo-1536240478700-b869ad10e2c6?w=800&h=240&fit=crop&auto=format',
    role: 'creator', profession: 'Documentary Filmmaker', headline: 'Documenting the untold stories of East Africa', city: 'Dar es Salaam', country: 'Tanzania', verified: true,
    connectionStatus: 'none', mutualConnections: 8, followerCount: 2140, connectionCount: 218,
    skills: ['Documentary', 'Journalism', 'Editing', 'Screenwriting', 'Producing'], availability: 'available',
    languages: ['English', 'Swahili', 'Arabic'], passportVerified: true, reputationScore: 88,
    bio: 'Documentary filmmaker focusing on climate change and community resilience in East Africa.'
  },
  {
    id: 'p3', name: 'Kwame Asante', username: 'kwame_sound', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    coverPhoto: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=240&fit=crop&auto=format',
    role: 'creator', profession: 'Music Producer & Sound Designer', headline: 'Afrobeat meets cinematic score', city: 'Accra', country: 'Ghana', verified: false,
    connectionStatus: 'pending_sent', mutualConnections: 5, followerCount: 8920, connectionCount: 412,
    skills: ['Music Production', 'Sound Design', 'Film Scoring', 'Mixing', 'Mastering'], availability: 'busy',
    languages: ['English', 'Twi', 'French'], passportVerified: false, reputationScore: 82,
    bio: 'Grammy-nominated producer. 200+ film and TV credits across Africa and Europe.'
  },
  {
    id: 'p4', name: 'Zawadi Mwangi', username: 'zawadi_writes', photo: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=120&h=120&fit=crop&auto=format',
    coverPhoto: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=240&fit=crop&auto=format',
    role: 'creator', profession: 'Screenwriter & Story Consultant', headline: 'Authentic African narratives for global screens', city: 'Kampala', country: 'Uganda', verified: true,
    connectionStatus: 'none', mutualConnections: 3, followerCount: 1560, connectionCount: 180,
    skills: ['Screenwriting', 'Story Development', 'Script Editing', 'Pitch Decks', 'Series Bible'], availability: 'available',
    languages: ['English', 'Luganda', 'Swahili'], passportVerified: true, reputationScore: 79,
    bio: 'WGA affiliate. Developed original series for Netflix Africa and Canal+ Afrique.'
  },
  {
    id: 'p5', name: 'Obinna Eze', username: 'obinna_vfx', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    role: 'creator', profession: 'VFX Artist & Motion Designer', headline: 'Building worlds with pixels', city: 'Lagos', country: 'Nigeria', verified: true,
    connectionStatus: 'none', mutualConnections: 7, followerCount: 3400, connectionCount: 290,
    skills: ['VFX', 'Motion Graphics', 'After Effects', 'Nuke', '3D Animation'], availability: 'available',
    languages: ['English', 'Igbo', 'Yoruba'], passportVerified: true, reputationScore: 91,
    bio: 'Lead VFX artist on four Nollywood blockbusters. Building Africa\'s VFX pipeline.'
  },
  {
    id: 'p6', name: 'Aisha Diallo', username: 'aisha_producer', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format',
    role: 'freelancer', profession: 'Executive Producer', headline: 'From concept to cinema — Africa\'s stories matter', city: 'Dakar', country: 'Senegal', verified: true,
    connectionStatus: 'following', mutualConnections: 15, followerCount: 6200, connectionCount: 520,
    skills: ['Producing', 'Financing', 'Distribution', 'Co-production', 'Development'], availability: 'open_to_work',
    languages: ['French', 'English', 'Wolof'], passportVerified: true, reputationScore: 96,
    bio: 'Produced films screened at Cannes, TIFF, and Sundance. FESPACO Golden Stallion winner.'
  },
]

export const ME: ConnectProfile = {
  id: 'me', name: 'Kofi Asante-Williams', username: 'kofi_creates', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&auto=format',
  coverPhoto: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=240&fit=crop&auto=format',
  role: 'creator', profession: 'Director & Content Creator', headline: 'Creating stories that move people', city: 'Nairobi', country: 'Kenya', verified: true,
  connectionStatus: 'connected', mutualConnections: 0, followerCount: 1240, connectionCount: 186,
  skills: ['Directing', 'Producing', 'Editing', 'Storytelling', 'Social Media'], availability: 'available',
  languages: ['English', 'Swahili'], passportVerified: true, reputationScore: 78,
  bio: 'Director and content creator based in Nairobi. Passionate about authentic African storytelling.'
}

// ─── Mock Posts ───────────────────────────────────────────────────────────────

export const POSTS: Post[] = [
  {
    id: 'post1', author: PROFILES[0], type: 'announcement', timestamp: '2h ago', liked: false, saved: false,
    content: '🎬 Thrilled to announce our documentary "Voices of the Rift" has been officially selected for the 2026 Zanzibar International Film Festival! Three years of filming across Kenya and Tanzania — grateful for every collaborator who believed in this story. #ZIFF2026 #EastAfrica',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=680&h=360&fit=crop&auto=format',
    likes: 284, comments: 47, shares: 63, tags: ['ZIFF2026', 'Documentary', 'EastAfrica']
  },
  {
    id: 'post2', author: PROFILES[5], type: 'opportunity', timestamp: '5h ago', liked: true, saved: false,
    content: '📣 Seeking a talented Kenyan/Tanzanian cinematographer for a 10-day production in Zanzibar this September. Feature-length documentary about ocean conservation. Competitive daily rate + full accommodation covered. DM me or apply via Pwani Hub.',
    likes: 98, comments: 31, shares: 45, tags: ['CastingCall', 'Cinematographer', 'Zanzibar'],
  },
  {
    id: 'post3', author: PROFILES[1], type: 'behind_scenes', timestamp: '1d ago', liked: false, saved: true,
    content: '📸 Behind the scenes from our shoot in the Serengeti last week. Three days, one drone, and more wildebeest than we bargained for. The story we found out there is going to change how you think about migration. Thread 🧵',
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=680&h=360&fit=crop&auto=format',
    likes: 412, comments: 58, shares: 89, tags: ['Documentary', 'Serengeti', 'Wildlife']
  },
  {
    id: 'post4', author: PROFILES[2], type: 'milestone', timestamp: '2d ago', liked: true, saved: false,
    content: '🎵 Just hit 1 million streams on the score I composed for "Lagos at Dawn"! When I started this journey composing for African cinema, I never imagined this. Thank you to every director who trusted me with their vision. More to come 🙏',
    likes: 1240, comments: 183, shares: 220, tags: ['FilmScore', 'AfricanCinema', 'Milestone']
  },
  {
    id: 'post5', author: PROFILES[3], type: 'discussion', timestamp: '3d ago', liked: false, saved: false,
    content: '💬 Hot take: African streaming platforms need to stop demanding "globally appealing" stories and start trusting that authentic local narratives ARE globally appealing. Thoughts? (Citing: the success of "Squid Game", "Dark", "Money Heist" — none of which "toned down" their culture)',
    likes: 567, comments: 234, shares: 178, tags: ['AfricanContent', 'StreamingWars', 'Storytelling']
  },
]

// ─── Mock Communities ─────────────────────────────────────────────────────────

export const COMMUNITIES: Community[] = [
  {
    id: 'c1', name: 'Filmmakers Kenya', description: 'The premier community for film professionals working in or with Kenya. Casting calls, industry news, collaborations, and peer support.', category: 'film',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=680&h=200&fit=crop&auto=format',
    memberCount: 4280, postCount: 12400, isJoined: true, isPrivate: false,
    moderators: ['Amara Osei-Wusu', 'Fatima Hassan'], tags: ['Kenya', 'Film', 'Production'], createdAt: '2023-01-15'
  },
  {
    id: 'c2', name: 'Swahili Storytellers', description: 'Celebrating and developing Swahili-language content across East Africa. Writers, directors, and producers welcome.', category: 'writing',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=680&h=200&fit=crop&auto=format',
    memberCount: 1840, postCount: 5200, isJoined: false, isPrivate: false,
    moderators: ['Zawadi Mwangi'], tags: ['Swahili', 'EastAfrica', 'Storytelling'], createdAt: '2023-06-02'
  },
  {
    id: 'c3', name: 'Women in Film Africa', description: 'A safe space for women across Africa in all areas of film and media. Mentorship, opportunities, advocacy, and community.', category: 'film',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=680&h=200&fit=crop&auto=format',
    memberCount: 2960, postCount: 8100, isJoined: true, isPrivate: false,
    moderators: ['Aisha Diallo', 'Fatima Hassan'], tags: ['WomenInFilm', 'Diversity', 'Mentorship'], createdAt: '2022-09-20'
  },
  {
    id: 'c4', name: 'East African Producers', description: 'Executive and line producers collaborating on financing, co-production, distribution, and development across the region.', category: 'film',
    coverImage: 'https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?w=680&h=200&fit=crop&auto=format',
    memberCount: 890, postCount: 3100, isJoined: false, isPrivate: true,
    moderators: ['Aisha Diallo'], tags: ['Producing', 'Financing', 'Distribution'], createdAt: '2023-03-10'
  },
  {
    id: 'c5', name: 'Podcast Creators Hub', description: 'African podcast creators sharing tools, strategies, sponsorship opportunities, and listener growth tips.', category: 'podcast',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=680&h=200&fit=crop&auto=format',
    memberCount: 3120, postCount: 9400, isJoined: false, isPrivate: false,
    moderators: ['Obinna Eze'], tags: ['Podcast', 'Audio', 'Creator'], createdAt: '2023-08-14'
  },
  {
    id: 'c6', name: 'African Animation Alliance', description: 'Animators, motion designers, and 2D/3D artists building Africa\'s animation industry together.', category: 'animation',
    coverImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=680&h=200&fit=crop&auto=format',
    memberCount: 1420, postCount: 4800, isJoined: false, isPrivate: false,
    moderators: ['Obinna Eze'], tags: ['Animation', 'Motion', 'VFX'], createdAt: '2023-11-01'
  },
]

// ─── Mock Conversations ───────────────────────────────────────────────────────

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1', type: 'direct', participant: PROFILES[0], lastMessage: 'Let\'s meet at the festival next week?', lastMessageTime: '2m ago', unreadCount: 2, isPinned: true, isRequest: false,
    messages: [
      { id: 'm1', senderId: 'p1', content: 'Hey! Congratulations on the ZIFF selection 🎉', timestamp: '10:00 AM', type: 'text', read: true },
      { id: 'm2', senderId: 'me', content: 'Thank you so much! It\'s been a long journey.', timestamp: '10:02 AM', type: 'text', read: true },
      { id: 'm3', senderId: 'p1', content: 'Are you attending the festival this year?', timestamp: '10:05 AM', type: 'text', read: true },
      { id: 'm4', senderId: 'me', content: 'Yes, flying in on the 14th. You?', timestamp: '10:07 AM', type: 'text', read: true },
      { id: 'm5', senderId: 'p1', content: 'Perfect! Let\'s meet at the festival next week?', timestamp: '10:08 AM', type: 'text', read: false },
    ]
  },
  {
    id: 'conv2', type: 'group', name: 'Nairobi Cinematographers Collective', participants: [PROFILES[0], PROFILES[1], PROFILES[4]], lastMessage: 'Kwame: Shots look incredible 🔥', lastMessageTime: '45m ago', unreadCount: 5, isPinned: false, isRequest: false,
    messages: [
      { id: 'm6', senderId: 'p1', content: 'Good morning team! Dailies are ready to review.', timestamp: '9:00 AM', type: 'text', read: true },
      { id: 'm7', senderId: 'p5', content: 'On it now — love the lighting in scene 4', timestamp: '9:15 AM', type: 'text', read: true },
      { id: 'm8', senderId: 'p2', content: 'https://pwani.studio/project/ncc2026', timestamp: '9:20 AM', type: 'project_link', read: true },
      { id: 'm9', senderId: 'me', content: 'Shots look incredible 🔥', timestamp: '9:45 AM', type: 'text', read: false },
    ]
  },
  {
    id: 'conv3', type: 'direct', participant: PROFILES[5], lastMessage: 'I\'ll send over the script tonight', lastMessageTime: '3h ago', unreadCount: 0, isPinned: false, isRequest: false,
    messages: [
      { id: 'm10', senderId: 'p6', content: 'Kofi — I wanted to reach out about the Zanzibar project.', timestamp: 'Yesterday', type: 'text', read: true },
      { id: 'm11', senderId: 'me', content: 'Absolutely! What role are you looking to fill?', timestamp: 'Yesterday', type: 'text', read: true },
      { id: 'm12', senderId: 'p6', content: 'Cinematographer, 10 days in September. Daily rate + accommodation.', timestamp: 'Yesterday', type: 'text', read: true },
      { id: 'm13', senderId: 'me', content: 'I\'m very interested. Can you share more details?', timestamp: 'Yesterday', type: 'text', read: true },
      { id: 'm14', senderId: 'p6', content: 'I\'ll send over the script tonight', timestamp: '3h ago', type: 'text', read: true },
    ]
  },
  {
    id: 'conv4', type: 'direct', participant: PROFILES[2], lastMessage: 'Could we collaborate on a score?', lastMessageTime: '1d ago', unreadCount: 1, isPinned: false, isRequest: true,
    messages: [
      { id: 'm15', senderId: 'p3', content: 'Hi Kofi! Huge fan of your work. I\'m Kwame, music producer based in Accra.', timestamp: '1d ago', type: 'text', read: false },
      { id: 'm16', senderId: 'p3', content: 'Could we collaborate on a score?', timestamp: '1d ago', type: 'text', read: false },
    ]
  },
]

// ─── Mock Events ──────────────────────────────────────────────────────────────

export const EVENTS: ConnectEvent[] = [
  {
    id: 'e1', title: 'Zanzibar International Film Festival 2026', type: 'festival',
    organizer: PROFILES[0], date: '2026-09-14', time: '10:00 AM', location: 'Zanzibar, Tanzania',
    isOnline: false, isRegistered: false, isSaved: true,
    description: 'The 20th edition of ZIFF brings together African and international filmmakers for a week of screenings, masterclasses, and pitching sessions. Over 200 films from 60 countries.',
    capacity: 2000, registered: 1840,
    image: 'https://images.unsplash.com/photo-1586861203927-800a5acddfb2?w=680&h=360&fit=crop&auto=format',
    tags: ['Festival', 'Zanzibar', 'Cinema'], price: null
  },
  {
    id: 'e2', title: 'Documentary Filmmaking Masterclass', type: 'workshop',
    organizer: PROFILES[1], date: '2026-08-22', time: '2:00 PM', location: 'Online (Zoom)',
    isOnline: true, isRegistered: true, isSaved: false,
    description: 'A 3-hour intensive workshop covering pre-production, field production, and post-production workflows for documentary filmmakers working in challenging environments.',
    capacity: 100, registered: 78,
    image: 'https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?w=680&h=360&fit=crop&auto=format',
    tags: ['Workshop', 'Documentary', 'Online'], price: 0
  },
  {
    id: 'e3', title: 'African Screen Producers Summit 2026', type: 'networking',
    organizer: PROFILES[5], date: '2026-09-05', time: '9:00 AM', location: 'Kigali, Rwanda',
    isOnline: false, isRegistered: false, isSaved: false,
    description: 'Three-day summit bringing together African producers, distributors, funders, and streaming platforms to discuss co-production frameworks and financing pathways.',
    capacity: 350, registered: 290,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=680&h=360&fit=crop&auto=format',
    tags: ['Summit', 'Producing', 'Networking'], price: 12000
  },
  {
    id: 'e4', title: 'Nairobi Animation Showcase', type: 'screening',
    organizer: PROFILES[4], date: '2026-08-30', time: '6:00 PM', location: 'Nairobi, Kenya',
    isOnline: false, isRegistered: false, isSaved: true,
    description: 'A curated showcase of East Africa\'s best animation work from 2025–2026, followed by a panel discussion and networking reception.',
    capacity: 200, registered: 156,
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=680&h=360&fit=crop&auto=format',
    tags: ['Animation', 'Showcase', 'Nairobi'], price: 500
  },
]

// ─── Mock Production Teams ────────────────────────────────────────────────────

export const PRODUCTION_TEAMS: ProductionTeam[] = [
  {
    id: 'pt1', name: 'Rift Valley Chronicles', projectTitle: 'Rift Valley Chronicles — Feature Documentary',
    description: 'An epic 90-minute documentary exploring life across Kenya\'s Great Rift Valley, from fishers on Lake Turkana to farmers in the Aberdares.',
    coverImage: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=680&h=240&fit=crop&auto=format',
    members: [
      { profile: PROFILES[0], role: 'Director of Photography', joinedAt: '2026-01-15' },
      { profile: PROFILES[1], role: 'Director', joinedAt: '2026-01-10' },
      { profile: ME, role: 'Co-Director', joinedAt: '2026-02-01' },
    ],
    openRoles: ['Sound Recordist', 'Production Coordinator', 'Driver/Fixer (Turkana)'],
    status: 'active', deadline: '2026-11-30',
    tags: ['Documentary', 'Kenya', 'Feature']
  },
  {
    id: 'pt2', name: 'Nairobi Noir', projectTitle: 'Nairobi Noir — Short Film Series',
    description: 'A 5-episode short film series set in Nairobi\'s underground music scene, blending crime thriller elements with authentic city culture.',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=680&h=240&fit=crop&auto=format',
    members: [
      { profile: PROFILES[3], role: 'Screenwriter', joinedAt: '2026-03-01' },
      { profile: PROFILES[2], role: 'Composer', joinedAt: '2026-03-15' },
    ],
    openRoles: ['Director', 'Cinematographer', 'Lead Actor', 'Production Designer'],
    status: 'recruiting', deadline: '2026-09-01',
    tags: ['ShortFilm', 'Nairobi', 'Thriller']
  },
]

// ─── Mock Mentors ─────────────────────────────────────────────────────────────

export const MENTORS: Mentor[] = [
  {
    id: 'men1', profile: PROFILES[5], expertise: ['Film Finance', 'Co-production', 'International Distribution', 'Pitch Development'],
    sessionTypes: ['video_call', 'chat'], rating: 4.9, reviewCount: 47, sessionRate: 3500, availableSlots: 2, isSaved: false,
    languages: ['French', 'English', 'Wolof'],
    bio: 'I help emerging African producers understand the international co-production landscape and secure financing from European and North American partners.'
  },
  {
    id: 'men2', profile: PROFILES[0], expertise: ['Cinematography', 'Camera Department', 'Lighting', 'Color Science'],
    sessionTypes: ['video_call', 'in_person', 'chat'], rating: 4.8, reviewCount: 63, sessionRate: null, availableSlots: 4, isSaved: true,
    languages: ['English', 'Swahili'],
    bio: 'Offering free mentorship sessions to emerging cinematographers from underrepresented backgrounds. Let\'s talk about building a career in African cinema.'
  },
  {
    id: 'men3', profile: PROFILES[1], expertise: ['Documentary', 'Journalism Ethics', 'Storytelling', 'Festival Strategy'],
    sessionTypes: ['video_call', 'chat'], rating: 4.7, reviewCount: 28, sessionRate: 2000, availableSlots: 3, isSaved: false,
    languages: ['English', 'Swahili', 'Arabic'],
    bio: 'Guiding documentary filmmakers through story development, ethical practice, and international festival submissions.'
  },
  {
    id: 'men4', profile: PROFILES[3], expertise: ['Screenwriting', 'Story Structure', 'Pitching', 'Series Development'],
    sessionTypes: ['video_call', 'chat', 'in_person'], rating: 4.6, reviewCount: 35, sessionRate: 1500, availableSlots: 1, isSaved: false,
    languages: ['English', 'Luganda'],
    bio: 'Script development consultant helping African writers break into streaming platforms and international co-productions.'
  },
]

// ─── Mock Opportunities ───────────────────────────────────────────────────────

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp1', type: 'casting', title: 'Cinematographer — Ocean Documentary (September 2026)', organization: PROFILES[5],
    location: 'Zanzibar, Tanzania', isRemote: false, deadline: '2026-08-15',
    description: 'Seeking an experienced cinematographer for a 10-day ocean conservation documentary in Zanzibar. Must have underwater camera experience and own equipment preferred.',
    requirements: ['5+ years cinematography experience', 'Documentary background', 'Own camera equipment preferred', 'Underwater photography experience'],
    compensation: 'KES 8,000/day + accommodation + flights', tags: ['Cinematography', 'Documentary', 'Zanzibar'], isSaved: false, applicantCount: 23, postedAt: '2026-08-06'
  },
  {
    id: 'opp2', type: 'grant', title: 'Docufilm East Africa Development Fund — 2026 Cycle', organization: PROFILES[1],
    location: 'East Africa (Remote OK)', isRemote: true, deadline: '2026-09-30',
    description: 'Grants of USD 10,000–50,000 for documentary films in early development. Priority given to first-time feature directors and stories addressing climate, health, or democracy.',
    requirements: ['East African nationality/residency', 'Documentary project in development', 'Director\'s statement', 'Budget estimate'],
    compensation: 'USD 10,000–50,000', tags: ['Grant', 'Documentary', 'EastAfrica'], isSaved: true, applicantCount: 142, postedAt: '2026-07-20'
  },
  {
    id: 'opp3', type: 'job', title: 'Senior Video Editor — Nairobi Media House', organization: PROFILES[0],
    location: 'Nairobi, Kenya', isRemote: false, deadline: '2026-08-20',
    description: 'A Nairobi-based digital media company seeks a Senior Video Editor with strong storytelling instincts to edit long-form documentary content and branded films.',
    requirements: ['3+ years professional editing', 'Proficiency in Premiere Pro and DaVinci Resolve', 'Showreel required', 'Available to start September 2026'],
    compensation: 'KES 120,000–160,000/month', tags: ['Editor', 'Video', 'Nairobi'], isSaved: false, applicantCount: 67, postedAt: '2026-08-01'
  },
  {
    id: 'opp4', type: 'collaboration', title: 'Seeking Afrobeat Composer for Short Film Score', organization: PROFILES[3],
    location: 'Remote', isRemote: true, deadline: '2026-08-25',
    description: 'Screenwriter with completed short film script (22 min) seeks a composer to create an original Afrobeat-influenced score. Revenue sharing model. Film targeting Sundance 2027.',
    requirements: ['Film scoring experience', 'Afrobeat/contemporary African music background', 'Own recording setup', 'Portfolio required'],
    compensation: 'Revenue share + festival residuals', tags: ['Composer', 'ShortFilm', 'Collaboration'], isSaved: false, applicantCount: 14, postedAt: '2026-08-04'
  },
]

// ─── Mock Notifications ───────────────────────────────────────────────────────

export const CONNECT_NOTIFICATIONS: ConnectNotification[] = [
  { id: 'cn1', type: 'connection_request', actor: PROFILES[2], content: 'Kwame Asante sent you a connection request', timestamp: '1h ago', read: false, actionable: true },
  { id: 'cn2', type: 'connection_accepted', actor: PROFILES[0], content: 'Amara Osei-Wusu accepted your connection request', timestamp: '3h ago', read: false, actionable: false },
  { id: 'cn3', type: 'project_invite', actor: PROFILES[1], content: 'Fatima Hassan invited you to join "Voices of the Rift" production team', timestamp: '5h ago', read: false, actionable: true },
  { id: 'cn4', type: 'community_invite', actor: PROFILES[5], content: 'Aisha Diallo invited you to East African Producers community', timestamp: '1d ago', read: true, actionable: true },
  { id: 'cn5', type: 'post_reaction', actor: PROFILES[3], content: 'Zawadi Mwangi appreciated your post about authentic storytelling', timestamp: '1d ago', read: true, actionable: false },
  { id: 'cn6', type: 'new_follower', actor: PROFILES[4], content: 'Obinna Eze started following you', timestamp: '2d ago', read: true, actionable: false },
  { id: 'cn7', type: 'event_reminder', actor: PROFILES[1], content: 'Documentary Filmmaking Masterclass is tomorrow at 2:00 PM', timestamp: '2d ago', read: true, actionable: false },
  { id: 'cn8', type: 'mention', actor: PROFILES[0], content: 'Amara Osei-Wusu mentioned you in a comment on "Filmmakers Kenya"', timestamp: '3d ago', read: true, actionable: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  creator: 'Creator', student: 'Student', educator: 'Educator', freelancer: 'Freelancer',
  production_company: 'Production Co.', ngo: 'NGO', broadcaster: 'Broadcaster', brand: 'Brand', government: 'Government'
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  workshop: 'Workshop', festival: 'Festival', screening: 'Screening', networking: 'Networking', training: 'Training', livestream: 'Livestream'
}

export const OPP_TYPE_LABELS: Record<OpportunityType, string> = {
  casting: 'Casting Call', job: 'Job', grant: 'Grant', competition: 'Competition', festival: 'Festival', collaboration: 'Collaboration'
}

export const OPP_TYPE_COLORS: Record<OpportunityType, string> = {
  casting: '#e74c3c', job: '#2980b9', grant: '#1abc9c', competition: '#9b59b6', festival: '#f39c12', collaboration: '#e67e22'
}

export const AVAIL_LABELS = { available: 'Available', busy: 'Busy', open_to_work: 'Open to Work', not_available: 'Not Available' }
export const AVAIL_COLORS = { available: '#1abc9c', busy: '#f39c12', open_to_work: '#2980b9', not_available: 'rgba(255,255,255,0.3)' }

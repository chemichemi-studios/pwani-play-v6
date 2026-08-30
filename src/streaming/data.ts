export type ContentItem = {
  id: string
  title: string
  type: 'movie' | 'series' | 'documentary' | 'podcast' | 'short'
  genre: string
  rating: number
  runtime: string
  year: number
  country: string
  language: string
  img: string
  backdrop: string
  synopsis: string
  premium: boolean
  downloadable: boolean
  episodes?: number
  seasons?: number
  cast: string[]
  director: string
  awards?: string[]
  subtitles: string[]
  progress?: number
  coins: number
}

export type Creator = {
  id: string
  name: string
  avatar: string
  role: string
  followers: string
  content: number
  verified: boolean
  bio: string
  banner: string
}

export const CONTENT: ContentItem[] = [
  {
    id: '1',
    title: 'Nairobi Nights',
    type: 'series',
    genre: 'Drama',
    rating: 4.8,
    runtime: '45 min',
    year: 2024,
    country: 'Kenya',
    language: 'Swahili / English',
    img: 'https://images.unsplash.com/photo-1643479669808-3312ff4e1f7f?w=300&h=180&fit=crop&auto=format',
    backdrop: 'https://images.unsplash.com/photo-1643479669808-3312ff4e1f7f?w=800&h=450&fit=crop&auto=format',
    synopsis: 'A gripping crime drama set in the vibrant streets of Nairobi, following three young detectives navigating corruption, loyalty, and justice in East Africa\'s most dynamic city.',
    premium: false,
    downloadable: true,
    episodes: 12,
    seasons: 2,
    cast: ['Aisha Kamau', 'David Ochieng', 'Fatuma Hassan', 'Njoroge Mwangi'],
    director: 'Grace Mutua',
    awards: ['Best African Drama 2024', 'Nairobi Film Festival Winner'],
    subtitles: ['English', 'French', 'Arabic'],
    progress: 0.45,
    coins: 15,
  },
  {
    id: '2',
    title: 'Sound of Mombasa',
    type: 'documentary',
    genre: 'Music',
    rating: 4.7,
    runtime: '1h 22min',
    year: 2024,
    country: 'Kenya',
    language: 'Swahili',
    img: 'https://images.unsplash.com/photo-1685654054911-1f1e99e2e4df?w=300&h=180&fit=crop&auto=format',
    backdrop: 'https://images.unsplash.com/photo-1685654054911-1f1e99e2e4df?w=800&h=450&fit=crop&auto=format',
    synopsis: 'A breathtaking journey through the historic streets of Mombasa, exploring the fusion of Taarab, benga, and contemporary Afrobeat sounds shaping East Africa\'s music revolution.',
    premium: true,
    downloadable: true,
    cast: ['Various Artists'],
    director: 'Omar Salim',
    awards: ['Zanzibar IFF Documentary Award'],
    subtitles: ['English', 'French'],
    coins: 20,
  },
  {
    id: '3',
    title: 'Studio Masters',
    type: 'series',
    genre: 'Reality',
    rating: 4.9,
    runtime: '38 min',
    year: 2025,
    country: 'Tanzania',
    language: 'Swahili / English',
    img: 'https://images.unsplash.com/photo-1627773755683-dfcf2774596a?w=300&h=180&fit=crop&auto=format',
    backdrop: 'https://images.unsplash.com/photo-1627773755683-dfcf2774596a?w=800&h=450&fit=crop&auto=format',
    synopsis: 'Ten aspiring audio engineers compete in East Africa\'s most intensive studio training program, mentored by Grammy-nominated producers.',
    premium: false,
    downloadable: true,
    episodes: 10,
    seasons: 1,
    cast: ['DJ Bongela', 'Amina Yusuf', 'Seun Kuti Jr.'],
    director: 'Zainab Mwamba',
    subtitles: ['English'],
    progress: 0.2,
    coins: 10,
  },
  {
    id: '4',
    title: 'Kilimanjaro',
    type: 'movie',
    genre: 'Adventure',
    rating: 4.6,
    runtime: '2h 04min',
    year: 2024,
    country: 'Tanzania',
    language: 'Swahili',
    img: 'https://images.unsplash.com/photo-1637759898746-283c2d6c24c5?w=300&h=180&fit=crop&auto=format',
    backdrop: 'https://images.unsplash.com/photo-1637759898746-283c2d6c24c5?w=800&h=450&fit=crop&auto=format',
    synopsis: 'A young woman from Arusha embarks on a life-changing journey to summit Africa\'s highest peak, confronting her past and discovering her purpose.',
    premium: true,
    downloadable: false,
    cast: ['Zawadi Juma', 'Petro Msigwa'],
    director: 'Boniface Waweru',
    awards: ['Swahili Cinema Award'],
    subtitles: ['English', 'French', 'Portuguese'],
    coins: 25,
  },
  {
    id: '5',
    title: 'Mama Afrika',
    type: 'series',
    genre: 'Historical Drama',
    rating: 4.9,
    runtime: '52 min',
    year: 2024,
    country: 'South Africa',
    language: 'English / Zulu',
    img: 'https://images.unsplash.com/photo-1782111665987-62d3eabb64c6?w=300&h=180&fit=crop&auto=format',
    backdrop: 'https://images.unsplash.com/photo-1782111665987-62d3eabb64c6?w=800&h=450&fit=crop&auto=format',
    synopsis: 'An epic saga spanning five decades, tracing the lives of four generations of an extraordinary African family through independence, struggle, and triumph.',
    premium: false,
    downloadable: true,
    episodes: 16,
    seasons: 3,
    cast: ['Nandi Mkhize', 'Themba Dlamini', 'Naledi Mokoena'],
    director: 'Sipho Ndlovu',
    awards: ['AMAA Best Series 2024', 'AFRIFF Grand Prize'],
    subtitles: ['English', 'French', 'Arabic', 'Portuguese'],
    coins: 18,
  },
  {
    id: '6',
    title: 'Coastal Beats',
    type: 'podcast',
    genre: 'Music',
    rating: 4.5,
    runtime: '55 min ep.',
    year: 2025,
    country: 'Kenya',
    language: 'English',
    img: 'https://images.unsplash.com/photo-1685654051837-782cdfb8dc0e?w=300&h=180&fit=crop&auto=format',
    backdrop: 'https://images.unsplash.com/photo-1685654051837-782cdfb8dc0e?w=800&h=450&fit=crop&auto=format',
    synopsis: 'Weekly conversations with East Africa\'s most innovative musicians, producers, and cultural entrepreneurs.',
    premium: false,
    downloadable: true,
    episodes: 48,
    cast: ['DJ Coastal', 'Amina B'],
    director: 'Pwani Studios',
    subtitles: ['English'],
    coins: 5,
  },
]

export const CREATORS: Creator[] = [
  { id: 'c1', name: 'Grace Mutua', avatar: '🎬', role: 'Director', followers: '142K', content: 24, verified: true, bio: 'Award-winning filmmaker from Nairobi. Stories that breathe.', banner: 'https://images.unsplash.com/photo-1643479669808-3312ff4e1f7f?w=600&h=200&fit=crop&auto=format' },
  { id: 'c2', name: 'Omar Salim', avatar: '🎵', role: 'Musician & Producer', followers: '89K', content: 56, verified: true, bio: 'Taarab maestro blending tradition with electronic beats from Mombasa.', banner: 'https://images.unsplash.com/photo-1685654054911-1f1e99e2e4df?w=600&h=200&fit=crop&auto=format' },
  { id: 'c3', name: 'Zainab Mwamba', avatar: '📸', role: 'Photographer & Director', followers: '67K', content: 38, verified: false, bio: 'Visual storyteller capturing the unfiltered beauty of East African life.', banner: 'https://images.unsplash.com/photo-1627773755683-dfcf2774596a?w=600&h=200&fit=crop&auto=format' },
  { id: 'c4', name: 'Boniface Waweru', avatar: '🎭', role: 'Actor & Screenwriter', followers: '210K', content: 12, verified: true, bio: 'AMAA-nominated actor and writer. Telling African stories for global audiences.', banner: 'https://images.unsplash.com/photo-1637759898746-283c2d6c24c5?w=600&h=200&fit=crop&auto=format' },
]

export const CATEGORIES = ['All', 'Movies', 'Series', 'Documentaries', 'Podcasts', 'Short Films', 'Live Events', 'Kids']
export const GENRES = ['Drama', 'Comedy', 'Thriller', 'Romance', 'Historical', 'Sci-Fi', 'Horror', 'Adventure', 'Music', 'Sports']
export const LANGUAGES_FILTER = ['All Languages', 'Swahili', 'English', 'French', 'Yoruba', 'Amharic', 'Zulu', 'Hausa', 'Arabic']

export const CHALLENGES = [
  { id: 'ch1', title: 'Daily Watch', desc: 'Watch any content today', coins: 5, icon: '📺', progress: 0, total: 1 },
  { id: 'ch2', title: 'Binge Mode', desc: 'Watch 3 episodes in a row', coins: 20, icon: '🔥', progress: 1, total: 3 },
  { id: 'ch3', title: 'Share & Earn', desc: 'Share a title with a friend', coins: 10, icon: '📤', progress: 0, total: 1 },
  { id: 'ch4', title: 'Daily Check-In', desc: 'Open the app 7 days straight', coins: 50, icon: '📅', progress: 4, total: 7 },
  { id: 'ch5', title: 'Invite a Friend', desc: 'Invite someone who signs up', coins: 100, icon: '👥', progress: 0, total: 1 },
  { id: 'ch6', title: 'Course Complete', desc: 'Finish a Pwani Learn course', coins: 75, icon: '🎓', progress: 0, total: 1 },
]

export const DOWNLOADS = [
  { id: 'd1', title: 'Nairobi Nights', subtitle: 'S2 E3 — The Informant', img: 'https://images.unsplash.com/photo-1643479669808-3312ff4e1f7f?w=120&h=80&fit=crop&auto=format', size: '380 MB', quality: '1080p', status: 'completed', expiry: '14 days left' },
  { id: 'd2', title: 'Studio Masters', subtitle: 'S1 E7 — Final Mix', img: 'https://images.unsplash.com/photo-1627773755683-dfcf2774596a?w=120&h=80&fit=crop&auto=format', size: '210 MB', quality: '720p', status: 'completed', expiry: '21 days left' },
  { id: 'd3', title: 'Sound of Mombasa', subtitle: 'Full Documentary', img: 'https://images.unsplash.com/photo-1685654054911-1f1e99e2e4df?w=120&h=80&fit=crop&auto=format', size: '1.2 GB', quality: '1080p', status: 'downloading', progress: 0.67, expiry: '' },
  { id: 'd4', title: 'Mama Afrika', subtitle: 'S1 E1 — Roots', img: 'https://images.unsplash.com/photo-1782111665987-62d3eabb64c6?w=120&h=80&fit=crop&auto=format', size: '450 MB', quality: '720p', status: 'queued', expiry: '' },
]

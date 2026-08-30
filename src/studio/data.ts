// ─── Pwani Studio — Data Types & Mock Data ───────────────────────────────────

export type ProjectStatus = 'draft' | 'in-review' | 'scheduled' | 'published' | 'archived'
export type ProjectType = 'movie' | 'series' | 'web-series' | 'documentary' | 'podcast' | 'music' | 'short-film' | 'live-event' | 'course'
export type EpisodeStatus = 'draft' | 'uploading' | 'processing' | 'ready' | 'published' | 'scheduled'
export type AssetType = 'video' | 'audio' | 'image' | 'document' | 'subtitle' | 'graphic'
export type CollabRole = 'owner' | 'producer' | 'editor' | 'reviewer' | 'marketing' | 'finance' | 'viewer'

export interface Episode {
  id: string
  title: string
  season: number
  episode: number
  runtime: string
  status: EpisodeStatus
  thumbnail: string
  uploadProgress?: number
  scheduledDate?: string
  views?: number
  downloadable: boolean
  coins: number
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  size: string
  folder: string
  updatedAt: string
  url?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  collabRole: CollabRole
  avatar: string
  verified: boolean
  status: 'active' | 'pending' | 'invited'
}

export interface Project {
  id: string
  title: string
  type: ProjectType
  status: ProjectStatus
  poster: string
  banner: string
  synopsis: string
  genre: string
  language: string
  country: string
  year: number
  rating: number
  ageRating: string
  episodes: Episode[]
  team: TeamMember[]
  assets: Asset[]
  totalViews: number
  totalRevenue: number
  watchHours: number
  createdAt: string
  updatedAt: string
  scheduledDate?: string
  tags: string[]
  trailer?: string
  version: number
}

export interface UploadItem {
  id: string
  filename: string
  type: AssetType
  size: string
  progress: number
  status: 'queued' | 'uploading' | 'processing' | 'complete' | 'error' | 'paused'
  projectId?: string
  error?: string
  eta?: string
}

export interface StudioNotif {
  id: string
  type: 'upload' | 'review' | 'approved' | 'published' | 'revenue' | 'collab' | 'comment' | 'milestone'
  title: string
  body: string
  time: string
  read: boolean
  icon: string
}

export interface AIPrompt {
  id: string
  label: string
  icon: string
  category: 'writing' | 'metadata' | 'social' | 'distribution'
  placeholder: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_EPISODES: Episode[] = [
  { id: 'ep1', title: 'The Beginning', season: 1, episode: 1, runtime: '42m', status: 'published', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=180&fit=crop', views: 12400, downloadable: true, coins: 15, scheduledDate: undefined },
  { id: 'ep2', title: 'Into the Storm', season: 1, episode: 2, runtime: '38m', status: 'published', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=180&fit=crop', views: 9800, downloadable: true, coins: 15 },
  { id: 'ep3', title: 'The Informant', season: 1, episode: 3, runtime: '45m', status: 'scheduled', thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=180&fit=crop', scheduledDate: 'Aug 15, 2026', downloadable: false, coins: 20 },
  { id: 'ep4', title: 'Shadows at Dusk', season: 1, episode: 4, runtime: '41m', status: 'processing', thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=180&fit=crop', uploadProgress: 0.78, downloadable: false, coins: 20 },
  { id: 'ep5', title: 'Point of No Return', season: 1, episode: 5, runtime: '52m', status: 'draft', thumbnail: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&h=180&fit=crop', downloadable: false, coins: 25 },
]

export const MOCK_TEAM: TeamMember[] = [
  { id: 't1', name: 'Amara Osei', role: 'Director', collabRole: 'owner', avatar: '🎬', verified: true, status: 'active' },
  { id: 't2', name: 'Zara Mutua', role: 'Producer', collabRole: 'producer', avatar: '🎭', verified: true, status: 'active' },
  { id: 't3', name: 'Juma Kariuki', role: 'Cinematographer', collabRole: 'editor', avatar: '📷', verified: false, status: 'active' },
  { id: 't4', name: 'Leilah Ndung\'u', role: 'Writer', collabRole: 'reviewer', avatar: '✍️', verified: false, status: 'active' },
  { id: 't5', name: 'Kofi Mensah', role: 'Sound Engineer', collabRole: 'editor', avatar: '🎙️', verified: false, status: 'pending' },
  { id: 't6', name: 'Fatima Diallo', role: 'Marketing Lead', collabRole: 'marketing', avatar: '📣', verified: false, status: 'invited' },
]

export const MOCK_ASSETS: Asset[] = [
  { id: 'a1', name: 'Episode_01_Final.mp4', type: 'video', size: '2.4 GB', folder: 'Videos', updatedAt: 'Today' },
  { id: 'a2', name: 'NairobiNights_Script_v3.pdf', type: 'document', size: '1.2 MB', folder: 'Scripts', updatedAt: 'Yesterday' },
  { id: 'a3', name: 'Main_Theme_Mix.wav', type: 'audio', size: '48 MB', folder: 'Music', updatedAt: '3 days ago' },
  { id: 'a4', name: 'Poster_Approved.png', type: 'image', size: '8.4 MB', folder: 'Images', updatedAt: 'Today' },
  { id: 'a5', name: 'en_subtitles_ep1.srt', type: 'subtitle', size: '28 KB', folder: 'Subtitles', updatedAt: 'Yesterday' },
  { id: 'a6', name: 'ProductionContract_2026.pdf', type: 'document', size: '340 KB', folder: 'Legal Documents', updatedAt: '1 week ago' },
  { id: 'a7', name: 'BTS_Day3_Raw.mp4', type: 'video', size: '1.1 GB', folder: 'Behind the Scenes', updatedAt: '5 days ago' },
  { id: 'a8', name: 'SponsorKit_2026.pptx', type: 'document', size: '22 MB', folder: 'Marketing', updatedAt: '2 days ago' },
]

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Nairobi Nights',
    type: 'series',
    status: 'published',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop',
    synopsis: 'A gripping crime thriller set in Nairobi\'s underground world, following Detective Aisha as she dismantles a syndicate that threatens the city\'s future.',
    genre: 'Crime Thriller',
    language: 'Swahili / English',
    country: 'Kenya',
    year: 2026,
    rating: 4.8,
    ageRating: '16+',
    episodes: MOCK_EPISODES,
    team: MOCK_TEAM,
    assets: MOCK_ASSETS,
    totalViews: 248000,
    totalRevenue: 1840,
    watchHours: 9200,
    createdAt: 'Jan 12, 2026',
    updatedAt: 'Today',
    tags: ['Crime', 'Thriller', 'Kenya', 'Swahili', 'Urban'],
    version: 7,
  },
  {
    id: 'p2',
    title: 'Mama Afrika',
    type: 'documentary',
    status: 'in-review',
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop',
    banner: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&h=400&fit=crop',
    synopsis: 'A sweeping documentary celebrating the mothers, grandmothers, and women who shaped African history and culture across six countries.',
    genre: 'Documentary',
    language: 'Multilingual',
    country: 'Pan-Africa',
    year: 2026,
    rating: 4.9,
    ageRating: 'G',
    episodes: [],
    team: MOCK_TEAM.slice(0, 3),
    assets: MOCK_ASSETS.slice(0, 4),
    totalViews: 0,
    totalRevenue: 0,
    watchHours: 0,
    createdAt: 'Mar 5, 2026',
    updatedAt: '2 days ago',
    tags: ['Documentary', 'Women', 'History', 'Pan-Africa'],
    version: 3,
  },
  {
    id: 'p3',
    title: 'Sound of Mombasa',
    type: 'music',
    status: 'scheduled',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    synopsis: 'A musical journey through Mombasa\'s rich coastal soundscape — Taarab, Benga, Genge, and beyond.',
    genre: 'Music',
    language: 'Swahili',
    country: 'Kenya',
    year: 2026,
    rating: 0,
    ageRating: 'PG',
    episodes: [],
    team: MOCK_TEAM.slice(0, 2),
    assets: MOCK_ASSETS.slice(2, 5),
    totalViews: 0,
    totalRevenue: 0,
    watchHours: 0,
    createdAt: 'Jun 1, 2026',
    updatedAt: 'Yesterday',
    scheduledDate: 'Sep 1, 2026',
    tags: ['Music', 'Mombasa', 'Taarab', 'Coast'],
    version: 2,
  },
  {
    id: 'p4',
    title: 'Studio Masters S2',
    type: 'course',
    status: 'draft',
    poster: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&h=600&fit=crop',
    banner: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&h=400&fit=crop',
    synopsis: 'Season 2 of the acclaimed filmmaking masterclass — advanced production, post-production, and distribution for African creators.',
    genre: 'Education',
    language: 'English',
    country: 'Kenya',
    year: 2026,
    rating: 0,
    ageRating: 'G',
    episodes: MOCK_EPISODES.slice(0, 2),
    team: MOCK_TEAM.slice(0, 4),
    assets: MOCK_ASSETS.slice(0, 3),
    totalViews: 0,
    totalRevenue: 0,
    watchHours: 0,
    createdAt: 'Jul 20, 2026',
    updatedAt: 'Today',
    tags: ['Education', 'Filmmaking', 'Masterclass'],
    version: 1,
  },
]

export const UPLOAD_QUEUE: UploadItem[] = [
  { id: 'u1', filename: 'NairobiNights_S1E4_4K.mp4', type: 'video', size: '8.2 GB', progress: 0.62, status: 'uploading', projectId: 'p1', eta: '14 min' },
  { id: 'u2', filename: 'MamaAfrika_Trailer.mp4', type: 'video', size: '340 MB', progress: 1, status: 'complete', projectId: 'p2' },
  { id: 'u3', filename: 'SoundMombasa_Mix_Final.wav', type: 'audio', size: '210 MB', progress: 0, status: 'queued', projectId: 'p3' },
  { id: 'u4', filename: 'Poster_StudioMasters_S2.png', type: 'image', size: '12 MB', progress: 0.1, status: 'error', projectId: 'p4', error: 'File too large. Max poster size is 10 MB.' },
]

export const STUDIO_NOTIFS: StudioNotif[] = [
  { id: 'n1', type: 'upload', title: 'Upload Complete', body: 'Mama Afrika Trailer is ready for review.', time: '2 min ago', read: false, icon: '✅' },
  { id: 'n2', type: 'revenue', title: 'Revenue Received', body: 'KSH 3,240 deposited to your Pwani Wallet.', time: '1 hr ago', read: false, icon: '💰' },
  { id: 'n3', type: 'collab', title: 'Collaboration Invite', body: 'Kofi Mensah accepted your invite to Nairobi Nights.', time: '3 hr ago', read: false, icon: '🤝' },
  { id: 'n4', type: 'approved', title: 'Episode Approved', body: 'S1E2 "Into the Storm" passed content review.', time: 'Yesterday', read: true, icon: '✅' },
  { id: 'n5', type: 'milestone', title: 'Milestone Reached!', body: 'Nairobi Nights crossed 250K views! 🎉', time: 'Yesterday', read: true, icon: '🏆' },
  { id: 'n6', type: 'comment', title: 'New Comments', body: '48 new comments on Nairobi Nights S1E1.', time: '2 days ago', read: true, icon: '💬' },
]

export const AI_PROMPTS: AIPrompt[] = [
  { id: 'ai1', label: 'Write Synopsis', icon: '📝', category: 'writing', placeholder: 'Describe your project briefly and AI will craft a compelling synopsis...' },
  { id: 'ai2', label: 'Improve Description', icon: '✨', category: 'writing', placeholder: 'Paste your current description and AI will enhance it...' },
  { id: 'ai3', label: 'Suggest Tags', icon: '🏷️', category: 'metadata', placeholder: 'Enter your genre, themes, and AI will suggest optimal tags...' },
  { id: 'ai4', label: 'Generate Subtitles', icon: '💬', category: 'metadata', placeholder: 'AI can generate a subtitle script from your audio track...' },
  { id: 'ai5', label: 'Write Social Captions', icon: '📣', category: 'social', placeholder: 'Describe your content and generate ready-to-post captions for Instagram, X, TikTok...' },
  { id: 'ai6', label: 'Draft Press Release', icon: '📰', category: 'social', placeholder: 'Share your project details and AI will write a press release...' },
  { id: 'ai7', label: 'Best Release Time', icon: '⏰', category: 'distribution', placeholder: 'Enter your audience region and AI will recommend optimal release windows...' },
  { id: 'ai8', label: 'Translate Metadata', icon: '🌍', category: 'distribution', placeholder: 'Select languages for title, synopsis, and tags translation...' },
]

export const ASSET_FOLDERS = ['Scripts', 'Contracts', 'Images', 'Music', 'Graphics', 'Behind the Scenes', 'Marketing', 'Subtitles', 'Legal Documents', 'Videos']

export const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
  draft: { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.15)' },
  'in-review': { bg: 'rgba(243,156,18,0.15)', text: '#f8c471', border: 'rgba(243,156,18,0.3)' },
  scheduled: { bg: 'rgba(41,128,185,0.15)', text: '#5dade2', border: 'rgba(41,128,185,0.3)' },
  published: { bg: 'rgba(26,188,156,0.15)', text: '#1abc9c', border: 'rgba(26,188,156,0.3)' },
  archived: { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.3)', border: 'rgba(255,255,255,0.08)' },
}

export const EPISODE_STATUS_COLORS: Record<EpisodeStatus, { color: string; label: string }> = {
  draft: { color: 'rgba(255,255,255,0.4)', label: 'Draft' },
  uploading: { color: '#5dade2', label: 'Uploading' },
  processing: { color: '#f39c12', label: 'Processing' },
  ready: { color: '#1abc9c', label: 'Ready' },
  published: { color: '#1abc9c', label: 'Published' },
  scheduled: { color: '#2980b9', label: 'Scheduled' },
}

export const TYPE_ICONS: Record<ProjectType, string> = {
  movie: '🎬',
  series: '📺',
  'web-series': '📱',
  documentary: '🎥',
  podcast: '🎙️',
  music: '🎵',
  'short-film': '🎞️',
  'live-event': '🔴',
  course: '📚',
}

export const COLLAB_ROLE_COLORS: Record<CollabRole, string> = {
  owner: '#f39c12',
  producer: '#e74c3c',
  editor: '#2980b9',
  reviewer: '#9b59b6',
  marketing: '#1abc9c',
  finance: '#f8c471',
  viewer: 'rgba(255,255,255,0.4)',
}

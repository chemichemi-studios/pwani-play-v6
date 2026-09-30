import { useState, useEffect, useRef, useCallback } from 'react'
import StudioShell from './studio/StudioShell'
import PassportShell from './passport/PassportShell'
import WalletShell from './wallet/WalletShell'
import ConnectShell from './connect/ConnectShell'
import NotificationsShell from './notifications/NotificationsShell'
import HubShell from './hub/HubShell'
import AIShell from './ai/AIShell'
import HomeTab from './streaming/HomeTab'
import DiscoverTab from './streaming/DiscoverTab'
import DownloadsTab from './streaming/DownloadsTab'
import RewardsTab from './streaming/RewardsTab'
import ProfileTab from './streaming/ProfileTab'
import MovieDetail from './streaming/MovieDetail'
import VideoPlayer from './streaming/VideoPlayer'
import CreatorPage from './streaming/CreatorPage'
import WatchlistScreen from './streaming/WatchlistScreen'
import ViewingHistory from './streaming/ViewingHistory'
import AIRecommendations from './streaming/AIRecommendations'
import OfflineLibrary from './streaming/OfflineLibrary'
import GlobalSearch from './streaming/GlobalSearch'
import ShareSheet from './streaming/components/ShareSheet'
import { ToastProvider, useToast } from './streaming/components/Toast'
import { type ContentItem } from './streaming/data'
import LearnShell from './learn/LearnShell'
import { PlatformProvider, usePlatform } from './platform/store'

// ─── Types ───────────────────────────────────────────────────────────────────
export type Role = 'viewer' | 'creator' | 'organization' | 'student' | 'educator'

type Screen =
  | 'splash'
  | 'welcome'
  | 'language'
  | 'register'
  | 'signin'
  | 'otp'
  | 'forgot'
  | 'password'
  | 'profile'
  | 'role'
  | 'role-onboarding'
  | 'interests'
  | 'permissions'
  | 'onboarding'
  | 'success'
  | 'account-setup'
  | 'locked'
  | 'offline-auth'
  | 'home'
  | 'studio'
  | 'passport'
  | 'wallet'
  | 'connect'
  | 'notifications'
  | 'hub'
  | 'ai'
  | 'learn'

interface AppState {
  screen: Screen
  language: string
  role: Role | null
  interests: string[]
  fromForgot: boolean
  otpPurpose: 'register' | 'signin' | 'forgot'
  name: string
  username: string
  email: string
  bio: string
  city: string
  website: string
  preferredLang: string
  timezone: string
  walletTarget: string
  postSetup: Screen
}

// ─── Constants ───────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'sw', label: 'Kiswahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
]

const ROLES: { id: Role; icon: string; title: string; desc: string; benefits: string[] }[] = [
  { id: 'viewer', icon: '🎬', title: 'Viewer', desc: 'Discover & stream African stories', benefits: ['Unlimited streaming', 'Offline downloads', 'Smart recommendations'] },
  { id: 'creator', icon: '🎥', title: 'Creator', desc: 'Publish, earn, and grow your audience', benefits: ['Creator Studio', 'Revenue sharing', 'Analytics dashboard'] },
  { id: 'organization', icon: '🏢', title: 'Organization', desc: 'Manage teams and distribute content', benefits: ['Team management', 'Enterprise tools', 'Bulk licensing'] },
  { id: 'student', icon: '🎓', title: 'Student', desc: 'Learn from Africa\'s best creators', benefits: ['Pwani Learn access', 'Mentorship programs', 'Student pricing'] },
  { id: 'educator', icon: '📚', title: 'Educator', desc: 'Teach creative skills and techniques', benefits: ['Course creation', 'Student insights', 'Educator badge'] },
]

const INTERESTS = [
  'Movies', 'TV Series', 'Web Series', 'Documentary', 'Music', 'Theatre',
  'Photography', 'Animation', 'Podcasting', 'Screenwriting', 'Directing',
  'Producing', 'Acting', 'Editing', 'Cinematography', 'Sound Design',
  'AI for Creators', 'Creative Business', 'Dance', 'Visual Arts', 'Fashion',
]

const PERMISSIONS = [
  { id: 'notifications', icon: '🔔', title: 'Notifications', desc: 'Stay updated on new content, messages, and opportunities tailored to your interests.' },
  { id: 'camera', icon: '📷', title: 'Camera', desc: 'Capture and upload your creative work directly from your camera.' },
  { id: 'microphone', icon: '🎙️', title: 'Microphone', desc: 'Record voiceovers, podcasts, and audio content in Pwani Studio.' },
  { id: 'photos', icon: '🖼️', title: 'Photo Library', desc: 'Import photos and videos into your portfolio and creative projects.' },
  { id: 'storage', icon: '💾', title: 'Storage', desc: 'Download content for offline viewing when internet is limited.' },
]

const ROLE_DISCIPLINES: Record<Role, { title: string; subtitle: string; options: { icon: string; label: string; desc: string }[] }> = {
  creator: {
    title: 'Your Creative Focus',
    subtitle: "Choose your disciplines — we'll tailor your studio, tools, and community",
    options: [
      { icon: '🎥', label: 'Filmmaking', desc: 'Directing, producing, cinematography' },
      { icon: '📝', label: 'Screenwriting', desc: 'Scripts, stories, narratives' },
      { icon: '🎵', label: 'Music', desc: 'Composition, production, performance' },
      { icon: '📸', label: 'Photography', desc: 'Still images, photo essays' },
      { icon: '🎙️', label: 'Podcasting', desc: 'Audio shows, interviews, storytelling' },
      { icon: '✏️', label: 'Animation', desc: '2D, 3D, motion graphics' },
      { icon: '💃', label: 'Dance & Performance', desc: 'Choreography, theatre, live arts' },
      { icon: '🎨', label: 'Visual Arts', desc: 'Illustration, design, fine arts' },
    ],
  },
  viewer: {
    title: 'What Do You Love?',
    subtitle: "Pick your content preferences — we'll curate a feed just for you",
    options: [
      { icon: '🎬', label: 'Movies', desc: 'Feature films from across Africa' },
      { icon: '📺', label: 'TV Series', desc: 'Long-form episodic storytelling' },
      { icon: '🎵', label: 'Music Videos', desc: 'African artists and performances' },
      { icon: '🎙️', label: 'Podcasts', desc: 'Conversations and audio shows' },
      { icon: '📖', label: 'Documentaries', desc: 'True stories, culture, history' },
      { icon: '🤣', label: 'Comedy', desc: 'Stand-up and sketch comedy' },
      { icon: '🎭', label: 'Theatre', desc: 'Stage plays and live performances' },
      { icon: '👶', label: 'Family & Kids', desc: 'Age-appropriate African content' },
    ],
  },
  organization: {
    title: 'Your Organization Type',
    subtitle: "Help us tailor enterprise tools and licensing for your team",
    options: [
      { icon: '🏢', label: 'Production Studio', desc: 'Film, TV, and digital production' },
      { icon: '🎓', label: 'Educational Institution', desc: 'Schools, colleges, universities' },
      { icon: '📺', label: 'Broadcaster', desc: 'TV channels and media networks' },
      { icon: '🏛️', label: 'Government / Cultural', desc: 'Cultural bodies and ministries' },
      { icon: '🏷️', label: 'Brand / Advertiser', desc: 'Marketing and branded content' },
      { icon: '🤝', label: 'NGO / Non-profit', desc: 'Impact and advocacy storytelling' },
      { icon: '🎪', label: 'Events & Festivals', desc: 'Film festivals and cultural events' },
      { icon: '📦', label: 'Distributor', desc: 'Content aggregation and distribution' },
    ],
  },
  student: {
    title: 'Your Learning Goals',
    subtitle: "Tell us what you want to learn — we'll match you with the right courses and mentors",
    options: [
      { icon: '🎬', label: 'Filmmaking Basics', desc: 'Camera, lighting, storytelling' },
      { icon: '✏️', label: 'Screenwriting', desc: 'Story structure and dialogue' },
      { icon: '🎞️', label: 'Editing & Post', desc: 'Cut, color, audio, finishing' },
      { icon: '💰', label: 'Creative Business', desc: 'Monetize and build a career' },
      { icon: '📸', label: 'Visual Storytelling', desc: 'Composition and visual language' },
      { icon: '🤖', label: 'AI for Creators', desc: 'Use AI in your creative workflow' },
      { icon: '📣', label: 'Marketing & Brand', desc: 'Build an audience and brand' },
      { icon: '🌍', label: 'African Film History', desc: 'Context, movements, pioneers' },
    ],
  },
  educator: {
    title: 'What Will You Teach?',
    subtitle: "Select your teaching areas — we'll set up your course tools and student community",
    options: [
      { icon: '🎥', label: 'Production Techniques', desc: 'Filmmaking and camera craft' },
      { icon: '📝', label: 'Creative Writing', desc: 'Scripts, narratives, storytelling' },
      { icon: '🎵', label: 'Music Production', desc: 'Theory, production, performance' },
      { icon: '🎞️', label: 'Post-Production', desc: 'Editing, VFX, sound design' },
      { icon: '💼', label: 'Industry & Business', desc: 'The business of African film' },
      { icon: '📸', label: 'Photography & Design', desc: 'Visual arts and aesthetics' },
      { icon: '🤖', label: 'AI & Tech for Film', desc: 'Emerging tools in production' },
      { icon: '🌍', label: 'African Aesthetics', desc: 'Culture, identity, and film theory' },
    ],
  },
}

const TIMEZONES = ['UTC+3 Nairobi', 'UTC+1 Lagos', 'UTC+2 Johannesburg', 'UTC+0 Dakar', 'UTC+3 Dar es Salaam', 'UTC+2 Cairo', 'UTC+1 Casablanca', 'UTC-5 New York', 'UTC+1 London', 'UTC+8 Singapore']
const SOCIAL_PLATFORMS = [
  { key: 'instagram', icon: '📷', label: 'Instagram', placeholder: '@handle' },
  { key: 'twitter', icon: '𝕏', label: 'X / Twitter', placeholder: '@handle' },
  { key: 'youtube', icon: '▶', label: 'YouTube', placeholder: 'channel URL' },
  { key: 'tiktok', icon: '♪', label: 'TikTok', placeholder: '@handle' },
  { key: 'linkedin', icon: '🔗', label: 'LinkedIn', placeholder: 'profile URL' },
]

const ONBOARDING_SLIDES = [
  {
    emoji: '🌊',
    title: 'Watch African stories\nanywhere.',
    subtitle: 'Stream thousands of films, series, and documentaries — or download for offline viewing in low-bandwidth zones.',
    tags: ['Streaming', 'Offline downloads', 'Smart recommendations'],
    color: '#1e6091',
  },
  {
    emoji: '🎬',
    title: 'Create and publish\nyour own content.',
    subtitle: 'Pwani Studio gives you professional tools to shoot, edit, publish, and grow your creative career.',
    tags: ['Pwani Studio', 'Creator tools', 'Analytics'],
    color: '#ca6f1e',
  },
  {
    emoji: '🛂',
    title: 'Build your Creative\nPassport.',
    subtitle: 'Your verified creative identity — showcase your portfolio, skills, and trust score across Africa.',
    tags: ['Verified identity', 'Portfolio', 'Trust Score'],
    color: '#0e6655',
  },
  {
    emoji: '🌍',
    title: 'Learn, connect,\nand grow.',
    subtitle: 'Access courses, mentors, and opportunities through Pwani Learn, Connect, and Hub.',
    tags: ['Pwani Learn', 'Pwani Connect', 'Pwani Hub'],
    color: '#6c3483',
  },
  {
    emoji: '💰',
    title: 'Earn from your\ncreativity.',
    subtitle: 'Monetize through your Wallet, Reward Coins, creator earnings, and the Pwani Marketplace.',
    tags: ['Wallet', 'Reward Coins', 'Marketplace'],
    color: '#117a65',
  },
]

// ─── Micro Components ─────────────────────────────────────────────────────────
function PwaniLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #1e6091, #f39c12)',
        borderRadius: size * 0.28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.55, flexShrink: 0,
      }}>🌊</div>
      <span style={{
        fontFamily: 'DM Serif Display, serif',
        fontSize: size * 0.7,
        fontWeight: 400,
        color: 'white',
        letterSpacing: '-0.01em',
      }}>Pwani Play</span>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      width: 44, height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'white', fontSize: 18,
    }}>←</button>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, width: '100%' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i < step ? '#2980b9' : 'rgba(255,255,255,0.15)',
          transition: 'background 0.3s ease',
        }} />
      ))}
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Min 8 chars', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special char', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['#e74c3c', '#e74c3c', '#f39c12', '#f39c12', '#1abc9c', '#1abc9c']
  const labels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="strength-bar" style={{ background: i < score ? colors[score] : undefined }} />
        ))}
      </div>
      {password && <p style={{ fontSize: 12, color: colors[score], margin: '0 0 8px', fontWeight: 600 }}>{labels[score]}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: 11, color: c.ok ? '#1abc9c' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Screens ─────────────────────────────────────────────────────────────────

// Screen 1 — Splash
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0a1628 0%, #103058 50%, #0d2040 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(30,96,145,0.12)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(243,156,18,0.1)', filter: 'blur(40px)' }} />

      <div className="animate-slide-up" style={{ textAlign: 'center', zIndex: 1 }}>
        {/* Logo */}
        <div style={{
          width: 96, height: 96, borderRadius: 28,
          background: 'linear-gradient(135deg, #1e6091, #f39c12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, margin: '0 auto 20px',
          boxShadow: '0 20px 60px rgba(30,96,145,0.4)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>🌊</div>

        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 38, fontWeight: 400, color: 'white',
          margin: '0 0 8px', letterSpacing: '-0.02em',
        }}>Pwani Play</h1>

        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 11, color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          margin: '0 0 48px',
        }}>Africa's Creative Infrastructure Platform</p>

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 60 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#2980b9',
              animation: `wave 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', margin: '0 0 4px' }}>v1.0.0</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace', margin: 0 }}>Powered by Chemichemi Studios</p>
      </div>
    </div>
  )
}

// Screen 2 — Welcome
function WelcomeScreen({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', position: 'relative', overflow: 'hidden' }}>
      {/* Hero image */}
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1782111665987-62d3eabb64c6?w=600&h=700&fit=crop&auto=format"
          alt="Coastal African sunset with boats"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="gradient-hero" style={{ position: 'absolute', inset: 0 }} />
        {/* Creator icons floating */}
        <div style={{ position: 'absolute', top: 48, left: 24 }}>
          <PwaniLogo size={28} />
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 24, display: 'flex', gap: 10 }}>
          {['🎬', '🎵', '📸', '🎙️', '✏️'].map((e, i) => (
            <div key={i} className="glass" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{e}</div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-slide-up" style={{ padding: '32px 24px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 36, fontWeight: 400, color: 'white',
          margin: '0 0 12px', lineHeight: 1.15,
        }}>Welcome to<br />Pwani Play</h1>

        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.6)',
          margin: '0 0 32px', lineHeight: 1.5,
        }}>Stream. Create. Learn. Connect. Earn.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'auto' }}>
          <button className="btn-gold" onClick={onGetStarted}>Get Started</button>
          <button className="btn-secondary" onClick={onSignIn}>Sign In</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Language</a>
        </div>
      </div>
    </div>
  )
}

// Screen 3 — Language
function LanguageScreen({ selected, onSelect, onContinue, onBack }: {
  selected: string; onSelect: (c: string) => void; onContinue: () => void; onBack: () => void
}) {
  const [query, setQuery] = useState('')
  const filtered = LANGUAGES.filter(l => l.label.toLowerCase().includes(query.toLowerCase()) || l.native.toLowerCase().includes(query.toLowerCase()))
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', padding: '56px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }} className="animate-fade-in">
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Choose Language</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Select your preferred language</p>
        </div>
      </div>

      <input
        className="input-field animate-slide-up"
        placeholder="🔍  Search language..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginBottom: 24 }}
      />

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Available Languages</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {filtered.map(lang => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 18px', borderRadius: 14,
              background: selected === lang.code ? 'rgba(41,128,185,0.18)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${selected === lang.code ? '#2980b9' : 'rgba(255,255,255,0.08)'}`,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 28 }}>{lang.flag}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: 'white', fontSize: 16, fontWeight: 600 }}>{lang.native}</p>
              <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{lang.label}</p>
            </div>
            {selected === lang.code && <span style={{ color: '#2980b9', fontSize: 20 }}>✓</span>}
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={onContinue} style={{ marginTop: 32 }}>Continue</button>
    </div>
  )
}

// Shared loading overlay
function LoadingOverlay({ message, sub }: { message: string; sub?: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(41,128,185,0.2)', borderTop: '3px solid #2980b9', animation: 'spin 0.9s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: '0 0 6px', fontFamily: 'DM Serif Display, serif' }}>{message}</p>
        {sub && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>{sub}</p>}
      </div>
    </div>
  )
}

// Screen 4 — Register
function RegisterScreen({ onRegister, onSignIn, onBack }: {
  onRegister: (name: string, email: string) => void; onSignIn: () => void; onBack: () => void
}) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState({ message: 'Creating your account…', sub: 'Setting up your Creative Passport' })

  const handleSocial = (label: string) => {
    setLoadingMsg({ message: `Continuing with ${label}…`, sub: 'Connecting to your account' })
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onRegister(name || `${label} User`, email || `demo+${label.toLowerCase()}@pwaniplay.com`)
    }, 1400)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Full name is required'
    if (!username.trim()) e.username = 'Username is required'
    if (username.length > 2 && username.length < 3) e.username = 'Username must be at least 3 characters'
    if (method === 'email' && !/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (method === 'phone' && !/^\+?[\d\s\-()]{7,}$/.test(email)) e.email = 'Enter a valid phone number'
    if (password.length < 8) e.password = 'Password must be at least 8 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    if (!terms) e.terms = 'Please accept the Terms of Service'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoadingMsg({ message: 'Creating your account…', sub: 'Setting up your Creative Passport' })
    setLoading(true)
    setTimeout(() => { setLoading(false); onRegister(name, email) }, 1600)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', overflowY: 'auto' }}>
      {loading && <LoadingOverlay message={loadingMsg.message} sub={loadingMsg.sub} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Create Account</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Join Africa's creative platform</p>
        </div>
      </div>

      {/* Method toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {(['email', 'phone'] as const).map(m => (
          <button key={m} onClick={() => setMethod(m)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: method === m ? '#1e6091' : 'transparent',
            color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600,
            transition: 'all 0.2s ease',
          }}>{m === 'email' ? '📧 Email' : '📱 Phone'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <input className="input-field" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <p style={{ color: '#e74c3c', fontSize: 12, margin: '4px 0 0' }}>⚠ {errors.name}</p>}
        </div>
        <div>
          <div style={{ position: 'relative' }}>
            <input className="input-field" placeholder="@username" value={username} onChange={e => setUsername(e.target.value)} style={{ paddingRight: 48 }} />
            {username.length > 2 && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#1abc9c', fontSize: 16 }}>✓</span>}
          </div>
          {username.length > 2 && !errors.username && (
            <p style={{ color: '#1abc9c', fontSize: 12, margin: '4px 0 0' }}>✓ @{username} is available</p>
          )}
          {errors.username && <p style={{ color: '#e74c3c', fontSize: 12, margin: '4px 0 0' }}>⚠ {errors.username}</p>}
        </div>
        <div>
          <input className="input-field" placeholder={method === 'email' ? 'Email address' : 'Phone number (+254...)'} value={email} onChange={e => setEmail(e.target.value)} type={method === 'email' ? 'email' : 'tel'} />
          {errors.email && <p style={{ color: '#e74c3c', fontSize: 12, margin: '4px 0 0' }}>⚠ {errors.email}</p>}
        </div>
        <div>
          <div style={{ position: 'relative' }}>
            <input className="input-field" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} style={{ paddingRight: 48 }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</button>
          </div>
          {password && <PasswordStrength password={password} />}
          {errors.password && <p style={{ color: '#e74c3c', fontSize: 12, margin: '4px 0 0' }}>⚠ {errors.password}</p>}
        </div>
        <div>
          <input className="input-field" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} type="password" />
          {errors.confirm && <p style={{ color: '#e74c3c', fontSize: 12, margin: '4px 0 0' }}>⚠ {errors.confirm}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'terms', state: terms, set: setTerms, label: 'I accept the Terms of Service' },
            { key: 'privacy', state: privacy, set: setPrivacy, label: 'I accept the Privacy Policy' },
          ].map(({ key, state, set, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div onClick={() => set(!state)} style={{
                width: 22, height: 22, borderRadius: 6,
                border: `2px solid ${state ? '#2980b9' : 'rgba(255,255,255,0.2)'}`,
                background: state ? '#2980b9' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}>{state && <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>✓</span>}</div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
            </label>
          ))}
          {errors.terms && <p style={{ color: '#e74c3c', fontSize: 12, margin: 0 }}>⚠ {errors.terms}</p>}
        </div>

        <button className="btn-primary" onClick={handleSubmit} style={{ marginTop: 8 }}>Create Account</button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          Already have an account?{' '}
          <button onClick={onSignIn} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Sign In</button>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ icon: 'G', label: 'Google' }, { icon: '🍎', label: 'Apple' }, { icon: 'f', label: 'Facebook' }].map(s => (
            <button key={s.label} className="social-btn" onClick={() => handleSocial(s.label)} style={{ flex: 1, cursor: 'pointer' }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
        {/* Passkey + Magic Link */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { icon: '🔑', label: 'Passkey' },
            { icon: '✉️', label: 'Magic Link' },
          ].map(s => (
            <button key={s.label} className="social-btn" onClick={() => handleSocial(s.label)} style={{ flex: 1, cursor: 'pointer' }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Screen 5 — Sign In
function SignInScreen({ onSignIn, onRegister, onForgot, onBack, onLocked }: {
  onSignIn: () => void; onRegister: () => void; onForgot: () => void; onBack: () => void; onLocked?: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState({ message: 'Signing you in…', sub: 'Restoring your session' })
  const [magicSent, setMagicSent] = useState(false)

  const handleSocial = (label: string) => {
    setLoadingMsg({ message: `Continuing with ${label}…`, sub: 'Verifying your account' })
    setLoading(true)
    setTimeout(() => { setLoading(false); onSignIn() }, 1300)
  }

  const handleMagicLink = () => {
    if (!email) { setError('Enter your email or phone above first'); return }
    setError('')
    setMagicSent(true)
    setLoadingMsg({ message: 'Sending magic link…', sub: `Check ${email} for a sign-in link` })
    setLoading(true)
    setTimeout(() => { setLoading(false); onSignIn() }, 1800)
  }

  const handleSubmit = () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setError('')
    setLoadingMsg({ message: 'Signing you in…', sub: 'Restoring your session' })
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const newAttempts = attempts + 1
      // Demo: wrong password simulation if password is "wrong"
      if (password === 'wrong') {
        setAttempts(newAttempts)
        if (newAttempts >= 3) { onLocked?.(); return }
        setError(`Incorrect password. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining.`)
        return
      }
      onSignIn()
    }, 1400)
  }

  const handleBiometric = () => {
    setShowBiometric(false)
    setLoading(true)
    setTimeout(() => { setLoading(false); onSignIn() }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px' }}>
      {loading && <LoadingOverlay message={loadingMsg.message} sub={loadingMsg.sub} />}

      {/* Biometric bottom sheet */}
      {showBiometric && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowBiometric(false)} />
          <div style={{ position: 'relative', background: '#0d2040', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.1)', padding: '32px 24px 48px', textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 28px' }} />
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔐</div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 8px' }}>Biometric Sign In</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>Use Face ID or fingerprint to sign in instantly — no password needed.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={handleBiometric} style={{ flex: 1 }}>👆 Use Fingerprint</button>
              <button className="btn-secondary" onClick={handleBiometric} style={{ flex: 1 }}>👤 Use Face ID</button>
            </div>
            <button onClick={() => setShowBiometric(false)} style={{ marginTop: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 14 }}>Use password instead</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Sign in to your account</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input className="input-field" placeholder="Email or Phone Number" value={email} onChange={e => { setEmail(e.target.value); setError('') }} />
        <div style={{ position: 'relative' }}>
          <input className="input-field" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} type={showPass ? 'text' : 'password'} style={{ paddingRight: 48 }} />
          <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 10, padding: '10px 14px', color: '#ec7063', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div onClick={() => setRemember(!remember)} style={{
              width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${remember ? '#2980b9' : 'rgba(255,255,255,0.2)'}`,
              background: remember ? '#2980b9' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>{remember && <span style={{ color: 'white', fontSize: 13 }}>✓</span>}</div>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Remember me</span>
          </label>
          <button onClick={onForgot} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Forgot password?</button>
        </div>

        <button className="btn-primary" onClick={handleSubmit}>Sign In</button>

        {/* Biometric CTA */}
        <button
          onClick={() => setShowBiometric(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600 }}
        >
          <span style={{ fontSize: 20 }}>🔐</span> Sign in with Biometrics
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          Don't have an account?{' '}
          <button onClick={onRegister} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Create one</button>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ icon: 'G', label: 'Google' }, { icon: '🍎', label: 'Apple' }, { icon: '🔑', label: 'Passkey' }].map(s => (
            <button key={s.label} className="social-btn" onClick={() => handleSocial(s.label)} style={{ flex: 1, cursor: 'pointer' }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </button>
          ))}
        </div>
        {/* Magic link */}
        <button onClick={handleMagicLink} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px', color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          ✉️ {magicSent ? 'Magic link sent — check your inbox' : 'Send Magic Link — passwordless sign in'}
        </button>
      </div>
    </div>
  )
}

// Screen 6 — OTP
function OTPScreen({ purpose, email, onVerify, onBack, onChangeContact }: {
  purpose: 'register' | 'signin' | 'forgot'
  email?: string
  onVerify: () => void
  onBack: () => void
  onChangeContact?: () => void
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(60)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [loading, setLoading] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    } else {
      setExpired(true)
    }
  }, [countdown])

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...digits]
    next[i] = val.slice(-1)
    setDigits(next)
    setError('')
    if (val && i < 5) refs.current[i + 1]?.focus()
    if (next.every(d => d)) {
      if (next.join('') === '123456') {
        setLoading(true)
        setTimeout(() => { setLoading(false); onVerify() }, 900)
      } else {
        setError('Incorrect code. Use 123456 for demo.')
      }
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handleResend = () => { setExpired(false); setCountdown(60); setDigits(['','','','','','']); setError('') }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px' }}>
      {loading && <LoadingOverlay message="Verifying code…" />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Verify Code</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>
            {purpose === 'register' ? 'Sent to your email/phone' : 'Enter the code we sent you'}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{expired ? '⏰' : '📨'}</div>
        {expired ? (
          <div>
            <p style={{ color: '#ec7063', fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>Code Expired</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 4px' }}>Your verification code has expired.</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>Request a new one below.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.5, margin: 0 }}>
              Enter the 6-digit code sent to<br />
              <strong style={{ color: 'white' }}>{email || 'demo@pwaniplay.com'}</strong>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'DM Mono, monospace', marginTop: 8 }}>Use 123456 for demo</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24, opacity: expired ? 0.4 : 1 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            className="otp-input"
            value={d}
            onChange={e => !expired && handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            disabled={expired}
            style={{ borderColor: expired ? 'rgba(255,255,255,0.1)' : undefined }}
          />
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 10, padding: '10px 14px', color: '#ec7063', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        {!expired && countdown > 0 ? (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Resend in <span style={{ color: '#f39c12', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{countdown}s</span>
          </p>
        ) : (
          <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Resend Code
          </button>
        )}
      </div>

      {/* Change email/phone */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <button
          onClick={onChangeContact ?? onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}
        >
          Change email / phone number
        </button>
      </div>

      {!expired && <button className="btn-primary" onClick={onVerify}>Verify →</button>}
      {expired && <button className="btn-primary" onClick={handleResend}>Request New Code</button>}
    </div>
  )
}

// Screen 7/8 — Password
function PasswordScreen({ title, onDone, onBack }: { title: string; onDone: () => void; onBack: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleDone = () => {
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setError('')
    onDone()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Choose a strong password</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ position: 'relative' }}>
            <input className="input-field" placeholder="New password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} type={showPass ? 'text' : 'password'} style={{ paddingRight: 48 }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</button>
          </div>
          {password && <PasswordStrength password={password} />}
        </div>
        <input className="input-field" placeholder="Confirm password" value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }} type="password" />
        {error && <p style={{ color: '#e74c3c', fontSize: 13, margin: 0 }}>⚠️ {error}</p>}
        <button className="btn-primary" onClick={handleDone} style={{ marginTop: 8 }}>Set Password →</button>
      </div>
    </div>
  )
}

// Screen 9 — Profile Setup
function ProfileScreen({ defaultName, onDone, onBack }: { defaultName: string; onDone: (name: string, username: string) => void; onBack: () => void }) {
  const [name, setName] = useState(defaultName)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [website, setWebsite] = useState('')
  const [timezone, setTimezone] = useState('UTC+3 Nairobi')
  const [preferredLang, setPreferredLang] = useState('en')
  const [portfolio, setPortfolio] = useState('')
  const [socials, setSocials] = useState<Record<string, string>>({})
  const [showSocials, setShowSocials] = useState(false)
  const [hasCover, setHasCover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarColor] = useState(['#1e6091', '#ca6f1e', '#0e6655', '#6c3483'][Math.floor(Math.random() * 4)])

  const fieldsCompleted = [name, username, bio, country, city, website].filter(Boolean).length
  const completionPct = Math.min(100, Math.round((fieldsCompleted / 6) * 60 + (hasCover ? 20 : 0) + (Object.values(socials).some(Boolean) ? 20 : 0)))

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); onDone(name, username) }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', overflowY: 'auto' }}>
      {loading && <LoadingOverlay message="Saving your profile…" sub="Building your Creative Passport" />}

      {/* Cover image area */}
      <div
        style={{ height: 120, background: hasCover ? 'linear-gradient(135deg,#1e6091,#ca6f1e)' : 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setHasCover(true)}
      >
        {hasCover ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '6px 14px', color: 'white', fontSize: 13 }}>📷 Change Cover</span>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>📷 Add Cover Image</p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, margin: '4px 0 0' }}>Recommended: 1500×500px</p>
          </div>
        )}
      </div>

      <div style={{ padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 20 }}>
          <BackButton onClick={onBack} />
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Your Profile</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Let the world know you</p>
          </div>
        </div>
        <ProgressBar step={1} total={5} />

        {/* Completion indicator */}
        <div style={{ margin: '20px 0 24px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Profile Completion</span>
            <span style={{ fontSize: 13, color: completionPct >= 80 ? '#1abc9c' : completionPct >= 40 ? '#f39c12' : '#e74c3c', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{completionPct}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${completionPct}%`, height: '100%', background: completionPct >= 80 ? '#1abc9c' : completionPct >= 40 ? '#f39c12' : '#2980b9', borderRadius: 3, transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '6px 0 0' }}>
            {completionPct < 100 ? `Add ${100 - completionPct}% more to boost discoverability` : '🎉 Profile is complete!'}
          </p>
        </div>

        {/* Avatar picker */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: `linear-gradient(135deg, ${avatarColor}, #2980b9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, border: '4px solid #0a1628', boxShadow: '0 0 0 2px rgba(41,128,185,0.3)' }}>
              {name ? name[0].toUpperCase() : '👤'}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: '#1e6091', border: '3px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>📷</div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '10px 0 0' }}>Tap to upload profile photo</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Required */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 -4px' }}>Required</p>
          <input className="input-field" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
          <div style={{ position: 'relative' }}>
            <input className="input-field" placeholder="@username *" value={username} onChange={e => setUsername(e.target.value)} style={{ paddingRight: 48 }} />
            {username.length > 2 && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#1abc9c', fontSize: 14 }}>✓</span>}
          </div>

          {/* Optional */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 -4px' }}>Optional</p>
          <textarea className="input-field" placeholder="Bio — Tell your creative story..." value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ resize: 'none', fontFamily: 'Outfit, sans-serif' }} />
          <input className="input-field" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
          <input className="input-field" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />

          <div style={{ display: 'flex', gap: 12 }}>
            <select className="input-field" value={preferredLang} onChange={e => setPreferredLang(e.target.value)} style={{ flex: 1, fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: '#0d2040' }}>{l.flag} {l.native}</option>)}
            </select>
            <select className="input-field" value={timezone} onChange={e => setTimezone(e.target.value)} style={{ flex: 1, fontFamily: 'DM Mono, monospace', fontSize: 12, cursor: 'pointer' }}>
              {TIMEZONES.map(tz => <option key={tz} value={tz} style={{ background: '#0d2040' }}>{tz}</option>)}
            </select>
          </div>

          <input className="input-field" placeholder="Website URL" value={website} onChange={e => setWebsite(e.target.value)} type="url" />
          <input className="input-field" placeholder="Portfolio / Showreel link" value={portfolio} onChange={e => setPortfolio(e.target.value)} />

          {/* Social links collapsible */}
          <button
            onClick={() => setShowSocials(!showSocials)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, cursor: 'pointer', color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600 }}
          >
            <span>🔗 Social Links</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }}>{showSocials ? '▾' : '▸'}</span>
          </button>
          {showSocials && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0 8px' }}>
              {SOCIAL_PLATFORMS.map(p => (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{p.icon}</div>
                  <input
                    className="input-field"
                    placeholder={`${p.label} — ${p.placeholder}`}
                    value={socials[p.key] ?? ''}
                    onChange={e => setSocials(prev => ({ ...prev, [p.key]: e.target.value }))}
                    style={{ flex: 1, margin: 0 }}
                  />
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
            Fields marked * are required. Everything else can be added later.
          </p>

          <button className="btn-primary" onClick={handleSave}>Save & Continue →</button>
          <button onClick={() => onDone(name, username)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, padding: '8px 0' }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

// Screen 10 — Role
function RoleScreen({ onSelect, onBack }: { onSelect: (r: Role) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Role | null>(null)
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Choose Your Role</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>You can add more roles later in Settings</p>
        </div>
      </div>
      <ProgressBar step={2} total={5} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28, marginBottom: 24 }}>
        {ROLES.map(role => (
          <div
            key={role.id}
            className={`role-card ${selected === role.id ? 'selected' : ''}`}
            onClick={() => setSelected(role.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{role.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>{role.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', margin: '0 0 10px', fontSize: 13, lineHeight: 1.4 }}>{role.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {role.benefits.map(b => (
                    <span key={b} style={{ fontSize: 11, color: selected === role.id ? '#f8c471' : '#5dade2', background: selected === role.id ? 'rgba(243,156,18,0.15)' : 'rgba(93,173,226,0.12)', padding: '3px 9px', borderRadius: 100, fontWeight: 500 }}>
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected === role.id ? '#f39c12' : 'rgba(255,255,255,0.2)'}`, background: selected === role.id ? '#f39c12' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selected === role.id && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={() => selected && onSelect(selected)} style={{ opacity: selected ? 1 : 0.4 }}>
        Continue →
      </button>
    </div>
  )
}

// Screen 11 — Interests
function InterestsScreen({ selected, onToggle, onDone, onBack }: {
  selected: string[]; onToggle: (i: string) => void; onDone: () => void; onBack: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Your Interests</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Pick at least 3 to personalise your feed</p>
        </div>
      </div>
      <ProgressBar step={3} total={5} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28, marginBottom: 32 }}>
        {INTERESTS.map(interest => (
          <button
            key={interest}
            className={`chip ${selected.includes(interest) ? 'selected' : ''}`}
            onClick={() => onToggle(interest)}
          >
            {interest}
          </button>
        ))}
      </div>

      <div style={{ position: 'sticky', bottom: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{selected.length} selected</span>
          {selected.length >= 3 && <span style={{ fontSize: 13, color: '#1abc9c' }}>✓ Good to go!</span>}
        </div>
        <button className="btn-primary" onClick={onDone} style={{ opacity: selected.length >= 3 ? 1 : 0.4 }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

// Screen 12 — Permissions
function PermissionsScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0)
  const [granted, setGranted] = useState<Record<string, boolean>>({})

  const perm = PERMISSIONS[current]
  const isLast = current === PERMISSIONS.length - 1

  const handleGrant = (allowed: boolean) => {
    setGranted(prev => ({ ...prev, [perm.id]: allowed }))
    if (isLast) onDone()
    else setCurrent(c => c + 1)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Permissions</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>{current + 1} of {PERMISSIONS.length}</p>
        </div>
      </div>
      <ProgressBar step={4} total={5} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0' }}>
        <div className="permission-card animate-fade-in" key={perm.id}>
          <div style={{ fontSize: 64, textAlign: 'center', marginBottom: 24 }}>{perm.icon}</div>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'white', textAlign: 'center', margin: '0 0 12px' }}>{perm.title}</h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 32px' }}>{perm.desc}</p>

          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 32 }}>
            {PERMISSIONS.map((p, i) => (
              <div key={p.id} style={{
                width: i === current ? 24 : 8, height: 8,
                borderRadius: 4,
                background: i < current ? '#1abc9c' : i === current ? '#2980b9' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          <button className="btn-primary" onClick={() => handleGrant(true)} style={{ marginBottom: 12 }}>Allow {perm.title}</button>
          <button className="btn-secondary" onClick={() => handleGrant(false)}>Not Now</button>
        </div>
      </div>
    </div>
  )
}

// Screen 13 — Onboarding carousel
function OnboardingScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [slide, setSlide] = useState(0)
  const s = ONBOARDING_SLIDES[slide]
  const isLast = slide === ONBOARDING_SLIDES.length - 1

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a1628', padding: '56px 24px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`carousel-dot ${i === slide ? 'active' : ''}`} />
          ))}
        </div>
        {!isLast && (
          <button onClick={onDone} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, fontFamily: 'Outfit, sans-serif' }}>
            Skip
          </button>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} key={slide} className="animate-fade-in">
        {/* Illustration area */}
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle at 40% 40%, ${s.color}44, ${s.color}11)`,
          border: `2px solid ${s.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72, marginBottom: 40,
          boxShadow: `0 0 60px ${s.color}30`,
        }}>
          {s.emoji}
        </div>

        <h2 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 32, fontWeight: 400,
          color: 'white', margin: '0 0 16px',
          lineHeight: 1.2, whiteSpace: 'pre-line',
        }}>{s.title}</h2>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 32px', maxWidth: 300 }}>
          {s.subtitle}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {s.tags.map(tag => (
            <span key={tag} style={{
              padding: '6px 14px', borderRadius: 100,
              background: `${s.color}22`, border: `1px solid ${s.color}44`,
              color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        {slide > 0 && (
          <button className="btn-secondary" onClick={() => setSlide(s => s - 1)} style={{ flex: 1 }}>← Back</button>
        )}
        {isLast ? (
          <button className="btn-gold" onClick={onDone} style={{ flex: 1 }}>Get Started 🎉</button>
        ) : (
          <button className="btn-primary" onClick={() => setSlide(s => s + 1)} style={{ flex: 1 }}>Next →</button>
        )}
      </div>
    </div>
  )
}

// Screen 14 — Success
function SuccessScreen({ name, onExplore, onCompletePassport }: { name: string; onExplore: () => void; onCompletePassport: () => void }) {
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#f39c12', '#2980b9', '#1abc9c', '#e74c3c', '#9b59b6', '#ca6f1e'][i % 6],
    shape: ['🎊', '🌟', '✨', '🎉', '🌊', '🎬', '🎵', '🎭'][i % 8],
  }))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a1628 0%, #103058 60%, #0d2040 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflow: 'hidden', position: 'relative', textAlign: 'center' }}>
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${c.x}%`,
          top: '-20px',
          fontSize: 20,
          animation: `confetti-fall ${2 + Math.random()}s ease-in ${c.delay}s infinite`,
        }}>{c.shape}</div>
      ))}

      <div className="animate-slide-up">
        <div style={{ fontSize: 80, marginBottom: 24 }}>🎊</div>
        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 40, fontWeight: 400,
          color: 'white', margin: '0 0 12px',
          lineHeight: 1.1,
        }}>Welcome to<br />Pwani Play!</h1>

        <p style={{ fontSize: 17, color: '#f8c471', fontStyle: 'italic', margin: '0 0 8px', fontFamily: 'DM Serif Display, serif' }}>
          "{name || 'Your'} creative journey starts today."
        </p>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 48px', lineHeight: 1.5 }}>
          Your account is verified and ready. Explore thousands of African stories, connect with creators, and start building your Creative Passport.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
          <button className="btn-gold" onClick={onExplore}>Explore Pwani Play 🌊</button>
          <button className="btn-secondary" onClick={onCompletePassport}>Complete My Passport →</button>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
          {['🎬 Stories', '🎵 Music', '📚 Learn', '💼 Earn'].map(tag => (
            <span key={tag} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Screen — Forgot Password (proper component)
function ForgotPasswordScreen({ onSend, onBack }: { onSend: () => void; onBack: () => void }) {
  const [contact, setContact] = useState('')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!contact.trim()) { setError('Please enter your email or phone number'); return }
    if (method === 'email' && !/\S+@\S+\.\S+/.test(contact)) { setError('Enter a valid email address'); return }
    setError('')
    setLoading(true)
    setTimeout(() => { setLoading(false); onSend() }, 1400)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px' }}>
      {loading && <LoadingOverlay message="Sending reset code…" sub="Check your inbox in a moment" />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Forgot Password</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>We'll send a secure reset code</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(41,128,185,0.15)', border: '2px solid rgba(41,128,185,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>🔑</div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Enter the email or phone number linked to your account and we'll send you a verification code.
        </p>
      </div>

      {/* Method toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
        {(['email', 'phone'] as const).map(m => (
          <button key={m} onClick={() => { setMethod(m); setContact(''); setError('') }} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: method === m ? '#1e6091' : 'transparent',
            color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600,
            transition: 'all 0.2s ease',
          }}>{m === 'email' ? '📧 Email' : '📱 Phone'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <input
            className="input-field"
            placeholder={method === 'email' ? 'Email address' : 'Phone number (+254...)'}
            value={contact}
            onChange={e => { setContact(e.target.value); setError('') }}
            type={method === 'email' ? 'email' : 'tel'}
            autoFocus
          />
          {error && <p style={{ color: '#e74c3c', fontSize: 12, margin: '6px 0 0' }}>⚠ {error}</p>}
        </div>

        <button className="btn-primary" onClick={handleSend}>Send Reset Code →</button>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            🔒 For security, we'll verify your identity before resetting your password. The code expires in 10 minutes.
          </p>
        </div>

        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, padding: '8px 0' }}>
          ← Back to Sign In
        </button>
      </div>
    </div>
  )
}

// Screen — Account Setup Loading (after success, before home)
function AccountSetupScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const steps = [
    { icon: '🎨', label: 'Building your Creative Passport…' },
    { icon: '🤖', label: 'Calibrating AI recommendations…' },
    { icon: '🌍', label: 'Curating African content for you…' },
    { icon: '🌊', label: 'Welcome to Pwani Play!' },
  ]

  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 900)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onDone, 800)
      return () => clearTimeout(t)
    }
  }, [step, onDone])

  const current = steps[step]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0a1628 0%,#103058 60%,#0d2040 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease' }} key={step}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>{current.icon}</div>
        <p style={{ color: 'white', fontSize: 18, fontWeight: 600, margin: '0 0 40px', fontFamily: 'DM Serif Display, serif' }}>{current.label}</p>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? '#2980b9' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

// Screen — Account Locked
function AccountLockedScreen({ onBack, onSupport }: { onBack: () => void; onSupport?: () => void }) {
  const [countdown, setCountdown] = useState(600) // 10-minute lockout

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>🔒</div>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'white', margin: '0 0 12px' }}>Account Temporarily Locked</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 300 }}>
        Too many failed sign-in attempts. For your security, please wait before trying again.
      </p>

      {/* Countdown */}
      {countdown > 0 ? (
        <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: 16, padding: '20px 32px', marginBottom: 32 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Try again in</p>
          <p style={{ color: '#ec7063', fontSize: 36, fontFamily: 'DM Mono, monospace', fontWeight: 700, margin: 0 }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
        </div>
      ) : (
        <div style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 16, padding: '16px 24px', marginBottom: 32 }}>
          <p style={{ color: '#1abc9c', fontSize: 15, fontWeight: 700, margin: 0 }}>✓ You can try again now</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        {countdown === 0 && <button className="btn-primary" onClick={onBack}>Try Sign In Again</button>}
        <button className="btn-secondary" onClick={onBack}>Back to Sign In</button>
        <button onClick={onSupport} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
          Contact Support
        </button>
      </div>

      <div style={{ marginTop: 32, padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, maxWidth: 320, width: '100%' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 8px', fontWeight: 600 }}>Forgot your password?</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 12px' }}>Use account recovery to regain access without waiting.</p>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Reset via email / phone →</button>
      </div>
    </div>
  )
}

// Screen — Offline / No Internet
function OfflineAuthScreen({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  const [checking, setChecking] = useState(false)

  const handleRetry = () => {
    setChecking(true)
    setTimeout(() => { setChecking(false); onRetry() }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {checking && <LoadingOverlay message="Checking connection…" />}
      <div style={{ fontSize: 72, marginBottom: 24 }}>📡</div>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: 'white', margin: '0 0 12px' }}>No Internet Connection</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, margin: '0 0 40px', maxWidth: 300 }}>
        Pwani Play requires an internet connection to sign in. Check your Wi-Fi or mobile data and try again.
      </p>

      <div style={{ width: '100%', maxWidth: 320, marginBottom: 32 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px' }}>
          {[
            { check: '📶', label: 'Check Wi-Fi settings' },
            { check: '📱', label: 'Enable mobile data' },
            { check: '🔄', label: 'Toggle airplane mode off' },
            { check: '🌐', label: 'Try a different network' },
          ].map(tip => (
            <div key={tip.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 18 }}>{tip.check}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>{tip.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <button className="btn-primary" onClick={handleRetry}>Try Again</button>
        <button className="btn-secondary" onClick={onBack}>Go Back</button>
      </div>
    </div>
  )
}

// Screen — Role-Specific Onboarding
function RoleOnboardingScreen({ role, onDone, onBack }: { role: Role | null; onDone: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([])

  const config = role ? ROLE_DISCIPLINES[role] : ROLE_DISCIPLINES.viewer

  const toggle = (label: string) => setSelected(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label])

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', padding: '56px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <BackButton onClick={onBack} />
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>{config.title}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Select up to 4</p>
        </div>
      </div>
      <ProgressBar step={2} total={5} />

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '24px 0 20px', lineHeight: 1.5 }}>{config.subtitle}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {config.options.map(opt => {
          const isSelected = selected.includes(opt.label)
          const isMaxed = selected.length >= 4 && !isSelected
          return (
            <button
              key={opt.label}
              onClick={() => !isMaxed && toggle(opt.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px', borderRadius: 14, textAlign: 'left', cursor: isMaxed ? 'not-allowed' : 'pointer',
                background: isSelected ? 'rgba(41,128,185,0.18)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${isSelected ? '#2980b9' : 'rgba(255,255,255,0.08)'}`,
                opacity: isMaxed ? 0.4 : 1, transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{opt.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>{opt.desc}</p>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${isSelected ? '#2980b9' : 'rgba(255,255,255,0.2)'}`, background: isSelected ? '#2980b9' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSelected && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div className="glass" style={{ flex: 1, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>{selected.length > 0 ? '✓' : '○'}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            {selected.length === 0 ? 'Select your focus areas' : `${selected.length} area${selected.length !== 1 ? 's' : ''} selected`}
          </span>
        </div>
      </div>

      <button className="btn-primary" onClick={onDone} style={{ opacity: selected.length > 0 ? 1 : 0.4 }}>Continue →</button>
      <button onClick={onDone} style={{ display: 'block', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 14, padding: '12px 0', width: '100%', textAlign: 'center' }}>
        Skip this step
      </button>
    </div>
  )
}

// ─── Streaming Home Shell (Prompt 2 + 3) ─────────────────────────────────────
type StreamingView =
  | { type: 'tabs' }
  | { type: 'content'; item: ContentItem }
  | { type: 'player'; item: ContentItem }
  | { type: 'creator'; id: string }
  | { type: 'watchlist' }
  | { type: 'history' }
  | { type: 'ai-recs' }
  | { type: 'offline' }
  | { type: 'search' }
  | { type: 'share'; item: ContentItem }

function StreamingHomeInner({ name, username, role, onOpenStudio, onOpenPassport, onOpenWallet, onOpenConnect, onOpenNotifications, onOpenHub, onOpenAI, onOpenLearn }: { name: string; username: string; role: Role | null; onOpenStudio?: () => void; onOpenPassport?: () => void; onOpenWallet?: (target?: string) => void; onOpenConnect?: () => void; onOpenNotifications?: () => void; onOpenHub?: () => void; onOpenAI?: () => void; onOpenLearn?: () => void }) {
  const [activeTab, setActiveTab] = useState('home')
  const [coinBalance, setCoinBalance] = useState(285)
  const [view, setView] = useState<StreamingView>({ type: 'tabs' })
  const [prevView, setPrevView] = useState<StreamingView>({ type: 'tabs' })
  const toast = useToast()
  const { state: platformState, actions: platformActions } = usePlatform()

  const tabs = [
    { id: 'home',      icon: '🏠', label: 'Home' },
    { id: 'discover',  icon: '🧭', label: 'Discover' },
    { id: 'downloads', icon: '💾', label: 'Downloads' },
    { id: 'rewards',   icon: '🪙', label: 'Rewards' },
    { id: 'profile',   icon: '👤', label: 'Profile' },
  ]

  const push = (v: StreamingView) => {
    setPrevView(view)
    setView(v)
  }

  const back = () => setView(prevView.type === 'tabs' ? { type: 'tabs' } : prevView)

  const handleOpenContent = (item: ContentItem) => push({ type: 'content', item })
  const handlePlay = (item: ContentItem) => {
    platformActions.recordWatch(item.id, 0.05)
    push({ type: 'player', item })
    setTimeout(() => toast.showCoin(item.coins), 3000)
  }
  const handleOpenCreator = (id: string) => push({ type: 'creator', id })
  const handleShare = (item: ContentItem) => push({ type: 'share', item })

  const handleEarnCoins = (n: number) => {
    setCoinBalance(prev => Math.max(0, prev + n))
    if (n > 0) toast.showCoin(n)
  }

  const navTo = (tab: string, specialView?: StreamingView) => {
    if (specialView) {
      push(specialView)
    } else {
      setView({ type: 'tabs' })
      setActiveTab(tab)
    }
  }

  // ── Full-screen overlays (rendered above everything) ──
  if (view.type === 'player') {
    return (
      <VideoPlayer
        item={view.item}
        onClose={() => { setView({ type: 'tabs' }); toast.showCoin(view.item.coins) }}
        onNextEpisode={() => toast.show('Playing next episode', 'info')}
      />
    )
  }

  if (view.type === 'content') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <MovieDetail
          item={view.item}
          onPlay={handlePlay}
          onBack={back}
          onDownload={() => { navTo('downloads'); toast.show('Added to download queue', 'success') }}
          onShare={() => handleShare(view.item)}
          onOpenCreator={handleOpenCreator}
          isSaved={platformState.watchlist.includes(view.item.id)}
          isLiked={platformState.likedContent.includes(view.item.id)}
          onToggleWatchlist={() => platformActions.toggleWatchlist(view.item.id)}
          onToggleLike={() => platformActions.toggleLike(view.item.id)}
        />
      </div>
    )
  }

  if (view.type === 'creator') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <CreatorPage
          creatorId={view.id}
          onBack={back}
          onOpenContent={handleOpenContent}
          onShare={() => toast.show('Share link copied!', 'success')}
          onEarnCoins={handleEarnCoins}
        />
      </div>
    )
  }

  if (view.type === 'watchlist') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <WatchlistScreen
          onBack={back}
          onOpenContent={handleOpenContent}
          onDownload={() => { navTo('downloads'); toast.show('Added to download queue', 'success') }}
          savedIds={platformState.watchlist}
          onRemoveSaved={platformActions.toggleWatchlist}
        />
      </div>
    )
  }

  if (view.type === 'history') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <ViewingHistory onBack={back} onOpenContent={handleOpenContent} />
      </div>
    )
  }

  if (view.type === 'ai-recs') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <AIRecommendations
          onBack={back}
          onOpenContent={handleOpenContent}
          onOpenCreator={handleOpenCreator}
        />
      </div>
    )
  }

  if (view.type === 'offline') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <OfflineLibrary
          onBack={back}
          onPlay={title => { toast.show(`Playing ${title} offline`, 'info') }}
        />
      </div>
    )
  }

  if (view.type === 'search') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }} className="screen-enter">
        <GlobalSearch
          onBack={back}
          onOpenContent={handleOpenContent}
          onOpenCreator={handleOpenCreator}
        />
      </div>
    )
  }

  if (view.type === 'share') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }}>
        {/* Show current tab behind the share sheet */}
        <div style={{ filter: 'blur(2px)', pointerEvents: 'none' }}>
          <HomeTab
            name={name} coinBalance={coinBalance}
            onOpenContent={() => {}} onOpenCreator={() => {}}
            onOpenNotifications={() => {}} onOpenRewards={() => {}}
          />
        </div>
        <ShareSheet
          item={view.item}
          onClose={back}
          onCoinEarned={n => handleEarnCoins(n)}
        />
      </div>
    )
  }

  // ── Main tab shell ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {activeTab === 'home' && (
          <HomeTab
            name={name}
            coinBalance={coinBalance}
            onOpenContent={handleOpenContent}
            onOpenCreator={handleOpenCreator}
            onOpenNotifications={() => push({ type: 'tabs' })}
            onOpenRewards={() => setActiveTab('rewards')}
            onOpenSearch={() => push({ type: 'search' })}
            onOpenAIRecs={() => push({ type: 'ai-recs' })}
            onOpenOffline={() => push({ type: 'offline' })}
          />
        )}
        {activeTab === 'discover' && (
          <DiscoverTab
            onOpenContent={handleOpenContent}
            onOpenCreator={handleOpenCreator}
            onOpenSearch={() => push({ type: 'search' })}
          />
        )}
        {activeTab === 'downloads' && (
          <DownloadsTab onOpenOffline={() => push({ type: 'offline' })} />
        )}
        {activeTab === 'rewards' && (
          <RewardsTab coinBalance={coinBalance} onEarnCoins={handleEarnCoins} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            name={platformState.profile.name || name}
            username={platformState.profile.username || username}
            role={role}
            coinBalance={coinBalance}
            onPremium={() => { toast.show('Opening Premium plans in your Wallet…', 'info'); onOpenWallet?.('subscriptions') }}
            onOpenWatchlist={() => push({ type: 'watchlist' })}
            onOpenHistory={() => push({ type: 'history' })}
            onOpenAIRecs={() => push({ type: 'ai-recs' })}
            onOpenOffline={() => push({ type: 'offline' })}
            onOpenStudio={onOpenStudio}
            onOpenPassport={onOpenPassport}
            onOpenWallet={onOpenWallet}
            onOpenConnect={onOpenConnect}
            onOpenNotifications={onOpenNotifications}
            onOpenHub={onOpenHub}
            onOpenAI={onOpenAI}
            onOpenLearn={onOpenLearn}
          />
        )}
      </div>

      {/* Global AI entry point — accessible from anywhere in the streaming home */}
      {view.type === 'tabs' && onOpenAI && (
        <button
          onClick={onOpenAI}
          title="Ask Pwani AI"
          style={{
            position: 'fixed', right: 16, bottom: 92, maxWidth: 430, zIndex: 25,
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg,#5dade2,#2980b9)',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 6px 20px rgba(41,128,185,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, cursor: 'pointer',
          }}
        >🤖</button>
      )}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 430, margin: '0 auto',
        background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', padding: '8px 0 20px', zIndex: 20,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setView({ type: 'tabs' }) }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? '#2980b9' : 'rgba(255,255,255,0.35)',
              transition: 'color 0.2s ease', padding: '4px 0',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{tab.label}</span>
            {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#2980b9', marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

function StreamingHome({ name, username, role, onOpenStudio, onOpenPassport, onOpenWallet, onOpenConnect, onOpenNotifications, onOpenHub, onOpenAI, onOpenLearn }: { name: string; username: string; role: Role | null; onOpenStudio?: () => void; onOpenPassport?: () => void; onOpenWallet?: (target?: string) => void; onOpenConnect?: () => void; onOpenNotifications?: () => void; onOpenHub?: () => void; onOpenAI?: () => void; onOpenLearn?: () => void }) {
  return (
    <ToastProvider>
      <StreamingHomeInner name={name} username={username} role={role} onOpenStudio={onOpenStudio} onOpenPassport={onOpenPassport} onOpenWallet={onOpenWallet} onOpenConnect={onOpenConnect} onOpenNotifications={onOpenNotifications} onOpenHub={onOpenHub} onOpenAI={onOpenAI} onOpenLearn={onOpenLearn} />
    </ToastProvider>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState<AppState>({
    screen: 'splash',
    language: 'en',
    role: null,
    interests: [],
    fromForgot: false,
    otpPurpose: 'register',
    name: '',
    username: '',
    email: '',
    bio: '',
    city: '',
    website: '',
    preferredLang: 'en',
    timezone: 'UTC+3 Nairobi',
    walletTarget: '',
    postSetup: 'home',
  })

  const go = useCallback((screen: Screen, extra?: Partial<AppState>) => {
    setState(prev => ({ ...prev, screen, ...extra }))
  }, [])

  const toggleInterest = (i: string) => {
    setState(prev => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter(x => x !== i)
        : [...prev.interests, i],
    }))
  }

  const { screen, language, role, interests, otpPurpose, name } = state

  return (
    <PlatformProvider>
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#0a1628' }}>
      {screen === 'splash' && <SplashScreen onDone={() => go('welcome')} />}
      {screen === 'welcome' && <WelcomeScreen onGetStarted={() => go('language')} onSignIn={() => go('signin')} />}
      {screen === 'language' && <LanguageScreen selected={language} onSelect={l => setState(p => ({ ...p, language: l }))} onContinue={() => go('register')} onBack={() => go('welcome')} />}
      {screen === 'register' && <RegisterScreen onRegister={(n, e) => go('otp', { otpPurpose: 'register', name: n, email: e })} onSignIn={() => go('signin')} onBack={() => go('language')} />}
      {screen === 'signin' && (
        <SignInScreen
          onSignIn={() => go('otp', { otpPurpose: 'signin' })}
          onRegister={() => go('register')}
          onForgot={() => go('forgot')}
          onBack={() => go('welcome')}
          onLocked={() => go('locked')}
        />
      )}
      {screen === 'otp' && (
        <OTPScreen
          purpose={otpPurpose}
          email={state.email}
          onVerify={() => {
            if (otpPurpose === 'forgot') go('password')
            else if (otpPurpose === 'signin') go('account-setup')
            else go('password')
          }}
          onBack={() => go(otpPurpose === 'register' ? 'register' : otpPurpose === 'forgot' ? 'forgot' : 'signin')}
          onChangeContact={() => go(otpPurpose === 'register' ? 'register' : 'signin')}
        />
      )}
      {screen === 'forgot' && <ForgotPasswordScreen onSend={() => go('otp', { otpPurpose: 'forgot' })} onBack={() => go('signin')} />}
      {screen === 'password' && <PasswordScreen title={otpPurpose === 'forgot' ? 'New Password' : 'Create Password'} onDone={() => go(otpPurpose === 'forgot' ? 'signin' : 'profile')} onBack={() => go('otp')} />}
      {screen === 'profile' && <ProfileScreen defaultName={name} onDone={(n, u) => go('role', { name: n, username: u })} onBack={() => go('password')} />}
      {screen === 'role' && <RoleScreen onSelect={r => go('role-onboarding', { role: r })} onBack={() => go('profile')} />}
      {screen === 'role-onboarding' && <RoleOnboardingScreen role={role} onDone={() => go('interests')} onBack={() => go('role')} />}
      {screen === 'interests' && <InterestsScreen selected={interests} onToggle={toggleInterest} onDone={() => go('permissions')} onBack={() => go('role-onboarding')} />}
      {screen === 'permissions' && <PermissionsScreen onDone={() => go('onboarding')} onBack={() => go('interests')} />}
      {screen === 'onboarding' && <OnboardingScreen onDone={() => go('success')} onBack={() => go('permissions')} />}
      {screen === 'success' && <SuccessScreen name={name} onExplore={() => go('account-setup', { postSetup: 'home' })} onCompletePassport={() => go('account-setup', { postSetup: 'passport' })} />}
      {screen === 'account-setup' && <AccountSetupScreen onDone={() => go(state.postSetup)} />}
      {screen === 'locked' && <AccountLockedScreen onBack={() => go('signin')} onSupport={() => go('signin')} />}
      {screen === 'offline-auth' && <OfflineAuthScreen onRetry={() => go('signin')} onBack={() => go('welcome')} />}
      {screen === 'home' && <StreamingHome name={name} username={state.username} role={role} onOpenStudio={() => go('studio')} onOpenPassport={() => go('passport')} onOpenWallet={(target) => go('wallet', { walletTarget: target || '' })} onOpenConnect={() => go('connect')} onOpenNotifications={() => go('notifications')} onOpenHub={() => go('hub')} onOpenAI={() => go('ai')} onOpenLearn={() => go('learn')} />}
      {screen === 'studio' && <StudioShell userName={name || 'Creator'} onExit={() => go('home')} />}
      {screen === 'passport' && <PassportShell onExit={() => go('home')} />}
      {screen === 'wallet' && <WalletShell onExit={() => go('home', { walletTarget: '' })} initialScreen={(state.walletTarget || 'root') as any} />}
      {screen === 'connect' && <ConnectShell onExit={() => go('home')} />}
      {screen === 'notifications' && <NotificationsShell onExit={() => go('home')} />}
      {screen === 'hub' && <HubShell onExit={() => go('home')} />}
      {screen === 'ai' && <AIShell onExit={() => go('home')} />}
      {screen === 'learn' && <LearnShell onExit={() => go('home')} />}
    </div>
    </PlatformProvider>
  )
}

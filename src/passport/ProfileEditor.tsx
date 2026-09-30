import { useState } from 'react'
import { MOCK_PROFILE } from './data'
import { usePlatform } from '../platform/store'

type Props = { onBack: () => void; onSaved: () => void }

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: '@username' },
  { key: 'twitter', label: 'X / Twitter', icon: '🐦', placeholder: '@username' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'linkedin.com/in/...' },
  { key: 'imdb', label: 'IMDb', icon: '🎬', placeholder: 'imdb.com/name/...' },
  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: '@channel' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: '@username' },
]

const PRONOUNS_OPTIONS = ['He/Him', 'She/Her', 'They/Them', 'He/They', 'She/They', 'Ze/Zir', 'Prefer not to say']
const PROFESSION_OPTIONS = [
  'Film Director', 'Film Producer', 'Screenwriter', 'Cinematographer', 'Film Editor',
  'Sound Designer', 'Actor / Actress', 'Musician / Composer', 'Photographer',
  'Graphic Designer', 'Journalist', 'Educator / Trainer', 'Podcaster', 'Animator',
]

export default function ProfileEditor({ onBack, onSaved }: Props) {
  const p = MOCK_PROFILE
  const { state: platformState, actions: platformActions } = usePlatform()
  const [name, setName] = useState(platformState.profile.name || p.name)
  const [username, setUsername] = useState(platformState.profile.username || p.username)
  const [bio, setBio] = useState(platformState.profile.bio || p.bio)
  const [pronouns, setPronouns] = useState(p.pronouns ?? '')
  const [website, setWebsite] = useState(p.website ?? '')
  const [profession, setProfession] = useState(p.primaryProfession)
  const [city, setCity] = useState(p.city)
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    instagram: '@amara.creates',
    twitter: '@amara_creates',
    linkedin: 'linkedin.com/in/amaraosei',
    imdb: 'imdb.com/name/nm0000000',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSocials, setShowSocials] = useState(false)

  const save = () => {
    setSaving(true)
    platformActions.setProfile({ name, username, bio })
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(onSaved, 800) }, 1200)
  }

  if (saved) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: 'fadeIn 0.4s ease' }}>✅</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 10px' }}>Profile Updated!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>Your Passport looks great.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Edit Profile</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Auto-saved as you type</p>
          </div>
          <button onClick={save} disabled={saving} style={{ padding: '9px 20px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* Photo + Cover */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Profile Media</p>
          <div style={{ position: 'relative', height: 120, borderRadius: 14, overflow: 'hidden', marginBottom: 12, cursor: 'pointer' }}>
            <img src={p.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: 100 }}>📷 Change Cover</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <img src={p.photo} alt={p.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)', display: 'block', background: '#103058' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>✏️</span>
              </div>
            </div>
            <div>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>Profile Photo</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>JPG or PNG, min 400×400</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Basic Info</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 5, fontFamily: 'DM Mono, monospace' }}>FULL NAME</label>
              <input className="input-field" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 5, fontFamily: 'DM Mono, monospace' }}>USERNAME</label>
              <input className="input-field" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: 0 }} />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 5, fontFamily: 'DM Mono, monospace' }}>PRIMARY PROFESSION</label>
            <select value={profession} onChange={e => setProfession(e.target.value)} className="input-field" style={{ marginBottom: 0 }}>
              {PROFESSION_OPTIONS.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 5, fontFamily: 'DM Mono, monospace' }}>CITY</label>
              <input className="input-field" value={city} onChange={e => setCity(e.target.value)} style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 5, fontFamily: 'DM Mono, monospace' }}>PRONOUNS</label>
              <select value={pronouns} onChange={e => setPronouns(e.target.value)} className="input-field" style={{ marginBottom: 0 }}>
                <option value="">Not specified</option>
                {PRONOUNS_OPTIONS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BIO</label>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{bio.length}/300</span>
          </div>
          <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300} rows={5} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 14px', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
        </div>

        {/* Website */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>WEBSITE</label>
          <input className="input-field" type="url" placeholder="https://" value={website} onChange={e => setWebsite(e.target.value)} style={{ marginBottom: 0 }} />
        </div>

        {/* Social links */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>SOCIAL LINKS</p>
            <button onClick={() => setShowSocials(!showSocials)} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{showSocials ? 'Collapse ▲' : 'Expand ▼'}</button>
          </div>
          {showSocials && SOCIAL_PLATFORMS.map(sp => (
            <div key={sp.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{sp.icon}</span>
              <input
                className="input-field"
                placeholder={sp.placeholder}
                value={socialLinks[sp.key] ?? ''}
                onChange={e => setSocialLinks(prev => ({ ...prev, [sp.key]: e.target.value }))}
                style={{ flex: 1, marginBottom: 0 }}
              />
            </div>
          ))}
          {!showSocials && (
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
              {Object.values(socialLinks).filter(Boolean).length} links connected
            </p>
          )}
        </div>

        {/* Visibility note */}
        <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 14, padding: '12px 16px' }}>
          <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>ℹ️ Privacy Note</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>Contact details and social links can be hidden from public view in Passport Settings → Privacy.</p>
        </div>
      </div>
    </div>
  )
}

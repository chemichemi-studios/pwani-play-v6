import { useState } from 'react'

type Props = {
  name: string
  onOpenCommunity: () => void
  onOpenAnalytics: () => void
}

const ACHIEVEMENTS = [
  { icon: '🎬', label: 'First Upload', earned: true },
  { icon: '🚀', label: '1K Views', earned: true },
  { icon: '💎', label: '10K Views', earned: true },
  { icon: '🏆', label: '100K Views', earned: false },
  { icon: '⭐', label: 'Featured', earned: true },
  { icon: '🌍', label: 'Global Reach', earned: false },
]

export default function StudioProfileTab({ name, onOpenCommunity, onOpenAnalytics }: Props) {
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState('East African filmmaker & storyteller. Bringing untold stories to the world through the lens of authentic African experience.')

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Banner + avatar */}
      <div style={{ position: 'relative', height: 140 }}>
        <div style={{ height: '100%', background: 'linear-gradient(135deg,#0e3460,#1e6091,#0e6655)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 60, opacity: 0.15 }}>🎬</div>
        </div>
        <div style={{ position: 'absolute', bottom: -30, left: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: '3px solid #0a1628' }}>🎬</div>
        </div>
      </div>

      <div style={{ padding: '38px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 2px' }}>{name}</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.25)', color: '#5dade2', fontWeight: 700 }}>✓ VERIFIED CREATOR</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.2)', color: '#f8c471', fontWeight: 700 }}>🏆 ARTISAN</span>
            </div>
          </div>
          <button onClick={() => setEditingBio(!editingBio)} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>Edit Profile</button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
          {[
            { label: 'Projects', value: '4' },
            { label: 'Followers', value: '18.4K' },
            { label: 'Views', value: '248K' },
            { label: 'Revenue', value: 'KSH 1.8K' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 20 }}>
          {editingBio ? (
            <div>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(41,128,185,0.3)', borderRadius: 12, padding: '12px', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setEditingBio(false)} className="btn-primary" style={{ flex: 1, padding: '10px' }}>Save Bio</button>
                <button onClick={() => setEditingBio(false)} style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{bio}</p>
          )}
        </div>

        {/* Achievements */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, margin: '0 0 12px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Achievements</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 10px', background: a.earned ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${a.earned ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 12, opacity: a.earned ? 1 : 0.4, minWidth: 64, flex: 1 }}>
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[
            { icon: '👥', label: 'Community & Followers', sub: '18.4K followers · 5 unread comments', action: onOpenCommunity },
            { icon: '📊', label: 'Full Analytics', sub: 'Views, revenue, retention', action: onOpenAnalytics },
          ].map(({ icon, label, sub, action }) => (
            <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{sub}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

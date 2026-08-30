import { useState } from 'react'
import { PROFILES, ME, AVAIL_COLORS, AVAIL_LABELS, ROLE_LABELS } from './data'
import type { ConnectProfile } from './data'

type Props = {
  profileId: string
  onBack: () => void
  onMessage: (userId: string) => void
  onInviteToProject: (userId: string) => void
}

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=140&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&h=140&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1536240478700-b869ad10e2c6?w=200&h=140&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=140&fit=crop&auto=format',
]

export default function ProfilePreview({ profileId, onBack, onMessage, onInviteToProject }: Props) {
  const profile = profileId === 'me' ? ME : (PROFILES.find(p => p.id === profileId) ?? PROFILES[0])
  const [connStatus, setConnStatus] = useState(profile.connectionStatus)
  const [following, setFollowing] = useState(connStatus === 'following')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }

  const handleConnect = () => {
    if (connStatus === 'none') { setConnStatus('pending_sent'); showToast('Connection request sent!') }
    else if (connStatus === 'pending_sent') { setConnStatus('none'); showToast('Request withdrawn') }
    else if (connStatus === 'pending_received') { setConnStatus('connected'); showToast('Connection accepted! 🎉') }
  }

  const availColor = AVAIL_COLORS[profile.availability as keyof typeof AVAIL_COLORS]
  const availLabel = AVAIL_LABELS[profile.availability as keyof typeof AVAIL_LABELS]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>{toast}</div>}

      {/* Cover + header */}
      <div style={{ position: 'relative' }}>
        <img src={profile.coverPhoto || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=200&fit=crop&auto=format'} alt="Cover" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.7))' }} />
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 14, width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}>
          <button style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>🔗</button>
          <button style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>···</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        {/* Avatar + name */}
        <div style={{ padding: '0 16px', marginTop: -40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <img src={profile.photo} alt={profile.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #0a1628' }} />
              {profile.verified && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 700 }}>✓</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: `${availColor}18`, color: availColor, border: `1px solid ${availColor}30`, fontWeight: 700 }}>● {availLabel}</span>
            </div>
          </div>

          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: '0 0 3px' }}>{profile.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 2px' }}>{profile.profession}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 4px' }}>{profile.headline}</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 10px' }}>📍 {profile.city}, {profile.country} · {ROLE_LABELS[profile.role]}</p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Connections', value: profile.connectionCount.toLocaleString() },
              { label: 'Followers', value: profile.followerCount.toLocaleString() },
              { label: 'Reputation', value: `${profile.reputationScore}%` },
            ].map(s => (
              <div key={s.label}>
                <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 1px', fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{s.label}</p>
              </div>
            ))}
            {profile.mutualConnections > 0 && (
              <div>
                <p style={{ color: '#5dade2', fontSize: 16, fontWeight: 700, margin: '0 0 1px', fontFamily: 'DM Mono, monospace' }}>{profile.mutualConnections}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>Mutual</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {profile.id !== 'me' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={handleConnect} style={{ flex: 1, padding: '11px', borderRadius: 12, border: connStatus === 'connected' ? '1px solid rgba(26,188,156,0.3)' : 'none', background: connStatus === 'connected' ? 'rgba(26,188,156,0.08)' : connStatus === 'pending_sent' ? 'rgba(255,255,255,0.08)' : 'linear-gradient(90deg,#1e6091,#2980b9)', color: connStatus === 'connected' ? '#1abc9c' : 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {connStatus === 'connected' ? '✓ Connected' : connStatus === 'pending_sent' ? '⏳ Pending' : connStatus === 'pending_received' ? 'Accept' : '+ Connect'}
              </button>
              <button onClick={() => onMessage(profile.id)} style={{ flex: 1, padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>💬 Message</button>
              <button onClick={() => setFollowing(!following)} style={{ width: 44, height: 44, borderRadius: 12, background: following ? 'rgba(26,188,156,0.08)' : 'rgba(255,255,255,0.06)', border: `1px solid ${following ? 'rgba(26,188,156,0.2)' : 'rgba(255,255,255,0.1)'}`, color: following ? '#1abc9c' : 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{following ? '🔔' : '🔕'}</button>
            </div>
          )}

          {/* More actions */}
          {profile.id !== 'me' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={() => onInviteToProject(profile.id)} style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🎬 Invite to Project</button>
              <button style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔗 Share Profile</button>
            </div>
          )}

          {/* Bio */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>About</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{profile.bio}</p>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.skills.map(s => (
                <span key={s} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Languages</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.languages.map(l => <span key={l} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{l}</span>)}
            </div>
          </div>

          {/* Portfolio highlights */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Portfolio Highlights</p>
              <button style={{ color: '#5dade2', fontSize: 12, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {PORTFOLIO_IMAGES.map((img, i) => (
                <div key={i} style={{ flexShrink: 0, width: 110, height: 80, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                  <img src={img} alt="Portfolio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.2)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Passport verified badge */}
          {profile.passportVerified && (
            <div style={{ padding: '12px 14px', background: 'rgba(26,188,156,0.06)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 14, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>🪪</span>
              <div>
                <p style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>Pwani Passport Verified</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Identity and credentials verified by Pwani</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

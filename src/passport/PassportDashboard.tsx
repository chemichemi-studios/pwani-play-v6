import { useState } from 'react'
import { MOCK_PROFILE, MOCK_PORTFOLIO, MOCK_TRUST_SCORE, TRUST_LEVELS, AVAILABILITY_OPTIONS } from './data'

type Props = {
  onEdit: () => void
  onVerify: () => void
  onShare: () => void
  onDownloadCV: () => void
  onOpenPortfolio: () => void
  onOpenReputation: () => void
  onOpenItem: (id: string) => void
}

const COMPLETION_TIPS = [
  'Add your availability status',
  'Upload a cover image',
  'Add 2 more portfolio items',
  'Request your first recommendation',
]

export default function PassportDashboard({ onEdit, onVerify, onShare, onDownloadCV, onOpenPortfolio, onOpenReputation, onOpenItem }: Props) {
  const p = MOCK_PROFILE
  const ts = MOCK_TRUST_SCORE
  const featured = MOCK_PORTFOLIO.filter(i => i.featured)
  const tl = TRUST_LEVELS[ts.level]
  const av = AVAILABILITY_OPTIONS.find(a => a.key === p.availability)
  const [showQR, setShowQR] = useState(false)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
      {/* Cover image */}
      <div style={{ position: 'relative', height: 180 }}>
        <img src={p.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1628 0%, rgba(10,22,40,0.3) 60%, transparent 100%)' }} />
        <button onClick={onShare} style={{ position: 'absolute', top: 52, right: 16, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '7px 14px', color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 600, backdropFilter: 'blur(8px)', fontFamily: 'Outfit, sans-serif' }}>
          Share Passport
        </button>
        <button onClick={() => setShowQR(true)} style={{ position: 'absolute', top: 52, right: 142, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '7px 12px', color: 'white', fontSize: 14, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          ⬛
        </button>
      </div>

      {/* Profile header */}
      <div style={{ padding: '0 20px', marginTop: -50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <img src={p.photo} alt={p.name} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #0a1628', display: 'block', background: '#103058' }} />
            {p.verificationStatus === 'approved' && (
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onEdit} style={{ padding: '9px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Edit</button>
            <button onClick={onDownloadCV} style={{ padding: '9px 16px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>CV ↓</button>
          </div>
        </div>

        {/* Name + badges */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: 0 }}>{p.name}</h1>
            {p.verificationStatus === 'approved' && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.2)', border: '1px solid rgba(41,128,185,0.35)', color: '#5dade2', fontWeight: 700 }}>✓ VERIFIED</span>}
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${tl.color}22`, border: `1px solid ${tl.color}44`, color: tl.color, fontWeight: 700 }}>{tl.icon} {tl.label.toUpperCase()}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>@{p.username} {p.pronouns ? `· ${p.pronouns}` : ''}</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 6px' }}>{p.primaryProfession}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>🌍 {p.city}, {p.country}</span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>🗣 {p.languages.join(' · ')}</span>
          </div>
        </div>

        {/* Availability chip */}
        {av && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: `${av.color}18`, border: `1px solid ${av.color}44`, marginBottom: 14 }}>
            <span style={{ fontSize: 11 }}>{av.icon}</span>
            <span style={{ color: av.color, fontSize: 12, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{av.label}</span>
          </div>
        )}

        {/* Bio */}
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{p.bio}</p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { label: 'Followers', value: (p.followers / 1000).toFixed(1) + 'K' },
            { label: 'Following', value: p.following.toString() },
            { label: 'Projects', value: MOCK_PORTFOLIO.length.toString() },
            { label: 'Credits', value: '6' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <p style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Trust Score */}
        <div onClick={onOpenReputation} style={{ background: 'linear-gradient(135deg,rgba(243,156,18,0.12),rgba(41,128,185,0.08))', border: '1px solid rgba(243,156,18,0.2)', borderRadius: 16, padding: '14px 16px', marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 2px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trust Score</p>
              <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#f8c471', margin: 0, lineHeight: 1 }}>{ts.total}<span style={{ fontSize: 14, color: 'rgba(248,196,113,0.6)' }}>/100</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 24 }}>{tl.icon}</span>
              <p style={{ color: tl.color, fontSize: 12, fontWeight: 700, margin: '4px 0 0' }}>{tl.label}</p>
            </div>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${ts.total}%`, height: '100%', background: 'linear-gradient(90deg,#f39c12,#f8c471)', borderRadius: 3, transition: 'width 0.8s ease' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '6px 0 0' }}>↗ View score breakdown →</p>
        </div>

        {/* Profile completion */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>Profile Completion</p>
            <span style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{p.completionPct}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 10 }}>
            <div style={{ width: `${p.completionPct}%`, height: '100%', background: 'linear-gradient(90deg,#1e6091,#1abc9c)', borderRadius: 3 }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 8px' }}>Tip: {COMPLETION_TIPS[0]}</p>
          <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Complete profile →</button>
        </div>

        {/* Passport ID */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#1e6091,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🪪</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>PASSPORT ID</p>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}>{p.passportId}</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
        </div>

        {/* Verification status */}
        {p.verificationStatus !== 'approved' && (
          <div onClick={onVerify} style={{ background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.2)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#f8c471', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Identity Not Verified</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>Verify your identity to unlock full Trust Score and Passport features.</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
          </div>
        )}

        {/* Featured project */}
        {featured.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Featured Project</p>
              <button onClick={onOpenPortfolio} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>All Projects →</button>
            </div>
            {featured.map(item => (
              <div key={item.id} onClick={() => onOpenItem(item.id)} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#103058' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 12 }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: 'rgba(243,156,18,0.2)', border: '1px solid rgba(243,156,18,0.4)', color: '#f8c471', fontWeight: 700, backdropFilter: 'blur(4px)' }}>⭐ Featured</span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
                  <p style={{ color: 'white', fontSize: 16, fontFamily: 'DM Serif Display, serif', margin: '0 0 3px' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>{item.role} · {item.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[
            { icon: '✏️', label: 'Edit Profile', action: onEdit },
            { icon: '🛡️', label: 'Verify Identity', action: onVerify },
            { icon: '📄', label: 'Download Resume', action: onDownloadCV },
            { icon: '🔗', label: 'Share Passport', action: onShare },
          ].map(a => (
            <button key={a.label} onClick={a.action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Social links */}
        {p.socialLinks.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Online Presence</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.socialLinks.map(s => (
                <div key={s.platform} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100 }}>
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600 }}>{s.platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowQR(false)}>
          <div style={{ background: '#0d2040', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 320, animation: 'slideUp 0.25s ease' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: '0 0 4px', textAlign: 'center' }}>Scan Passport</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px', textAlign: 'center' }}>{p.passportId}</p>
            <div style={{ width: 200, height: 200, margin: '0 auto 20px', background: 'white', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>⬛</div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', margin: '0 0 16px', fontFamily: 'DM Mono, monospace' }}>pwaniplay.com/p/{p.username}</p>
            <button onClick={() => setShowQR(false)} style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

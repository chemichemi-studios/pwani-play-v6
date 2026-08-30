import { useState } from 'react'
import { MOCK_PROFILE, MOCK_TRUST_SCORE, TRUST_LEVELS } from './data'

type Props = { onBack: () => void }

export default function PassportShare({ onBack }: Props) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const tl = TRUST_LEVELS[MOCK_TRUST_SCORE.level]
  const passportUrl = `pwani.africa/passport/${MOCK_PROFILE.username}`

  const copyLink = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Share Passport</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Share your verified creative identity</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>
        {/* Passport card preview */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#0a1628 60%,#1a2840 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 20, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(243,156,18,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(41,128,185,0.08)' }} />

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16, position: 'relative' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#1abc9c)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={MOCK_PROFILE.photo} alt={MOCK_PROFILE.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ color: 'white', fontSize: 18, fontFamily: 'DM Serif Display, serif', margin: '0 0 3px' }}>{MOCK_PROFILE.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>{MOCK_PROFILE.primaryProfession}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '2px 0 0', fontFamily: 'DM Mono, monospace' }}>@{MOCK_PROFILE.username} · {MOCK_PROFILE.city}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.15)', borderRadius: 12, position: 'relative' }}>
            <span style={{ fontSize: 20 }}>{tl.icon}</span>
            <div>
              <p style={{ color: '#f8c471', fontSize: 13, fontWeight: 700, margin: 0 }}>{tl.label} Creator · Trust Score {MOCK_TRUST_SCORE.total}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0', fontFamily: 'DM Mono, monospace' }}>Passport ID: {MOCK_PROFILE.passportId}</p>
            </div>
          </div>
        </div>

        {/* Passport URL */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <div style={{ flex: 1, padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>PUBLIC LINK</p>
            <p style={{ color: '#5dade2', fontSize: 13, margin: 0, fontFamily: 'DM Mono, monospace' }}>{passportUrl}</p>
          </div>
          <button onClick={copyLink} style={{ padding: '0 18px', borderRadius: 12, background: copied ? 'rgba(26,188,156,0.15)' : '#1e6091', border: `1px solid ${copied ? 'rgba(26,188,156,0.3)' : 'transparent'}`, color: copied ? '#1abc9c' : 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* QR Code */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>QR Code</p>
          {/* QR mock using grid of squares */}
          <div style={{ display: 'inline-block', background: 'white', padding: 12, borderRadius: 12, marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 12px)', gap: 1 }}>
              {Array.from({ length: 225 }, (_, i) => {
                const row = Math.floor(i / 15), col = i % 15
                const corner = (row < 3 && col < 3) || (row < 3 && col > 11) || (row > 11 && col < 3)
                const border = (row === 0 || row === 6 || col === 0 || col === 6) && row <= 6 && col <= 6
                const dark = corner || (i % 7 === 0) || (row * col % 5 === 0) || (i % 11 === 3)
                return <div key={i} style={{ width: 12, height: 12, background: dark ? '#1e3a5f' : 'white', borderRadius: 1 }} />
              })}
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 14px' }}>Scan to view {MOCK_PROFILE.name}'s Passport</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>📥 Save QR</button>
            <button style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>🖨 Print</button>
          </div>
        </div>

        {/* Share options */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Share Via</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { icon: '📧', label: 'Email', color: '#2980b9' },
            { icon: '💬', label: 'WhatsApp', color: '#25d366' },
            { icon: '🐦', label: 'Twitter / X', color: '#1da1f2' },
            { icon: '💼', label: 'LinkedIn', color: '#0077b5' },
            { icon: '📄', label: 'Export PDF', color: '#f39c12' },
            { icon: '🔗', label: 'Copy Link', color: '#9b59b6' },
          ].map(opt => (
            <button key={opt.label} style={{ padding: '14px 12px', borderRadius: 14, background: `${opt.color}0d`, border: `1px solid ${opt.color}22`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{opt.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* What's shared */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Mono, monospace' }}>What people see</p>
          {['Profile summary', 'Public portfolio', 'Verified credits', 'Trust Score', 'Skills & endorsements'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: '#1abc9c', fontSize: 12 }}>✓</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item}</span>
            </div>
          ))}
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '8px 0 0', lineHeight: 1.5 }}>Private contact, salary, and document details are never shared publicly.</p>
        </div>
      </div>
    </div>
  )
}

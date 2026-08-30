import { useState, useEffect } from 'react'
import { type ContentItem } from '../data'

type Props = {
  item: ContentItem
  onClose: () => void
  onCoinEarned?: (n: number) => void
}

const SHARE_TARGETS = [
  { id: 'whatsapp', icon: '💬', label: 'WhatsApp', color: '#25D366', bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.25)' },
  { id: 'facebook', icon: '👥', label: 'Facebook', color: '#1877F2', bg: 'rgba(24,119,242,0.12)', border: 'rgba(24,119,242,0.25)' },
  { id: 'x',        icon: '𝕏',  label: 'X (Twitter)', color: '#ffffff', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)' },
  { id: 'telegram', icon: '✈️', label: 'Telegram', color: '#2AABEE', bg: 'rgba(42,171,238,0.12)', border: 'rgba(42,171,238,0.25)' },
  { id: 'instagram',icon: '📸', label: 'Instagram', color: '#E4405F', bg: 'rgba(228,64,95,0.12)', border: 'rgba(228,64,95,0.25)' },
  { id: 'tiktok',  icon: '🎵', label: 'TikTok', color: '#ffffff', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.12)' },
]

export default function ShareSheet({ item, onClose, onCoinEarned }: Props) {
  const [copied, setCopied] = useState(false)
  const [sharedTo, setSharedTo] = useState<string | null>(null)
  const [showReferral, setShowReferral] = useState(false)
  const [visible, setVisible] = useState(false)

  const referralLink = `https://pwaniplay.com/watch/${item.id}?ref=USR8472&promo=SHARE10`
  const shortLink = `pwani.play/${item.id.slice(0,6)}`

  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 260)
  }

  const handleShare = (targetId: string) => {
    setSharedTo(targetId)
    if (onCoinEarned) onCoinEarned(10)
    setTimeout(() => setSharedTo(null), 2000)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: `rgba(0,0,0,${visible ? 0.6 : 0})`,
        transition: 'background 0.25s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d2040',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0 0 40px',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          maxWidth: 430,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={item.img} alt={item.title} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8, background: '#103058' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{item.type} · {item.genre} · {item.country}</p>
            </div>
            <div style={{ background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 100, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12 }}>🪙</span>
              <span style={{ fontSize: 12, color: '#f8c471', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>+10</span>
            </div>
          </div>
        </div>

        {/* Share targets grid */}
        <div style={{ padding: '20px 20px 0' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Share to</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {SHARE_TARGETS.map(t => (
              <button
                key={t.id}
                onClick={() => handleShare(t.id)}
                style={{
                  background: sharedTo === t.id ? 'rgba(26,188,156,0.15)' : t.bg,
                  border: `1.5px solid ${sharedTo === t.id ? 'rgba(26,188,156,0.4)' : t.border}`,
                  borderRadius: 14, padding: '14px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 24 }}>{sharedTo === t.id ? '✅' : t.icon}</span>
                <span style={{ fontSize: 11, color: sharedTo === t.id ? '#1abc9c' : 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Copy link */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortLink}</span>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? 'rgba(26,188,156,0.15)' : 'rgba(41,128,185,0.15)',
                border: `1px solid ${copied ? 'rgba(26,188,156,0.3)' : 'rgba(41,128,185,0.3)'}`,
                borderRadius: 10, padding: '7px 14px',
                color: copied ? '#1abc9c' : '#5dade2',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          {/* Referral toggle */}
          <button
            onClick={() => setShowReferral(!showReferral)}
            style={{ width: '100%', background: 'rgba(108,52,131,0.12)', border: '1px solid rgba(108,52,131,0.25)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: showReferral ? 10 : 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🎁</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>Share with Referral Link</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>Earn 100🪙 when your friend signs up</p>
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, transform: showReferral ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </button>

          {showReferral && (
            <div style={{ background: 'rgba(108,52,131,0.08)', border: '1px solid rgba(108,52,131,0.2)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{referralLink}</p>
              <button onClick={handleCopy} style={{ background: 'rgba(108,52,131,0.3)', border: '1px solid rgba(108,52,131,0.4)', borderRadius: 8, padding: '7px 14px', color: '#c39bd3', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {copied ? '✓ Copied!' : 'Copy Referral Link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

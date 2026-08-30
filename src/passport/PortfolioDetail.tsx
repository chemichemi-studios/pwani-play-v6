import { MOCK_PORTFOLIO, MOCK_PROFILE } from './data'

type Props = { itemId: string; onBack: () => void }

const TYPE_ICONS: Record<string, string> = {
  film: '🎬', series: '📺', photography: '📷', music: '🎵', award: '🏆', course: '🎓',
  podcast: '🎙️', article: '📰', certificate: '📜', other: '📁',
}

export default function PortfolioDetail({ itemId, onBack }: Props) {
  const item = MOCK_PORTFOLIO.find(p => p.id === itemId)

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <p style={{ color: 'white', fontSize: 16 }}>Item not found.</p>
        <button onClick={onBack} className="btn-primary">Go Back</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 260, background: '#103058', flexShrink: 0 }}>
        {item.thumbnail && <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1628 0%, rgba(10,22,40,0.3) 60%, transparent 100%)' }} />

        <button onClick={onBack} style={{ position: 'absolute', top: 52, left: 20, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>

        {item.featured && (
          <div style={{ position: 'absolute', top: 56, right: 20, background: 'rgba(243,156,18,0.2)', border: '1px solid rgba(243,156,18,0.4)', borderRadius: 100, padding: '3px 10px' }}>
            <span style={{ color: '#f8c471', fontSize: 11, fontWeight: 700 }}>⭐ Featured</span>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.3)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.4)', fontWeight: 700 }}>{TYPE_ICONS[item.type] || '📁'} {item.type}</span>
            {item.year && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{item.year}</span>}
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0, lineHeight: 1.2 }}>{item.title}</h1>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* Role & org */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{item.role}</span>
          {item.organization && <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{item.organization}</span>}
        </div>

        {/* Credits */}
        {item.credits && item.credits.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {item.credits.map(c => <span key={c} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>{c}</span>)}
          </div>
        )}

        {/* Description */}
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.65, margin: '0 0 20px' }}>{item.description}</p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Tags</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {item.tags.map(t => <span key={t} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(155,89,182,0.1)', color: '#bb8fce', border: '1px solid rgba(155,89,182,0.15)' }}>#{t}</span>)}
            </div>
          </div>
        )}

        {/* Link */}
        {item.link && (
          <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(41,128,185,0.06)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#5dade2', fontSize: 13, textDecoration: 'none', fontFamily: 'DM Mono, monospace' }}>{item.link}</a>
          </div>
        )}

        {/* Creator info */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#1abc9c)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={MOCK_PROFILE.photo} alt={MOCK_PROFILE.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{MOCK_PROFILE.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>{MOCK_PROFILE.primaryProfession}</p>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Follow</button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>✏️ Edit</button>
          <button style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>🔗 Share</button>
          <button style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)', color: '#e74c3c', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>🗑 Remove</button>
        </div>
      </div>
    </div>
  )
}

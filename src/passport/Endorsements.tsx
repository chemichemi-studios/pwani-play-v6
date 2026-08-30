import { useState } from 'react'
import { MOCK_RECOMMENDATIONS, MOCK_SKILLS } from './data'
import type { Recommendation } from './data'

type Props = { onBack: () => void }

type SubTab = 'recommendations' | 'endorsements' | 'request'

export default function Endorsements({ onBack }: Props) {
  const [subtab, setSubtab] = useState<SubTab>('recommendations')
  const [recs, setRecs] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS)
  const [requestMsg, setRequestMsg] = useState('')
  const [requestTo, setRequestTo] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const toggleHide = (id: string) => setRecs(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r))

  const sendRequest = () => {
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true); setRequestMsg(''); setRequestTo('') }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Endorsements &amp; Recommendations</h2>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {([
            { key: 'recommendations', label: '📝 Recommendations' },
            { key: 'endorsements', label: '👍 Endorsements' },
            { key: 'request', label: '📨 Request' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setSubtab(t.key)} style={{
              flex: 1, padding: '11px 4px', border: 'none', background: 'none', cursor: 'pointer',
              color: subtab === t.key ? '#2980b9' : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              borderBottom: `2px solid ${subtab === t.key ? '#2980b9' : 'transparent'}`,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
        {subtab === 'recommendations' && (
          <div>
            {recs.map(r => (
              <div key={r.id} style={{ background: r.hidden ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 12, opacity: r.hidden ? 0.5 : 1 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{r.authorAvatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{r.authorName}</p>
                      {r.authorVerified && <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.2)', fontWeight: 700 }}>✓</span>}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 1px' }}>{r.authorRole}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{r.relationship} · {r.date}</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px', fontStyle: 'italic' }}>"{r.body}"</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {r.skills.map(s => <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(155,89,182,0.1)', color: '#bb8fce', border: '1px solid rgba(155,89,182,0.15)' }}>{s}</span>)}
                </div>
                <button onClick={() => toggleHide(r.id)} style={{ background: 'none', border: 'none', color: r.hidden ? '#2980b9' : 'rgba(255,255,255,0.35)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                  {r.hidden ? '👁 Show on Profile' : '🙈 Hide from Profile'}
                </button>
              </div>
            ))}
          </div>
        )}

        {subtab === 'endorsements' && (
          <div>
            {MOCK_SKILLS.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{s.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{s.category}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#f8c471', fontSize: 18, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.endorsements}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0 }}>endorsements</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {subtab === 'request' && (
          <div>
            {sent && (
              <div style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0 }}>Request sent successfully!</p>
              </div>
            )}
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.5, margin: '0 0 20px' }}>
              Ask a collaborator, employer, or mentor to write a recommendation for your Passport.
            </p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 7px', fontFamily: 'DM Mono, monospace' }}>SEND TO</label>
              <input className="input-field" placeholder="Email address or @username" value={requestTo} onChange={e => setRequestTo(e.target.value)} style={{ marginBottom: 0 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 7px', fontFamily: 'DM Mono, monospace' }}>PERSONAL MESSAGE (OPTIONAL)</label>
              <textarea value={requestMsg} onChange={e => setRequestMsg(e.target.value)} rows={4} placeholder="Hi [Name], I'd appreciate a recommendation based on our work together on..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 14px', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
            </div>
            <button className="btn-primary" onClick={sendRequest} disabled={sending || !requestTo.trim()} style={{ width: '100%' }}>
              {sending ? 'Sending…' : '📨 Send Request'}
            </button>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', margin: '12px 0 0', lineHeight: 1.4 }}>Recommendations require approval before appearing on your Passport.</p>
          </div>
        )}
      </div>
    </div>
  )
}

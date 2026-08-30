import { useState } from 'react'
import { MOCK_CREDITS, CREDIT_TYPE_LABELS } from './data'
import type { CreditType } from './data'

type Props = { onAdd: () => void }

const FILTERS: { key: CreditType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'film', label: 'Film' },
  { key: 'tv', label: 'TV' },
  { key: 'music', label: 'Music' },
  { key: 'theatre', label: 'Theatre' },
  { key: 'ngo', label: 'NGO' },
  { key: 'short', label: 'Short' },
]

export default function Credits({ onAdd }: Props) {
  const [filter, setFilter] = useState<CreditType | 'all'>('all')

  const filtered = MOCK_CREDITS.filter(c => filter === 'all' || c.type === filter)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '16px 20px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 2px' }}>Credits</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{MOCK_CREDITS.length} credits · {MOCK_CREDITS.filter(c => c.verified).length} verified</p>
          </div>
          <button onClick={onAdd} style={{ padding: '9px 18px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Add</button>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: filter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: filter === f.key ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* IMDb-style credits list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => {
          const ct = CREDIT_TYPE_LABELS[c.type]
          return (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.verified ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{ct.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{c.title}</p>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: c.verified ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.06)', color: c.verified ? '#1abc9c' : 'rgba(255,255,255,0.35)', border: `1px solid ${c.verified ? 'rgba(26,188,156,0.25)' : 'rgba(255,255,255,0.1)'}`, fontWeight: 600, flexShrink: 0 }}>{c.verified ? '✓ Verified' : 'Unverified'}</span>
                  </div>
                  <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 600, margin: '0 0 3px' }}>{c.role}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{c.organization}</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{c.year}</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{ct.icon} {ct.label}</span>
                  </div>
                  {c.country && <span style={{ display: 'inline-block', color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 3 }}>🌍 {c.country}</span>}
                  {c.linkedPassports.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '0 4px 0 0' }}>With:</p>
                      {c.linkedPassports.map(lp => (
                        <span key={lp} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.15)' }}>@{lp}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {!c.verified && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(243,156,18,0.06)', border: '1px solid rgba(243,156,18,0.15)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: '#f8c471', fontSize: 12, margin: 0 }}>Submit for verification to boost Trust Score</p>
                  <button style={{ background: 'none', border: 'none', color: '#f39c12', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Verify →</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎬</div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No credits here yet</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>Add your professional film, TV, and creative credits.</p>
          <button onClick={onAdd} className="btn-primary" style={{ maxWidth: 200, margin: '0 auto' }}>+ Add Credit</button>
        </div>
      )}

      {/* Add credit info box */}
      {filtered.length > 0 && (
        <div style={{ margin: '20px 20px 0', padding: '14px 16px', background: 'rgba(41,128,185,0.06)', border: '1px solid rgba(41,128,185,0.12)', borderRadius: 14 }}>
          <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>💡 Verified Credits</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>Verified credits are linked to Pwani Studio productions and approved by production companies. They add significantly to your Trust Score.</p>
        </div>
      )}
    </div>
  )
}

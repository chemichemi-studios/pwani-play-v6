import { useState } from 'react'
import { MOCK_TIMELINE } from './data'
import type { TimelineCategory } from './data'

type Props = { onBack: () => void }

const CATEGORIES: { key: TimelineCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '📋' },
  { key: 'employment', label: 'Work', icon: '💼' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'project', label: 'Projects', icon: '🎬' },
  { key: 'award', label: 'Awards', icon: '🏆' },
  { key: 'certification', label: 'Certs', icon: '📜' },
  { key: 'festival', label: 'Festivals', icon: '🎪' },
]

const CAT_COLORS: Record<string, string> = {
  work: '#2980b9',
  education: '#9b59b6',
  project: '#f39c12',
  award: '#f1c40f',
  certification: '#1abc9c',
  volunteer: '#e74c3c',
}

export default function CareerTimeline({ onBack }: Props) {
  const [cat, setCat] = useState<TimelineCategory | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)

  const entries = cat === 'all' ? MOCK_TIMELINE : MOCK_TIMELINE.filter(e => e.category === cat)

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Career Timeline</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{MOCK_TIMELINE.length} entries across your career</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>+ Add</button>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12 }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: cat === c.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: cat === c.key ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{c.icon} {c.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>
        {showAdd && (
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 16, padding: '16px', marginBottom: 24, animation: 'slideUp 0.2s ease' }}>
            <p style={{ color: '#5dade2', fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>New Timeline Entry</p>
            <input className="input-field" placeholder="Title / Role" style={{ marginBottom: 10 }} />
            <input className="input-field" placeholder="Organization or Institution" style={{ marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input className="input-field" placeholder="Start date" style={{ flex: 1, marginBottom: 0 }} />
              <input className="input-field" placeholder="End date" style={{ flex: 1, marginBottom: 0 }} />
            </div>
            <textarea rows={3} placeholder="Description..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 12px', color: 'white', fontSize: 13, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }}>Save Entry</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Timeline vertical line */}
        <div style={{ position: 'relative', paddingLeft: 36 }}>
          <div style={{ position: 'absolute', left: 13, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />

          {entries.map((entry, i) => {
            const color = CAT_COLORS[entry.category] || 'rgba(255,255,255,0.4)'
            return (
              <div key={entry.id} style={{ position: 'relative', marginBottom: 20 }}>
                {/* Dot */}
                <div style={{ position: 'absolute', left: -31, top: 14, width: 14, height: 14, borderRadius: '50%', background: color, border: `3px solid #0a1628`, boxSizing: 'border-box', zIndex: 1 }} />

                <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22`, borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{entry.title}</p>
                        {entry.verified && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(26,188,156,0.15)', color: '#1abc9c', border: '1px solid rgba(26,188,156,0.2)', fontWeight: 700 }}>✓</span>}
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '0 0 2px' }}>{entry.organization}</p>
                      {entry.location && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>📍 {entry.location}</p>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${color}18`, color, border: `1px solid ${color}33`, fontWeight: 600 }}>{CATEGORIES.find(c => c.key === entry.category)?.icon} {entry.category}</span>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '4px 0 0', fontFamily: 'DM Mono, monospace', textAlign: 'right' }}>
                        {entry.startDate}{entry.endDate ? ` – ${entry.endDate}` : ' – Present'}
                      </p>
                    </div>
                  </div>

                  {entry.description && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.55, margin: '8px 0 0' }}>{entry.description}</p>}
                </div>
              </div>
            )
          })}

          {entries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No entries in this category</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Add entries to tell your career story.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

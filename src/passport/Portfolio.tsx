import { useState } from 'react'
import { MOCK_PORTFOLIO } from './data'
import type { PortfolioType } from './data'

type Props = { onOpenItem: (id: string) => void; onAdd: () => void }

const TYPE_ICONS: Record<PortfolioType, string> = {
  film: '🎬', series: '📺', photography: '📷', music: '🎵', podcast: '🎙️',
  article: '📝', course: '📚', award: '🏆', certificate: '📜', other: '🗂️',
}

const FILTERS: { key: PortfolioType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'film', label: 'Film' },
  { key: 'series', label: 'Series' },
  { key: 'photography', label: 'Photo' },
  { key: 'music', label: 'Music' },
  { key: 'award', label: 'Awards' },
  { key: 'course', label: 'Courses' },
]

export default function Portfolio({ onOpenItem, onAdd }: Props) {
  const [filter, setFilter] = useState<PortfolioType | 'all'>('all')

  const filtered = MOCK_PORTFOLIO.filter(p => filter === 'all' || p.type === filter)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 2px' }}>Portfolio</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{MOCK_PORTFOLIO.length} items</p>
          </div>
          <button onClick={onAdd} style={{ padding: '9px 18px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Add</button>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: filter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: filter === f.key ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Featured item */}
      {filter === 'all' && (
        <div style={{ padding: '0 20px 16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Featured</p>
          {MOCK_PORTFOLIO.filter(p => p.featured).map(item => (
            <div key={item.id} onClick={() => onOpenItem(item.id)} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', marginBottom: 16 }}>
              <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', background: '#103058' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: 'rgba(243,156,18,0.25)', border: '1px solid rgba(243,156,18,0.4)', color: '#f8c471', fontWeight: 700 }}>⭐ Featured</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}>{TYPE_ICONS[item.type]} {item.type}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
                <p style={{ color: 'white', fontSize: 18, fontFamily: 'DM Serif Display, serif', margin: '0 0 3px' }}>{item.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>{item.role} · {item.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.filter(p => !p.featured || filter !== 'all').map(item => (
          <div key={item.id} onClick={() => onOpenItem(item.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block', background: '#103058' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              <span style={{ position: 'absolute', top: 7, left: 8, fontSize: 16 }}>{TYPE_ICONS[item.type]}</span>
              {item.featured && <span style={{ position: 'absolute', top: 7, right: 8, fontSize: 14 }}>⭐</span>}
            </div>
            <div style={{ padding: '8px 10px 10px' }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.role}</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {item.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', color: 'rgba(93,173,226,0.8)', border: '1px solid rgba(41,128,185,0.15)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Add item card */}
        <div onClick={onAdd} style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 14, height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 6 }}>
          <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.2)' }}>+</span>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>Add Item</p>
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{TYPE_ICONS[filter as PortfolioType] ?? '📂'}</div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No {filter} items yet</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>Showcase your work to grow your profile.</p>
          <button onClick={onAdd} className="btn-primary" style={{ maxWidth: 200, margin: '0 auto' }}>+ Add First Item</button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { MOCK_ASSETS } from './data'
import type { AssetType } from './data'

type Props = { projectId: string; onBack: () => void }

const TYPE_FILTER: { key: AssetType | 'all'; icon: string; label: string }[] = [
  { key: 'all', icon: '📁', label: 'All' },
  { key: 'video', icon: '🎬', label: 'Video' },
  { key: 'audio', icon: '🎵', label: 'Audio' },
  { key: 'image', icon: '🖼️', label: 'Images' },
  { key: 'document', icon: '📄', label: 'Docs' },
  { key: 'subtitle', icon: '💬', label: 'Subs' },
  { key: 'graphic', icon: '🎨', label: 'Graphics' },
]

export default function AssetLibrary({ projectId: _projectId, onBack }: Props) {
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const filtered = MOCK_ASSETS.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false
    if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Asset Library</h2>
          </div>
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>{view === 'grid' ? '☰' : '⊞'}</button>
          <button style={{ padding: '0 14px', height: 36, borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Upload</button>
        </div>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
          <input className="input-field" placeholder="Search assets…" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 42, marginBottom: 0 }} />
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {TYPE_FILTER.map(f => (
            <button key={f.key} onClick={() => setTypeFilter(f.key)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: typeFilter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: typeFilter === f.key ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{f.icon} {f.label}</button>
          ))}
        </div>
      </div>

      {/* Selection toolbar */}
      {selected.length > 0 && (
        <div style={{ padding: '10px 20px', background: 'rgba(41,128,185,0.1)', borderBottom: '1px solid rgba(41,128,185,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, flex: 1 }}>{selected.length} selected</span>
          <button onClick={() => setSelected([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>Deselect</button>
          <button style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.2)', color: '#ec7063', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
          <button style={{ padding: '6px 14px', borderRadius: 8, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Download</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📂</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: 0 }}>No assets found</p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {filtered.map(a => {
              const isSelected = selected.includes(a.id)
              return (
                <div key={a.id} onClick={() => toggleSelect(a.id)} style={{ background: isSelected ? 'rgba(41,128,185,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${isSelected ? '#2980b9' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ height: 70, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                    {a.type === 'image' || a.type === 'video' ? <img src={a.url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ['🎬', '🎵', '📄', '💬', '🎨'][['video', 'audio', 'document', 'subtitle', 'graphic'].indexOf(a.type)] ?? '📁'}
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, margin: 0, fontFamily: 'DM Mono, monospace' }}>{a.size}</p>
                  </div>
                  {isSelected && <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%', background: '#2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>✓</div>}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(a => {
              const typeIcons: Record<string, string> = { video: '🎬', audio: '🎵', image: '🖼️', document: '📄', subtitle: '💬', graphic: '🎨' }
              const isSelected = selected.includes(a.id)
              return (
                <div key={a.id} onClick={() => toggleSelect(a.id)} style={{ display: 'flex', gap: 12, padding: '12px', background: isSelected ? 'rgba(41,128,185,0.08)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${isSelected ? '#2980b9' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, cursor: 'pointer', alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{typeIcons[a.type]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{a.size} · {a.updatedAt}</p>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

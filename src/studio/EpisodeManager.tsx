import { useState } from 'react'
import { MOCK_EPISODES, EPISODE_STATUS_COLORS } from './data'
import type { Episode, EpisodeStatus } from './data'

type Props = { projectId: string; onBack: () => void; onUpload: () => void }

const STATUS_ORDER: EpisodeStatus[] = ['published', 'scheduled', 'ready', 'processing', 'uploading', 'draft']

export default function EpisodeManager({ projectId: _projectId, onBack, onUpload }: Props) {
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES)
  const [reorder, setReorder] = useState(false)
  const [filter, setFilter] = useState<EpisodeStatus | 'all'>('all')
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const filtered = episodes.filter(e => filter === 'all' || e.status === filter)

  const moveUp = (idx: number) => {
    if (idx === 0) return
    setEpisodes(prev => {
      const a = [...prev]
      ;[a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]
      return a
    })
  }

  const moveDown = (idx: number) => {
    if (idx === episodes.length - 1) return
    setEpisodes(prev => {
      const a = [...prev]
      ;[a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]
      return a
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingTop: 52, padding: '52px 20px 16px', background: 'rgba(10,22,40,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 2px' }}>Episode Manager</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{episodes.length} episodes</p>
          </div>
          <button onClick={() => setReorder(!reorder)} style={{ padding: '8px 14px', borderRadius: 10, background: reorder ? '#1e6091' : 'rgba(255,255,255,0.06)', border: `1px solid ${reorder ? '#2980b9' : 'rgba(255,255,255,0.1)'}`, color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            {reorder ? 'Done' : '↕ Reorder'}
          </button>
          <button onClick={onUpload} style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>+ Add</button>
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {(['all', ...STATUS_ORDER] as (EpisodeStatus | 'all')[]).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: filter === s ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: filter === s ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 600, textTransform: 'capitalize', fontFamily: 'Outfit, sans-serif',
            }}>{s === 'all' ? 'All' : s.replace('-', ' ')}</button>
          ))}
        </div>
      </div>

      {/* Episode list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((ep, idx) => {
          const sc = EPISODE_STATUS_COLORS[ep.status]
          return (
            <div key={ep.id} style={{ display: 'flex', gap: 12, padding: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, alignItems: 'center', position: 'relative' }}>
              {reorder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button onClick={() => moveUp(idx)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 26, height: 22, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>▲</button>
                  <button onClick={() => moveDown(idx)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 26, height: 22, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>▼</button>
                </div>
              )}
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#5dade2', fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>E{ep.episode}</span>
              </div>
              <img src={ep.thumbnail} alt={ep.title} style={{ width: 72, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#103058' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.title}</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>·</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{ep.runtime}</span>
                  {ep.scheduledDate && <><span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>·</span><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{ep.scheduledDate}</span></>}
                </div>
                {(ep.status === 'uploading' || ep.status === 'processing') && ep.uploadProgress !== undefined && (
                  <div style={{ marginTop: 4, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <div style={{ width: `${ep.uploadProgress * 100}%`, height: '100%', background: '#2980b9', borderRadius: 2 }} />
                  </div>
                )}
              </div>
              <button onClick={() => setShowMenu(showMenu === ep.id ? null : ep.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}>⋮</button>
              {showMenu === ep.id && (
                <div style={{ position: 'absolute', right: 40, top: 8, background: '#0d2040', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 6, zIndex: 30, minWidth: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  {[
                    { icon: '✏️', label: 'Edit Metadata' },
                    { icon: '📋', label: 'Duplicate' },
                    { icon: '📅', label: 'Schedule' },
                    { icon: '🗑', label: 'Delete', danger: true },
                  ].map(a => (
                    <button key={a.label} onClick={() => setShowMenu(null)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'none', border: 'none', color: a.danger ? '#e74c3c' : 'rgba(255,255,255,0.8)', fontSize: 13, cursor: 'pointer', borderRadius: 8, fontFamily: 'Outfit, sans-serif', textAlign: 'left' }}>
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

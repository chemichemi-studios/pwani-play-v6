import { useState } from 'react'
import { PROJECTS, STATUS_COLORS, TYPE_ICONS } from './data'
import type { ProjectStatus, ProjectType } from './data'

type Props = {
  onOpenProject: (id: string) => void
  onNewProject: () => void
}

const STATUS_FILTERS: { key: ProjectStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'in-review', label: 'In Review' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'draft', label: 'Drafts' },
  { key: 'archived', label: 'Archived' },
]

export default function ProjectsTab({ onOpenProject, onNewProject }: Props) {
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const filtered = PROJECTS.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>My Projects</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15 }}>
              {view === 'grid' ? '☰' : '⊞'}
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>🔍</span>
          <input
            className="input-field"
            placeholder="Search projects..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 44, marginBottom: 0 }}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 100,
              background: filter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${filter === f.key ? '#2980b9' : 'rgba(255,255,255,0.1)'}`,
              color: filter === f.key ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📂</div>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>No projects yet</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>Start creating your first film, series, podcast, or course.</p>
          <button className="btn-primary" onClick={onNewProject} style={{ maxWidth: 220, margin: '0 auto' }}>+ Create First Project</button>
        </div>
      ) : view === 'grid' ? (
        <div style={{ padding: '8px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ position: 'relative' }}>
              <div onClick={() => onOpenProject(p.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  <img src={p.poster} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', background: '#103058' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: STATUS_COLORS[p.status].bg, color: STATUS_COLORS[p.status].text, border: `1px solid ${STATUS_COLORS[p.status].border}`, fontWeight: 600, textTransform: 'capitalize', backdropFilter: 'blur(8px)' }}>
                      {p.status.replace('-', ' ')}
                    </span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setShowMenu(showMenu === p.id ? null : p.id) }} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>⋮</button>
                  <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                    <span style={{ fontSize: 14 }}>{TYPE_ICONS[p.type]}</span>
                  </div>
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{p.genre}</p>
                </div>
              </div>
              {/* Context menu */}
              {showMenu === p.id && (
                <div style={{ position: 'absolute', top: 40, right: 0, background: '#0d2040', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 6, zIndex: 30, minWidth: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  {[
                    { icon: '📂', label: 'Open' },
                    { icon: '✏️', label: 'Edit' },
                    { icon: '📋', label: 'Duplicate' },
                    { icon: '📦', label: 'Archive' },
                    { icon: '🗑', label: 'Delete', danger: true },
                  ].map(a => (
                    <button key={a.label} onClick={() => { setShowMenu(null); if (a.label === 'Open') onOpenProject(p.id) }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'none', border: 'none', color: a.danger ? '#e74c3c' : 'rgba(255,255,255,0.8)', fontSize: 13, cursor: 'pointer', borderRadius: 8, fontFamily: 'Outfit, sans-serif', textAlign: 'left' }}>
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => onOpenProject(p.id)} style={{ display: 'flex', gap: 12, padding: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, cursor: 'pointer', alignItems: 'center' }}>
              <img src={p.poster} alt={p.title} style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#103058' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>{TYPE_ICONS[p.type]}</span>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{p.genre} · {p.updatedAt}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: STATUS_COLORS[p.status].bg, color: STATUS_COLORS[p.status].text, border: `1px solid ${STATUS_COLORS[p.status].border}`, fontWeight: 600 }}>{p.status.replace('-', ' ')}</span>
                  {p.episodes.length > 0 && <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>{p.episodes.length} eps</span>}
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

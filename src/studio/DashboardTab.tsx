import { useState } from 'react'
import { PROJECTS, STUDIO_NOTIFS, UPLOAD_QUEUE, STATUS_COLORS, TYPE_ICONS } from './data'
import type { Project } from './data'

type Props = {
  name: string
  coinBalance: number
  onOpenProject: (id: string) => void
  onOpenUpload: () => void
  onOpenNotifs: () => void
  onOpenAI: () => void
  onNewProject: () => void
  onOpenAnalytics: () => void
}

const STATS = [
  { label: 'Total Views', value: '248K', icon: '👁', delta: '+12%', color: '#2980b9' },
  { label: 'Watch Hours', value: '9.2K', icon: '⏱', delta: '+8%', color: '#1abc9c' },
  { label: 'Subscribers', value: '18.4K', icon: '👥', delta: '+340', color: '#9b59b6' },
  { label: 'Revenue', value: 'KSH 1,840', icon: '💰', delta: '+22%', color: '#f39c12' },
]

export default function DashboardTab({ name, coinBalance, onOpenProject, onOpenUpload, onOpenNotifs, onOpenAI, onNewProject, onOpenAnalytics }: Props) {
  const [walletBalance] = useState(3240)
  const unread = STUDIO_NOTIFS.filter(n => !n.read).length
  const drafts = PROJECTS.filter(p => p.status === 'draft').length
  const inReview = PROJECTS.filter(p => p.status === 'in-review').length
  const activeUpload = UPLOAD_QUEUE.find(u => u.status === 'uploading')

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 2px' }}>Good morning,</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>{name} 👋</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onOpenNotifs} style={{ position: 'relative', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
            🔔
            {unread > 0 && <div style={{ position: 'absolute', top: -2, right: -2, background: '#e74c3c', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1628' }}>
              <span style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>{unread}</span>
            </div>}
          </button>
        </div>
      </div>

      {/* Creator level banner */}
      <div style={{ margin: '0 20px 20px', background: 'linear-gradient(135deg,rgba(41,128,185,0.2),rgba(26,188,156,0.1))', border: '1px solid rgba(41,128,185,0.25)', borderRadius: 18, padding: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -12, top: -12, fontSize: 60, opacity: 0.08 }}>🎬</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>🎬</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{name}</p>
              <span style={{ background: '#2980b9', borderRadius: 6, padding: '1px 6px', fontSize: 10, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>✓ VERIFIED</span>
            </div>
            <p style={{ color: '#5dade2', fontSize: 12, margin: '0 0 6px' }}>Creator Level: Artisan 🏆</p>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg,#2980b9,#1abc9c)', borderRadius: 2 }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: '4px 0 0', fontFamily: 'DM Mono, monospace' }}>6,800 / 10,000 XP to Legend</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#f8c471', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>KSH {walletBalance.toLocaleString()}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0 }}>Wallet</p>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#f8c471', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>🪙 {coinBalance}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0 }}>Coins</p>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>4</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0 }}>Projects</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { icon: '📤', label: 'Upload', action: onOpenUpload },
            { icon: '➕', label: 'New Project', action: onNewProject },
            { icon: '🤖', label: 'AI Tools', action: onOpenAI },
            { icon: '📊', label: 'Analytics', action: onOpenAnalytics },
          ].map(q => (
            <button key={q.label} onClick={q.action} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <span style={{ fontSize: 22 }}>{q.icon}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textAlign: 'center' }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active upload banner */}
      {activeUpload && (
        <div style={{ margin: '0 20px 20px', background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: 0 }}>📤 Uploading…</p>
            <button onClick={onOpenUpload} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>View All</button>
          </div>
          <p style={{ color: 'white', fontSize: 12, margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeUpload.filename}</p>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: `${activeUpload.progress * 100}%`, height: '100%', background: '#2980b9', borderRadius: 2, transition: 'width 0.5s' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '6px 0 0', fontFamily: 'DM Mono, monospace' }}>{Math.round(activeUpload.progress * 100)}% — ETA {activeUpload.eta}</p>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Overview</p>
          <button onClick={onOpenAnalytics} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Full Analytics →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: '#1abc9c', background: 'rgba(26,188,156,0.12)', padding: '2px 7px', borderRadius: 100, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{s.delta}</span>
              </div>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending actions */}
      {(drafts > 0 || inReview > 0) && (
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Needs Attention</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {inReview > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.2)', borderRadius: 12 }}>
                <span style={{ fontSize: 20 }}>⏳</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{inReview} project in review</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Mama Afrika awaiting content review</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
              </div>
            )}
            {drafts > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                <span style={{ fontSize: 20 }}>📝</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{drafts} draft project{drafts !== 1 ? 's' : ''}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Continue where you left off</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent projects */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Recent Projects</p>
          <button style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>See all →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROJECTS.slice(0, 3).map(p => (
            <ProjectRowCard key={p.id} project={p} onOpen={() => onOpenProject(p.id)} />
          ))}
        </div>
      </div>

      {/* Recent notifications */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Recent Activity</p>
          <button onClick={onOpenNotifs} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>All →</button>
        </div>
        {STUDIO_NOTIFS.slice(0, 3).map(n => (
          <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: n.read ? 'rgba(255,255,255,0.6)' : 'white', fontSize: 13, fontWeight: n.read ? 400 : 700, margin: '0 0 2px' }}>{n.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 2px' }}>{n.body}</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980b9', flexShrink: 0, marginTop: 4 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectRowCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const sc = STATUS_COLORS[project.status]
  return (
    <div onClick={onOpen} style={{ display: 'flex', gap: 12, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', alignItems: 'center' }}>
      <img src={project.poster} alt={project.title} style={{ width: 52, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#103058' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{TYPE_ICONS[project.type]} {project.title}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{project.genre} · {project.updatedAt}</p>
        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontWeight: 600, textTransform: 'capitalize' }}>{project.status.replace('-', ' ')}</span>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
    </div>
  )
}

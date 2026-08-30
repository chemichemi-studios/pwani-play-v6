import { useState } from 'react'
import { PROJECTS, STATUS_COLORS, TYPE_ICONS, EPISODE_STATUS_COLORS } from './data'
import type { Project, Episode, TeamMember } from './data'

type Tab = 'overview' | 'episodes' | 'assets' | 'cast' | 'budget' | 'schedule' | 'analytics' | 'settings'

type Props = {
  projectId: string
  onBack: () => void
  onUpload: () => void
  onPublish: () => void
  onManageEpisodes: () => void
  onOpenAssets: () => void
  onOpenCast: () => void
  onOpenCollaboration: () => void
  onOpenMonetization: () => void
  onOpenAnalytics: () => void
  onOpenMetadata: () => void
}

const BUDGET_ITEMS = [
  { category: 'Production', allocated: 800000, spent: 620000 },
  { category: 'Post-Production', allocated: 300000, spent: 180000 },
  { category: 'Marketing', allocated: 150000, spent: 45000 },
  { category: 'Equipment', allocated: 200000, spent: 198000 },
]

const SCHEDULE = [
  { milestone: 'Script Lock', date: 'Jan 20, 2026', done: true },
  { milestone: 'Principal Photography', date: 'Feb 15 – Apr 10, 2026', done: true },
  { milestone: 'Post-Production', date: 'Apr 15 – Jun 30, 2026', done: true },
  { milestone: 'Premiere (S1E1–E2)', date: 'Jul 1, 2026', done: true },
  { milestone: 'S1E3–E4 Release', date: 'Aug 15, 2026', done: false },
  { milestone: 'Season 1 Finale', date: 'Sep 1, 2026', done: false },
  { milestone: 'Season 2 Greenlight Decision', date: 'Oct 1, 2026', done: false },
]

export default function ProjectDetail({ projectId, onBack, onUpload, onPublish, onManageEpisodes, onOpenAssets, onOpenCast, onOpenCollaboration, onOpenMonetization, onOpenAnalytics, onOpenMetadata }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const project = PROJECTS.find(p => p.id === projectId) ?? PROJECTS[0]
  const sc = STATUS_COLORS[project.status]

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📋' },
    { key: 'episodes', label: 'Episodes', icon: '📺' },
    { key: 'assets', label: 'Assets', icon: '📁' },
    { key: 'cast', label: 'Cast & Crew', icon: '👥' },
    { key: 'budget', label: 'Budget', icon: '💰' },
    { key: 'schedule', label: 'Schedule', icon: '📅' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: 200 }}>
        <img src={project.banner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1628 0%, rgba(10,22,40,0.4) 50%, transparent 100%)' }} />
        <button onClick={onBack} style={{ position: 'absolute', top: 48, left: 20, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18, backdropFilter: 'blur(8px)' }}>←</button>
        <div style={{ position: 'absolute', top: 48, right: 20, display: 'flex', gap: 8 }}>
          <button onClick={onPublish} style={{ background: 'rgba(26,188,156,0.2)', border: '1px solid rgba(26,188,156,0.4)', borderRadius: 10, padding: '8px 14px', color: '#1abc9c', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif', backdropFilter: 'blur(8px)' }}>Publish</button>
          <button onClick={onOpenMetadata} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 12px', color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', backdropFilter: 'blur(8px)' }}>Edit</button>
        </div>
      </div>

      {/* Title section */}
      <div style={{ padding: '0 20px 16px', marginTop: -8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <img src={project.poster} alt={project.title} style={{ width: 72, height: 100, objectFit: 'cover', borderRadius: 12, flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)', background: '#103058' }} />
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontWeight: 600 }}>{project.status.replace('-', ' ')}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>{TYPE_ICONS[project.type]} {project.type}</span>
            </div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 4px', lineHeight: 1.2 }}>{project.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 6px' }}>{project.genre} · {project.language} · {project.year}</p>
            {project.status === 'published' && (
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 12, color: '#5dade2', fontFamily: 'DM Mono, monospace' }}>👁 {(project.totalViews / 1000).toFixed(0)}K</span>
                <span style={{ fontSize: 12, color: '#f8c471', fontFamily: 'DM Mono, monospace' }}>💰 KSH {project.totalRevenue.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick action row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onUpload} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📤 Upload</button>
          <button onClick={onManageEpisodes} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📺 Episodes</button>
          <button onClick={onOpenCollaboration} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>👥 Team</button>
          <button onClick={onOpenMonetization} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>💰 Earn</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingLeft: 20, flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flexShrink: 0, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer',
            color: tab === t.key ? '#2980b9' : 'rgba(255,255,255,0.4)',
            fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            borderBottom: `2px solid ${tab === t.key ? '#2980b9' : 'transparent'}`,
            transition: 'all 0.2s',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
        {tab === 'overview' && <OverviewTab project={project} />}
        {tab === 'episodes' && <EpisodesTab episodes={project.episodes} onManage={onManageEpisodes} />}
        {tab === 'assets' && <AssetsTabPreview onOpenFull={onOpenAssets} />}
        {tab === 'cast' && <CastTabPreview team={project.team} onOpenFull={onOpenCast} />}
        {tab === 'budget' && <BudgetTab />}
        {tab === 'schedule' && <ScheduleTab />}
        {tab === 'analytics' && <AnalyticsTabPreview project={project} onOpenFull={onOpenAnalytics} />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

function OverviewTab({ project }: { project: Project }) {
  return (
    <div>
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Synopsis</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{project.synopsis}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Genre', value: project.genre },
          { label: 'Language', value: project.language },
          { label: 'Country', value: project.country },
          { label: 'Age Rating', value: project.ageRating },
          { label: 'Version', value: `v${project.version}` },
          { label: 'Last Updated', value: project.updatedAt },
        ].map(f => (
          <div key={f.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '0 0 3px', fontFamily: 'DM Mono, monospace' }}>{f.label}</p>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{f.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Tags</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.25)', color: '#5dade2' }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Version History</p>
        {[
          { v: `v${project.version}`, note: 'Metadata updated, S1E4 upload started', date: 'Today' },
          { v: `v${project.version - 1}`, note: 'S1E3 scheduled for Aug 15', date: 'Yesterday' },
          { v: `v${project.version - 2}`, note: 'Episode descriptions improved via AI', date: '3 days ago' },
        ].map(h => (
          <div key={h.v} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#2980b9', fontFamily: 'DM Mono, monospace', fontWeight: 700, minWidth: 32 }}>{h.v}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 2px' }}>{h.note}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{h.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EpisodesTab({ episodes, onManage }: { episodes: Episode[]; onManage: () => void }) {
  if (episodes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📺</div>
        <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No episodes yet</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px' }}>Upload your first episode to get started.</p>
        <button className="btn-primary" onClick={onManage}>Add Episodes</button>
      </div>
    )
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{episodes.length} episodes</p>
        <button onClick={onManage} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Manage All →</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {episodes.map(ep => {
          const sc = EPISODE_STATUS_COLORS[ep.status]
          return (
            <div key={ep.id} style={{ display: 'flex', gap: 12, padding: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
              <img src={ep.thumbnail} alt={ep.title} style={{ width: 72, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#103058' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>S{ep.season}E{ep.episode} · {ep.title}</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>·</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{ep.runtime}</span>
                  {ep.views && <><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>·</span><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{(ep.views / 1000).toFixed(1)}K views</span></>}
                </div>
                {ep.status === 'uploading' || ep.status === 'processing' ? (
                  <div style={{ marginTop: 4, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <div style={{ width: `${(ep.uploadProgress ?? 0) * 100}%`, height: '100%', background: '#2980b9', borderRadius: 2 }} />
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AssetsTabPreview({ onOpenFull }: { onOpenFull: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
      <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Production Assets</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px' }}>Scripts, contracts, images, audio, and more.</p>
      <button className="btn-primary" onClick={onOpenFull}>Open Asset Library</button>
    </div>
  )
}

function CastTabPreview({ team, onOpenFull }: { team: TeamMember[]; onOpenFull: () => void }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{team.length} members</p>
        <button onClick={onOpenFull} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Manage Team →</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {team.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: 12, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{m.avatar}</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{m.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.role}</p>
            </div>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', textTransform: 'capitalize' }}>{m.collabRole}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetTab() {
  const totalAllocated = BUDGET_ITEMS.reduce((s, i) => s + i.allocated, 0)
  const totalSpent = BUDGET_ITEMS.reduce((s, i) => s + i.spent, 0)
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 14, padding: 14 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 4px' }}>Total Budget</p>
          <p style={{ color: '#1abc9c', fontSize: 20, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>KSH {(totalAllocated / 1000).toFixed(0)}K</p>
        </div>
        <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)', borderRadius: 14, padding: 14 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 4px' }}>Total Spent</p>
          <p style={{ color: '#ec7063', fontSize: 20, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>KSH {(totalSpent / 1000).toFixed(0)}K</p>
        </div>
      </div>
      {BUDGET_ITEMS.map(b => {
        const pct = (b.spent / b.allocated) * 100
        return (
          <div key={b.category} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>{b.category}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>KSH {(b.spent / 1000).toFixed(0)}K / {(b.allocated / 1000).toFixed(0)}K</p>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: pct > 90 ? '#e74c3c' : pct > 70 ? '#f39c12' : '#2980b9', borderRadius: 3 }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '4px 0 0', fontFamily: 'DM Mono, monospace' }}>{pct.toFixed(0)}% used</p>
          </div>
        )
      })}
    </div>
  )
}

function ScheduleTab() {
  return (
    <div>
      <div style={{ position: 'relative', paddingLeft: 20 }}>
        <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.1)' }} />
        {SCHEDULE.map((s, i) => (
          <div key={s.milestone} style={{ position: 'relative', marginBottom: 20 }}>
            <div style={{ position: 'absolute', left: -16, top: 3, width: 14, height: 14, borderRadius: '50%', background: s.done ? '#1abc9c' : 'rgba(255,255,255,0.15)', border: `2px solid ${s.done ? '#1abc9c' : 'rgba(255,255,255,0.2)'}` }} />
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px' }}>
              <p style={{ color: s.done ? '#1abc9c' : 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{s.milestone} {s.done ? '✓' : ''}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>{s.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsTabPreview({ project, onOpenFull }: { project: Project; onOpenFull: () => void }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Views', value: `${(project.totalViews / 1000).toFixed(0)}K`, icon: '👁' },
          { label: 'Watch Hrs', value: `${(project.watchHours / 1000).toFixed(1)}K`, icon: '⏱' },
          { label: 'Revenue', value: `KSH ${project.totalRevenue.toLocaleString()}`, icon: '💰' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{s.icon}</span>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={onOpenFull} style={{ width: '100%' }}>View Full Analytics →</button>
    </div>
  )
}

function SettingsTab() {
  const [downloadable, setDownloadable] = useState(true)
  const [comments, setComments] = useState(true)
  const [ageGate, setAgeGate] = useState(false)

  return (
    <div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        {[
          { label: 'Allow Downloads', sub: 'Viewers can download for offline', val: downloadable, set: setDownloadable },
          { label: 'Enable Comments', sub: 'Allow viewers to comment', val: comments, set: setComments },
          { label: 'Age Gate (16+)', sub: 'Require age verification', val: ageGate, set: setAgeGate },
        ].map(({ label, sub, val, set }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{sub}</p>
            </div>
            <div onClick={() => set(!val)} style={{ width: 48, height: 28, borderRadius: 14, background: val ? '#2980b9' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: val ? 22 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
        ))}
      </div>

      <button style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)', color: '#ec7063', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 8 }}>
        🗑 Delete Project
      </button>
    </div>
  )
}

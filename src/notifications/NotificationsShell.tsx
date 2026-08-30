import { useState } from 'react'
import {
  NOTIFS, TASKS, COLLAB_REQUESTS, DOWNLOADS, TIMELINE, AI_SUGGESTIONS,
  MODULE_META, CAT_META, PRIORITY_COLOR,
  type PwaniNotif, type Task, type CollabRequest, type Download,
  type NotifCategory, type NotifModule,
} from './data'

type Tab = 'all' | 'activity' | 'tasks' | 'settings'

type SubScreen =
  | { id: 'root' }
  | { id: 'downloads' }
  | { id: 'search' }
  | { id: 'archive' }
  | { id: 'digest' }
  | { id: 'ai-recs' }
  | { id: 'security' }
  | { id: 'opportunities' }

type Props = { onExit: () => void }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'all',      label: 'All',      icon: '🔔' },
  { key: 'activity', label: 'Activity', icon: '📊' },
  { key: 'tasks',    label: 'Tasks',    icon: '✅' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

// ─── Utility ─────────────────────────────────────────────────────────────────

function PriorityDot({ p }: { p: 'high' | 'medium' | 'low' }) {
  return <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[p], flexShrink: 0 }} />
}

function ModuleBadge({ module }: { module: NotifModule }) {
  const m = MODULE_META[module]
  return (
    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}28`, fontWeight: 700, fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
      {m.icon} {m.label}
    </span>
  )
}

function Toast({ msg }: { msg: string }) {
  return (
    <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease', pointerEvents: 'none' }}>{msg}</div>
  )
}

function FullScreen({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 68, overflowY: 'auto', paddingBottom: 32 }}>
        {children}
      </div>
    </div>
  )
}

// ─── All Notifications Tab ────────────────────────────────────────────────────

function AllTab({ onSubScreen }: { onSubScreen: (s: SubScreen) => void }) {
  const [notifs, setNotifs] = useState<PwaniNotif[]>(NOTIFS.filter(n => !n.archived))
  const [catFilter, setCatFilter] = useState<NotifCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  const markAllRead = () => { setNotifs(p => p.map(n => ({ ...n, read: true }))); showToast('All marked as read') }
  const markRead = (id: string) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const archive = (id: string) => { setNotifs(p => p.filter(n => n.id !== id)); showToast('Archived') }
  const dismiss = (id: string) => { setNotifs(p => p.filter(n => n.id !== id)); showToast('Dismissed') }

  const unread = notifs.filter(n => !n.read).length

  const filtered = notifs.filter(n => {
    if (catFilter !== 'all' && n.category !== catFilter) return false
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.body.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const CATS: (NotifCategory | 'all')[] = ['all', 'payments', 'community', 'jobs', 'learning', 'content', 'studio', 'passport', 'ai', 'security', 'system']

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      {toast && <Toast msg={toast} />}

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto' }}>
        {[
          { label: 'Unread', val: unread, color: '#e74c3c', action: () => {} },
          { label: 'Downloads', val: DOWNLOADS.filter(d => d.status === 'active').length, color: '#2980b9', action: () => onSubScreen({ id: 'downloads' }) },
          { label: 'Opportunities', val: 4, color: '#f39c12', action: () => onSubScreen({ id: 'opportunities' }) },
          { label: 'Security', val: 1, color: '#e74c3c', action: () => onSubScreen({ id: 'security' }) },
          { label: 'AI Tips', val: AI_SUGGESTIONS.length, color: '#5dade2', action: () => onSubScreen({ id: 'ai-recs' }) },
        ].map(c => (
          <button key={c.label} onClick={c.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px', borderRadius: 14, background: `${c.color}10`, border: `1px solid ${c.color}20`, cursor: 'pointer', flexShrink: 0, minWidth: 72 }}>
            <span style={{ color: c.color, fontSize: 18, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>{c.val}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2, fontFamily: 'Outfit, sans-serif' }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
          <input
            className="input-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notifications…"
            style={{ margin: 0, paddingLeft: 38, width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, padding: '0 20px 16px', overflowX: 'auto' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 100, border: 'none', cursor: 'pointer', background: catFilter === c ? '#1e6091' : 'rgba(255,255,255,0.07)', color: catFilter === c ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            {c === 'all' ? 'All' : CAT_META[c].icon + ' ' + CAT_META[c].label}
          </button>
        ))}
      </div>

      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 12px' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{filtered.length} notifications{unread > 0 ? ` · ${unread} unread` : ''}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && <button onClick={markAllRead} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Mark all read</button>}
          <button onClick={() => onSubScreen({ id: 'archive' })} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Archive</button>
        </div>
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 20px' }}>
        {filtered.map(n => (
          <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} onArchive={() => archive(n.id)} onDismiss={() => dismiss(n.id)} onSnooze={() => showToast('Snoozed for 1 hour')} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No notifications</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>You are all caught up! Check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NotifCard({ n, onRead, onArchive, onDismiss, onSnooze }: { n: PwaniNotif; onRead: () => void; onArchive: () => void; onDismiss: () => void; onSnooze: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const m = MODULE_META[n.module]
  return (
    <div onClick={() => { setExpanded(!expanded); onRead() }} style={{ borderRadius: 16, background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(41,128,185,0.07)', border: `1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(41,128,185,0.15)'}`, cursor: 'pointer', overflow: 'hidden', transition: 'background 0.15s' }}>
      <div style={{ display: 'flex', gap: 12, padding: '13px 14px', alignItems: 'flex-start' }}>
        {!n.read && <div style={{ position: 'absolute', marginLeft: -4, marginTop: 4, width: 6, height: 6, borderRadius: '50%', background: '#2980b9', display: 'inline-block' }} />}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{n.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PriorityDot p={n.priority} />
              <p style={{ color: n.read ? 'rgba(255,255,255,0.75)' : 'white', fontSize: 13, fontWeight: n.read ? 600 : 700, margin: 0, lineHeight: 1.3 }}>{n.title}</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{n.time}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '2px 0 5px', lineHeight: 1.4 }}>{n.body}</p>
          <ModuleBadge module={n.module} />
        </div>
      </div>
      {expanded && (
        <div style={{ display: 'flex', gap: 6, padding: '0 14px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
          {n.actionLabel && <button style={{ padding: '7px 14px', borderRadius: 9, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{n.actionLabel}</button>}
          <button onClick={onArchive} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>📦 Archive</button>
          <button onClick={onSnooze} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>⏰ Snooze</button>
          <button onClick={onDismiss} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(231,76,60,0.06)', border: 'none', color: '#e74c3c', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>🗑 Dismiss</button>
        </div>
      )}
    </div>
  )
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

function ActivityTab() {
  const [modFilter, setModFilter] = useState<NotifModule | 'all'>('all')
  const filtered = modFilter === 'all' ? TIMELINE : TIMELINE.filter(e => e.module === modFilter)

  const mods: (NotifModule | 'all')[] = ['all', 'play', 'studio', 'wallet', 'connect', 'learn', 'passport', 'hub', 'ai']

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Activity Timeline</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px' }}>Everything that happened across your account</p>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16 }}>
          {mods.map(m => {
            const meta = m === 'all' ? null : MODULE_META[m]
            return (
              <button key={m} onClick={() => setModFilter(m)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', background: modFilter === m ? '#1e6091' : 'rgba(255,255,255,0.07)', color: modFilter === m ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                {meta ? `${meta.icon} ${meta.label}` : 'All'}
              </button>
            )
          })}
        </div>

        {/* Smart Digest card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.12), rgba(26,188,156,0.07))', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 18, padding: '16px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(41,128,185,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📋</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Today's Smart Digest</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>AI summary of your daily activity, earnings, and learning progress</p>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>View</button>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 21, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {filtered.map((ev, i) => (
              <div key={ev.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: i < filtered.length - 1 ? 20 : 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${ev.color}18`, border: `2px solid ${ev.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, zIndex: 1, background2: '#0a1628' } as React.CSSProperties}>{ev.icon}</div>
                <div style={{ flex: 1, paddingTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>{ev.title}</p>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 8 }}>{ev.time}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 5px', lineHeight: 1.4 }}>{ev.body}</p>
                  <ModuleBadge module={ev.module} />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', marginLeft: 60 }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>No activity for this module</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [view, setView] = useState<'tasks' | 'collab'>('tasks')
  const [collabs, setCollabs] = useState<CollabRequest[]>(COLLAB_REQUESTS)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  const toggleDone = (id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const acceptCollab = (id: string) => { setCollabs(p => p.filter(c => c.id !== id)); showToast('Request accepted!') }
  const declineCollab = (id: string) => { setCollabs(p => p.filter(c => c.id !== id)); showToast('Request declined') }

  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  const COLLAB_TYPE_META: Record<CollabRequest['type'], { icon: string; color: string }> = {
    team:        { icon: '👥', color: '#2980b9' },
    project:     { icon: '🎬', color: '#9b59b6' },
    community:   { icon: '🏘️', color: '#16a085' },
    mentor:      { icon: '🎓', color: '#f39c12' },
    partnership: { icon: '🤝', color: '#e91e8c' },
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 16px' }}>Tasks & Requests</h2>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
          {([['tasks', '✅ Task Center'], ['collab', '🤝 Collaboration']] as const).map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', background: view === v ? '#1e6091' : 'transparent', color: view === v ? 'white' : 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{label}</button>
          ))}
        </div>

        {view === 'tasks' && (
          <>
            {/* Progress summary */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#e74c3c', fontSize: 22, fontFamily: 'DM Serif Display, serif', margin: '0 0 2px' }}>{pending.length}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>Pending</p>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#1abc9c', fontSize: 22, fontFamily: 'DM Serif Display, serif', margin: '0 0 2px' }}>{done.length}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>Done</p>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ width: `${(done.length / tasks.length) * 100}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #1abc9c, #2ecc71)' }} />
                </div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Pending</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {pending.map(t => <TaskCard key={t.id} task={t} onToggle={() => toggleDone(t.id)} />)}
            </div>

            {done.length > 0 && (
              <>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Completed</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {done.map(t => <TaskCard key={t.id} task={t} onToggle={() => toggleDone(t.id)} />)}
                </div>
              </>
            )}
          </>
        )}

        {view === 'collab' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {collabs.map(c => {
              const meta = COLLAB_TYPE_META[c.type]
              return (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
                  <div style={{ padding: '15px 16px 12px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.fromAvatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{c.fromName}</p>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{meta.icon} {c.type}</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 2px' }}>{c.fromRole}</p>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{c.time}</span>
                      </div>
                    </div>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{c.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{c.body}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => acceptCollab(c.id)} style={{ flex: 1, padding: '11px', background: 'rgba(26,188,156,0.08)', border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)', color: '#1abc9c', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✓ Accept</button>
                    <button onClick={() => declineCollab(c.id)} style={{ flex: 1, padding: '11px', background: 'transparent', border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✕ Decline</button>
                    <button style={{ flex: 1, padding: '11px', background: 'transparent', border: 'none', color: '#5dade2', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>💬 Message</button>
                  </div>
                </div>
              )
            })}
            {collabs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
                <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No pending requests</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>All collaboration requests handled!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TaskCard({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const PRIORITY_LABEL: Record<string, string> = { high: '🔴 High', medium: '🟡 Medium', low: '⚪ Low' }
  const m = MODULE_META[task.module]
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${task.done ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <button onClick={onToggle} style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${task.done ? '#1abc9c' : 'rgba(255,255,255,0.2)'}`, background: task.done ? '#1abc9c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2, fontSize: 13, color: 'white' }}>
          {task.done ? '✓' : ''}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
            <p style={{ color: task.done ? 'rgba(255,255,255,0.35)' : 'white', fontSize: 14, fontWeight: 700, margin: 0, textDecoration: task.done ? 'line-through' : 'none' }}>{task.icon} {task.title}</p>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{PRIORITY_LABEL[task.priority]}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 8px' }}>{task.desc}</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>📅 {task.dueDate}</span>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${m.color}15`, color: m.color, fontWeight: 700 }}>{m.icon} {m.label}</span>
            {task.progress > 0 && !task.done && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 80 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ width: `${task.progress}%`, height: '100%', borderRadius: 2, background: '#2980b9' }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{task.progress}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ onSubScreen }: { onSubScreen: (s: SubScreen) => void }) {
  const MODULES: { key: NotifModule; freq: string }[] = [
    { key: 'play', freq: 'Instant' },
    { key: 'studio', freq: 'Instant' },
    { key: 'passport', freq: 'Daily Digest' },
    { key: 'wallet', freq: 'Instant' },
    { key: 'connect', freq: 'Instant' },
    { key: 'learn', freq: 'Daily Digest' },
    { key: 'hub', freq: 'Instant' },
    { key: 'ai', freq: 'Weekly Summary' },
    { key: 'system', freq: 'Weekly Summary' },
    { key: 'security', freq: 'Instant' },
  ]
  const [channels, setChannels] = useState({ push: true, email: true, sms: false, inApp: true })
  const [freqs, setFreqs] = useState<Record<string, string>>(Object.fromEntries(MODULES.map(m => [m.key, m.freq])))
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  const FREQ_OPTIONS = ['Instant', 'Daily Digest', 'Weekly Summary', 'Mute', 'Priority Only']

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Notification Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Control how and when you hear from Pwani Play</p>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: '📋 Smart Digest', action: () => onSubScreen({ id: 'digest' }) },
            { label: '🔍 Search', action: () => onSubScreen({ id: 'search' }) },
            { label: '📦 Archive', action: () => onSubScreen({ id: 'archive' }) },
          ].map(l => (
            <button key={l.label} onClick={l.action} style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>{l.label}</button>
          ))}
        </div>

        {/* Channels */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Delivery Channels</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
          {([['push', '🔔 Push Notifications'], ['email', '📧 Email'], ['sms', '📱 SMS'], ['inApp', '💬 In-App']] as const).map(([k, label], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{label}</span>
              <button onClick={() => { setChannels(p => ({ ...p, [k]: !p[k] })); showToast('Setting saved') }} style={{ width: 46, height: 26, borderRadius: 13, background: channels[k] ? '#1e6091' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: channels[k] ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Per-module frequency */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Per-Module Frequency</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {MODULES.map(({ key }) => {
            const m = MODULE_META[key]
            return (
              <div key={key} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{m.icon}</div>
                <p style={{ color: 'white', fontSize: 14, margin: 0, fontWeight: 600, flex: 1 }}>{m.label}</p>
                <select
                  value={freqs[key]}
                  onChange={e => { setFreqs(p => ({ ...p, [key]: e.target.value })); showToast('Saved') }}
                  style={{ padding: '6px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, cursor: 'pointer', outline: 'none', fontFamily: 'Outfit, sans-serif' }}
                >
                  {FREQ_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#0a1628' }}>{o}</option>)}
                </select>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-screens ──────────────────────────────────────────────────────────────

function DownloadCenter({ onBack }: { onBack: () => void }) {
  const [downloads, setDownloads] = useState<Download[]>(DOWNLOADS)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  const update = (id: string, status: Download['status']) => setDownloads(p => p.map(d => d.id === id ? { ...d, status } : d))
  const remove = (id: string) => { setDownloads(p => p.filter(d => d.id !== id)); showToast('Removed') }

  const totalUsed = 4.8
  const totalAvail = 32

  const STATUS_CFG: Record<Download['status'], { label: string; color: string }> = {
    active:  { label: 'Downloading', color: '#2980b9' },
    paused:  { label: 'Paused',      color: '#f39c12' },
    failed:  { label: 'Failed',      color: '#e74c3c' },
    done:    { label: 'Complete',    color: '#1abc9c' },
  }

  return (
    <FullScreen title="Download Center" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        {/* Storage bar */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Storage Used</p>
            <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{totalUsed} GB / {totalAvail} GB</p>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: `${(totalUsed / totalAvail) * 100}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #2980b9, #1abc9c)' }} />
          </div>
        </div>

        {/* Downloads list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {downloads.map(d => {
            const cfg = STATUS_CFG[d.status]
            return (
              <div key={d.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{d.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{d.title}</p>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${cfg.color}15`, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 6px', fontFamily: 'DM Mono, monospace' }}>{d.type} · {d.size}</p>
                    {d.status !== 'done' && (
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ width: `${d.progress}%`, height: '100%', borderRadius: 2, background: cfg.color, transition: 'width 0.3s' }} />
                      </div>
                    )}
                    {d.status === 'active' && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '4px 0 0', fontFamily: 'DM Mono, monospace' }}>{d.progress}% complete</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  {d.status === 'active' && <button onClick={() => update(d.id, 'paused')} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>⏸ Pause</button>}
                  {d.status === 'paused' && <button onClick={() => update(d.id, 'active')} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(41,128,185,0.1)', border: 'none', color: '#5dade2', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>▶ Resume</button>}
                  {d.status === 'failed' && <button onClick={() => update(d.id, 'active')} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(243,156,18,0.08)', border: 'none', color: '#f39c12', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>🔄 Retry</button>}
                  <button onClick={() => remove(d.id)} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(231,76,60,0.06)', border: 'none', color: '#e74c3c', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>🗑 Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </FullScreen>
  )
}

function SearchActivity({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('')
  const [modFilter, setModFilter] = useState<NotifModule | 'all'>('all')

  const results = NOTIFS.filter(n => {
    if (modFilter !== 'all' && n.module !== modFilter) return false
    if (!query) return false
    return n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase())
  })

  const SAVED = ['payment received', 'casting calls', 'grant deadlines']

  return (
    <FullScreen title="Search Activity" onBack={onBack}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
          <input autoFocus className="input-field" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword, module, type…" style={{ margin: 0, paddingLeft: 38, width: '100%', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16 }}>
          {(['all', 'play', 'studio', 'wallet', 'connect', 'learn', 'hub', 'ai', 'security'] as const).map(m => {
            const meta = m === 'all' ? null : MODULE_META[m]
            return (
              <button key={m} onClick={() => setModFilter(m)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', background: modFilter === m ? '#1e6091' : 'rgba(255,255,255,0.07)', color: modFilter === m ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}>
                {meta ? `${meta.icon} ${meta.label}` : 'All'}
              </button>
            )
          })}
        </div>

        {!query && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Saved Searches</p>
            {SAVED.map(s => (
              <button key={s} onClick={() => setQuery(s)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 16 }}>🔖</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{s}</span>
              </button>
            ))}
          </>
        )}

        {query && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 12px', fontFamily: 'DM Mono, monospace' }}>{results.length} result{results.length !== 1 ? 's' : ''}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map(n => (
                <div key={n.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '13px 14px' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 20 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{n.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 5px' }}>{n.body}</p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <ModuleBadge module={n.module} />
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{n.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>No notifications match "{query}"</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </FullScreen>
  )
}

function ArchiveScreen({ onBack }: { onBack: () => void }) {
  const [archived, setArchived] = useState<PwaniNotif[]>(NOTIFS.filter(n => n.archived))
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }
  const restore = (id: string) => { setArchived(p => p.filter(n => n.id !== id)); showToast('Restored to inbox') }
  const remove = (id: string) => { setArchived(p => p.filter(n => n.id !== id)); showToast('Permanently deleted') }

  return (
    <FullScreen title="Archive" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px' }}>{archived.length} archived notification{archived.length !== 1 ? 's' : ''}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {archived.map(n => (
            <div key={n.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '13px 14px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{n.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 5px' }}>{n.body}</p>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{n.time}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => restore(n.id)} style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(41,128,185,0.08)', border: 'none', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↩ Restore</button>
                <button onClick={() => remove(n.id)} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(231,76,60,0.06)', border: 'none', color: '#e74c3c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🗑 Delete</button>
              </div>
            </div>
          ))}
          {archived.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Archive is empty</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Archived notifications appear here.</p>
            </div>
          )}
        </div>
      </div>
    </FullScreen>
  )
}

function SmartDigest({ onBack }: { onBack: () => void }) {
  const stats = [
    { icon: '📚', label: 'Learning Progress', val: '75%', sub: 'Film Editing — Module 4 next', color: '#e67e22' },
    { icon: '💰', label: 'Earnings This Week', val: 'KES 3,900', sub: '+KES 500 tip + KES 3,400 subs revenue', color: '#1abc9c' },
    { icon: '🖼️', label: 'Portfolio Updates', val: '1 draft', sub: '"Swahili Coast" ready to publish', color: '#9b59b6' },
    { icon: '🤝', label: 'Community Activity', val: '3 events', sub: '1 collab request pending reply', color: '#2980b9' },
    { icon: '🎯', label: 'New Opportunities', val: '6 matches', sub: '1 casting, 1 grant, 4 jobs', color: '#f39c12' },
    { icon: '🎬', label: 'Viewing History', val: '4h 12m', sub: '3 films, 2 short films watched', color: '#e74c3c' },
  ]

  return (
    <FullScreen title="Smart Digest" onBack={onBack}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.15), rgba(26,188,156,0.08))', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 18, padding: '18px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 36 }}>🤖</span>
          <div>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 3px', fontFamily: 'DM Serif Display, serif' }}>Today's AI Digest — Mon, 10 Aug 2026</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>A summary of your activity, earnings, and opportunities across all modules</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: '0 0 2px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <p style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI insight */}
        <div style={{ background: 'rgba(93,173,226,0.07)', border: '1px solid rgba(93,173,226,0.15)', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
          <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>🤖 AI Insight</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            You are most active on Tuesday evenings. Publishing "Swahili Coast" tonight at 8 PM EAT could reach 3× your usual audience. The Kenya Film Commission Grant deadline is in 22 days — your profile matches 91% of requirements.
          </p>
        </div>
      </div>
    </FullScreen>
  )
}

function AIRecsScreen({ onBack }: { onBack: () => void }) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }
  const visible = AI_SUGGESTIONS.filter((_, i) => !dismissed.includes(String(i)))

  return (
    <FullScreen title="AI Recommendations" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(93,173,226,0.12), rgba(26,188,156,0.07))', border: '1px solid rgba(93,173,226,0.2)', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 28 }}>🤖</span>
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Pwani AI — Intelligent Suggestions</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Personalized recommendations based on your profile and activity</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(93,173,226,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{s.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 6px', lineHeight: 1.5 }}>{s.body}</p>
                  <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 100, background: 'rgba(93,173,226,0.1)', color: '#5dade2', border: '1px solid rgba(93,173,226,0.2)', fontFamily: 'DM Mono, monospace' }}>💡 {s.reason}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => showToast('Action started!')} style={{ flex: 1, padding: '8px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Take Action</button>
                <button onClick={() => { setDismissed(p => [...p, String(i)]); showToast('Dismissed') }} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>All caught up!</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Check back tomorrow for new personalized recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </FullScreen>
  )
}

function SecurityScreen({ onBack }: { onBack: () => void }) {
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }
  const alerts = NOTIFS.filter(n => n.category === 'security')
  const events = [
    { icon: '📱', device: 'iPhone 15 Pro', location: 'Nairobi, Kenya', time: 'Active now', trusted: true },
    { icon: '💻', device: 'MacBook Air', location: 'Nairobi, Kenya', time: '2h ago', trusted: true },
    { icon: '📟', device: 'iPad Air', location: 'Nairobi, Kenya', time: '3h ago', trusted: false },
  ]
  return (
    <FullScreen title="Security Alerts" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        {alerts.map(n => (
          <div key={n.id} style={{ background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.15)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(231,76,60,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🔐</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{n.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 8px', lineHeight: 1.4 }}>{n.body}</p>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => showToast('Security settings opened')} style={{ padding: '7px 14px', borderRadius: 9, background: '#e74c3c', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Review Now</button>
                <button onClick={() => showToast('Marked as safe')} style={{ padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>Was me</button>
              </div>
            </div>
          </div>
        ))}

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '16px 0 12px' }}>Active Sessions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
              <span style={{ fontSize: 24 }}>{e.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{e.device}</p>
                  {e.trusted && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'rgba(26,188,156,0.12)', color: '#1abc9c', fontWeight: 700 }}>Trusted</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '1px 0 0', fontFamily: 'DM Mono, monospace' }}>{e.location} · {e.time}</p>
              </div>
              {!e.trusted && <button onClick={() => showToast('Session revoked')} style={{ padding: '6px 12px', borderRadius: 9, background: 'rgba(231,76,60,0.08)', border: 'none', color: '#e74c3c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Revoke</button>}
            </div>
          ))}
        </div>
      </div>
    </FullScreen>
  )
}

function OpportunitiesScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }
  const toggleSave = (id: string) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const opportunities = [
    { id: 'o1', type: 'Casting Call', icon: '🎭', color: '#e74c3c', title: 'Short Film Lead Actor', org: 'Nairobi Film Collective', deadline: '20 Aug 2026', pay: 'KES 15,000', match: 94 },
    { id: 'o2', type: 'Grant', icon: '🏆', color: '#f39c12', title: 'Kenya Film Commission Grant 2026', org: 'KFC', deadline: '1 Sep 2026', pay: 'KES 250,000', match: 91 },
    { id: 'o3', type: 'Job', icon: '💼', color: '#2980b9', title: 'Freelance Cinematographer', org: 'Savannah Media House', deadline: 'Open', pay: 'KES 8,000/day', match: 88 },
    { id: 'o4', type: 'Festival', icon: '🌍', color: '#9b59b6', title: 'DIFF 2026 — Film Submissions', org: 'Durban Int\'l Film Festival', deadline: '15 Sep 2026', pay: 'Prize + Exposure', match: 82 },
  ]

  return (
    <FullScreen title="Opportunity Alerts" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px' }}>{opportunities.length} opportunities matching your profile</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {opportunities.map(o => (
            <div key={o.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${o.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{o.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${o.color}15`, color: o.color, fontWeight: 700 }}>{o.type}</span>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(26,188,156,0.1)', color: '#1abc9c', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>⚡ {o.match}% match</span>
                    </div>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{o.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{o.org} · Deadline: {o.deadline}</p>
                  </div>
                  <button onClick={() => toggleSave(o.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 0, color: saved.includes(o.id) ? '#f39c12' : 'rgba(255,255,255,0.2)' }}>
                    {saved.includes(o.id) ? '★' : '☆'}
                  </button>
                </div>
                <p style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, margin: '0 0 10px', fontFamily: 'DM Mono, monospace' }}>{o.pay}</p>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => showToast('Application started!')} style={{ flex: 2, padding: '10px', background: '#1e6091', border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Apply Now</button>
                <button onClick={() => showToast('Dismissed')} style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FullScreen>
  )
}

// ─── Dashboard Header ─────────────────────────────────────────────────────────

function DashboardHeader({ onExit, onSearch, unread }: { onExit: () => void; onSearch: () => void; unread: number }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px 0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
        <button onClick={onExit} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#1abc9c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔔</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Notifications</span>
          {unread > 0 && <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: '#e74c3c', color: 'white', fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>{unread}</span>}
        </div>
        <button onClick={onSearch} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: 'white' }}>🔍</button>
      </div>
    </div>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function NotificationsShell({ onExit }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const [subScreen, setSubScreen] = useState<SubScreen>({ id: 'root' })

  const unread = NOTIFS.filter(n => !n.read && !n.archived).length
  const isRoot = subScreen.id === 'root'

  const go = (s: SubScreen) => setSubScreen(s)
  const goRoot = () => setSubScreen({ id: 'root' })

  const renderSubScreen = () => {
    switch (subScreen.id) {
      case 'downloads':    return <DownloadCenter onBack={goRoot} />
      case 'search':       return <SearchActivity onBack={goRoot} />
      case 'archive':      return <ArchiveScreen onBack={goRoot} />
      case 'digest':       return <SmartDigest onBack={goRoot} />
      case 'ai-recs':      return <AIRecsScreen onBack={goRoot} />
      case 'security':     return <SecurityScreen onBack={goRoot} />
      case 'opportunities': return <OpportunitiesScreen onBack={goRoot} />
    }
  }

  const renderTab = () => {
    switch (tab) {
      case 'all':      return <AllTab onSubScreen={go} />
      case 'activity': return <ActivityTab />
      case 'tasks':    return <TasksTab />
      case 'settings': return <SettingsTab onSubScreen={go} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {isRoot && (
        <>
          <DashboardHeader onExit={onExit} onSearch={() => go({ id: 'search' })} unread={unread} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {renderTab()}
          </div>
          {/* Bottom nav */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', padding: '8px 0 20px' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
                <span style={{ fontSize: 20, filter: tab === t.key ? 'none' : 'grayscale(1) opacity(0.4)' }}>{t.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: tab === t.key ? '#5dade2' : 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>{t.label}</span>
                {tab === t.key && <div style={{ width: 18, height: 2, borderRadius: 1, background: '#2980b9' }} />}
              </button>
            ))}
          </div>
        </>
      )}
      {!isRoot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0a1628', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.22s ease' }}>
          {renderSubScreen()}
        </div>
      )}
    </div>
  )
}

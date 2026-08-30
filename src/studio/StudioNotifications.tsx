import { useState } from 'react'
import { STUDIO_NOTIFS } from './data'
import type { StudioNotif } from './data'

type Props = { onBack: () => void }

type Filter = 'all' | 'unread' | 'publish' | 'upload' | 'review' | 'comment' | 'collab' | 'revenue'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'publish', label: 'Publish' },
  { key: 'upload', label: 'Uploads' },
  { key: 'review', label: 'Review' },
  { key: 'comment', label: 'Comments' },
  { key: 'collab', label: 'Collab' },
  { key: 'revenue', label: 'Revenue' },
]

export default function StudioNotifications({ onBack }: Props) {
  const [notifs, setNotifs] = useState<StudioNotif[]>(STUDIO_NOTIFS)
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter !== 'all') return n.type === filter
    return true
  })

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Studio Notifications</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: filter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: filter === f.key ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔔</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>All caught up!</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>No notifications here.</p>
          </div>
        ) : filtered.map((n, i) => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{
            display: 'flex', gap: 12, padding: '14px 20px',
            background: !n.read ? 'rgba(41,128,185,0.05)' : 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: !n.read ? 'white' : 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: !n.read ? 700 : 400, margin: '0 0 3px' }}>{n.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 4px', lineHeight: 1.4 }}>{n.body}</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980b9', flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

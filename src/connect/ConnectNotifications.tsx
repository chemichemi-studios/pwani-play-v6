import { useState } from 'react'
import { CONNECT_NOTIFICATIONS } from './data'
import type { ConnectNotification } from './data'

type Props = { onProfile: (id: string) => void }

const NOTIF_CONFIG: Record<ConnectNotification['type'], { icon: string; color: string }> = {
  connection_request: { icon: '🤝', color: '#2980b9' },
  connection_accepted: { icon: '✅', color: '#1abc9c' },
  community_invite: { icon: '🌐', color: '#9b59b6' },
  new_message: { icon: '💬', color: '#5dade2' },
  event_reminder: { icon: '📅', color: '#f39c12' },
  project_invite: { icon: '🎬', color: '#e67e22' },
  mention: { icon: '🔔', color: '#e91e8c' },
  recommendation: { icon: '⭐', color: '#f8c471' },
  new_follower: { icon: '👤', color: '#27ae60' },
  post_reaction: { icon: '❤️', color: '#e74c3c' },
}

export default function ConnectNotifications({ onProfile }: Props) {
  const [notifs, setNotifs] = useState(CONNECT_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const unread = notifs.filter(n => !n.read).length
  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Notifications</h2>
          {unread > 0 && <button onClick={markAllRead} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Mark all read</button>}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px' }}>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 18px', borderRadius: 100, border: 'none', cursor: 'pointer', background: filter === f ? '#1e6091' : 'rgba(255,255,255,0.06)', color: filter === f ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>
              {f === 'all' ? 'All' : `Unread (${unread})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(n => {
            const cfg = NOTIF_CONFIG[n.type]
            return (
              <div key={n.id} onClick={() => { markRead(n.id); onProfile(n.actor.id) }} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 16, cursor: 'pointer', background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(41,128,185,0.06)', border: `1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(41,128,185,0.12)'}`, position: 'relative', alignItems: 'flex-start' }}>
                {!n.read && <div style={{ position: 'absolute', top: 14, right: 14, width: 7, height: 7, borderRadius: '50%', background: '#2980b9' }} />}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={n.actor.photo} alt={n.actor.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: `${cfg.color}22`, border: `1px solid ${cfg.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{cfg.icon}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: n.read ? 'rgba(255,255,255,0.7)' : 'white', fontSize: 13, fontWeight: n.read ? 500 : 700, margin: '0 0 4px', lineHeight: 1.4 }}>{n.content}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{n.timestamp}</p>
                  {n.actionable && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {n.type === 'connection_request' && (
                        <>
                          <button onClick={e => { e.stopPropagation(); markRead(n.id) }} style={{ padding: '6px 14px', borderRadius: 8, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Accept</button>
                          <button onClick={e => { e.stopPropagation(); markRead(n.id) }} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>Decline</button>
                        </>
                      )}
                      {n.type === 'project_invite' && (
                        <>
                          <button onClick={e => { e.stopPropagation(); markRead(n.id) }} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.2)', color: '#1abc9c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Join Team</button>
                          <button onClick={e => { e.stopPropagation(); markRead(n.id) }} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>Decline</button>
                        </>
                      )}
                      {n.type === 'community_invite' && (
                        <button onClick={e => { e.stopPropagation(); markRead(n.id) }} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View Invite</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No unread notifications</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>You are all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

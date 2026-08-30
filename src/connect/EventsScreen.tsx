import { useState } from 'react'
import { EVENTS, EVENT_TYPE_LABELS } from './data'
import type { ConnectEvent } from './data'

type Props = { onEvent: (id: string) => void }

type Filter = 'all' | 'workshop' | 'festival' | 'networking' | 'online'

export default function EventsScreen({ onEvent }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [events, setEvents] = useState(EVENTS)
  const [search, setSearch] = useState('')

  const filtered = events.filter(e => {
    const matchesFilter = filter === 'all' ? true : filter === 'online' ? e.isOnline : e.type === filter
    const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const saveToggle = (id: string, ev: React.MouseEvent) => {
    ev.stopPropagation()
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isSaved: !e.isSaved } : e))
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      {/* Search */}
      <div style={{ padding: '10px 16px', position: 'sticky', top: 56, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(8px)' }}>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" className="input-field" style={{ margin: 0, paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }} />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 16px 12px', overflowX: 'auto' }}>
        {(['all', 'workshop', 'festival', 'networking', 'online'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', background: filter === f ? '#1e6091' : 'rgba(255,255,255,0.06)', color: filter === f ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            {{ all: 'All Events', workshop: 'Workshops', festival: 'Festivals', networking: 'Networking', online: 'Online Only' }[f]}
          </button>
        ))}
      </div>

      {/* Registered CTA */}
      {events.some(e => e.isRegistered) && (
        <div style={{ margin: '0 16px 16px', padding: '12px 14px', background: 'rgba(26,188,156,0.07)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>📅</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>You have upcoming events</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Documentary Masterclass in 16 days</p>
          </div>
          <button style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(26,188,156,0.12)', border: '1px solid rgba(26,188,156,0.2)', color: '#1abc9c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View</button>
        </div>
      )}

      {/* Event list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(ev => <EventCard key={ev.id} event={ev} onPress={() => onEvent(ev.id)} onSave={e => saveToggle(ev.id, e)} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No events found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Check back soon for upcoming events in your area.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ event, onPress, onSave }: { event: ConnectEvent; onPress: () => void; onSave: (e: React.MouseEvent) => void }) {
  const TYPE_COLORS = { workshop: '#9b59b6', festival: '#f39c12', screening: '#e74c3c', networking: '#2980b9', training: '#1abc9c', livestream: '#e91e8c' }
  const color = TYPE_COLORS[event.type]
  const pct = Math.round((event.registered / event.capacity) * 100)

  return (
    <div onClick={onPress} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: 140 }}>
        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.2), rgba(10,22,40,0.8))' }} />
        <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: `${color}25`, color, border: `1px solid ${color}40`, fontWeight: 700 }}>{EVENT_TYPE_LABELS[event.type]}</span>
          {event.isOnline && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(26,188,156,0.2)', color: '#1abc9c', fontWeight: 700 }}>Online</span>}
          {event.isRegistered && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(41,128,185,0.25)', color: '#5dade2', fontWeight: 700 }}>✓ Registered</span>}
        </div>
        <button onClick={onSave} style={{ position: 'absolute', top: 10, right: 12, width: 32, height: 32, borderRadius: 10, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
          {event.isSaved ? '🔖' : '🏷️'}
        </button>
        <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Serif Display, serif', lineHeight: 1.2 }}>{event.title}</p>
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>📅 {event.date}</span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>📍 {event.location}</span>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{event.registered} / {event.capacity} registered</span>
            <span style={{ color: pct >= 90 ? '#e74c3c' : '#1abc9c', fontSize: 11, fontWeight: 700 }}>{pct}% full</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: pct >= 90 ? '#e74c3c' : '#1abc9c', borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: event.price === 0 ? '#1abc9c' : event.price === null ? '#1abc9c' : 'white', fontSize: 13, fontWeight: 700 }}>
            {event.price === null ? 'Free Admission' : event.price === 0 ? 'Free' : `KES ${event.price.toLocaleString()}`}
          </span>
          <button style={{ padding: '8px 16px', borderRadius: 10, background: event.isRegistered ? 'rgba(26,188,156,0.1)' : 'linear-gradient(90deg,#1e6091,#2980b9)', border: event.isRegistered ? '1px solid rgba(26,188,156,0.25)' : 'none', color: event.isRegistered ? '#1abc9c' : 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {event.isRegistered ? '✓ Registered' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}

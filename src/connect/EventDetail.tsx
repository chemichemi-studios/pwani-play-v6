import { useState } from 'react'
import { EVENTS, EVENT_TYPE_LABELS } from './data'

type Props = { eventId: string; onBack: () => void; onProfile: (id: string) => void }

type Step = 'detail' | 'register' | 'success'

export default function EventDetail({ eventId, onBack, onProfile }: Props) {
  const event = EVENTS.find(e => e.id === eventId) ?? EVENTS[0]
  const [step, setStep] = useState<Step>('detail')
  const [saved, setSaved] = useState(event.isSaved)
  const [registered, setRegistered] = useState(event.isRegistered)

  const TYPE_COLORS = { workshop: '#9b59b6', festival: '#f39c12', screening: '#e74c3c', networking: '#2980b9', training: '#1abc9c', livestream: '#e91e8c' }
  const color = TYPE_COLORS[event.type]
  const pct = Math.round((event.registered / event.capacity) * 100)

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🎉</div>
        <p style={{ color: '#1abc9c', fontSize: 26, fontFamily: 'DM Serif Display, serif', margin: 0, textAlign: 'center' }}>You are Registered!</p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{event.title}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', margin: '0 0 16px' }}>📅 {event.date} · 📍 {event.location}</p>
        <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 280 }}>
          <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>📅 Calendar</button>
          <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>🔗 Share</button>
        </div>
        <button className="btn-primary" onClick={onBack} style={{ width: '100%', maxWidth: 280, marginTop: 8 }}>Back to Events</button>
      </div>
    )
  }

  if (step === 'register') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setStep('detail')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white' }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>Register</h2>
        </div>
        <div style={{ flex: 1, padding: '20px 16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '14px', marginBottom: 20 }}>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>{event.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>📅 {event.date} · 📍 {event.location}</p>
          </div>
          {['Your name will appear on the attendee list', 'You will receive a confirmation email', 'Event reminders will be sent 24h and 1h before'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#1abc9c', fontSize: 16 }}>✓</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: 24 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px', textAlign: 'center' }}>
              {event.price === null || event.price === 0 ? 'This event is free.' : `Registration fee: KES ${event.price?.toLocaleString()}`}
            </p>
            <button className="btn-primary" onClick={() => { setRegistered(true); setStep('success') }} style={{ width: '100%' }}>
              {event.price ? 'Proceed to Payment' : 'Confirm Registration'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <img src={event.image} alt={event.title} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.85))' }} />
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 14, width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <button onClick={() => setSaved(!saved)} style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>{saved ? '🔖' : '🏷️'}</button>
        <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: `${color}25`, color, border: `1px solid ${color}40`, fontWeight: 700 }}>{EVENT_TYPE_LABELS[event.type]}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 100 }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>{event.title}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span>📅</span><span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{event.date} at {event.time}</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span>📍</span><span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{event.location}{event.isOnline && ' (Online)'}</span></div>
          <div onClick={() => onProfile(event.organizer.id)} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <img src={event.organizer.photo} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ color: '#5dade2', fontSize: 14 }}>Organised by {event.organizer.name}</span>
          </div>
        </div>

        {/* Capacity */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{event.registered} / {event.capacity} registered</span>
            <span style={{ color: pct >= 90 ? '#e74c3c' : '#1abc9c', fontSize: 13, fontWeight: 700 }}>{pct >= 90 ? '⚠ Almost full' : `${100 - pct}% spots left`}</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: pct >= 90 ? '#e74c3c' : '#1abc9c', borderRadius: 3 }} />
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>About This Event</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>{event.description}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {event.tags.map(t => <span key={t} style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12 }}>#{t}</span>)}
        </div>
      </div>

      {/* Action bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 2px' }}>Registration</p>
          <p style={{ color: event.price ? 'white' : '#1abc9c', fontSize: 15, fontWeight: 700, margin: 0 }}>{event.price === null || event.price === 0 ? 'Free' : `KES ${event.price.toLocaleString()}`}</p>
        </div>
        <button onClick={() => registered ? null : setStep('register')} style={{ padding: '12px 28px', borderRadius: 14, background: registered ? 'rgba(26,188,156,0.1)' : 'linear-gradient(90deg,#1e6091,#2980b9)', border: registered ? '1px solid rgba(26,188,156,0.3)' : 'none', color: registered ? '#1abc9c' : 'white', fontSize: 15, fontWeight: 700, cursor: registered ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          {registered ? '✓ Registered' : 'Register Now'}
        </button>
      </div>
    </div>
  )
}

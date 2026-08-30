import { useState } from 'react'
import { MENTORS } from './data'
import type { Mentor } from './data'

type Props = { onProfile: (id: string) => void }

const SESSION_ICONS = { video_call: '📹', voice_call: '📞', chat: '💬', in_person: '🤝' }
const SESSION_LABELS = { video_call: 'Video Call', voice_call: 'Voice Call', chat: 'Chat', in_person: 'In Person' }

export default function Mentorship({ onProfile }: Props) {
  const [mentors, setMentors] = useState(MENTORS)
  const [requestSent, setRequestSent] = useState<Record<string, boolean>>({})
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const toggleSave = (id: string) => setMentors(prev => prev.map(m => m.id === id ? { ...m, isSaved: !m.isSaved } : m))
  const sendRequest = (id: string) => { setRequestSent(prev => ({ ...prev, [id]: true })); showToast('Mentorship request sent! 🙏'); setSelectedMentor(null) }

  if (selectedMentor) {
    return (
      <MentorProfile
        mentor={selectedMentor}
        onBack={() => setSelectedMentor(null)}
        onProfile={() => onProfile(selectedMentor.profile.id)}
        onRequest={() => sendRequest(selectedMentor.id)}
        requestSent={!!requestSent[selectedMentor.id]}
        onSave={() => toggleSave(selectedMentor.id)}
      />
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>{toast}</div>}

      <div style={{ padding: '0 16px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Find a Mentor</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Connect with experienced professionals in your field</p>

        {/* Your mentor */}
        <div style={{ background: 'rgba(41,128,185,0.07)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 16, padding: '14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 26 }}>🎓</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Ready to grow your career?</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Find a mentor who has walked your path</p>
          </div>
        </div>

        {/* Mentor cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mentors.map(m => (
            <div key={m.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px', cursor: 'pointer' }} onClick={() => setSelectedMentor(m)}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={m.profile.photo} alt={m.profile.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                  {m.profile.verified && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>✓</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{m.profile.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 4px' }}>{m.profile.profession} · {m.profile.city}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#f8c471', fontSize: 12 }}>★ {m.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>({m.reviewCount} reviews)</span>
                    <span style={{ color: m.availableSlots > 0 ? '#1abc9c' : '#e74c3c', fontSize: 12, fontWeight: 600 }}>
                      {m.availableSlots > 0 ? `${m.availableSlots} slots open` : 'Full'}
                    </span>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleSave(m.id) }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 0 }}>
                  {m.isSaved ? '🔖' : '🏷️'}
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {m.expertise.slice(0, 3).map(e => <span key={e} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.15)', color: '#5dade2', fontSize: 11, fontWeight: 600 }}>{e}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {m.sessionTypes.slice(0, 3).map(t => <span key={t} title={SESSION_LABELS[t]} style={{ fontSize: 16 }}>{SESSION_ICONS[t]}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: m.sessionRate === null ? '#1abc9c' : 'white', fontSize: 13, fontWeight: 700 }}>
                    {m.sessionRate === null ? 'Free sessions' : `KES ${m.sessionRate.toLocaleString()}/session`}
                  </span>
                  <button onClick={e => { e.stopPropagation(); if (!requestSent[m.id]) sendRequest(m.id) }} style={{ padding: '8px 16px', borderRadius: 10, background: requestSent[m.id] ? 'rgba(26,188,156,0.1)' : 'linear-gradient(90deg,#1e6091,#2980b9)', border: requestSent[m.id] ? '1px solid rgba(26,188,156,0.25)' : 'none', color: requestSent[m.id] ? '#1abc9c' : 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    {requestSent[m.id] ? '✓ Requested' : 'Request'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MentorProfile({ mentor, onBack, onProfile, onRequest, requestSent, onSave }: { mentor: Mentor; onBack: () => void; onProfile: () => void; onRequest: () => void; requestSent: boolean; onSave: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>Mentor Profile</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', paddingBottom: 100 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div onClick={onProfile} style={{ cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
            <img src={mentor.profile.photo} alt={mentor.profile.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(41,128,185,0.4)' }} />
            {mentor.profile.verified && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 20, height: 20, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>✓</div>}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'white', fontSize: 20, fontFamily: 'DM Serif Display, serif', margin: '0 0 2px' }}>{mentor.profile.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 4px' }}>{mentor.profile.profession}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#f8c471', fontSize: 13 }}>★ {mentor.rating}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>({mentor.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{mentor.bio}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Areas of Expertise</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {mentor.expertise.map(e => <span key={e} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12 }}>{e}</span>)}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Session Types</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {mentor.sessionTypes.map(t => <span key={t} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{SESSION_ICONS[t]} {SESSION_LABELS[t]}</span>)}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Session rate</span>
            <span style={{ color: mentor.sessionRate === null ? '#1abc9c' : 'white', fontSize: 14, fontWeight: 700 }}>{mentor.sessionRate === null ? 'Free' : `KES ${mentor.sessionRate.toLocaleString()}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Available slots</span>
            <span style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700 }}>{mentor.availableSlots} open</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
        <button onClick={onSave} style={{ width: 44, height: 44, borderRadius: 12, background: mentor.isSaved ? 'rgba(26,188,156,0.1)' : 'rgba(255,255,255,0.06)', border: `1px solid ${mentor.isSaved ? 'rgba(26,188,156,0.25)' : 'rgba(255,255,255,0.1)'}`, color: mentor.isSaved ? '#1abc9c' : 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{mentor.isSaved ? '🔖' : '🏷️'}</button>
        <button onClick={onRequest} disabled={requestSent} style={{ flex: 1, padding: '12px', borderRadius: 14, background: requestSent ? 'rgba(26,188,156,0.1)' : 'linear-gradient(90deg,#1e6091,#2980b9)', border: requestSent ? '1px solid rgba(26,188,156,0.3)' : 'none', color: requestSent ? '#1abc9c' : 'white', fontSize: 15, fontWeight: 700, cursor: requestSent ? 'default' : 'pointer' }}>
          {requestSent ? '✓ Request Sent' : '🎓 Request Mentorship'}
        </button>
      </div>
    </div>
  )
}

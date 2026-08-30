import { useState } from 'react'
import { PRODUCTION_TEAMS, PROFILES } from './data'
import type { ProductionTeam } from './data'

type Props = { onProfile: (id: string) => void }

const STATUS_COLORS = { recruiting: '#2980b9', active: '#1abc9c', completed: 'rgba(255,255,255,0.3)' }
const STATUS_LABELS = { recruiting: '🔍 Recruiting', active: '✅ Active', completed: '🏁 Completed' }

export default function ProductionTeams({ onProfile }: Props) {
  const [teams] = useState(PRODUCTION_TEAMS)
  const [selected, setSelected] = useState<ProductionTeam | null>(null)
  const [inviteSent, setInviteSent] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  if (showCreate) return <CreateTeamForm onBack={() => setShowCreate(false)} />
  if (selected) return (
    <TeamDetail
      team={selected}
      onBack={() => setSelected(null)}
      onProfile={onProfile}
      onInvite={() => setInviteSent(true)}
      inviteSent={inviteSent}
    />
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Production Teams</h2>
          <button onClick={() => setShowCreate(true)} style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Create</button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Collaborate on productions</p>

        {/* My teams */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>My Teams</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {teams.filter(t => t.members.some(m => m.profile.id === 'me')).map(t => <TeamCard key={t.id} team={t} onPress={() => setSelected(t)} />)}
        </div>

        {/* Discover teams */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recruiting Now</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {teams.filter(t => t.status === 'recruiting').map(t => <TeamCard key={t.id + 'discover'} team={t} onPress={() => setSelected(t)} />)}
        </div>
      </div>
    </div>
  )
}

function TeamCard({ team, onPress }: { team: ProductionTeam; onPress: () => void }) {
  const color = STATUS_COLORS[team.status]
  return (
    <div onClick={onPress} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: 100 }}>
        <img src={team.coverImage} alt={team.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.2), rgba(10,22,40,0.8))' }} />
        <div style={{ position: 'absolute', top: 10, left: 12 }}>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: `${color}20`, color, border: `1px solid ${color}35`, fontWeight: 700 }}>{STATUS_LABELS[team.status]}</span>
        </div>
        {team.deadline && <div style={{ position: 'absolute', top: 10, right: 12 }}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Due {team.deadline.split('-').slice(1).join('/')}</span></div>}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Serif Display, serif' }}>{team.projectTitle}</p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{team.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: -6 }}>
            {team.members.slice(0, 4).map((m, i) => (
              <img key={m.profile.id} src={m.profile.photo} alt={m.profile.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0a1628', marginLeft: i > 0 ? -8 : 0 }} />
            ))}
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginLeft: 8, alignSelf: 'center' }}>{team.members.length} members</span>
          </div>
          {team.openRoles.length > 0 && <span style={{ color: '#2980b9', fontSize: 12, fontWeight: 700 }}>{team.openRoles.length} open roles</span>}
        </div>
      </div>
    </div>
  )
}

function TeamDetail({ team, onBack, onProfile, onInvite, inviteSent }: { team: ProductionTeam; onBack: () => void; onProfile: (id: string) => void; onInvite: () => void; inviteSent: boolean }) {
  const color = STATUS_COLORS[team.status]
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <img src={team.coverImage} alt={team.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.85))' }} />
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 14, width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: `${color}20`, color, border: `1px solid ${color}35`, fontWeight: 700, marginBottom: 8, display: 'inline-block' }}>{STATUS_LABELS[team.status]}</span>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: '4px 0 0', lineHeight: 1.2 }}>{team.projectTitle}</h2>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 100 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{team.description}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Team Members</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {team.members.map(m => (
            <div key={m.profile.id} onClick={() => onProfile(m.profile.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
              <img src={m.profile.photo} alt={m.profile.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{m.profile.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.role}</p>
              </div>
              <span style={{ color: '#5dade2', fontSize: 12 }}>›</span>
            </div>
          ))}
        </div>
        {team.openRoles.length > 0 && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Open Roles ({team.openRoles.length})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {team.openRoles.map(r => (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(41,128,185,0.07)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 12 }}>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{r}</span>
                  <button style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.25)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Apply</button>
                </div>
              ))}
            </div>
          </>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {team.tags.map(t => <span key={t} style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>#{t}</span>)}
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
        <button style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>💬 Message Team</button>
        <button onClick={() => !inviteSent && onInvite()} style={{ flex: 1, padding: '12px', borderRadius: 14, background: inviteSent ? 'rgba(26,188,156,0.1)' : 'linear-gradient(90deg,#1e6091,#2980b9)', border: inviteSent ? '1px solid rgba(26,188,156,0.3)' : 'none', color: inviteSent ? '#1abc9c' : 'white', fontSize: 15, fontWeight: 700, cursor: inviteSent ? 'default' : 'pointer' }}>
          {inviteSent ? '✓ Invitation Sent' : '👤+ Invite Member'}
        </button>
      </div>
    </div>
  )
}

function CreateTeamForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [done, setDone] = useState(false)

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🎬</div>
      <p style={{ color: '#1abc9c', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Team Created!</p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', margin: 0 }}>Start inviting collaborators to {name}.</p>
      <button className="btn-primary" onClick={onBack} style={{ width: '100%', maxWidth: 280, marginTop: 8 }}>Back to Teams</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>Create Production Team</h2>
      </div>
      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Project Title</label>
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nairobi Noir — Short Film" style={{ margin: 0 }} />
        </div>
        <div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Description</label>
          <textarea className="input-field" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your project and what you are looking for…" style={{ margin: 0, minHeight: 90, resize: 'none' } as React.CSSProperties} />
        </div>
        <div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Open Roles (comma separated)</label>
          <input className="input-field" placeholder="e.g. Director, Cinematographer, Sound Recordist" style={{ margin: 0 }} />
        </div>
        <button className="btn-primary" onClick={() => name && setDone(true)} style={{ marginTop: 8 }}>Create Team</button>
      </div>
    </div>
  )
}

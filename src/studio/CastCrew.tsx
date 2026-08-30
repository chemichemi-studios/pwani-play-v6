import { useState } from 'react'
import { MOCK_TEAM, COLLAB_ROLE_COLORS } from './data'
import type { TeamMember } from './data'

type Props = { projectId: string; onBack: () => void }

const DEPT_FILTERS = ['All', 'Owner', 'Producer', 'Editor', 'Reviewer', 'Marketing', 'Finance', 'Viewer']

export default function CastCrew({ projectId: _projectId, onBack }: Props) {
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM)
  const [dept, setDept] = useState('All')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [sending, setSending] = useState(false)

  const filtered = dept === 'All' ? team : team.filter(m => m.collabRole === dept.toLowerCase())

  const sendInvite = () => {
    setSending(true)
    setTimeout(() => { setSending(false); setShowInvite(false); setInviteEmail(''); setInviteRole('') }, 1200)
  }

  const removeFromTeam = (id: string) => setTeam(prev => prev.filter(m => m.id !== id))

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Cast &amp; Crew</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{team.length} members</p>
          </div>
          <button onClick={() => setShowInvite(true)} style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Invite</button>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {DEPT_FILTERS.map(d => (
            <button key={d} onClick={() => setDept(d)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', background: dept === d ? '#1e6091' : 'rgba(255,255,255,0.06)', color: dept === d ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(m => {
          const rc = COLLAB_ROLE_COLORS[m.collabRole]
          return (
            <div key={m.id} style={{ display: 'flex', gap: 12, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{m.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{m.name}</p>
                  {m.verified && <span style={{ fontSize: 12 }}>✓</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 6px' }}>{m.role}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(255,255,255,0.08)', color: rc, border: `1px solid ${rc}22`, fontWeight: 700, textTransform: 'capitalize' }}>{m.collabRole}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', alignSelf: 'center', textTransform: 'capitalize' }}>{m.status}</span>
                </div>
              </div>
              <button onClick={() => removeFromTeam(m.id)} style={{ background: 'rgba(231,76,60,0.08)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, color: '#e74c3c', flexShrink: 0 }}>✕</button>
            </div>
          )
        })}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowInvite(false)}>
          <div style={{ width: '100%', background: '#0d2040', borderRadius: '20px 20px 0 0', padding: '24px 24px 40px', animation: 'slideUp 0.25s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: '0 0 20px' }}>Invite Team Member</h3>
            <input className="input-field" placeholder="Email or phone number" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ marginBottom: 12 }} />
            <input className="input-field" placeholder="Role (e.g. Director of Photography)" value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ marginBottom: 20 }} />
            <button className="btn-primary" onClick={sendInvite} disabled={sending || !inviteEmail} style={{ width: '100%' }}>
              {sending ? 'Sending Invite…' : '📨 Send Invite'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

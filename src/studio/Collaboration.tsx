import { useState } from 'react'
import { MOCK_TEAM, COLLAB_ROLE_COLORS } from './data'
import type { CollabRole } from './data'

type Props = { projectId: string; onBack: () => void }

const PERMISSIONS: { key: string; label: string; desc: string }[] = [
  { key: 'upload', label: 'Upload Files', desc: 'Upload videos, audio, and assets' },
  { key: 'edit_meta', label: 'Edit Metadata', desc: 'Modify project and episode details' },
  { key: 'publish', label: 'Publish', desc: 'Publish and schedule content' },
  { key: 'analytics', label: 'View Analytics', desc: 'Access project analytics data' },
  { key: 'invite', label: 'Invite Members', desc: 'Invite collaborators to the project' },
  { key: 'monetize', label: 'Manage Revenue', desc: 'Configure monetization settings' },
]

const ROLE_DEFAULTS: Record<CollabRole, string[]> = {
  owner: ['upload', 'edit_meta', 'publish', 'analytics', 'invite', 'monetize'],
  producer: ['upload', 'edit_meta', 'publish', 'analytics', 'invite'],
  editor: ['upload', 'edit_meta', 'analytics'],
  reviewer: ['analytics'],
  marketing: ['analytics'],
  finance: ['analytics', 'monetize'],
  viewer: ['analytics'],
}

export default function Collaboration({ projectId: _projectId, onBack }: Props) {
  const [selectedMember, setSelectedMember] = useState(MOCK_TEAM[0].id)
  const [perms, setPerms] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {}
    MOCK_TEAM.forEach(m => { map[m.id] = [...ROLE_DEFAULTS[m.collabRole]] })
    return map
  })

  const member = MOCK_TEAM.find(m => m.id === selectedMember)!
  const memberPerms = perms[selectedMember] ?? []

  const togglePerm = (key: string) => {
    setPerms(prev => ({
      ...prev,
      [selectedMember]: memberPerms.includes(key)
        ? memberPerms.filter(p => p !== key)
        : [...memberPerms, key],
    }))
  }

  const resetToRole = () => setPerms(prev => ({ ...prev, [selectedMember]: [...ROLE_DEFAULTS[member.collabRole]] }))

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Collaboration</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Roles &amp; permissions</p>
          </div>
        </div>
      </div>

      {/* Member selector */}
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {MOCK_TEAM.map(m => {
          const rc = COLLAB_ROLE_COLORS[m.collabRole]
          return (
            <button key={m.id} onClick={() => setSelectedMember(m.id)} style={{ flexShrink: 0, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, borderBottom: `2px solid ${selectedMember === m.id ? '#2980b9' : 'transparent'}` }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{m.avatar}</div>
              <span style={{ fontSize: 10, color: selectedMember === m.id ? '#5dade2' : 'rgba(255,255,255,0.4)', fontWeight: 600, whiteSpace: 'nowrap', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
        {/* Member info */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{member.avatar}</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{member.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{member.role}</p>
          </div>
          <div>
            <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(255,255,255,0.08)', color: COLLAB_ROLE_COLORS[member.collabRole], border: `1px solid ${COLLAB_ROLE_COLORS[member.collabRole]}33`, fontWeight: 700, textTransform: 'capitalize' }}>{member.collabRole}</span>
          </div>
        </div>

        {/* Permissions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: 0, fontFamily: 'DM Mono, monospace' }}>PERMISSIONS</p>
          <button onClick={resetToRole} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Reset to role defaults</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PERMISSIONS.map(p => {
            const enabled = memberPerms.includes(p.key)
            const isOwnerPerm = member.collabRole === 'owner'
            return (
              <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 1px' }}>{p.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{p.desc}</p>
                </div>
                <div onClick={() => !isOwnerPerm && togglePerm(p.key)} style={{ width: 48, height: 28, borderRadius: 14, background: enabled ? '#2980b9' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: isOwnerPerm ? 'not-allowed' : 'pointer', transition: 'background 0.3s', flexShrink: 0, opacity: isOwnerPerm ? 0.5 : 1 }}>
                  <div style={{ position: 'absolute', top: 3, left: enabled ? 22 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
                </div>
              </div>
            )
          })}
        </div>

        {member.collabRole !== 'owner' && (
          <button style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 14, background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', color: '#ec7063', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            🚫 Remove from Project
          </button>
        )}
      </div>
    </div>
  )
}

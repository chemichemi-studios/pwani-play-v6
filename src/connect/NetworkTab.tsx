import { useState } from 'react'
import { PROFILES, AVAIL_COLORS, AVAIL_LABELS } from './data'
import type { ConnectProfile } from './data'

type Props = {
  onProfile: (userId: string) => void
  onFilter: () => void
}

const SECTIONS = [
  { label: 'People You May Know', profiles: [PROFILES[1], PROFILES[3], PROFILES[4]] },
  { label: 'Verified Professionals', profiles: [PROFILES[5], PROFILES[0]] },
  { label: 'Trending Creators', profiles: [PROFILES[2], PROFILES[3]] },
  { label: 'Mentors', profiles: [PROFILES[0], PROFILES[5], PROFILES[1]] },
]

export default function NetworkTab({ onProfile, onFilter }: Props) {
  const [search, setSearch] = useState('')
  const [connections, setConnections] = useState<Record<string, 'none' | 'pending_sent' | 'connected'>>({})

  const connect = (id: string) => setConnections(prev => ({ ...prev, [id]: prev[id] === 'pending_sent' ? 'none' : 'pending_sent' }))

  const filtered = search.trim() ? PROFILES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.profession.toLowerCase().includes(search.toLowerCase()) ||
    p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  ) : null

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      {/* Search & Filter */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 8, position: 'sticky', top: 56, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(8px)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search professionals…"
            className="input-field"
            style={{ margin: 0, paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }}
          />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
        </div>
        <button onClick={onFilter} style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}>⚙️</button>
      </div>

      {/* Connection requests badge */}
      <div style={{ margin: '0 16px 16px', padding: '12px 14px', background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.18)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>1</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>1 Connection Request</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Kwame Asante wants to connect</p>
        </div>
        <button style={{ padding: '7px 14px', borderRadius: 10, background: '#2980b9', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Review</button>
      </div>

      {filtered ? (
        // Search results
        <div style={{ padding: '0 16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 12px' }}>{filtered.length} results for "{search}"</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(p => <ProfileCard key={p.id} profile={p} onPress={() => onProfile(p.id)} onConnect={() => connect(p.id)} connStatus={connections[p.id] || p.connectionStatus} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No results found</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Try different keywords or filters.</p>
            </div>
          )}
        </div>
      ) : (
        // Sections
        SECTIONS.map(sec => (
          <div key={sec.label} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 12 }}>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>{sec.label}</p>
              <button style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>See all</button>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto' }}>
              {sec.profiles.map(p => (
                <ProfileCardCompact key={p.id + sec.label} profile={p} onPress={() => onProfile(p.id)} onConnect={() => connect(p.id)} connStatus={connections[p.id] || p.connectionStatus} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export function ProfileCard({ profile, onPress, onConnect, connStatus }: { profile: ConnectProfile; onPress: () => void; onConnect: () => void; connStatus: string }) {
  const availColor = AVAIL_COLORS[profile.availability as keyof typeof AVAIL_COLORS]
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', display: 'flex', gap: 12 }}>
      <div onClick={onPress} style={{ cursor: 'pointer', flexShrink: 0, position: 'relative' }}>
        <img src={profile.photo} alt={profile.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
        {profile.verified && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>✓</div>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div onClick={onPress} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
            <span style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>{profile.name}</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: availColor, flexShrink: 0 }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, margin: '0 0 2px' }}>{profile.profession}</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '0 0 6px' }}>{profile.city}, {profile.country} · {profile.mutualConnections} mutual</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {profile.skills.slice(0, 3).map(s => <span key={s} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>{s}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onConnect} style={{ flex: 1, padding: '7px', borderRadius: 10, border: connStatus === 'connected' ? '1px solid rgba(26,188,156,0.3)' : '1px solid rgba(41,128,185,0.4)', background: connStatus === 'pending_sent' ? 'rgba(255,255,255,0.06)' : connStatus === 'connected' ? 'rgba(26,188,156,0.08)' : 'rgba(41,128,185,0.1)', color: connStatus === 'connected' ? '#1abc9c' : '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {connStatus === 'pending_sent' ? '⏳ Pending' : connStatus === 'connected' ? '✓ Connected' : connStatus === 'following' ? '+ Connect' : '+ Connect'}
          </button>
          <button onClick={onPress} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)', fontSize: 12, cursor: 'pointer' }}>View</button>
        </div>
      </div>
    </div>
  )
}

function ProfileCardCompact({ profile, onPress, onConnect, connStatus }: { profile: ConnectProfile; onPress: () => void; onConnect: () => void; connStatus: string }) {
  return (
    <div style={{ flexShrink: 0, width: 148, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
      <div onClick={onPress} style={{ cursor: 'pointer', position: 'relative', display: 'inline-block', marginBottom: 8 }}>
        <img src={profile.photo} alt={profile.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
        {profile.verified && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>✓</div>}
      </div>
      <p onClick={onPress} style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 3px', cursor: 'pointer', lineHeight: 1.2 }}>{profile.name}</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 4px', lineHeight: 1.3 }}>{profile.profession}</p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, margin: '0 0 10px' }}>{profile.mutualConnections} mutual</p>
      <button onClick={onConnect} style={{ width: '100%', padding: '7px', borderRadius: 10, background: connStatus === 'pending_sent' ? 'rgba(255,255,255,0.06)' : 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.25)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        {connStatus === 'pending_sent' ? 'Pending' : connStatus === 'connected' ? '✓ Connected' : '+ Connect'}
      </button>
    </div>
  )
}

import { useState } from 'react'
import { COMMUNITIES, POSTS, PROFILES } from './data'

type Props = { communityId: string; onBack: () => void; onProfile: (id: string) => void }

type Tab = 'feed' | 'members' | 'events' | 'files' | 'about'

export default function CommunityDetail({ communityId, onBack, onProfile }: Props) {
  const community = COMMUNITIES.find(c => c.id === communityId) ?? COMMUNITIES[0]
  const [joined, setJoined] = useState(community.isJoined)
  const [activeTab, setActiveTab] = useState<Tab>('feed')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const TABS: { key: Tab; label: string }[] = [
    { key: 'feed', label: 'Feed' }, { key: 'members', label: 'Members' }, { key: 'events', label: 'Events' }, { key: 'files', label: 'Files' }, { key: 'about', label: 'About' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>{toast}</div>}

      {/* Cover */}
      <div style={{ position: 'relative' }}>
        <img src={community.coverImage} alt={community.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.8))' }} />
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 14, width: 38, height: 38, borderRadius: 12, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 4px' }}>{community.name}</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>👥 {community.memberCount.toLocaleString()} members</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>💬 {(community.postCount / 1000).toFixed(1)}K posts</span>
          </div>
        </div>
      </div>

      {/* Join / actions */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => { setJoined(!joined); showToast(joined ? 'Left community' : 'Joined! Welcome 🎉') }} style={{ flex: 1, padding: '10px', borderRadius: 12, border: joined ? '1px solid rgba(26,188,156,0.3)' : 'none', background: joined ? 'rgba(26,188,156,0.08)' : 'linear-gradient(90deg,#1e6091,#2980b9)', color: joined ? '#1abc9c' : 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {joined ? '✓ Joined' : '+ Join Community'}
        </button>
        <button style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤+</button>
        <button style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔗</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a1628', position: 'sticky', top: 0, zIndex: 10, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === t.key ? '#2980b9' : 'transparent'}`, color: activeTab === t.key ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: activeTab === t.key ? 700 : 600, fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        {activeTab === 'feed' && (
          <div>
            {POSTS.slice(0, 3).map(post => (
              <div key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <img src={post.author.photo} alt={post.author.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>{post.author.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{post.timestamp}</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.5, margin: '0 0 10px' }}>{post.content.slice(0, 160)}…</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>❤️ {post.likes}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>💬 {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'members' && (
          <div style={{ padding: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Moderators</p>
            {community.moderators.map((mod, i) => (
              <div key={mod} onClick={() => onProfile(PROFILES[i]?.id || 'p1')} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                <img src={PROFILES[i]?.photo || PROFILES[0].photo} alt={mod} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 1px' }}>{mod}</p>
                  <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', color: '#5dade2' }}>Moderator</span>
                </div>
              </div>
            ))}
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '16px 0 12px' }}>Members ({community.memberCount.toLocaleString()})</p>
            {PROFILES.map(p => (
              <div key={p.id} onClick={() => onProfile(p.id)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                <img src={p.photo} alt={p.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 1px' }}>{p.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{p.profession}</p>
                </div>
                {p.verified && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', color: '#5dade2' }}>✓ Verified</span>}
              </div>
            ))}
          </div>
        )}
        {activeTab === 'events' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Monthly Filmmaker Meetup', date: 'Aug 28, 2026', location: 'Nairobi, Kenya', type: 'networking' },
              { title: 'Short Film Pitch Night', date: 'Sep 12, 2026', location: 'Online (Zoom)', type: 'workshop' },
            ].map(ev => (
              <div key={ev.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px' }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{ev.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 8px' }}>📅 {ev.date} · 📍 {ev.location}</p>
                <button style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Register</button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'files' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Filmmakers Kenya 2026 Directory.pdf', size: '2.4 MB', uploaded: 'Amara O.' },
              { name: 'Grant Opportunities East Africa.docx', size: '1.1 MB', uploaded: 'Fatima H.' },
              { name: 'Production Rate Card Kenya 2026.xlsx', size: '842 KB', uploaded: 'Aisha D.' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', gap: 10, padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.xlsx') ? '📊' : '📝'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{f.size} · {f.uploaded}</p>
                </div>
                <button style={{ padding: '6px 10px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>📥</button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'about' && (
          <div style={{ padding: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>{community.description}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Community Rules</p>
            {['Be respectful and professional', 'No spam or self-promotion without context', 'Share knowledge generously', 'Support emerging creators', 'Report harmful content'].map((rule, i) => (
              <p key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '0 0 8px' }}>{i + 1}. {rule}</p>
            ))}
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: '16px 0 0', fontFamily: 'DM Mono, monospace' }}>Created {community.createdAt}</p>
          </div>
        )}
      </div>
    </div>
  )
}

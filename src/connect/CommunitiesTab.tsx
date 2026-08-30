import { useState } from 'react'
import { COMMUNITIES } from './data'
import type { Community } from './data'

type Props = { onCommunity: (id: string) => void }

const CAT_LABELS = { film: '🎬 Film', music: '🎵 Music', podcast: '🎙️ Podcast', animation: '🎨 Animation', photography: '📷 Photography', writing: '✍️ Writing', entrepreneurship: '💼 Business', education: '🎓 Education' }

export default function CommunitiesTab({ onCommunity }: Props) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'joined' | 'discover'>('all')

  const filtered = COMMUNITIES.filter(c => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchesTab = activeTab === 'all' || (activeTab === 'joined' ? c.isJoined : !c.isJoined)
    return matchesSearch && matchesTab
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      {/* Search */}
      <div style={{ padding: '10px 16px', position: 'sticky', top: 56, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(8px)' }}>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities…" className="input-field" style={{ margin: 0, paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }} />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 16px 12px' }}>
        {(['all', 'joined', 'discover'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '6px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', background: activeTab === t ? '#1e6091' : 'rgba(255,255,255,0.06)', color: activeTab === t ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            {t === 'all' ? 'All' : t === 'joined' ? `Joined (${COMMUNITIES.filter(c => c.isJoined).length})` : 'Discover'}
          </button>
        ))}
      </div>

      {/* Create community CTA */}
      {activeTab !== 'joined' && (
        <div style={{ margin: '0 16px 16px', padding: '14px', background: 'rgba(41,128,185,0.07)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(41,128,185,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌐</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Start a Community</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Bring your creative network together</p>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: '#2980b9', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Create</button>
        </div>
      )}

      {/* Community list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(c => <CommunityCard key={c.id} community={c} onPress={() => onCommunity(c.id)} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌐</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No communities found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Try different search terms or start your own!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function CommunityCard({ community, onPress }: { community: Community; onPress: () => void }) {
  const [joined, setJoined] = useState(community.isJoined)

  return (
    <div onClick={onPress} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: 90 }}>
        <img src={community.coverImage} alt={community.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.2), rgba(10,22,40,0.75))' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'white', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>{CAT_LABELS[community.category]}</span>
          {community.isPrivate && <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: 'rgba(243,156,18,0.2)', color: '#f8c471', border: '1px solid rgba(243,156,18,0.3)' }}>Private</span>}
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 3px', fontFamily: 'DM Serif Display, serif' }}>{community.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{community.description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>👥 {community.memberCount.toLocaleString()}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>💬 {(community.postCount / 1000).toFixed(1)}K</span>
          </div>
          <button onClick={e => { e.stopPropagation(); setJoined(!joined) }} style={{ padding: '7px 14px', borderRadius: 10, background: joined ? 'rgba(26,188,156,0.1)' : 'rgba(41,128,185,0.12)', border: `1px solid ${joined ? 'rgba(26,188,156,0.25)' : 'rgba(41,128,185,0.25)'}`, color: joined ? '#1abc9c' : '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {joined ? '✓ Joined' : '+ Join'}
          </button>
        </div>
      </div>
    </div>
  )
}

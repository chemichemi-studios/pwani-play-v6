import { useState } from 'react'
import { CONVERSATIONS } from './data'

type Props = { onConversation: (id: string) => void }

export default function MessagesTab({ onConversation }: Props) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all')

  const allConvs = CONVERSATIONS.filter(c => !c.isRequest)
  const requests = CONVERSATIONS.filter(c => c.isRequest)

  const displayed = (activeTab === 'requests' ? requests : allConvs).filter(c => {
    if (!search) return true
    const name = c.participant?.name || c.name || ''
    return name.toLowerCase().includes(search.toLowerCase())
  })

  const totalUnread = allConvs.reduce((a, c) => a + c.unreadCount, 0)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      {/* Search */}
      <div style={{ padding: '10px 16px 0', position: 'sticky', top: 56, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(8px)' }}>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="input-field" style={{ margin: 0, paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }} />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
          {(['all', 'requests'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', background: activeTab === t ? '#1e6091' : 'rgba(255,255,255,0.06)', color: activeTab === t ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, position: 'relative' }}>
              {t === 'all' ? `Messages${totalUnread > 0 ? ` (${totalUnread})` : ''}` : `Requests${requests.length > 0 ? ` (${requests.length})` : ''}`}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>✏️</button>
        </div>
      </div>

      {/* Conversation list */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>💬</div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{activeTab === 'requests' ? 'No message requests' : 'No conversations yet'}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>Connect with creators and start collaborating</p>
          <button style={{ padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Find Collaborators</button>
        </div>
      ) : (
        displayed.map(conv => <ConvRow key={conv.id} conv={conv} onPress={() => onConversation(conv.id)} />)
      )}
    </div>
  )
}

function ConvRow({ conv, onPress }: { conv: (typeof CONVERSATIONS)[0]; onPress: () => void }) {
  const photo = conv.participant?.photo || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&auto=format'
  const displayName = conv.participant?.name || conv.name || 'Group'
  const isGroup = conv.type === 'group'

  return (
    <div onClick={onPress} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: conv.unreadCount > 0 ? 'rgba(41,128,185,0.04)' : 'transparent', alignItems: 'center' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {isGroup ? (
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👥</div>
        ) : (
          <img src={photo} alt={displayName} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
        )}
        {conv.isRequest && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 16, height: 16, borderRadius: '50%', background: '#f39c12', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>!</div>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
          <span style={{ color: conv.unreadCount > 0 ? 'white' : 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: conv.unreadCount > 0 ? 700 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{displayName}</span>
          <span style={{ color: conv.unreadCount > 0 ? '#5dade2' : 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{conv.lastMessageTime}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: conv.unreadCount > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{conv.lastMessage}</span>
          {conv.unreadCount > 0 && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{conv.unreadCount}</span></div>}
        </div>
      </div>
    </div>
  )
}

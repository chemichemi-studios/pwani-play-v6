import { useState } from 'react'
import ConnectFeed from './ConnectFeed'
import NetworkTab from './NetworkTab'
import ProfilePreview from './ProfilePreview'
import CommunitiesTab from './CommunitiesTab'
import CommunityDetail from './CommunityDetail'
import MessagesTab from './MessagesTab'
import Conversation from './Conversation'
import EventsScreen from './EventsScreen'
import EventDetail from './EventDetail'
import ProductionTeams from './ProductionTeams'
import Mentorship from './Mentorship'
import Opportunities from './Opportunities'
import ConnectNotifications from './ConnectNotifications'
import ActivityDashboard from './ActivityDashboard'
import AIAssistant from './AIAssistant'
import Reputation from './Reputation'
import { ME } from './data'

type Tab = 'feed' | 'network' | 'communities' | 'messages' | 'profile'

type ConnectScreen =
  | { id: 'root' }
  | { id: 'profile-preview'; profileId: string }
  | { id: 'community-detail'; communityId: string }
  | { id: 'conversation'; conversationId: string }
  | { id: 'event-detail'; eventId: string }
  | { id: 'notifications' }
  | { id: 'activity' }
  | { id: 'ai-assistant' }
  | { id: 'reputation' }
  | { id: 'events' }
  | { id: 'teams' }
  | { id: 'mentorship' }
  | { id: 'opportunities' }
  | { id: 'create-post' }

type Props = { onExit: () => void }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'feed',        label: 'Feed',       icon: '🏠' },
  { key: 'network',     label: 'Network',    icon: '🤝' },
  { key: 'communities', label: 'Community',  icon: '🌐' },
  { key: 'messages',    label: 'Messages',   icon: '💬' },
  { key: 'profile',     label: 'Profile',    icon: '👤' },
]

export default function ConnectShell({ onExit }: Props) {
  const [tab, setTab] = useState<Tab>('feed')
  const [stack, setStack] = useState<ConnectScreen[]>([{ id: 'root' }])
  const [fabOpen, setFabOpen] = useState(false)

  const current = stack[stack.length - 1]
  const push = (s: ConnectScreen) => { setStack(p => [...p, s]); setFabOpen(false) }
  const back = () => setStack(p => p.length > 1 ? p.slice(0, -1) : p)
  const isOverlay = current.id !== 'root'

  const goProfile = (id: string) => push({ id: 'profile-preview', profileId: id })
  const goCommunity = (id: string) => push({ id: 'community-detail', communityId: id })
  const goConversation = (id: string) => push({ id: 'conversation', conversationId: id })
  const goEvent = (id: string) => push({ id: 'event-detail', eventId: id })

  const renderOverlay = () => {
    switch (current.id) {
      case 'profile-preview':
        return <ProfilePreview profileId={current.profileId} onBack={back} onMessage={id => goConversation(id)} onInviteToProject={() => push({ id: 'teams' })} />
      case 'community-detail':
        return <CommunityDetail communityId={current.communityId} onBack={back} onProfile={goProfile} />
      case 'conversation':
        return <Conversation conversationId={current.conversationId} onBack={back} onProfile={goProfile} />
      case 'event-detail':
        return <EventDetail eventId={current.eventId} onBack={back} onProfile={goProfile} />
      case 'notifications':
        return <FullScreen title="Notifications" onBack={back}><ConnectNotifications onProfile={goProfile} /></FullScreen>
      case 'activity':
        return <FullScreen title="Analytics" onBack={back}><ActivityDashboard /></FullScreen>
      case 'ai-assistant':
        return <FullScreen title="AI Networking Assistant" onBack={back}><AIAssistant onProfile={goProfile} onCommunity={goCommunity} onEvent={goEvent} /></FullScreen>
      case 'reputation':
        return <FullScreen title="Reputation" onBack={back}><Reputation /></FullScreen>
      case 'events':
        return <FullScreen title="Events" onBack={back}><EventsScreen onEvent={goEvent} /></FullScreen>
      case 'teams':
        return <FullScreen title="Production Teams" onBack={back}><ProductionTeams onProfile={goProfile} /></FullScreen>
      case 'mentorship':
        return <FullScreen title="Mentorship" onBack={back}><Mentorship onProfile={goProfile} /></FullScreen>
      case 'opportunities':
        return <FullScreen title="Opportunities" onBack={back}><Opportunities onProfile={goProfile} /></FullScreen>
      case 'create-post':
        return <CreatePost onBack={back} />
    }
  }

  const renderTab = () => {
    switch (tab) {
      case 'feed':
        return <ConnectFeed onProfile={goProfile} onCreatePost={() => push({ id: 'create-post' })} />
      case 'network':
        return <NetworkTab onProfile={goProfile} onFilter={() => {}} />
      case 'communities':
        return <CommunitiesTab onCommunity={goCommunity} />
      case 'messages':
        return <MessagesTab onConversation={goConversation} />
      case 'profile':
        return <ProfileTab
          onProfile={goProfile}
          onActivity={() => push({ id: 'activity' })}
          onReputation={() => push({ id: 'reputation' })}
          onTeams={() => push({ id: 'teams' })}
          onMentorship={() => push({ id: 'mentorship' })}
          onOpportunities={() => push({ id: 'opportunities' })}
          onEvents={() => push({ id: 'events' })}
          onAI={() => push({ id: 'ai-assistant' })}
          onExit={onExit}
        />
    }
  }

  const unreadMessages = 3
  const unreadNotifs = 3

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onExit} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤝</div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Pwani Connect</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => push({ id: 'ai-assistant' })} style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>✨</button>
          <button onClick={() => push({ id: 'notifications' })} style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, position: 'relative' }}>
            🔔
            {unreadNotifs > 0 && <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', border: '2px solid #0a1628' }} />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 68 }}>
        {renderTab()}
      </div>

      {/* FAB */}
      {!isOverlay && (
        <>
          {fabOpen && (
            <div style={{ position: 'fixed', bottom: 100, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', animation: 'slideUp 0.2s ease' }}>
              {[
                { label: 'Create Post', icon: '✍️', action: () => push({ id: 'create-post' }) },
                { label: 'Find Events', icon: '📅', action: () => push({ id: 'events' }) },
                { label: 'Join Team', icon: '🎬', action: () => push({ id: 'teams' }) },
                { label: 'Find Mentor', icon: '🎓', action: () => push({ id: 'mentorship' }) },
              ].map(f => (
                <button key={f.label} onClick={f.action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 14px', borderRadius: 100, background: 'rgba(30,96,145,0.95)', border: '1px solid rgba(41,128,185,0.3)', backdropFilter: 'blur(8px)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setFabOpen(!fabOpen)} style={{ position: 'fixed', bottom: 82, right: 20, zIndex: 201, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: fabOpen ? 22 : 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(41,128,185,0.4)', transition: 'transform 0.2s', transform: fabOpen ? 'rotate(45deg)' : 'none' }}>
            {fabOpen ? '✕' : '＋'}
          </button>
        </>
      )}

      {/* Bottom nav */}
      {!isOverlay && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', padding: '8px 0 20px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setStack([{ id: 'root' }]); setFabOpen(false) }} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0', position: 'relative' }}>
              <span style={{ fontSize: 20, filter: tab === t.key ? 'none' : 'grayscale(1) opacity(0.4)' }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: tab === t.key ? '#5dade2' : 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>{t.label}</span>
              {tab === t.key && <div style={{ width: 18, height: 2, borderRadius: 1, background: '#2980b9' }} />}
              {t.key === 'messages' && unreadMessages > 0 && <div style={{ position: 'absolute', top: 2, right: '22%', width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', border: '2px solid #0a1628' }} />}
            </button>
          ))}
        </div>
      )}

      {/* Overlay screens */}
      {isOverlay && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0a1628', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.22s ease' }}>
          {renderOverlay()}
        </div>
      )}
    </div>
  )
}

function FullScreen({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 68 }}>
        {children}
      </div>
    </div>
  )
}

function ProfileTab({ onProfile, onActivity, onReputation, onTeams, onMentorship, onOpportunities, onEvents, onAI, onExit }: {
  onProfile: (id: string) => void; onActivity: () => void; onReputation: () => void; onTeams: () => void; onMentorship: () => void; onOpportunities: () => void; onEvents: () => void; onAI: () => void; onExit: () => void
}) {
  const ITEMS = [
    { icon: '📊', label: 'Networking Analytics', desc: 'Profile views, search appearances', action: onActivity },
    { icon: '⭐', label: 'Professional Reputation', desc: 'Recommendations, badges, ratings', action: onReputation },
    { icon: '🎬', label: 'Production Teams', desc: 'Manage and find project teams', action: onTeams },
    { icon: '🎓', label: 'Mentorship', desc: 'Find mentors and book sessions', action: onMentorship },
    { icon: '💼', label: 'Opportunities', desc: 'Castings, jobs, grants', action: onOpportunities },
    { icon: '📅', label: 'Events', desc: 'Workshops, festivals, meetups', action: onEvents },
    { icon: '✨', label: 'AI Networking Assistant', desc: 'Personalised connection suggestions', action: onAI },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 10 }}>
      {/* My profile card */}
      <div onClick={() => onProfile('me')} style={{ margin: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '16px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={ME.photo} alt={ME.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(41,128,185,0.4)' }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>✓</div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Serif Display, serif' }}>{ME.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 6px' }}>{ME.profession}</p>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{ME.connectionCount} connections</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{ME.followerCount.toLocaleString()} followers</span>
          </div>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 20 }}>›</span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {ITEMS.map(item => (
          <button key={item.label} onClick={item.action} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{item.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{item.desc}</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        <button onClick={onExit} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.12)', color: '#e74c3c', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>← Back to Pwani Play</button>
      </div>
    </div>
  )
}

function CreatePost({ onBack }: { onBack: () => void }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState('update')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✅</div>
        <p style={{ color: '#1abc9c', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Post Published!</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', margin: 0 }}>Your update is now visible to your network.</p>
        <button className="btn-primary" onClick={onBack} style={{ width: '100%', maxWidth: 280, marginTop: 8 }}>Back to Feed</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white' }}>✕</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0, flex: 1 }}>Create Post</h2>
        <button onClick={() => content.trim() && setSubmitted(true)} disabled={!content.trim()} style={{ padding: '8px 18px', borderRadius: 10, background: content.trim() ? 'linear-gradient(90deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.08)', border: 'none', color: content.trim() ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 700, cursor: content.trim() ? 'pointer' : 'default' }}>Post</button>
      </div>
      <div style={{ flex: 1, padding: '16px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <img src={ME.photo} alt={ME.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{ME.name}</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {['update', 'announcement', 'opportunity', 'discussion'].map(t => (
                <button key={t} onClick={() => setType(t)} style={{ padding: '3px 10px', borderRadius: 100, background: type === t ? 'rgba(41,128,185,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${type === t ? 'rgba(41,128,185,0.4)' : 'rgba(255,255,255,0.1)'}`, color: type === t ? '#5dade2' : 'rgba(255,255,255,0.45)', fontSize: 11, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share an update, announce something, post an opportunity, or start a discussion…"
          style={{ width: '100%', minHeight: 180, padding: '12px', background: 'transparent', border: 'none', color: 'white', fontSize: 15, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {['📷', '🎬', '📎', '🗺️'].map(icon => (
            <button key={icon} style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}>{icon}</button>
          ))}
        </div>
      </div>
    </div>
  )
}


import { useState } from 'react'
import { CONTENT, CREATORS, type ContentItem } from './data'
import EmptyState, { EMPTY_STATES } from './components/EmptyState'

type Props = {
  onBack: () => void
  onOpenContent: (item: ContentItem) => void
  onOpenCreator: (id: string) => void
}

type RecSection = {
  id: string
  title: string
  icon: string
  reason: string
  color: string
  items: ContentItem[]
}

const SECTIONS: RecSection[] = [
  {
    id: 'because-watched',
    title: 'Because You Watched Nairobi Nights',
    icon: '📺',
    reason: 'You finished 45% of this series — we found similar crime dramas with authentic African storytelling.',
    color: '#1e6091',
    items: [CONTENT[4], CONTENT[3]],
  },
  {
    id: 'trending-near',
    title: 'Trending Near You',
    icon: '📍',
    reason: 'Top content among viewers in Nairobi, Kenya right now.',
    color: '#ca6f1e',
    items: [CONTENT[0], CONTENT[2], CONTENT[1]],
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    icon: '💎',
    reason: 'Underrated titles with outstanding quality that match your taste profile.',
    color: '#0e6655',
    items: [CONTENT[5], CONTENT[1]],
  },
  {
    id: 'new-voices',
    title: 'New African Voices',
    icon: '🌱',
    reason: 'Debut works from emerging creators across East, West, and Southern Africa.',
    color: '#6c3483',
    items: [CONTENT[2], CONTENT[5], CONTENT[3]],
  },
  {
    id: 'festival-winners',
    title: 'Festival Winners',
    icon: '🏆',
    reason: 'Award-winning films and series from AFRIFF, Zanzibar IFF, and AMAA.',
    color: '#b7770d',
    items: CONTENT.filter(c => c.awards?.length),
  },
]

export default function AIRecommendations({ onBack, onOpenContent, onOpenCreator }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [expandedReason, setExpandedReason] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const visibleSections = SECTIONS.filter(s => !dismissed.includes(s.id))

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', background: 'linear-gradient(180deg, rgba(108,52,131,0.3) 0%, #0a1628 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>AI For You</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Personalised picks · Updated hourly</p>
          </div>
          <button
            onClick={handleRefresh}
            style={{ background: 'rgba(108,52,131,0.2)', border: '1px solid rgba(108,52,131,0.3)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, transition: 'transform 0.5s ease', transform: refreshing ? 'rotate(360deg)' : 'none' }}
          >🔄</button>
        </div>

        {/* AI model badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,52,131,0.15)', border: '1px solid rgba(108,52,131,0.3)', borderRadius: 100, padding: '6px 14px' }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 12, color: '#c39bd3', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>PWANI AI · TASTE PROFILE ACTIVE</span>
        </div>
      </div>

      {/* Taste profile card */}
      <div style={{ margin: '0 20px 20px', background: 'rgba(108,52,131,0.1)', border: '1px solid rgba(108,52,131,0.2)', borderRadius: 18, padding: '16px' }}>
        <p style={{ fontSize: 11, color: '#c39bd3', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', margin: '0 0 10px', textTransform: 'uppercase' }}>Your Taste Profile</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Drama 🎭', 'Swahili 🗣', 'Crime 🔍', 'Kenya 🇰🇪', 'Music Docs 🎵', 'Short Films 🎬'].map(tag => (
            <span key={tag} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(108,52,131,0.2)', border: '1px solid rgba(108,52,131,0.3)', color: '#c39bd3', fontSize: 12, fontWeight: 600 }}>{tag}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '10px 0 0', lineHeight: 1.4 }}>Based on 24 watched titles, 6 watchlisted, 3 liked, and your role as Creator</p>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
        {visibleSections.length === 0 ? (
          <EmptyState
            {...EMPTY_STATES.noRecommendations}
            onAction={onBack}
          />
        ) : (
          visibleSections.map(section => (
            <AISection
              key={section.id}
              section={section}
              expanded={expandedReason === section.id}
              onToggleReason={() => setExpandedReason(expandedReason === section.id ? null : section.id)}
              onOpenContent={onOpenContent}
              onDismiss={() => setDismissed(prev => [...prev, section.id])}
            />
          ))
        )}

        {/* Similar creators */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>🎬 Similar Creators</h3>
            <button style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>See all</button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {CREATORS.map(c => (
              <div key={c.id} onClick={() => onOpenCreator(c.id)} style={{ flexShrink: 0, width: 100, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 8px', border: '2px solid rgba(255,255,255,0.1)' }}>
                  {c.avatar}
                </div>
                <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name.split(' ')[0]}</p>
                <p style={{ color: '#5dade2', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.followers}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AISection({ section, expanded, onToggleReason, onOpenContent, onDismiss }: {
  section: RecSection
  expanded: boolean
  onToggleReason: () => void
  onOpenContent: (item: ContentItem) => void
  onDismiss: () => void
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Section header */}
      <div style={{ padding: '0 20px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0, flex: 1, paddingRight: 12 }}>
            {section.icon} {section.title}
          </h3>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
        </div>

        {/* Why explanation */}
        <button
          onClick={onToggleReason}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
        >
          <span style={{ fontSize: 14, color: `${section.color}cc`, flexShrink: 0, marginTop: 1 }}>🤖</span>
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5,
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 1,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}>
            {section.reason}
          </p>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: 4, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </button>
      </div>

      {/* Content row */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
        {section.items.map(item => (
          <div key={item.id} style={{ flexShrink: 0, width: 160, cursor: 'pointer' }} onClick={() => onOpenContent(item)}>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
              <img src={item.img} alt={item.title} style={{ width: 160, height: 100, objectFit: 'cover', display: 'block', background: '#103058' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              {item.premium && (
                <div style={{ position: 'absolute', top: 7, left: 7, background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', borderRadius: 5, padding: '1px 7px' }}>
                  <span style={{ fontSize: 9, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>PRO</span>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 7, left: 7 }}>
                <span style={{ fontSize: 11, color: '#f8c471' }}>⭐ {item.rating}</span>
              </div>
              {/* AI match badge */}
              <div style={{ position: 'absolute', top: 7, right: 7, background: `${section.color}cc`, borderRadius: 6, padding: '2px 7px' }}>
                <span style={{ fontSize: 9, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                  {Math.floor(85 + Math.random() * 12)}% Match
                </span>
              </div>
            </div>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{item.genre} · {item.country}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

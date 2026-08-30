import { useState, useEffect, useRef } from 'react'
import { CONTENT, CREATORS, type ContentItem } from './data'

type Props = {
  name: string
  coinBalance: number
  onOpenContent: (item: ContentItem) => void
  onOpenCreator: (id: string) => void
  onOpenNotifications: () => void
  onOpenRewards: () => void
  onOpenSearch?: () => void
  onOpenAIRecs?: () => void
  onOpenOffline?: () => void
}

function ContentCard({ item, onOpen, size = 'md' }: { item: ContentItem; onOpen: () => void; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? { w: 240, h: 148 } : size === 'sm' ? { w: 130, h: 84 } : { w: 180, h: 110 }
  return (
    <div style={{ flexShrink: 0, width: dims.w, cursor: 'pointer' }} onClick={onOpen}>
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
        <img src={item.img} alt={item.title} style={{ width: dims.w, height: dims.h, objectFit: 'cover', display: 'block', background: '#103058' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
        {item.premium && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', borderRadius: 6, padding: '2px 8px' }}>
            <span style={{ fontSize: 10, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>PRO</span>
          </div>
        )}
        {item.progress !== undefined && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ width: `${item.progress * 100}%`, height: '100%', background: '#2980b9' }} />
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '2px 7px' }}>
          <span style={{ fontSize: 11, color: '#f8c471', fontFamily: 'DM Mono, monospace' }}>⭐ {item.rating}</span>
        </div>
        {item.downloadable && (
          <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 14 }}>💾</div>
        )}
      </div>
      <p style={{ color: 'white', fontSize: size === 'sm' ? 12 : 14, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{item.genre} · {item.runtime}</p>
    </div>
  )
}

function SectionRow({ title, items, onOpen, size = 'md', action }: {
  title: string; items: ContentItem[]; onOpen: (item: ContentItem) => void; size?: 'sm' | 'md' | 'lg'; action?: string
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
        <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h3>
        {action && <button style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>{action}</button>}
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
        {items.map(item => <ContentCard key={item.id} item={item} onOpen={() => onOpen(item)} size={size} />)}
      </div>
    </div>
  )
}

function HeroCarousel({ items, onOpen }: { items: ContentItem[]; onOpen: (item: ContentItem) => void }) {
  const [current, setCurrent] = useState(0)
  const item = items[current]

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % items.length), 4000)
    return () => clearInterval(t)
  }, [items.length])

  return (
    <div style={{ position: 'relative', height: 340, overflow: 'hidden', cursor: 'pointer' }} onClick={() => onOpen(item)}>
      <img key={item.id} src={item.backdrop} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.5s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1628 0%, rgba(10,22,40,0.5) 50%, rgba(10,22,40,0.1) 100%)' }} />

      {/* Content info */}
      <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {item.premium && (
            <span style={{ background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>PREMIUM</span>
          )}
          <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: 'white', fontWeight: 600 }}>{item.type.toUpperCase()}</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: '#f8c471' }}>⭐ {item.rating}</span>
        </div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'white', margin: '0 0 6px', lineHeight: 1.15 }}>{item.title}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.synopsis}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0a1628', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Outfit, sans-serif' }}>
            ▶ Watch Now
          </button>
          <button style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 16px', color: 'white', fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            + Watchlist
          </button>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 0, right: 20, display: 'flex', gap: 5, paddingBottom: 28 }}>
        {/* invisible - positioned for aesthetics only */}
      </div>
      <div style={{ position: 'absolute', top: 12, right: 20, display: 'flex', gap: 4 }}>
        {items.map((_, i) => (
          <div key={i} onClick={e => { e.stopPropagation(); setCurrent(i) }} style={{
            width: i === current ? 20 : 6, height: 6, borderRadius: 3,
            background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
            cursor: 'pointer', transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  )
}

function ContinueWatchingRow({ items, onOpen }: { items: ContentItem[]; onOpen: (i: ContentItem) => void }) {
  const watching = items.filter(i => i.progress !== undefined)
  if (!watching.length) return null
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
        <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>Continue Watching</h3>
        <button style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>See all</button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 20, paddingRight: 20 }}>
        {watching.map(item => (
          <div key={item.id} style={{ flexShrink: 0, width: 220, cursor: 'pointer' }} onClick={() => onOpen(item)}>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
              <img src={item.img} alt={item.title} style={{ width: 220, height: 130, objectFit: 'cover', display: 'block', background: '#103058' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18, color: '#0a1628', marginLeft: 3 }}>▶</span>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.2)' }}>
                <div style={{ width: `${(item.progress ?? 0) * 100}%`, height: '100%', background: '#2980b9' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 12, right: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '2px 8px' }}>
                <span style={{ fontSize: 11, color: 'white', fontFamily: 'DM Mono, monospace' }}>
                  {Math.round((1 - (item.progress ?? 0)) * parseInt(item.runtime))}m left
                </span>
              </div>
            </div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{item.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{Math.round((item.progress ?? 0) * 100)}% watched</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Top10Row({ items, onOpen }: { items: ContentItem[]; onOpen: (i: ContentItem) => void }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
        <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>Top 10 in Kenya 🇰🇪</h3>
      </div>
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingLeft: 20, paddingRight: 20 }}>
        {items.map((item, i) => (
          <div key={item.id} style={{ flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', marginRight: i < items.length - 1 ? -20 : 0 }} onClick={() => onOpen(item)}>
            <span style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 80, fontWeight: 400, lineHeight: 1,
              color: '#103058',
              WebkitTextStroke: '2px rgba(255,255,255,0.15)',
              zIndex: 1, position: 'relative', marginRight: -12,
            }}>{i + 1}</span>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', zIndex: 2 }}>
              <img src={item.img} alt={item.title} style={{ width: 100, height: 145, objectFit: 'cover', display: 'block', background: '#103058' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CreatorSpotlight({ creators, onOpen }: { creators: typeof CREATORS; onOpen: (id: string) => void }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
        <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>Creator Spotlight ✨</h3>
        <button style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>All Creators</button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 20, paddingRight: 20 }}>
        {creators.map(c => (
          <div key={c.id} style={{ flexShrink: 0, width: 130, cursor: 'pointer', textAlign: 'center' }} onClick={() => onOpen(c.id)}>
            <div style={{ position: 'relative', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 8px', border: '2px solid rgba(255,255,255,0.15)' }}>
              {c.avatar}
              {c.verified && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>}
            </div>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 4px' }}>{c.role}</p>
            <p style={{ color: '#5dade2', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.followers}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomeTab({ name, coinBalance, onOpenContent, onOpenCreator, onOpenNotifications, onOpenRewards, onOpenSearch, onOpenAIRecs, onOpenOffline }: Props) {
  const [notifCount] = useState(3)

  const heroItems = [CONTENT[4], CONTENT[0], CONTENT[3]]
  const trending = [...CONTENT].sort((a, b) => b.rating - a.rating)
  const africanOriginals = CONTENT.filter(c => ['Kenya', 'Tanzania'].includes(c.country))
  const documentaries = CONTENT.filter(c => c.type === 'documentary')
  const podcasts = CONTENT.filter(c => c.type === 'podcast')

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
      {/* Header bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '52px 20px 12px', background: 'linear-gradient(to bottom, rgba(10,22,40,0.9) 0%, transparent 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 430, margin: '0 auto' }}>
        <PwaniLogo />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Coins */}
          <button onClick={onOpenRewards} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 100, padding: '6px 12px', cursor: 'pointer' }}>
            <span style={{ fontSize: 14 }}>🪙</span>
            <span style={{ fontSize: 13, color: '#f8c471', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{coinBalance}</span>
          </button>
          {/* Notifications */}
          <button onClick={onOpenNotifications} style={{ position: 'relative', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
            🔔
            {notifCount > 0 && <div style={{ position: 'absolute', top: -2, right: -2, background: '#e74c3c', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1628' }}>
              <span style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>{notifCount}</span>
            </div>}
          </button>
          {/* Search */}
          <button onClick={onOpenSearch} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
            🔍
          </button>
          {/* Offline */}
          <button onClick={onOpenOffline} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
            📡
          </button>
        </div>
      </div>

      <HeroCarousel items={heroItems} onOpen={onOpenContent} />

      {/* Greeting strip */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 2px' }}>Good evening,</p>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>{name || 'Creative'} 👋</h3>
        </div>
        <div style={{ background: 'rgba(30,96,145,0.2)', border: '1px solid rgba(30,96,145,0.3)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>STREAK</p>
          <p style={{ fontSize: 18, color: '#f39c12', fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>🔥 4</p>
        </div>
      </div>

      <ContinueWatchingRow items={CONTENT} onOpen={onOpenContent} />

      <SectionRow title="Trending Now 🔥" items={trending} onOpen={onOpenContent} size="md" action="See all" />

      <Top10Row items={trending.slice(0, 5)} onOpen={onOpenContent} />

      <SectionRow title="African Originals 🌍" items={africanOriginals} onOpen={onOpenContent} size="lg" action="See all" />

      {/* AI Banner */}
      <div onClick={onOpenAIRecs} style={{ margin: '0 20px 28px', background: 'linear-gradient(135deg, rgba(108,52,131,0.4), rgba(30,96,145,0.4))', border: '1px solid rgba(108,52,131,0.3)', borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 60, opacity: 0.15 }}>🤖</div>
        <p style={{ fontSize: 10, color: '#c39bd3', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>AI Picks For You</p>
        <h4 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>Because you watched<br /><span style={{ color: '#aed6f1' }}>Nairobi Nights</span></h4>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.4 }}>3 new titles match your taste</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {trending.slice(0, 3).map(item => (
            <div key={item.id} onClick={() => onOpenContent(item)} style={{ flex: 1, cursor: 'pointer' }}>
              <img src={item.img} alt={item.title} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
            </div>
          ))}
        </div>
      </div>

      <SectionRow title="Swahili Drama" items={CONTENT.filter(c => c.language.includes('Swahili'))} onOpen={onOpenContent} action="See all" />
      <SectionRow title="Documentaries 🎥" items={documentaries} onOpen={onOpenContent} size="lg" action="See all" />
      <SectionRow title="Podcasts 🎙️" items={podcasts} onOpen={onOpenContent} size="sm" action="See all" />

      <CreatorSpotlight creators={CREATORS} onOpen={onOpenCreator} />

      {/* Coming Soon */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>Coming Soon 📅</h3>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: 'linear-gradient(135deg,#1e6091,#0e6655)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🎭</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Lagos Legends</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 8px' }}>Series · Drama · Nigeria</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#f8c471', background: 'rgba(243,156,18,0.15)', padding: '3px 9px', borderRadius: 100, fontWeight: 600 }}>Premieres Aug 30</span>
              <button style={{ fontSize: 11, color: '#2980b9', background: 'rgba(41,128,185,0.15)', padding: '3px 9px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Remind Me</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PwaniLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#1e6091,#f39c12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌊</div>
      <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Pwani Play</span>
    </div>
  )
}

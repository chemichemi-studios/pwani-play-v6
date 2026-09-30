import { useState } from 'react'
import { type ContentItem, CONTENT } from './data'

type Props = {
  item: ContentItem
  onPlay: (item: ContentItem) => void
  onBack: () => void
  onDownload: () => void
  onShare?: () => void
  onOpenCreator?: (id: string) => void
  isSaved?: boolean
  isLiked?: boolean
  onToggleWatchlist?: () => void
  onToggleLike?: () => void
}

const REVIEWS = [
  { user: 'Aisha K.', avatar: '🌺', rating: 5, text: 'Absolutely brilliant storytelling. The cinematography is on par with anything from Netflix. Proud to see African talent shine like this!', likes: 48, date: '3 days ago' },
  { user: 'Jomo O.', avatar: '🦁', rating: 4, text: 'The writing in season 2 is significantly better. The acting is world-class. Small production niggles aside, this is must-watch TV.', likes: 32, date: '1 week ago' },
  { user: 'Fatuma H.', avatar: '🌸', rating: 5, text: 'Binged all 12 episodes in one weekend. The cultural authenticity is refreshing. More please!', likes: 61, date: '2 weeks ago' },
]

export default function MovieDetail({ item, onPlay, onBack, onDownload, onShare, onOpenCreator, isSaved = false, isLiked = false, onToggleWatchlist, onToggleLike }: Props) {
  const [activeTab, setActiveTab] = useState<'episodes' | 'reviews' | 'related' | 'extras'>('episodes')
  const [inWatchlist, setInWatchlist] = useState(isSaved)
  const [liked, setLiked] = useState(isLiked)
  const [userRating, setUserRating] = useState(0)
  const related = CONTENT.filter(c => c.id !== item.id && (c.genre === item.genre || c.country === item.country)).slice(0, 3)
  const episodes = item.episodes ? Array.from({ length: Math.min(item.episodes, 6) }, (_, i) => ({
    num: i + 1,
    title: ['The Beginning', 'Shadows', 'Trust No One', 'The Informant', 'Turning Point', 'Season Finale'][i],
    runtime: '44 min',
    watched: i < 3,
    progress: i === 2 ? 0.45 : 0,
  })) : []

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', overflowY: 'auto', paddingBottom: 40 }}>
      {/* Backdrop */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <img src={item.backdrop} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#103058' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, #0a1628 100%)' }} />

        {/* Back + actions bar */}
        <div style={{ position: 'absolute', top: 52, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setLiked(!liked); onToggleLike?.() }} aria-label={liked ? 'Unlike content' : 'Like content'} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: `1px solid ${liked ? 'rgba(231,76,60,0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>{liked ? '❤️' : '🤍'}</button>
            <button onClick={onShare} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>📤</button>
          </div>
        </div>

        {/* Play button overlay */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
          <button onClick={() => onPlay(item)} style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: 22, color: '#0a1628', marginLeft: 4 }}>▶</span>
          </button>
        </div>
      </div>

      {/* Info section */}
      <div style={{ padding: '0 20px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {item.premium && <span style={{ background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>PREMIUM</span>}
          <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{item.type.toUpperCase()}</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{item.country}</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{item.year}</span>
        </div>

        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'white', margin: '0 0 8px', lineHeight: 1.15 }}>{item.title}</h1>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#f8c471', display: 'flex', alignItems: 'center', gap: 4 }}>⭐ {item.rating}/5</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>⏱ {item.runtime}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{item.language}</span>
          {item.seasons && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{item.seasons} Seasons · {item.episodes} Episodes</span>}
        </div>

        {/* Star rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Rate:</span>
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setUserRating(s)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: s <= userRating ? '#f39c12' : 'rgba(255,255,255,0.2)', transition: 'color 0.15s' }}>★</button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={() => onPlay(item)} className="btn-primary" style={{ flex: 1 }}>▶ Watch Now</button>
          <button onClick={onDownload} style={{ background: item.downloadable ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${item.downloadable ? 'rgba(26,188,156,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '14px 16px', cursor: item.downloadable ? 'pointer' : 'not-allowed', fontSize: 18, opacity: item.downloadable ? 1 : 0.4 }}>💾</button>
          <button onClick={() => { setInWatchlist(!inWatchlist); onToggleWatchlist?.() }} aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'} style={{ background: inWatchlist ? 'rgba(41,128,185,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${inWatchlist ? 'rgba(41,128,185,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', fontSize: 18 }}>{inWatchlist ? '✅' : '➕'}</button>
        </div>

        {/* Synopsis */}
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 20px' }}>{item.synopsis}</p>

        {/* Details grid */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          {[
            { label: 'Director', value: item.director, clickable: true },
            { label: 'Language', value: item.language },
            { label: 'Country', value: item.country },
            { label: 'Subtitles', value: item.subtitles.join(', ') },
            { label: 'Download', value: item.downloadable ? '✓ Available' : '✗ Not available' },
            { label: '🪙 Earn', value: `+${item.coins} coins per episode` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Cast */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>CAST</p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {item.cast.map((actor, i) => {
              const emojis = ['🧑‍🎬', '👩‍🎤', '🧑‍🎭', '👩‍💼', '🧑‍🏫']
              return (
                <div key={actor} style={{ flexShrink: 0, textAlign: 'center', width: 70 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 6px' }}>{emojis[i % emojis.length]}</div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{actor.split(' ')[0]}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Awards */}
        {item.awards && (
          <div style={{ marginBottom: 20 }}>
            {item.awards.map(award => (
              <div key={award} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.2)', borderRadius: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <span style={{ fontSize: 13, color: '#f8c471', fontWeight: 500 }}>{award}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ position: 'sticky', top: 0, background: '#0a1628', zIndex: 5, padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {(['episodes', 'reviews', 'related', 'extras'] as const).filter(t => t !== 'episodes' || item.episodes).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '14px 0', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? '#2980b9' : 'transparent'}`,
              color: activeTab === tab ? '#2980b9' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 20px' }}>
        {activeTab === 'episodes' && item.episodes && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <select style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, padding: '8px 12px', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}>
                {Array.from({ length: item.seasons ?? 1 }, (_, i) => <option key={i} style={{ background: '#0a1628' }}>Season {i + 1}</option>)}
              </select>
              <button style={{ background: 'rgba(26,188,156,0.12)', border: '1px solid rgba(26,188,156,0.3)', borderRadius: 10, padding: '8px 14px', color: '#1abc9c', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>⬇ Download All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {episodes.map(ep => (
                <div key={ep.num} onClick={() => onPlay(item)} style={{ display: 'flex', gap: 12, cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 90, height: 58, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#103058' }} />
                    {ep.watched && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#1abc9c', fontSize: 22 }}>✓</span></div>}
                    {ep.progress > 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}><div style={{ width: `${ep.progress * 100}%`, height: '100%', background: '#2980b9' }} /></div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>EP {ep.num}</p>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{ep.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>{ep.runtime}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onDownload() }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>⬇</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* AI sentiment */}
            <div style={{ background: 'rgba(108,52,131,0.15)', border: '1px solid rgba(108,52,131,0.3)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <div>
                <p style={{ color: '#c39bd3', fontSize: 12, fontWeight: 700, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>AI SENTIMENT SUMMARY</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>Audiences love the authentic storytelling and strong performances. 94% of viewers recommend this title. Common praise: cinematography, writing, cultural accuracy.</p>
              </div>
            </div>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{r.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>{r.user}</p>
                    <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 11, color: s <= r.rating ? '#f39c12' : 'rgba(255,255,255,0.2)' }}>★</span>)}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{r.date}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 }}>{r.text}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>👍 {r.likes}</button>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}>Report</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'related' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {related.map(item => (
              <div key={item.id} onClick={() => onPlay(item)} style={{ display: 'flex', gap: 14, cursor: 'pointer' }}>
                <img src={item.img} alt={item.title} style={{ width: 100, height: 65, objectFit: 'cover', borderRadius: 12, flexShrink: 0, background: '#103058' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 4px' }}>{item.type} · {item.genre}</p>
                  <span style={{ fontSize: 11, color: '#f8c471' }}>⭐ {item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'extras' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>Behind the Scenes</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>Making-of videos, interviews, and exclusive extras coming soon.</p>
            <button className="btn-secondary" style={{ maxWidth: 200, margin: '0 auto' }}>Notify Me</button>
          </div>
        )}
      </div>
    </div>
  )
}

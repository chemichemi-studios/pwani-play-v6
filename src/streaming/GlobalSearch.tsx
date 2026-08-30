import { useState, useRef, useEffect } from 'react'
import { CONTENT, CREATORS, type ContentItem } from './data'
import { SkeletonCard } from './components/Skeleton'
import EmptyState, { EMPTY_STATES } from './components/EmptyState'

type Props = {
  onBack: () => void
  onOpenContent: (item: ContentItem) => void
  onOpenCreator: (id: string) => void
}

type SearchTab = 'all' | 'movies' | 'creators' | 'actors' | 'episodes'

const TRENDING = ['Nairobi Nights', 'Mama Afrika', 'Grace Mutua', 'Swahili drama', 'African animation', 'Sound of Mombasa']
const RECENT = ['Studio Masters', 'documentary Kenya', 'Grace Mutua']
const ACTORS = [
  { name: 'Aisha Kamau', role: 'Actress', titles: 8, emoji: '👩‍🎭' },
  { name: 'David Ochieng', role: 'Actor', titles: 12, emoji: '🧑‍🎬' },
  { name: 'Nandi Mkhize', role: 'Actress', titles: 6, emoji: '👩‍🎤' },
  { name: 'Themba Dlamini', role: 'Actor', titles: 15, emoji: '🎭' },
]

export default function GlobalSearch({ onBack, onOpenContent, onOpenCreator }: Props) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSearch = (q: string) => {
    setQuery(q)
    if (q.length > 0) {
      setLoading(true)
      setHasSearched(true)
      setTimeout(() => setLoading(false), 600)
    } else {
      setHasSearched(false)
      setLoading(false)
    }
  }

  const contentResults = CONTENT.filter(c =>
    query && (
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.genre.toLowerCase().includes(query.toLowerCase()) ||
      c.director.toLowerCase().includes(query.toLowerCase()) ||
      c.cast.some(a => a.toLowerCase().includes(query.toLowerCase()))
    )
  )

  const creatorResults = CREATORS.filter(c =>
    query && (c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase()))
  )

  const actorResults = ACTORS.filter(a =>
    query && a.name.toLowerCase().includes(query.toLowerCase())
  )

  const totalResults = contentResults.length + creatorResults.length + actorResults.length

  const TABS: { id: SearchTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Titles' },
    { id: 'creators', label: 'Creators' },
    { id: 'actors', label: 'Actors' },
    { id: 'episodes', label: 'Episodes' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Search header */}
      <div style={{ padding: '52px 20px 0', background: '#0a1628', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18, flexShrink: 0 }}>←</button>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              ref={inputRef}
              className="input-field"
              placeholder="Search titles, creators, actors..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              style={{ paddingLeft: 44, paddingRight: query ? 44 : 16 }}
            />
            {query && (
              <button onClick={() => { handleSearch(''); setHasSearched(false) }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 22, height: 22, color: 'white', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            )}
          </div>
        </div>

        {/* Tabs (shown when searching) */}
        {hasSearched && (
          <div style={{ display: 'flex', gap: 0, marginBottom: 0, overflowX: 'auto' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flexShrink: 0, padding: '10px 14px', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#2980b9' : 'transparent'}`,
                color: activeTab === tab.id ? '#2980b9' : 'rgba(255,255,255,0.45)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s',
              }}>{tab.label}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px' }}>
        {/* Pre-search state */}
        {!hasSearched && (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recent Searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {RECENT.map(s => (
                  <button key={s} onClick={() => handleSearch(s)} style={{ padding: '8px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🕐 {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>🔥 Trending Searches</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TRENDING.map((s, i) => (
                  <button key={s} onClick={() => handleSearch(s)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <span style={{ fontSize: 13, color: i < 3 ? '#e74c3c' : 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace', fontWeight: 700, width: 20, flexShrink: 0, textAlign: 'center' }}>{i + 1}</span>
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', fontFamily: 'Outfit, sans-serif', flex: 1 }}>{s}</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI voice search */}
            <div style={{ background: 'rgba(108,52,131,0.1)', border: '1px solid rgba(108,52,131,0.2)', borderRadius: 16, padding: '16px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(108,52,131,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🎙️</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Voice Search</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Say what you're looking for — coming soon</p>
              </div>
              <span style={{ background: 'rgba(202,111,30,0.2)', border: '1px solid rgba(202,111,30,0.3)', color: '#ca6f1e', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, fontFamily: 'DM Mono, monospace' }}>SOON</span>
            </div>
          </>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, overflowX: 'hidden' }}>
              {[0,1,2].map(i => <SkeletonCard key={i} size="md" />)}
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'hidden' }}>
              {[0,1,2].map(i => <SkeletonCard key={i} size="sm" />)}
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && (
          <>
            {totalResults === 0 ? (
              <EmptyState
                {...EMPTY_STATES.noResults}
                onAction={() => handleSearch('')}
              />
            ) : (
              <>
                {/* Result count */}
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px', fontFamily: 'DM Mono, monospace' }}>
                  {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                </p>

                {/* AI suggestion */}
                <div style={{ background: 'rgba(108,52,131,0.1)', border: '1px solid rgba(108,52,131,0.2)', borderRadius: 14, padding: '12px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🤖</span>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    <span style={{ color: '#c39bd3', fontWeight: 700 }}>AI Suggestion: </span>
                    You might also enjoy searching for "African crime drama" or "East African directors".
                  </p>
                </div>

                {/* Content results */}
                {(activeTab === 'all' || activeTab === 'movies') && contentResults.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Titles · {contentResults.length}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {contentResults.map(item => (
                        <SearchResultCard key={item.id} item={item} onOpen={() => onOpenContent(item)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Creator results */}
                {(activeTab === 'all' || activeTab === 'creators') && creatorResults.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Creators · {creatorResults.length}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {creatorResults.map(c => (
                        <div key={c.id} onClick={() => onOpenCreator(c.id)} style={{ display: 'flex', gap: 14, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', alignItems: 'center' }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{c.name}</p>
                              {c.verified && <span style={{ fontSize: 14 }}>✓</span>}
                            </div>
                            <p style={{ color: '#5dade2', fontSize: 12, margin: '2px 0 2px', fontWeight: 600 }}>{c.role}</p>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.followers} followers · {c.content} titles</p>
                          </div>
                          <button style={{ background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.25)', borderRadius: 10, padding: '7px 14px', color: '#5dade2', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, flexShrink: 0 }}>Follow</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actor results */}
                {(activeTab === 'all' || activeTab === 'actors') && actorResults.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Actors & Directors · {actorResults.length}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {actorResults.map(a => (
                        <div key={a.name} style={{ display: 'flex', gap: 14, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{a.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{a.name}</p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{a.role} · Appears in {a.titles} titles</p>
                          </div>
                          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SearchResultCard({ item, onOpen }: { item: ContentItem; onOpen: () => void }) {
  return (
    <div onClick={onOpen} style={{ display: 'flex', gap: 14, cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
      <img src={item.img} alt={item.title} style={{ width: 80, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#103058' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 5px' }}>{item.type} · {item.genre} · {item.country}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#f8c471' }}>⭐ {item.rating}</span>
          {item.premium && <span style={{ fontSize: 11, color: '#f39c12', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>PRO</span>}
          {item.downloadable && <span style={{ fontSize: 11, color: '#1abc9c' }}>💾</span>}
        </div>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18, flexShrink: 0 }}>›</span>
    </div>
  )
}

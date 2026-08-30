import { useState } from 'react'
import { CONTENT, CREATORS, CATEGORIES, GENRES, LANGUAGES_FILTER, type ContentItem } from './data'

type Props = {
  onOpenContent: (item: ContentItem) => void
  onOpenCreator?: (id: string) => void
  onOpenSearch?: () => void
}

const FESTIVALS = [
  { id: 'naiff', name: 'Nairobi Int\'l Film Festival', location: 'Nairobi, Kenya', date: 'Oct 15–22', emoji: '🇰🇪', films: 48, color: '#1e6091' },
  { id: 'zaniff', name: 'Zanzibar Film Festival', location: 'Zanzibar, Tanzania', date: 'Jul 5–12', emoji: '🇹🇿', films: 36, color: '#0e6655' },
  { id: 'liff', name: 'Lagos Int\'l Film Festival', location: 'Lagos, Nigeria', date: 'Nov 2–9', emoji: '🇳🇬', films: 62, color: '#6c3483' },
  { id: 'paiff', name: 'Pan-African Film Festival', location: 'Ouagadougou, BF', date: 'Feb 18–25', emoji: '🌍', films: 120, color: '#b7770d' },
  { id: 'diff', name: 'Durban Int\'l Film Festival', location: 'Durban, South Africa', date: 'Jun 20–30', emoji: '🇿🇦', films: 55, color: '#922b21' },
]

const FILTERS = ['Free', 'Premium', 'Downloadable', 'Short Films', 'Movies', 'Series', 'Podcasts', 'Live', 'Family Friendly']
const TRENDING_TAGS = ['#AfricanOriginals', '#SwahiliDrama', '#Nollywood', '#KenyanCinema', '#AfroBeats', '#NewVoices', '#Documentary', '#Animation']
const COUNTRIES = ['🇰🇪 Kenya', '🇹🇿 Tanzania', '🇳🇬 Nigeria', '🇬🇭 Ghana', '🇿🇦 South Africa', '🇪🇹 Ethiopia', '🇸🇳 Senegal', '🇷🇼 Rwanda']

export default function DiscoverTab({ onOpenContent, onOpenCreator, onOpenSearch }: Props) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [activeLang, setActiveLang] = useState('All Languages')
  const [showResults, setShowResults] = useState(false)

  const recentSearches = ['Nairobi Nights', 'Grace Mutua', 'Swahili drama', 'documentary 2024']
  const trendingSearches = ['Studio Masters', 'Mama Afrika', 'Sound of Mombasa', 'African animation']

  const toggleFilter = (f: string) => setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const filtered = CONTENT.filter(item => {
    if (activeCategory !== 'All' && !item.type.toLowerCase().includes(activeCategory.toLowerCase()) && !item.genre.toLowerCase().includes(activeCategory.toLowerCase())) return false
    if (query && !item.title.toLowerCase().includes(query.toLowerCase()) && !item.genre.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Search header */}
      <div style={{ padding: '12px 20px 0', position: 'sticky', top: 52, background: '#0a1628', zIndex: 5 }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
          <input
            className="input-field"
            placeholder="Search films, creators, genres..."
            value={query}
            onChange={e => { setQuery(e.target.value); setShowResults(e.target.value.length > 0) }}
            style={{ paddingLeft: 44, paddingRight: query ? 44 : 16 }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowResults(false) }} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 22, height: 22, color: 'white', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          )}
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 100,
              background: activeCategory === cat ? '#2980b9' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${activeCategory === cat ? '#2980b9' : 'rgba(255,255,255,0.1)'}`,
              color: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.6)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.2s ease',
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Search suggestions (when typing) */}
      {showResults && (
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Results</p>
          {filtered.map(item => (
            <div key={item.id} onClick={() => { onOpenContent(item); setQuery(''); setShowResults(false) }} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
              <img src={item.img} alt={item.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#103058' }} />
              <div>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{item.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{item.type} · {item.genre} · {item.country}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>No results found</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Try different keywords or browse categories</p>
            </div>
          )}
        </div>
      )}

      {!showResults && (
        <>
          {/* Recent + Trending searches */}
          <div style={{ padding: '16px 20px 0' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recent Searches</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {recentSearches.map(s => (
                <button key={s} onClick={() => { setQuery(s); setShowResults(true) }} style={{ padding: '7px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🕐 {s}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Trending Searches</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {trendingSearches.map((s, i) => (
                <button key={s} onClick={() => { setQuery(s); setShowResults(true) }} style={{ padding: '7px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔥 {s}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Filters</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => toggleFilter(f)} style={{
                  padding: '7px 14px', borderRadius: 100, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500,
                  background: activeFilters.includes(f) ? 'rgba(243,156,18,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${activeFilters.includes(f) ? '#f39c12' : 'rgba(255,255,255,0.1)'}`,
                  color: activeFilters.includes(f) ? '#f8c471' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.18s ease',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Genres grid */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Browse Genres</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {GENRES.map((genre, i) => {
                const colors = ['#1e6091', '#ca6f1e', '#0e6655', '#6c3483', '#117a65', '#b7770d', '#922b21', '#1a5276']
                return (
                  <div key={genre} style={{ background: `${colors[i % colors.length]}30`, border: `1px solid ${colors[i % colors.length]}44`, borderRadius: 14, padding: '16px 16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                    <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0, position: 'relative', zIndex: 1 }}>{genre}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '2px 0 0', position: 'relative', zIndex: 1 }}>{Math.floor(Math.random() * 40 + 10)} titles</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Languages */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>By Language</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {LANGUAGES_FILTER.map(lang => (
                <button key={lang} onClick={() => setActiveLang(lang)} style={{
                  flexShrink: 0, padding: '8px 16px', borderRadius: 100,
                  background: activeLang === lang ? 'rgba(26,188,156,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${activeLang === lang ? '#1abc9c' : 'rgba(255,255,255,0.1)'}`,
                  color: activeLang === lang ? '#1abc9c' : 'rgba(255,255,255,0.6)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.2s',
                }}>{lang}</button>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>By Country</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {COUNTRIES.map(c => (
                <button key={c} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Trending tags */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Trending Tags</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TRENDING_TAGS.map(tag => (
                <span key={tag} style={{ padding: '7px 12px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.25)', color: '#5dade2', fontSize: 13, cursor: 'pointer' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Award Winners */}
          <div style={{ padding: '0 20px 24px' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>🏆 Award Winners</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CONTENT.filter(c => c.awards?.length).map(item => (
                <div key={item.id} onClick={() => onOpenContent(item)} style={{ display: 'flex', gap: 14, cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
                  <img src={item.img} alt={item.title} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#103058' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ color: '#f8c471', fontSize: 12, margin: '0 0 4px' }}>🏆 {item.awards?.[0]}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{item.type} · {item.year}</p>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Film Festivals */}
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>🎪 Film Festivals</p>
              <span style={{ fontSize: 11, color: '#2980b9', cursor: 'pointer', fontWeight: 600 }}>All Events</span>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {FESTIVALS.map(fest => (
                <div key={fest.id} style={{
                  flexShrink: 0, width: 190,
                  background: `linear-gradient(135deg, ${fest.color}40, ${fest.color}18)`,
                  border: `1px solid ${fest.color}44`,
                  borderRadius: 18, padding: '16px', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', right: -8, top: -8, fontSize: 52, opacity: 0.12 }}>{fest.emoji}</div>
                  <span style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>{fest.emoji}</span>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 3px', lineHeight: 1.3 }}>{fest.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: '0 0 10px' }}>{fest.location}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#f8c471', background: 'rgba(243,156,18,0.15)', padding: '3px 8px', borderRadius: 100, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{fest.date}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{fest.films} films</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Creators */}
          <div style={{ padding: '0 20px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>✨ Featured Creators</p>
              <span style={{ fontSize: 11, color: '#2980b9', cursor: 'pointer', fontWeight: 600 }}>All Creators</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {CREATORS.map(c => (
                <div
                  key={c.id}
                  onClick={() => onOpenCreator?.(c.id)}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '16px 14px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 10, border: '2px solid rgba(255,255,255,0.1)' }}>
                    {c.avatar}
                    {c.verified && (
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>✓</div>
                    )}
                  </div>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{c.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 8px' }}>{c.role}</p>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#5dade2', fontSize: 12, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.followers}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0 }}>followers</p>
                    </div>
                    <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#1abc9c', fontSize: 12, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.content}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0 }}>films</p>
                    </div>
                  </div>
                  <button style={{ width: '100%', padding: '7px', borderRadius: 10, background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.3)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

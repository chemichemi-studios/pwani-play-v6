import { useState } from 'react'
import { CONTENT, type ContentItem } from './data'
import EmptyState, { EMPTY_STATES } from './components/EmptyState'

type Props = {
  onBack: () => void
  onOpenContent: (item: ContentItem) => void
  onDownload: () => void
  savedIds?: string[]
  onRemoveSaved?: (id: string) => void
}

const SECTIONS = ['All', 'Movies', 'Series', 'Podcasts', 'Continue Later'] as const
type Section = typeof SECTIONS[number]

export default function WatchlistScreen({ onBack, onOpenContent, onDownload, savedIds = [], onRemoveSaved }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('All')
  const [removed, setRemoved] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'rating'>('added')

  const allItems = CONTENT.filter(item => savedIds.includes(item.id))
  const continueItems = CONTENT.filter(c => c.progress !== undefined)

  const items = activeSection === 'Continue Later'
    ? continueItems
    : allItems.filter(item => {
        if (activeSection === 'Movies') return item.type === 'movie'
        if (activeSection === 'Series') return item.type === 'series'
        if (activeSection === 'Podcasts') return item.type === 'podcast'
        return true
      })

  const visible = items.filter(i => !removed.includes(i.id))

  const sorted = [...visible].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0', background: 'linear-gradient(180deg, #103058 0%, #0a1628 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>My Watchlist</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>{visible.length} title{visible.length !== 1 ? 's' : ''} saved</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 12, padding: '7px 10px', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}
            >
              <option value="added" style={{ background: '#0a1628' }}>Recently Added</option>
              <option value="title" style={{ background: '#0a1628' }}>Title A–Z</option>
              <option value="rating" style={{ background: '#0a1628' }}>Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16 }}>
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                background: activeSection === s ? '#2980b9' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${activeSection === s ? '#2980b9' : 'rgba(255,255,255,0.1)'}`,
                color: 'white', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s ease',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px' }}>
        {sorted.length === 0 ? (
          <EmptyState
            {...EMPTY_STATES.emptyWatchlist}
            onAction={() => onBack()}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sorted.map(item => (
              <WatchlistCard
                key={item.id}
                item={item}
                showProgress={activeSection === 'Continue Later'}
                onWatch={() => onOpenContent(item)}
                onDownload={onDownload}
                onRemove={() => { setRemoved(prev => [...prev, item.id]); onRemoveSaved?.(item.id) }}
                onShare={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function WatchlistCard({ item, showProgress, onWatch, onDownload, onRemove, onShare }: {
  item: ContentItem
  showProgress: boolean
  onWatch: () => void
  onDownload: () => void
  onRemove: () => void
  onShare: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 14, padding: '14px', alignItems: 'flex-start' }}>
        {/* Thumbnail */}
        <div style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }} onClick={onWatch}>
          <img src={item.img} alt={item.title} style={{ width: 100, height: 65, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, color: '#0a1628', marginLeft: 2 }}>▶</span>
            </div>
          </div>
          {item.premium && (
            <div style={{ position: 'absolute', top: 5, left: 5, background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', borderRadius: 4, padding: '1px 6px' }}>
              <span style={{ fontSize: 9, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>PRO</span>
            </div>
          )}
          {showProgress && item.progress !== undefined && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
              <div style={{ width: `${item.progress * 100}%`, height: '100%', background: '#2980b9' }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} · {item.genre} · {item.year}
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#f8c471' }}>⭐ {item.rating}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{item.runtime}</span>
            {item.downloadable && <span style={{ fontSize: 11, color: '#1abc9c' }}>💾 Available</span>}
          </div>
          {showProgress && item.progress !== undefined && (
            <p style={{ fontSize: 11, color: '#5dade2', margin: '4px 0 0', fontFamily: 'DM Mono, monospace' }}>
              {Math.round(item.progress * 100)}% watched
            </p>
          )}
        </div>

        {/* More button */}
        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20, padding: '0 4px', flexShrink: 0 }}>⋯</button>
      </div>

      {/* Expanded actions */}
      {expanded && (
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { icon: '▶', label: 'Watch', action: onWatch, color: '#2980b9' },
            { icon: '💾', label: 'Download', action: onDownload, color: '#1abc9c', disabled: !item.downloadable },
            { icon: '📤', label: 'Share', action: onShare, color: 'rgba(255,255,255,0.6)' },
            { icon: '✕', label: 'Remove', action: onRemove, color: '#e74c3c' },
          ].map(({ icon, label, action, color, disabled }) => (
            <button
              key={label}
              onClick={() => { if (!disabled) { action(); setExpanded(false) } }}
              disabled={disabled}
              style={{
                flex: 1, padding: '12px 0', background: 'none', border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                opacity: disabled ? 0.3 : 1,
              }}
            >
              <span style={{ fontSize: 16, color }}>{icon}</span>
              <span style={{ fontSize: 10, color, fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

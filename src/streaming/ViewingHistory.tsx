import { useState } from 'react'
import { CONTENT, type ContentItem } from './data'
import EmptyState, { EMPTY_STATES } from './components/EmptyState'

type Props = {
  onBack: () => void
  onOpenContent: (item: ContentItem) => void
}

type HistoryItem = ContentItem & {
  watchedAt: string
  watchedOn: string
  completed: boolean
  abandoned: boolean
}

const HISTORY: HistoryItem[] = [
  { ...CONTENT[0], watchedAt: '2h ago', watchedOn: 'iPhone 15', completed: false, abandoned: false },
  { ...CONTENT[4], watchedAt: 'Yesterday', watchedOn: 'Smart TV', completed: true, abandoned: false },
  { ...CONTENT[2], watchedAt: '3 days ago', watchedOn: 'iPad', completed: false, abandoned: false },
  { ...CONTENT[1], watchedAt: '1 week ago', watchedOn: 'iPhone 15', completed: true, abandoned: false },
  { ...CONTENT[3], watchedAt: '2 weeks ago', watchedOn: 'iPhone 15', completed: false, abandoned: true },
  { ...CONTENT[5], watchedAt: '3 weeks ago', watchedOn: 'Web Browser', completed: true, abandoned: false },
]

const DEVICE_ICONS: Record<string, string> = {
  'iPhone 15': '📱',
  'Smart TV': '📺',
  'iPad': '🖥',
  'Web Browser': '💻',
}

export default function ViewingHistory({ onBack, onOpenContent }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'abandoned' | 'downloads'>('all')
  const [deleted, setDeleted] = useState<string[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const filtered = HISTORY.filter(item => {
    if (deleted.includes(item.id)) return false
    if (activeTab === 'completed') return item.completed
    if (activeTab === 'abandoned') return item.abandoned
    if (activeTab === 'downloads') return item.downloadable ?? false
    return true
  })

  const groupedByDate = filtered.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const group = item.watchedAt.includes('ago') ? 'Today' : item.watchedAt === 'Yesterday' ? 'Yesterday' : 'Earlier'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0', background: 'linear-gradient(180deg,#103058 0%,#0a1628 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Viewing History</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>{filtered.length} items</p>
          </div>
          <button onClick={() => setShowClearConfirm(true)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Clear All</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {([['all', 'All'], ['completed', 'Completed ✓'], ['abandoned', 'Abandoned'], ['downloads', 'Downloads']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === id ? '#1e6091' : 'transparent',
              color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600,
              transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Device sync banner */}
      <div style={{ margin: '12px 20px 0', background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>☁️</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#1abc9c', fontSize: 13, fontWeight: 600, margin: '0 0 1px' }}>Synced across 3 devices</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>Last sync: 2 minutes ago</p>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1abc9c', animation: 'pulse-glow 2s infinite' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px' }}>
        {filtered.length === 0 ? (
          <EmptyState {...EMPTY_STATES.noHistory} onAction={onBack} />
        ) : (
          Object.entries(groupedByDate).map(([group, items]) => (
            <div key={group} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>{group}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <HistoryCard
                    key={`${item.id}-${item.watchedAt}`}
                    item={item}
                    onWatch={() => onOpenContent(item)}
                    onDelete={() => setDeleted(prev => [...prev, item.id])}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear confirm dialog */}
      {showClearConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ background: '#0d2040', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '28px 24px', maxWidth: 320, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 10px' }}>Clear History?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>This will remove all viewing history. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowClearConfirm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={() => { setDeleted(HISTORY.map(h => h.id)); setShowClearConfirm(false) }}
                style={{ flex: 1, background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12, padding: '14px', color: '#ec7063', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
              >Clear All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function HistoryCard({ item, onWatch, onDelete }: { item: HistoryItem; onWatch: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }} onClick={onWatch}>
        <img src={item.img} alt={item.title} style={{ width: 88, height: 56, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
        {item.completed && (
          <div style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: '50%', background: '#1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, color: 'white' }}>✓</span>
          </div>
        )}
        {item.abandoned && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(231,76,60,0.5)', borderRadius: '0 0 10px 10px' }}>
            <div style={{ width: `${(item.progress ?? 0.15) * 100}%`, height: '100%', background: '#e74c3c' }} />
          </div>
        )}
        {!item.completed && !item.abandoned && item.progress !== undefined && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
            <div style={{ width: `${item.progress * 100}%`, height: '100%', background: '#2980b9' }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: item.completed ? '#1abc9c' : item.abandoned ? '#e74c3c' : '#5dade2', fontWeight: 600 }}>
            {item.completed ? '✓ Completed' : item.abandoned ? 'Abandoned' : `${Math.round((item.progress ?? 0) * 100)}% watched`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>{DEVICE_ICONS[item.watchedOn] ?? '📱'}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{item.watchedOn} · {item.watchedAt}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <button onClick={onWatch} style={{ background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.25)', borderRadius: 8, padding: '7px 10px', color: '#5dade2', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
          {item.completed ? 'Re-watch' : item.abandoned ? 'Restart' : 'Resume'}
        </button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Remove</button>
      </div>
    </div>
  )
}

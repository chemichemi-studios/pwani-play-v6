import { useState, useEffect } from 'react'
import { DOWNLOADS } from './data'
import EmptyState, { EMPTY_STATES } from './components/EmptyState'

type Props = {
  onBack: () => void
  onPlay: (title: string) => void
}

export default function OfflineLibrary({ onBack, onPlay }: Props) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)
  const [lastSync] = useState('5 minutes ago')

  useEffect(() => {
    const on = () => { setIsOnline(true); setSyncing(true); setTimeout(() => setSyncing(false), 2000) }
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const completedDownloads = DOWNLOADS.filter(d => d.status === 'completed')
  const storageUsed = 1.59
  const storageTotal = 16

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', background: 'linear-gradient(180deg,#0d2040 0%,#0a1628 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Offline Library</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>{completedDownloads.length} titles available</p>
          </div>
        </div>

        {/* Connection status banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
          background: isOnline ? 'rgba(26,188,156,0.1)' : 'rgba(231,76,60,0.1)',
          border: `1px solid ${isOnline ? 'rgba(26,188,156,0.25)' : 'rgba(231,76,60,0.25)'}`,
          borderRadius: 14, marginBottom: 16,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? '#1abc9c' : '#e74c3c', flexShrink: 0, animation: isOnline ? 'pulse-glow 2s infinite' : 'none' }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: isOnline ? '#1abc9c' : '#ec7063', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>
              {isOnline ? (syncing ? 'Syncing...' : 'Online') : 'Offline Mode'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>
              {isOnline ? `Last synced: ${lastSync}` : 'Showing downloaded content only'}
            </p>
          </div>
          {isOnline && !syncing && (
            <button onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000) }} style={{ background: 'none', border: 'none', color: '#1abc9c', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, flexShrink: 0 }}>Sync</button>
          )}
          {syncing && <span style={{ fontSize: 18, animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>🔄</span>}
        </div>

        {/* Storage mini gauge */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>💾</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Offline Storage</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{storageUsed} / {storageTotal} GB</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <div style={{ width: `${(storageUsed / storageTotal) * 100}%`, height: '100%', background: '#2980b9', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px' }}>
        {!isOnline && (
          <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>📡</span>
            <div>
              <p style={{ color: '#ec7063', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>No internet connection</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.4 }}>Only your downloaded content is available. Connect to internet to browse more titles and sync your progress.</p>
            </div>
          </div>
        )}

        {completedDownloads.length === 0 ? (
          <EmptyState
            {...EMPTY_STATES.noDownloads}
            onAction={onBack}
          />
        ) : (
          <>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>
              Ready to Watch
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {completedDownloads.map(item => (
                <OfflineCard key={item.id} item={item} onPlay={() => onPlay(item.title)} />
              ))}
            </div>

            {/* Download settings shortcut */}
            <div style={{ marginTop: 24, background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.18)', borderRadius: 16, padding: '16px' }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>⚙️ Download Settings</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.4 }}>Configure quality, Wi-Fi-only downloads, and auto-delete preferences.</p>
              <button onClick={onBack} style={{ background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.3)', borderRadius: 10, padding: '10px 16px', color: '#5dade2', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Open Download Manager</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function OfflineCard({ item, onPlay }: { item: typeof DOWNLOADS[0]; onPlay: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, alignItems: 'center' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={item.img} alt={item.title} style={{ width: 80, height: 52, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
        <div style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: '50%', background: '#1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: 'white' }}>✓</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{item.quality}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{item.size}</span>
          {item.expiry && <><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span><span style={{ fontSize: 11, color: '#f39c12' }}>{item.expiry}</span></>}
        </div>
      </div>
      <button onClick={onPlay} style={{ background: 'white', border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <span style={{ fontSize: 14, color: '#0a1628', marginLeft: 2 }}>▶</span>
      </button>
    </div>
  )
}

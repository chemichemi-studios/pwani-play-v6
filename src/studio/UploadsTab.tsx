import { useState } from 'react'
import { UPLOAD_QUEUE } from './data'
import type { UploadItem } from './data'

type Props = { onOpenProject?: (id: string) => void }

const ASSET_TYPE_ICON: Record<string, string> = {
  video: '🎬', audio: '🎵', image: '🖼️', document: '📄', subtitle: '💬', graphic: '🎨',
}

export default function UploadsTab({ onOpenProject }: Props) {
  const [uploads, setUploads] = useState<UploadItem[]>(UPLOAD_QUEUE)
  const [activeFilter, setActiveFilter] = useState<'all' | 'uploading' | 'complete' | 'queued' | 'error'>('all')

  const filtered = uploads.filter(u => activeFilter === 'all' || u.status === activeFilter)

  const togglePause = (id: string) => setUploads(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'uploading' ? 'paused' : 'uploading' } : u))
  const cancel = (id: string) => setUploads(prev => prev.filter(u => u.id !== id))
  const retry = (id: string) => setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'uploading', progress: 0, error: undefined } : u))

  const activeCount = uploads.filter(u => u.status === 'uploading').length
  const totalSize = '10.7 GB'

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Upload Manager</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>{activeCount} active · {totalSize} total</p>

        {/* Upload progress summary */}
        {activeCount > 0 && (
          <div style={{ background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ color: '#5dade2', fontSize: 14, fontWeight: 700, margin: 0 }}>📤 Uploading {activeCount} file{activeCount !== 1 ? 's' : ''}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>Wi-Fi · 45 MB/s</p>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg,#1e6091,#2980b9)', borderRadius: 3, animation: 'shimmer 2s infinite' }} />
            </div>
          </div>
        )}

        {/* Add upload button */}
        <button style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📤</span> Add Files to Upload
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 16px' }}>
        {(['all', 'uploading', 'complete', 'queued', 'error'] as const).map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            flexShrink: 0, padding: '7px 14px', borderRadius: 100,
            background: activeFilter === f ? '#1e6091' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${activeFilter === f ? '#2980b9' : 'rgba(255,255,255,0.1)'}`,
            color: activeFilter === f ? 'white' : 'rgba(255,255,255,0.55)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize',
          }}>{f} {f === 'error' && uploads.filter(u => u.status === 'error').length > 0 && `(${uploads.filter(u => u.status === 'error').length})`}</button>
        ))}
      </div>

      {/* Upload list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📭</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>No uploads here</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Add files above to get started.</p>
          </div>
        ) : filtered.map(item => (
          <UploadCard key={item.id} item={item} onPause={() => togglePause(item.id)} onCancel={() => cancel(item.id)} onRetry={() => retry(item.id)} />
        ))}
      </div>
    </div>
  )
}

function UploadCard({ item, onPause, onCancel, onRetry }: { item: UploadItem; onPause: () => void; onCancel: () => void; onRetry: () => void }) {
  const statusConfig = {
    uploading: { color: '#2980b9', label: 'Uploading', icon: '⬆️' },
    processing: { color: '#f39c12', label: 'Processing', icon: '⚙️' },
    complete: { color: '#1abc9c', label: 'Complete', icon: '✅' },
    error: { color: '#e74c3c', label: 'Failed', icon: '⚠️' },
    queued: { color: 'rgba(255,255,255,0.4)', label: 'Queued', icon: '⏳' },
    paused: { color: '#f39c12', label: 'Paused', icon: '⏸' },
  }
  const sc = statusConfig[item.status]

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.status === 'error' ? 'rgba(231,76,60,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: '14px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          {ASSET_TYPE_ICON[item.type] ?? '📁'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: sc.color, fontWeight: 600 }}>{sc.icon} {sc.label}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{item.size}</span>
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          {item.status === 'uploading' && (
            <button onClick={onPause} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏸</button>
          )}
          {item.status === 'paused' && (
            <button onClick={onPause} style={{ background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.3)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</button>
          )}
          {item.status === 'error' && (
            <button onClick={onRetry} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔄</button>
          )}
          {item.status !== 'complete' && (
            <button onClick={onCancel} style={{ background: 'rgba(231,76,60,0.08)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, color: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {(item.status === 'uploading' || item.status === 'paused' || item.status === 'processing') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: sc.color, fontFamily: 'DM Mono, monospace' }}>{Math.round(item.progress * 100)}%</span>
            {item.eta && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>ETA {item.eta}</span>}
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: `${item.progress * 100}%`, height: '100%', background: sc.color, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      {/* Error message */}
      {item.status === 'error' && item.error && (
        <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(231,76,60,0.1)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <p style={{ color: '#ec7063', fontSize: 12, margin: 0 }}>{item.error}</p>
        </div>
      )}
    </div>
  )
}

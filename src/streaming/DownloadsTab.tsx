import { useState } from 'react'
import { DOWNLOADS } from './data'

export default function DownloadsTab({ onOpenOffline }: { onOpenOffline?: () => void }) {
  const [downloads, setDownloads] = useState(DOWNLOADS)
  const [wifiOnly, setWifiOnly] = useState(true)
  const [quality, setQuality] = useState('1080p')
  const [smartDownloads, setSmartDownloads] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'active' | 'queued'>('all')
  const _ = onOpenOffline // silence unused warning — used in JSX below

  const storageUsed = 2.4
  const storageTotal = 16
  const storagePercent = (storageUsed / storageTotal) * 100

  const filtered = downloads.filter(d => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'completed') return d.status === 'completed'
    if (activeFilter === 'active') return d.status === 'downloading'
    if (activeFilter === 'queued') return d.status === 'queued'
    return true
  })

  const deleteItem = (id: string) => setDownloads(prev => prev.filter(d => d.id !== id))

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '16px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Downloads</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>Your offline library</p>

        {/* Storage indicator */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: 'white', fontWeight: 600 }}>💾 Storage Used</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace' }}>{storageUsed} GB / {storageTotal} GB</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${storagePercent}%`, height: '100%', background: storagePercent > 80 ? '#e74c3c' : storagePercent > 60 ? '#f39c12' : '#2980b9', borderRadius: 4, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{storagePercent.toFixed(0)}% used</span>
            <button style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Manage Storage</button>
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '4px 0', marginBottom: 20 }}>
          {[
            {
              label: 'Wi-Fi Only', sub: 'Downloads pause on mobile data', value: wifiOnly,
              toggle: () => setWifiOnly(!wifiOnly), type: 'toggle'
            },
            {
              label: 'Smart Downloads', sub: 'Auto-delete watched, download next', value: smartDownloads,
              toggle: () => setSmartDownloads(!smartDownloads), type: 'toggle'
            },
          ].map(({ label, sub, value, toggle, type }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{sub}</p>
              </div>
              <div onClick={toggle} style={{ width: 48, height: 28, borderRadius: 14, background: value ? '#2980b9' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: value ? 22 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
            <div>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>Download Quality</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Affects file size and clarity</p>
            </div>
            <select value={quality} onChange={e => setQuality(e.target.value)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 13, padding: '6px 10px', fontFamily: 'DM Mono, monospace', cursor: 'pointer' }}>
              {['4K', '1080p', '720p', '480p'].map(q => <option key={q} value={q} style={{ background: '#0a1628' }}>{q}</option>)}
            </select>
          </div>
        </div>

        {/* Offline Library shortcut */}
        {onOpenOffline && (
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.18)', borderRadius: 14, padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }} onClick={onOpenOffline}>
            <span style={{ fontSize: 20 }}>📡</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>Offline Library</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>View all content available without internet</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(['all', 'completed', 'active', 'queued'] as const).map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flex: 1, padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeFilter === f ? '#1e6091' : 'transparent',
              color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 600,
              transition: 'all 0.2s', textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Download items */}
      <div style={{ padding: '0 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📭</div>
            <p style={{ color: 'white', fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>No downloads here</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>Tap the download icon on any content to save it for offline viewing</p>
            <button className="btn-primary" style={{ maxWidth: 200, margin: '0 auto' }}>Browse Content</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(item => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={item.img} alt={item.title} style={{ width: 80, height: 52, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
                  {item.status === 'completed' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,188,156,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 20 }}>✅</span>
                    </div>
                  )}
                  {item.status === 'downloading' && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.progress ?? 0) * 100}%`, height: '100%', background: '#2980b9', transition: 'width 0.3s' }} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</p>

                  {item.status === 'downloading' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#2980b9', fontFamily: 'DM Mono, monospace' }}>{Math.round((item.progress ?? 0) * 100)}%</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{item.size}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <div style={{ width: `${(item.progress ?? 0) * 100}%`, height: '100%', background: '#2980b9', borderRadius: 2 }} />
                      </div>
                    </div>
                  ) : item.status === 'completed' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{item.quality}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>·</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{item.size}</span>
                      {item.expiry && <span style={{ fontSize: 11, color: '#f39c12', fontFamily: 'DM Mono, monospace' }}>· {item.expiry}</span>}
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Queued</span>
                  )}
                </div>

                {/* Action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  {item.status === 'downloading' && (
                    <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>⏸</button>
                  )}
                  {item.status === 'completed' && (
                    <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>▶</button>
                  )}
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

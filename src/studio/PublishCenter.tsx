import { useState } from 'react'
import { PROJECTS } from './data'

type Props = { projectId: string; onBack: () => void; onPublished: () => void }

const REGIONS = ['🇰🇪 Kenya', '🇹🇿 Tanzania', '🇺🇬 Uganda', '🇷🇼 Rwanda', '🇳🇬 Nigeria', '🇬🇭 Ghana', '🇿🇦 South Africa', '🌍 All Africa', '🌐 Worldwide']
const PLATFORMS = ['Pwani Play', 'YouTube', 'Instagram', 'TikTok', 'X / Twitter', 'Facebook']

export default function PublishCenter({ projectId, onBack, onPublished }: Props) {
  const project = PROJECTS.find(p => p.id === projectId) ?? PROJECTS[0]
  const [visibility, setVisibility] = useState<'public' | 'subscribers' | 'unlisted' | 'private'>('public')
  const [schedule, setSchedule] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('2026-08-15')
  const [scheduleTime, setScheduleTime] = useState('18:00')
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['🇰🇪 Kenya', '🇹🇿 Tanzania', '🌍 All Africa'])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Pwani Play'])
  const [notify, setNotify] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [done, setDone] = useState(false)

  const toggleRegion = (r: string) => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])
  const togglePlatform = (p: string) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== x) : [...prev, p])

  const publish = () => {
    setPublishing(true)
    setTimeout(() => { setPublishing(false); setDone(true); setTimeout(onPublished, 1500) }, 2000)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20, animation: 'fadeIn 0.5s ease' }}>🚀</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'white', margin: '0 0 12px' }}>Published!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>{project.title} is now live on {selectedPlatforms.join(', ')}.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 2px' }}>Publish Center</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{project.title}</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* Visibility */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 10px', fontFamily: 'DM Mono, monospace' }}>VISIBILITY</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              { key: 'public', icon: '🌍', label: 'Public', desc: 'Anyone can watch' },
              { key: 'subscribers', icon: '🔐', label: 'Subscribers', desc: 'Subscribers only' },
              { key: 'unlisted', icon: '🔗', label: 'Unlisted', desc: 'Only with link' },
              { key: 'private', icon: '🔒', label: 'Private', desc: 'Only you' },
            ] as const).map(v => (
              <button key={v.key} onClick={() => setVisibility(v.key)} style={{ padding: '12px', borderRadius: 14, border: `1.5px solid ${visibility === v.key ? '#2980b9' : 'rgba(255,255,255,0.08)'}`, background: visibility === v.key ? 'rgba(41,128,185,0.12)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 22, display: 'block', marginBottom: 4 }}>{v.icon}</span>
                <p style={{ color: visibility === v.key ? '#5dade2' : 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{v.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{v.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>📅 Schedule Release</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Publish at a future date &amp; time</p>
            </div>
            <div onClick={() => setSchedule(!schedule)} style={{ width: 48, height: 28, borderRadius: 14, background: schedule ? '#2980b9' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
              <div style={{ position: 'absolute', top: 3, left: schedule ? 22 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
            </div>
          </div>
          {schedule && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 4 }}>Date</label>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="input-field" style={{ marginBottom: 0, colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 4 }}>Time</label>
                <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="input-field" style={{ marginBottom: 0, colorScheme: 'dark' }} />
              </div>
            </div>
          )}
        </div>

        {/* Distribution regions */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 10px', fontFamily: 'DM Mono, monospace' }}>DISTRIBUTION REGIONS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => toggleRegion(r)} style={{ padding: '6px 12px', borderRadius: 100, border: `1.5px solid ${selectedRegions.includes(r) ? '#1abc9c' : 'rgba(255,255,255,0.1)'}`, background: selectedRegions.includes(r) ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.04)', color: selectedRegions.includes(r) ? '#1abc9c' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>{r}</button>
            ))}
          </div>
        </div>

        {/* Cross-platform */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 10px', fontFamily: 'DM Mono, monospace' }}>CROSS-PLATFORM SHARING</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => togglePlatform(p)} style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${selectedPlatforms.includes(p) ? '#2980b9' : 'rgba(255,255,255,0.1)'}`, background: selectedPlatforms.includes(p) ? 'rgba(41,128,185,0.12)' : 'rgba(255,255,255,0.04)', color: selectedPlatforms.includes(p) ? '#5dade2' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Notification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, marginBottom: 24 }}>
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>🔔 Notify Subscribers</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Send push notification on publish</p>
          </div>
          <div onClick={() => setNotify(!notify)} style={{ width: 48, height: 28, borderRadius: 14, background: notify ? '#2980b9' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: notify ? 22 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)' }}>
        <button className="btn-primary" onClick={publish} disabled={publishing} style={{ width: '100%' }}>
          {publishing ? '🚀 Publishing…' : schedule ? `📅 Schedule for ${scheduleDate} at ${scheduleTime}` : '🚀 Publish Now'}
        </button>
      </div>
    </div>
  )
}

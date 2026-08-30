import { useState } from 'react'

type Props = { onBack: () => void }

type VisibilitySetting = 'public' | 'verified' | 'connections' | 'private'

type Section = {
  key: string
  label: string
  icon: string
  desc: string
  value: VisibilitySetting
}

const VIS_OPTIONS: { key: VisibilitySetting; label: string; icon: string; color: string }[] = [
  { key: 'public', label: 'Public', icon: '🌍', color: '#2980b9' },
  { key: 'verified', label: 'Verified Users', icon: '✅', color: '#1abc9c' },
  { key: 'connections', label: 'Connections Only', icon: '👥', color: '#f39c12' },
  { key: 'private', label: 'Private', icon: '🔒', color: '#e74c3c' },
]

export default function Privacy({ onBack }: Props) {
  const [sections, setSections] = useState<Section[]>([
    { key: 'profile', label: 'Profile & Bio', icon: '👤', desc: 'Name, photo, bio, location', value: 'public' },
    { key: 'portfolio', label: 'Portfolio', icon: '📂', desc: 'Projects and work samples', value: 'public' },
    { key: 'credits', label: 'Screen Credits', icon: '🎬', desc: 'Film, TV, and production credits', value: 'public' },
    { key: 'trust', label: 'Trust Score', icon: '⭐', desc: 'Your reputation and ratings', value: 'verified' },
    { key: 'skills', label: 'Skills', icon: '⚡', desc: 'Skill list and endorsements', value: 'public' },
    { key: 'timeline', label: 'Career Timeline', icon: '📅', desc: 'Work and education history', value: 'verified' },
    { key: 'certificates', label: 'Certificates', icon: '📜', desc: 'Learning achievements', value: 'verified' },
    { key: 'availability', label: 'Availability', icon: '📆', desc: 'Booking status and rate', value: 'connections' },
    { key: 'contact', label: 'Contact Details', icon: '📱', desc: 'Email, phone, social', value: 'private' },
    { key: 'activity', label: 'Activity Feed', icon: '🕒', desc: 'Recent actions and history', value: 'private' },
  ])

  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const updateSection = (key: string, value: VisibilitySetting) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, value } : s))
    setActiveKey(null)
  }

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Privacy Controls</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Control who sees each section</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {saved && (
          <div style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 14, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>✅</span>
            <p style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, margin: 0 }}>Privacy settings saved.</p>
          </div>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {VIS_OPTIONS.map(v => (
            <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: `${v.color}12`, border: `1px solid ${v.color}25` }}>
              <span style={{ fontSize: 11 }}>{v.icon}</span>
              <span style={{ color: v.color, fontSize: 11, fontWeight: 600 }}>{v.label}</span>
            </div>
          ))}
        </div>

        {/* Sections list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {sections.map(s => {
            const vis = VIS_OPTIONS.find(v => v.key === s.value)!
            const isActive = activeKey === s.key
            return (
              <div key={s.key} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div onClick={() => setActiveKey(isActive ? null : s.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{s.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{s.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{vis.icon}</span>
                    <span style={{ color: vis.color, fontSize: 12, fontWeight: 700 }}>{vis.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, transform: isActive ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>›</span>
                  </div>
                </div>

                {isActive && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px 14px', animation: 'fadeIn 0.15s ease' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {VIS_OPTIONS.map(v => {
                        const sel = s.value === v.key
                        return (
                          <button key={v.key} onClick={() => updateSection(s.key, v.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: `1px solid ${sel ? v.color + '44' : 'rgba(255,255,255,0.07)'}`, background: sel ? `${v.color}12` : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                            <span style={{ fontSize: 16 }}>{v.icon}</span>
                            <span style={{ flex: 1, color: sel ? v.color : 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: sel ? 700 : 500, fontFamily: 'Outfit, sans-serif' }}>{v.label}</span>
                            {sel && <span style={{ color: v.color, fontSize: 14 }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Security note */}
        <div style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ color: '#f8c471', fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>🔐 Your Data Security</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>Your government ID and biometric data are encrypted and never shared publicly. Only Pwani's verification team can access them for review.</p>
        </div>

        <button className="btn-primary" onClick={save} style={{ width: '100%' }}>Save Privacy Settings</button>
      </div>
    </div>
  )
}

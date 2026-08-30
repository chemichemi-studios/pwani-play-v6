import { useState } from 'react'
import { MOCK_PROFILE, MOCK_CREDITS, MOCK_SKILLS, MOCK_CERTIFICATES, MOCK_TIMELINE } from './data'

type Props = { onBack: () => void }

type Template = 'classic' | 'modern' | 'minimal'

const TEMPLATES: { key: Template; label: string; desc: string; preview: string }[] = [
  { key: 'classic', label: 'Classic', desc: 'Traditional chronological CV', preview: '📄' },
  { key: 'modern', label: 'Modern', desc: 'Clean two-column layout', preview: '🗂' },
  { key: 'minimal', label: 'Minimal', desc: 'Ultra-clean single column', preview: '📃' },
]

const SECTIONS = [
  { key: 'profile', label: 'Profile Summary', icon: '👤' },
  { key: 'credits', label: 'Screen Credits', icon: '🎬' },
  { key: 'skills', label: 'Skills', icon: '⚡' },
  { key: 'certificates', label: 'Certificates', icon: '📜' },
  { key: 'timeline', label: 'Career History', icon: '📅' },
]

export default function ResumeBuilder({ onBack }: Props) {
  const [template, setTemplate] = useState<Template>('modern')
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ profile: true, credits: true, skills: true, certificates: true, timeline: true })
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const toggleSection = (key: string) => setEnabled(prev => ({ ...prev, [key]: !prev[key] }))

  const doExport = () => {
    setExporting(true)
    setTimeout(() => { setExporting(false); setExported(true) }, 1600)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Resume Builder</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Auto-populate from your Passport data</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {exported && (
          <div style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <div>
              <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Resume exported!</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Saved to your downloads as PDF.</p>
            </div>
          </div>
        )}

        {/* Template picker */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Choose Template</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {TEMPLATES.map(t => (
            <button key={t.key} onClick={() => setTemplate(t.key)} style={{
              flex: 1, padding: '14px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
              background: template === t.key ? 'rgba(41,128,185,0.15)' : 'rgba(255,255,255,0.04)',
              border: `2px solid ${template === t.key ? '#2980b9' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{t.preview}</div>
              <p style={{ color: template === t.key ? '#5dade2' : 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{t.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Section toggles */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Include Sections</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {SECTIONS.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <p style={{ flex: 1, color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>{s.label}</p>
              <div onClick={() => toggleSection(s.key)} style={{ width: 46, height: 26, borderRadius: 100, background: enabled[s.key] ? '#2980b9' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: enabled[s.key] ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Resume preview */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Preview</p>
        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          {/* Resume header */}
          <div style={{ background: '#1e3a5f', padding: '20px 20px 16px' }}>
            <p style={{ color: 'white', fontSize: 20, fontFamily: 'DM Serif Display, serif', margin: '0 0 3px' }}>{MOCK_PROFILE.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 8px' }}>{MOCK_PROFILE.primaryProfession}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>📍 {MOCK_PROFILE.city}</span>
              {MOCK_PROFILE.website && <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>🌐 {MOCK_PROFILE.website}</span>}
            </div>
          </div>

          <div style={{ padding: '16px 20px', background: 'white' }}>
            {enabled.profile && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: '#1e3a5f', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #1e3a5f', paddingBottom: 3, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Profile</p>
                <p style={{ color: '#444', fontSize: 12, lineHeight: 1.55, margin: 0 }}>{MOCK_PROFILE.bio}</p>
              </div>
            )}

            {enabled.credits && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: '#1e3a5f', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #1e3a5f', paddingBottom: 3, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Screen Credits</p>
                {MOCK_CREDITS.slice(0, 3).map(c => (
                  <div key={c.id} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ color: '#222', fontSize: 12, fontWeight: 700, margin: 0 }}>{c.title} — {c.role}</p>
                      <p style={{ color: '#888', fontSize: 11, margin: 0, fontFamily: 'monospace' }}>{c.year}</p>
                    </div>
                    <p style={{ color: '#666', fontSize: 11, margin: '1px 0 0' }}>{c.organization}</p>
                  </div>
                ))}
              </div>
            )}

            {enabled.skills && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: '#1e3a5f', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #1e3a5f', paddingBottom: 3, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MOCK_SKILLS.slice(0, 6).map(s => <span key={s.id} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#eef2f7', color: '#1e3a5f', fontWeight: 600 }}>{s.name}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={doExport} className="btn-primary" disabled={exporting} style={{ width: '100%' }}>
            {exporting ? '⏳ Generating PDF…' : '📥 Export as PDF'}
          </button>
          <button style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            🔗 Share as Link
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

type Props = { onBack: () => void; onCreate: (id: string) => void }

type ProjectType = 'series' | 'film' | 'documentary' | 'podcast' | 'course' | 'live' | 'short' | 'music-video'

const PROJECT_TYPES: { key: ProjectType; icon: string; label: string; desc: string }[] = [
  { key: 'series', icon: '📺', label: 'Series', desc: 'Multi-episode narrative' },
  { key: 'film', icon: '🎬', label: 'Film', desc: 'Feature or short film' },
  { key: 'documentary', icon: '🎥', label: 'Documentary', desc: 'Non-fiction storytelling' },
  { key: 'podcast', icon: '🎙️', label: 'Podcast', desc: 'Audio-first series' },
  { key: 'course', icon: '📚', label: 'Course', desc: 'Educational content' },
  { key: 'live', icon: '🔴', label: 'Live Event', desc: 'Stream live events' },
  { key: 'short', icon: '⚡', label: 'Short', desc: 'Under 15 minutes' },
  { key: 'music-video', icon: '🎵', label: 'Music Video', desc: 'Visual music content' },
]

const GENRES = ['Drama', 'Comedy', 'Action', 'Documentary', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Animation', 'Musical', 'Historical', 'Sports', 'Education', 'Reality']
const LANGUAGES = ['Swahili', 'English', 'Yoruba', 'Amharic', 'Zulu', 'Hausa', 'Igbo', 'Shona', 'Somali', 'Arabic']

export default function NewProject({ onBack, onCreate }: Props) {
  const [step, setStep] = useState(0)
  const [type, setType] = useState<ProjectType>('series')
  const [title, setTitle] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [genre, setGenre] = useState('Drama')
  const [language, setLanguage] = useState('Swahili')
  const [creating, setCreating] = useState(false)

  const create = () => {
    setCreating(true)
    setTimeout(() => { setCreating(false); onCreate('new-' + Date.now()) }, 1500)
  }

  const steps = [
    { title: 'Project Type', valid: !!type },
    { title: 'Basic Info', valid: title.trim().length > 2 },
    { title: 'Details', valid: true },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>New Project</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Step {step + 1} of {steps.length}: {steps[step].title}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: i <= step ? 2 : 1, height: 3, borderRadius: 2, background: i < step ? '#1abc9c' : i === step ? '#2980b9' : 'rgba(255,255,255,0.12)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 100px' }}>
        {step === 0 && (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>What are you creating?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PROJECT_TYPES.map(t => (
                <button key={t.key} onClick={() => setType(t.key)} style={{ padding: '16px 12px', borderRadius: 14, border: `1.5px solid ${type === t.key ? '#2980b9' : 'rgba(255,255,255,0.08)'}`, background: type === t.key ? 'rgba(41,128,185,0.12)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{t.icon}</span>
                  <p style={{ color: type === t.key ? '#5dade2' : 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{t.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>PROJECT TITLE *</label>
              <input className="input-field" placeholder="Enter your project title…" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 0, fontSize: 16, fontWeight: 600 }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>SYNOPSIS</label>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{synopsis.length} / 500</span>
              </div>
              <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} maxLength={500} rows={6} placeholder="What is your project about?" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>GENRE</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenre(g)} style={{ padding: '6px 12px', borderRadius: 100, border: `1.5px solid ${genre === g ? '#2980b9' : 'rgba(255,255,255,0.1)'}`, background: genre === g ? 'rgba(41,128,185,0.15)' : 'rgba(255,255,255,0.04)', color: genre === g ? '#5dade2' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>PRIMARY LANGUAGE</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {LANGUAGES.map(l => (
                  <button key={l} onClick={() => setLanguage(l)} style={{ padding: '6px 12px', borderRadius: 100, border: `1.5px solid ${language === l ? '#1abc9c' : 'rgba(255,255,255,0.1)'}`, background: language === l ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.04)', color: language === l ? '#1abc9c' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)', display: 'flex', gap: 10 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Back</button>
        )}
        {step < steps.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep(s => s + 1)} disabled={!steps[step].valid} style={{ flex: 2 }}>Continue →</button>
        ) : (
          <button className="btn-primary" onClick={create} disabled={creating || !title.trim()} style={{ flex: 2 }}>
            {creating ? '✨ Creating…' : '🎬 Create Project'}
          </button>
        )}
      </div>
    </div>
  )
}

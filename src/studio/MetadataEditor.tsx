import { useState } from 'react'
import { PROJECTS } from './data'

type Props = { projectId: string; onBack: () => void; onSave: () => void }

const GENRES = ['Drama', 'Comedy', 'Action', 'Documentary', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Animation', 'Musical', 'Historical', 'Sports']
const LANGUAGES = ['Swahili', 'English', 'Yoruba', 'Amharic', 'Zulu', 'Hausa', 'Igbo', 'Shona', 'Somali', 'Arabic', 'French', 'Portuguese']
const RATINGS = ['G', 'PG', 'PG-13', '16+', '18+']
const AI_SUGGESTIONS = [
  "A young woman rediscovers her cultural roots through a transformative journey across East Africa's most vibrant communities.",
  "Set against the backdrop of modern Nairobi, one family's choices ripple across generations in this gripping drama.",
  "A timeless story of love, identity, and resilience told through the lens of contemporary African life.",
]

export default function MetadataEditor({ projectId, onBack, onSave }: Props) {
  const project = PROJECTS.find(p => p.id === projectId) ?? PROJECTS[0]
  const [title, setTitle] = useState(project.title)
  const [synopsis, setSynopsis] = useState(project.synopsis)
  const [genre, setGenre] = useState(project.genre)
  const [language, setLanguage] = useState(project.language)
  const [rating, setRating] = useState(project.ageRating)
  const [tags, setTags] = useState<string[]>(project.tags)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

  const save = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); onSave() }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Metadata Editor</h2>
          </div>
          <button onClick={() => setShowAI(!showAI)} style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#bb8fce', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>🤖 AI</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* AI suggestions panel */}
        {showAI && (
          <div style={{ background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.2)', borderRadius: 16, padding: 16, marginBottom: 20, animation: 'slideUp 0.2s ease' }}>
            <p style={{ color: '#bb8fce', fontSize: 13, fontWeight: 700, margin: '0 0 12px' }}>🤖 AI Synopsis Suggestions</p>
            {AI_SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => { setSynopsis(s); setShowAI(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(155,89,182,0.1)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer', marginBottom: 8, lineHeight: 1.5, fontFamily: 'Outfit, sans-serif' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: 'DM Mono, monospace' }}>TITLE</label>
          <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 0 }} />
        </div>

        {/* Synopsis */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>SYNOPSIS</label>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{synopsis.length} / 500</span>
          </div>
          <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} maxLength={500} rows={5} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
        </div>

        {/* Genre + Language */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: 'DM Mono, monospace' }}>GENRE</label>
            <select value={genre} onChange={e => setGenre(e.target.value)} className="input-field" style={{ marginBottom: 0, cursor: 'pointer' }}>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: 'DM Mono, monospace' }}>LANGUAGE</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="input-field" style={{ marginBottom: 0, cursor: 'pointer' }}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Age rating */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>AGE RATING</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {RATINGS.map(r => (
              <button key={r} onClick={() => setRating(r)} style={{ flex: 1, padding: '10px 4px', borderRadius: 10, border: `1.5px solid ${rating === r ? '#2980b9' : 'rgba(255,255,255,0.1)'}`, background: rating === r ? 'rgba(41,128,185,0.2)' : 'rgba(255,255,255,0.04)', color: rating === r ? '#5dade2' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>{r}</button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>TAGS</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {tags.map(t => (
              <span key={t} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.25)', color: '#5dade2', display: 'flex', alignItems: 'center', gap: 6 }}>
                {t}
                <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', color: 'rgba(93,173,226,0.6)', cursor: 'pointer', padding: 0, fontSize: 12, lineHeight: 1 }}>✕</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-field" placeholder="Add tag…" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} style={{ flex: 1, marginBottom: 0 }} />
            <button onClick={addTag} style={{ padding: '0 18px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontSize: 14 }}>+</button>
          </div>
        </div>

        {/* Poster / Thumbnail section */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>POSTER & BANNER</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 14, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 28, marginBottom: 6 }}>🖼️</span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, textAlign: 'center' }}>Poster<br />(2:3)</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 14, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 28, marginBottom: 6 }}>🎨</span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, textAlign: 'center' }}>Banner<br />(16:9)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)' }}>
        <button className="btn-primary" onClick={save} style={{ width: '100%' }} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save Metadata'}
        </button>
      </div>
    </div>
  )
}

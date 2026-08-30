import { useState } from 'react'
import type { PortfolioType } from './data'

type Props = { onBack: () => void; onSave: () => void }

const TYPES: { key: PortfolioType; label: string; icon: string }[] = [
  { key: 'film', label: 'Film', icon: '🎬' },
  { key: 'series', label: 'TV / Series', icon: '📺' },
  { key: 'photography', label: 'Photography', icon: '📷' },
  { key: 'music', label: 'Music Video', icon: '🎵' },
  { key: 'award', label: 'Award / Recognition', icon: '🏆' },
  { key: 'course', label: 'Course / Talk', icon: '🎓' },
]

export default function PortfolioAdd({ onBack, onSave }: Props) {
  const [type, setType] = useState<PortfolioType>('film')
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [desc, setDesc] = useState('')
  const [tags, setTags] = useState('')
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)

  const valid = title.trim().length > 0

  const save = () => {
    if (!valid) return
    setSaving(true)
    setTimeout(() => { setSaving(false); onSave() }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Add Portfolio Item</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Showcase your best work</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* Cover upload */}
        <div style={{ height: 140, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', marginBottom: 24 }}>
          <span style={{ fontSize: 32 }}>🖼</span>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, margin: 0 }}>Add Cover Image</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: 0 }}>JPG or PNG, up to 5 MB</p>
        </div>

        {/* Type */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Type</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
          {TYPES.map(t => (
            <button key={t.key} onClick={() => setType(t.key)} style={{ padding: '12px 8px', borderRadius: 12, cursor: 'pointer', textAlign: 'center', background: type === t.key ? 'rgba(41,128,185,0.15)' : 'rgba(255,255,255,0.04)', border: `2px solid ${type === t.key ? '#2980b9' : 'rgba(255,255,255,0.07)'}` }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
              <p style={{ color: type === t.key ? '#5dade2' : 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, margin: 0 }}>{t.label}</p>
            </button>
          ))}
        </div>

        {/* Title */}
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Title *</label>
        <input className="input-field" placeholder="e.g. Nairobi Noir" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 16 }} />

        {/* Year */}
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Year</label>
        <input className="input-field" placeholder="2024" value={year} onChange={e => setYear(e.target.value)} style={{ marginBottom: 16 }} />

        {/* Description */}
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Description</label>
        <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the project, your role, and why it matters..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 14px', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5, marginBottom: 16 }} />

        {/* Tags */}
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Tags (comma-separated)</label>
        <input className="input-field" placeholder="drama, festival, nairobi, 2024" value={tags} onChange={e => setTags(e.target.value)} style={{ marginBottom: 20 }} />

        {/* Featured toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 28 }}>
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>⭐ Mark as Featured</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>Pinned to the top of your portfolio</p>
          </div>
          <div onClick={() => setFeatured(!featured)} style={{ width: 46, height: 26, borderRadius: 100, background: featured ? '#2980b9' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: featured ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
          </div>
        </div>

        {/* Save */}
        <button className="btn-primary" onClick={save} disabled={!valid || saving} style={{ width: '100%' }}>
          {saving ? 'Saving…' : 'Add to Portfolio'}
        </button>
      </div>
    </div>
  )
}

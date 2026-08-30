import { useState } from 'react'
import { MOCK_SKILLS, SKILL_LEVEL_COLORS } from './data'
import type { Skill } from './data'

type Props = { onOpenEndorsements: () => void }

const CATEGORIES = ['All', 'Production', 'Technical', 'Creative', 'Post-Production', 'Visual Arts', 'Education']

export default function Skills({ onOpenEndorsements }: Props) {
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS)
  const [category, setCategory] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = category === 'All' ? skills : skills.filter(s => s.category === category)

  const addSkill = () => {
    if (!newSkill.trim()) return
    setSkills(prev => [...prev, {
      id: `sk${Date.now()}`, name: newSkill.trim(), category: 'Other', level: 'beginner',
      endorsements: 0, verified: false, relatedProjects: [], certificates: [],
    }])
    setNewSkill('')
    setShowAdd(false)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '16px 20px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 2px' }}>Skills</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{skills.length} skills · {skills.reduce((s, sk) => s + sk.endorsements, 0)} endorsements</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '9px 18px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Add</button>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: category === c ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: category === c ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Add skill inline */}
      {showAdd && (
        <div style={{ margin: '0 20px 16px', padding: '14px 16px', background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 14, animation: 'slideUp 0.2s ease' }}>
          <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>Add a Skill</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-field" placeholder="e.g. Colour Grading" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ flex: 1, marginBottom: 0 }} />
            <button onClick={addSkill} disabled={!newSkill.trim()} style={{ padding: '0 18px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Add</button>
          </div>
        </div>
      )}

      {/* Skills list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(s => {
          const lc = SKILL_LEVEL_COLORS[s.level]
          const expanded = expandedId === s.id
          return (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div onClick={() => setExpandedId(expanded ? null : s.id)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{s.name}</p>
                    {s.verified && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.25)', fontWeight: 700 }}>✓ Verified</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: lc.bg, color: lc.text, fontWeight: 600 }}>{lc.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{s.category}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>👍 {s.endorsements}</span>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16, transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'none' }}>›</span>
              </div>

              {/* Proficiency bar */}
              <div style={{ padding: '0 16px 12px' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ width: { beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%' }[s.level], height: '100%', background: lc.text, borderRadius: 2 }} />
                </div>
              </div>

              {/* Expanded details */}
              {expanded && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', animation: 'fadeIn 0.2s ease' }}>
                  {s.relatedProjects.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 6px', fontFamily: 'DM Mono, monospace' }}>RELATED PROJECTS</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {s.relatedProjects.map(r => <span key={r} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.15)' }}>{r}</span>)}
                      </div>
                    </div>
                  )}
                  {s.certificates.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 6px', fontFamily: 'DM Mono, monospace' }}>CERTIFICATES</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {s.certificates.map(c => <span key={c} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(26,188,156,0.1)', color: '#1abc9c', border: '1px solid rgba(26,188,156,0.15)' }}>📜 {c}</span>)}
                      </div>
                    </div>
                  )}
                  <button onClick={onOpenEndorsements} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600, padding: 0 }}>Request endorsement for this skill →</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Request endorsements CTA */}
      <div style={{ margin: '20px 20px 0', padding: '14px 16px', background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🤝</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Get More Endorsements</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>Ask collaborators to endorse your skills and boost your Trust Score.</p>
        </div>
        <button onClick={onOpenEndorsements} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#bb8fce', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Request</button>
      </div>
    </div>
  )
}

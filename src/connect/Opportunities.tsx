import { useState } from 'react'
import { OPPORTUNITIES, OPP_TYPE_LABELS, OPP_TYPE_COLORS } from './data'
import type { Opportunity, OpportunityType } from './data'

type Props = { onProfile: (id: string) => void }

type Filter = 'all' | OpportunityType

export default function Opportunities({ onProfile }: Props) {
  const [opps, setOpps] = useState(OPPORTUNITIES)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [applied, setApplied] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')

  const saveToggle = (id: string) => setOpps(prev => prev.map(o => o.id === id ? { ...o, isSaved: !o.isSaved } : o))

  const filtered = opps.filter(o => {
    const matchesFilter = filter === 'all' || o.type === filter
    const matchesSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  if (selected) {
    return (
      <OppDetail
        opp={selected}
        onBack={() => setSelected(null)}
        onProfile={() => onProfile(selected.organization.id)}
        onApply={() => setApplied(prev => ({ ...prev, [selected.id]: true }))}
        applied={!!applied[selected.id]}
        saved={selected.isSaved}
        onSave={() => saveToggle(selected.id)}
      />
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      <div style={{ padding: '10px 16px', position: 'sticky', top: 56, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(8px)' }}>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities…" className="input-field" style={{ margin: 0, paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }} />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '8px 16px 12px', overflowX: 'auto' }}>
        {(['all', 'casting', 'job', 'grant', 'collaboration', 'competition'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', background: filter === f ? '#1e6091' : 'rgba(255,255,255,0.06)', color: filter === f ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}>
            {f === 'all' ? 'All' : OPP_TYPE_LABELS[f as OpportunityType]}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(opp => {
          const color = OPP_TYPE_COLORS[opp.type]
          return (
            <div key={opp.id} onClick={() => setSelected(opp)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${color}15`, color, border: `1px solid ${color}25`, fontWeight: 700 }}>{OPP_TYPE_LABELS[opp.type]}</span>
                    {opp.isRemote && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>Remote</span>}
                  </div>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px', lineHeight: 1.3 }}>{opp.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 4px' }}>{opp.organization.name} · {opp.location}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); saveToggle(opp.id) }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', padding: '0 0 0 8px', flexShrink: 0 }}>
                  {opp.isSaved ? '🔖' : '🏷️'}
                </button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{opp.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>📅 Deadline {opp.deadline}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>👥 {opp.applicantCount} applied</span>
                </div>
                {opp.compensation && <span style={{ color: '#1abc9c', fontSize: 12, fontWeight: 700, textAlign: 'right', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.compensation.split('+')[0]}</span>}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No opportunities found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Check back soon for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OppDetail({ opp, onBack, onProfile, onApply, applied, saved, onSave }: { opp: Opportunity; onBack: () => void; onProfile: () => void; onApply: () => void; applied: boolean; saved: boolean; onSave: () => void }) {
  const color = OPP_TYPE_COLORS[opp.type]
  const [step, setStep] = useState<'detail' | 'apply' | 'success'>('detail')

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🎉</div>
        <p style={{ color: '#1abc9c', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0, textAlign: 'center' }}>Application Submitted!</p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>{opp.organization.name} will review your profile and get in touch.</p>
        <button className="btn-primary" onClick={onBack} style={{ width: '100%', maxWidth: 280 }}>Back to Opportunities</button>
      </div>
    )
  }

  if (step === 'apply') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setStep('detail')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white' }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>Quick Apply</h2>
        </div>
        <div style={{ flex: 1, padding: '20px 16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px', marginBottom: 20 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{opp.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{opp.organization.name}</p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Cover Note (optional)</p>
          <textarea placeholder="Introduce yourself and explain why you are a great fit…" style={{ width: '100%', minHeight: 120, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 20px' }}>Your Pwani Passport profile and portfolio will be shared with the organiser.</p>
          <button className="btn-primary" onClick={() => { onApply(); setStep('success') }} style={{ width: '100%' }}>Submit Application</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white' }}>←</button>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${color}15`, color, border: `1px solid ${color}25`, fontWeight: 700 }}>{OPP_TYPE_LABELS[opp.type]}</span>
        </div>
        <button onClick={onSave} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>{saved ? '🔖' : '🏷️'}</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: 100 }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 6px', lineHeight: 1.3 }}>{opp.title}</h1>
        <div onClick={onProfile} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, cursor: 'pointer' }}>
          <img src={opp.organization.photo} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: '#5dade2', fontSize: 14 }}>{opp.organization.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>· {opp.location}</span>
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>📅 Deadline: {opp.deadline}</span>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>👥 {opp.applicantCount} applicants</span>
        </div>
        {opp.compensation && <div style={{ background: 'rgba(26,188,156,0.07)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 12, padding: '10px 14px', marginBottom: 16 }}><p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0 }}>💰 {opp.compensation}</p></div>}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>About This Opportunity</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{opp.description}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Requirements</p>
        {opp.requirements.map((r, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '0 0 6px' }}>• {r}</p>)}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
          {opp.tags.map(t => <span key={t} style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12 }}>#{t}</span>)}
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
        <button onClick={onProfile} style={{ padding: '12px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Contact</button>
        <button onClick={() => applied ? null : setStep('apply')} style={{ flex: 1, padding: '12px', borderRadius: 14, background: applied ? 'rgba(26,188,156,0.1)' : 'linear-gradient(90deg,#1e6091,#2980b9)', border: applied ? '1px solid rgba(26,188,156,0.3)' : 'none', color: applied ? '#1abc9c' : 'white', fontSize: 15, fontWeight: 700, cursor: applied ? 'default' : 'pointer' }}>
          {applied ? '✓ Applied' : 'Quick Apply'}
        </button>
      </div>
    </div>
  )
}

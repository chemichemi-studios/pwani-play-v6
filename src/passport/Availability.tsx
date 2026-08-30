import { useState } from 'react'
import { MOCK_PROFILE, AVAILABILITY_OPTIONS } from './data'
import type { AvailabilityStatus } from './data'

type Props = { onBack: () => void }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WORK_TYPES = ['On-set', 'Remote', 'Studio', 'Location', 'Hybrid']
const PROJECT_TYPES = ['Feature Film', 'TV Series', 'Short Film', 'Commercial', 'Music Video', 'Documentary', 'Corporate', 'NGO / Impact']

export default function Availability({ onBack }: Props) {
  const [status, setStatus] = useState<AvailabilityStatus>(MOCK_PROFILE.availability as AvailabilityStatus)
  const [rate, setRate] = useState('KES 15,000 / day')
  const [openTo, setOpenTo] = useState<string[]>(['On-set', 'Remote', 'Studio'])
  const [workDays, setWorkDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  const [projectTypes, setProjectTypes] = useState<string[]>(['Feature Film', 'TV Series', 'Short Film'])
  const [saved, setSaved] = useState(false)

  const toggleArr = (arr: string[], item: string, set: (v: string[]) => void) =>
    set(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Availability</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Visible to verified collaborators</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {saved && (
          <div style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 14, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <p style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, margin: 0 }}>Availability updated!</p>
          </div>
        )}

        {/* Status selector */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Current Status</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {AVAILABILITY_OPTIONS.map(opt => {
            const active = status === opt.key
            return (
              <button key={opt.key} onClick={() => setStatus(opt.key)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                background: active ? `${opt.color}12` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${active ? opt.color + '44' : 'rgba(255,255,255,0.07)'}`,
                transition: 'all 0.15s',
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: opt.color, flexShrink: 0, boxShadow: active ? `0 0 8px ${opt.color}` : 'none' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: active ? opt.color : 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{opt.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>{opt.icon} {opt.key}</p>
                </div>
                {active && <span style={{ color: opt.color, fontSize: 18 }}>✓</span>}
              </button>
            )
          })}
        </div>

        {/* Rate */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Day Rate (Optional)</p>
        <input className="input-field" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. KES 15,000 / day" style={{ marginBottom: 24 }} />

        {/* Preferred work types */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Open To</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {WORK_TYPES.map(t => {
            const on = openTo.includes(t)
            return <button key={t} onClick={() => toggleArr(openTo, t, setOpenTo)} style={{ padding: '7px 14px', borderRadius: 100, border: `1px solid ${on ? 'rgba(41,128,185,0.35)' : 'transparent'}`, cursor: 'pointer', background: on ? 'rgba(41,128,185,0.2)' : 'rgba(255,255,255,0.06)', color: on ? '#5dade2' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{t}</button>
          })}
        </div>

        {/* Working days */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Working Days</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {DAYS.map(d => {
            const on = workDays.includes(d)
            return <button key={d} onClick={() => toggleArr(workDays, d, setWorkDays)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: on ? '#2980b9' : 'rgba(255,255,255,0.06)', color: on ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{d}</button>
          })}
        </div>

        {/* Project types */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Project Types</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {PROJECT_TYPES.map(t => {
            const on = projectTypes.includes(t)
            return <button key={t} onClick={() => toggleArr(projectTypes, t, setProjectTypes)} style={{ padding: '7px 14px', borderRadius: 100, border: `1px solid ${on ? 'rgba(26,188,156,0.25)' : 'transparent'}`, cursor: 'pointer', background: on ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.06)', color: on ? '#1abc9c' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{t}</button>
          })}
        </div>

        <button className="btn-primary" onClick={save} style={{ width: '100%' }}>Save Availability</button>
      </div>
    </div>
  )
}

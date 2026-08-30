import { useState } from 'react'
import { PROJECTS } from './data'

type DateRange = '7d' | '30d' | '90d' | 'all'

const CHART_DATA = {
  '7d': [12, 18, 24, 16, 28, 22, 30],
  '30d': [8, 14, 18, 22, 16, 28, 24, 32, 20, 18, 26, 30, 22, 28, 24, 36, 30, 28, 32, 26, 24, 30, 28, 34, 30, 26, 32, 36, 28, 32],
  '90d': Array.from({ length: 12 }, (_, i) => Math.round(15 + Math.sin(i * 0.8) * 8 + Math.random() * 6)),
  'all': Array.from({ length: 12 }, (_, i) => Math.round(8 + i * 3 + Math.random() * 5)),
}

const GEO = [
  { country: '🇰🇪 Kenya', pct: 42, views: '104K' },
  { country: '🇹🇿 Tanzania', pct: 18, views: '44K' },
  { country: '🇳🇬 Nigeria', pct: 14, views: '34K' },
  { country: '🇬🇭 Ghana', pct: 10, views: '24K' },
  { country: '🌍 Other', pct: 16, views: '42K' },
]

const TRAFFIC = [
  { source: 'Pwani Play Discovery', pct: 48 },
  { source: 'Social Media', pct: 24 },
  { source: 'Direct / Search', pct: 16 },
  { source: 'External Links', pct: 12 },
]

export default function AnalyticsTab() {
  const [range, setRange] = useState<DateRange>('30d')
  const [selectedProject, setSelectedProject] = useState('all')

  const chartData = CHART_DATA[range]
  const maxVal = Math.max(...chartData)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Analytics</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>Track performance across all projects</p>

        {/* Project selector */}
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="input-field"
          style={{ marginBottom: 14, fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}
        >
          <option value="all">All Projects</option>
          {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>

        {/* Date range */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4 }}>
          {(['7d', '30d', '90d', 'all'] as DateRange[]).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: range === r ? '#1e6091' : 'transparent',
              color: 'white', fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 600,
              transition: 'all 0.2s',
            }}>{r === 'all' ? 'All Time' : r}</button>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Views', value: '248K', delta: '+12%', icon: '👁', color: '#2980b9' },
          { label: 'Watch Hours', value: '9,200h', delta: '+8%', icon: '⏱', color: '#1abc9c' },
          { label: 'Avg. Retention', value: '74%', delta: '+3%', icon: '📌', color: '#f39c12' },
          { label: 'Revenue', value: 'KSH 1,840', delta: '+22%', icon: '💰', color: '#9b59b6' },
          { label: 'Downloads', value: '12.4K', delta: '+6%', icon: '📥', color: '#e74c3c' },
          { label: 'Shares', value: '3,800', delta: '+18%', icon: '🔗', color: '#ca6f1e' },
        ].map(m => (
          <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <span style={{ fontSize: 11, color: '#1abc9c', background: 'rgba(26,188,156,0.12)', padding: '2px 7px', borderRadius: 100, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{m.delta}</span>
            </div>
            <p style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{m.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Views chart */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Views Over Time</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>×1,000</p>
          </div>
          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
            {chartData.map((v, i) => (
              <div key={i} style={{ flex: 1, background: i === chartData.length - 1 ? '#2980b9' : 'rgba(41,128,185,0.35)', borderRadius: '3px 3px 0 0', height: `${(v / maxVal) * 100}%`, minHeight: 4, transition: 'height 0.4s ease' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace' }}>Start</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace' }}>Today</span>
          </div>
        </div>
      </div>

      {/* Audience retention */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px' }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Audience Retention</p>
          {[
            { label: 'Completed (80–100%)', pct: 38, color: '#1abc9c' },
            { label: 'High (50–80%)', pct: 28, color: '#2980b9' },
            { label: 'Mid (20–50%)', pct: 22, color: '#f39c12' },
            { label: 'Drop-off (<20%)', pct: 12, color: '#e74c3c' },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{r.label}</span>
                <span style={{ fontSize: 12, color: r.color, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{r.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic reach */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px' }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>🌍 Geographic Reach</p>
          {GEO.map(g => (
            <div key={g.country} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 14, minWidth: 130, color: 'rgba(255,255,255,0.7)' }}>{g.country}</span>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                <div style={{ width: `${g.pct}%`, height: '100%', background: '#2980b9', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', minWidth: 36, textAlign: 'right', fontFamily: 'DM Mono, monospace' }}>{g.views}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic sources */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px' }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Traffic Sources</p>
          {TRAFFIC.map((t, i) => {
            const colors = ['#2980b9', '#1abc9c', '#f39c12', '#9b59b6']
            return (
              <div key={t.source} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i], flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{t.source}</span>
                <span style={{ fontSize: 13, color: colors[i], fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{t.pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Export */}
      <div style={{ padding: '0 20px 20px' }}>
        <button style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
          📥 Export Analytics Report (CSV)
        </button>
      </div>
    </div>
  )
}

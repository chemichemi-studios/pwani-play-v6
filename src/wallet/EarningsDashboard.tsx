import { useState } from 'react'
import { MONTHLY_EARNINGS, formatKES } from './data'

type Props = { onBack?: () => void }
type Period = 'weekly' | 'monthly' | 'annual'

const COLORS = {
  subscriptions: '#2980b9',
  tips: '#f1c40f',
  marketplace: '#e67e22',
  courses: '#9b59b6',
  ads: '#5dade2',
  sponsorship: '#1abc9c',
}

const LABELS: Record<string, string> = {
  subscriptions: 'Subscriptions',
  tips: 'Tips',
  marketplace: 'Marketplace',
  courses: 'Courses',
  ads: 'Ad Revenue',
  sponsorship: 'Sponsorship',
}

export default function EarningsDashboard({ onBack }: Props) {
  const [period, setPeriod] = useState<Period>('monthly')
  const [autoPayout, setAutoPayout] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }
  const latest = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const prev = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2]

  const totalLatest = Object.values(latest).filter((v): v is number => typeof v === 'number').reduce((a, b) => a + b, 0)
  const totalPrev = Object.values(prev).filter((v): v is number => typeof v === 'number').reduce((a, b) => a + b, 0)
  const growth = Math.round(((totalLatest - totalPrev) / totalPrev) * 100)

  const maxTotal = Math.max(...MONTHLY_EARNINGS.map(e => e.subscriptions + e.tips + e.marketplace + e.courses + e.ads + e.sponsorship))

  const SOURCES = ['subscriptions', 'tips', 'marketplace', 'courses', 'ads', 'sponsorship'] as const

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Earnings</h2>
          <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(26,188,156,0.12)', color: '#1abc9c', border: '1px solid rgba(26,188,156,0.2)', fontWeight: 700 }}>+{growth}% vs last month</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Creator revenue dashboard</p>

        {/* Total this period */}
        <div style={{ background: 'linear-gradient(135deg, rgba(26,188,156,0.1), rgba(41,128,185,0.06))', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 18, padding: '18px 20px', marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>August 2026</p>
          <p style={{ color: '#1abc9c', fontSize: 36, fontFamily: 'DM Serif Display, serif', margin: '0 0 12px', letterSpacing: '-0.5px' }}>{formatKES(totalLatest)}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Streams', value: formatKES(latest.subscriptions + latest.ads) },
              { label: 'Creator', value: formatKES(latest.tips + latest.sponsorship) },
              { label: 'Products', value: formatKES(latest.courses + latest.marketplace) },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: '0 0 2px' }}>{s.label}</p>
                <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Period toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 3, marginBottom: 20 }}>
          {(['weekly', 'monthly', 'annual'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 10, background: period === p ? '#1e6091' : 'transparent', color: period === p ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>Monthly Earnings Trend</p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100, marginBottom: 8 }}>
            {MONTHLY_EARNINGS.map((entry, i) => {
              const total = entry.subscriptions + entry.tips + entry.marketplace + entry.courses + entry.ads + entry.sponsorship
              const height = (total / maxTotal) * 100
              const isLatest = i === MONTHLY_EARNINGS.length - 1
              return (
                <div key={entry.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${height}%`, background: isLatest ? 'linear-gradient(to top, #1abc9c, #27ae60)' : 'rgba(41,128,185,0.3)', position: 'relative', minHeight: 4 }}>
                    {isLatest && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: '#1abc9c', borderRadius: 4, padding: '1px 4px', fontSize: 9, color: 'white', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>+{growth}%</div>}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'DM Mono, monospace' }}>{entry.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Breakdown by source */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Revenue Breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {SOURCES.map(src => {
            const val = latest[src]
            const pct = Math.round((val / totalLatest) * 100)
            const color = COLORS[src]
            return (
              <div key={src} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{LABELS[src]}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color, fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(val)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginLeft: 6 }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Payout info */}
        <div style={{ background: 'rgba(41,128,185,0.06)', border: '1px solid rgba(41,128,185,0.12)', borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>📅 Next Payout: 1 September 2026</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 10px', lineHeight: 1.5 }}>KES 12,300 pending earnings will be added to your available balance.</p>
          <button onClick={() => { setAutoPayout(p => !p); showToast(autoPayout ? 'Auto-payout turned off' : 'Auto-payout enabled — earnings move to available balance automatically') }} style={{ padding: '8px 16px', borderRadius: 10, background: autoPayout ? 'rgba(26,188,156,0.15)' : 'rgba(41,128,185,0.15)', border: `1px solid ${autoPayout ? 'rgba(26,188,156,0.3)' : 'rgba(41,128,185,0.25)'}`, color: autoPayout ? '#1abc9c' : '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>{autoPayout ? '✓ Auto-Payout On' : 'Set Up Auto-Payout'}</button>
        </div>
      </div>
    </div>
  )
}

import { AI_INSIGHTS, MONTHLY_EARNINGS, TRANSACTIONS, formatKES } from './data'

type Props = { onBack?: () => void; onSubscriptions?: () => void }

const SPENDING_CATEGORIES = [
  { label: 'Subscriptions', amount: 5798, icon: '🔄', color: '#3498db', pct: 40 },
  { label: 'Marketplace', amount: 2890, icon: '🛒', color: '#e67e22', pct: 20 },
  { label: 'Courses', amount: 1560, icon: '🎓', color: '#9b59b6', pct: 11 },
  { label: 'Equipment', amount: 850, icon: '🎥', color: '#1abc9c', pct: 6 },
  { label: 'Other', amount: 3282, icon: '📌', color: 'rgba(255,255,255,0.2)', pct: 23 },
]

export default function FinancialInsights({ onBack, onSubscriptions }: Props) {
  const latest = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const prev = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2]
  const totalLatest = Object.values(latest).filter((v): v is number => typeof v === 'number').reduce((a, b) => a + b, 0)
  const totalPrev = Object.values(prev).filter((v): v is number => typeof v === 'number').reduce((a, b) => a + b, 0)
  const growth = Math.round(((totalLatest - totalPrev) / totalPrev) * 100)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Financial Insights</h2>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>AI-powered analysis of your Pwani finances</p>

        {/* AI Insights cards */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Personalised Insights</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {AI_INSIGHTS.map(ins => {
            const TYPE_COLORS = { tip: '#2980b9', alert: '#e74c3c', opportunity: '#f39c12', achievement: '#1abc9c' }
            const color = TYPE_COLORS[ins.type]
            return (
              <div key={ins.id} style={{ background: `${color}0a`, border: `1px solid ${color}20`, borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{ins.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{ins.title}</p>
                    {ins.value && <span style={{ color, fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{ins.value}</span>}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{ins.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Monthly trend */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Income vs Spending (6 months)</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80, marginBottom: 8 }}>
            {MONTHLY_EARNINGS.slice(-6).map((e, i) => {
              const total = e.subscriptions + e.tips + e.marketplace + e.courses + e.ads + e.sponsorship
              const spending = [3200, 4100, 3800, 5000, 5400, 6200][i]
              const maxVal = 50000
              const incH = (total / maxVal) * 100
              const spH = (spending / maxVal) * 100
              return (
                <div key={e.month} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, height: `${incH}%`, background: 'linear-gradient(to top,#1abc9c,#27ae60)', borderRadius: '3px 3px 0 0', minHeight: 3 }} />
                  <div style={{ flex: 1, height: `${spH}%`, background: 'rgba(231,76,60,0.4)', borderRadius: '3px 3px 0 0', minHeight: 3 }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {MONTHLY_EARNINGS.slice(-6).map(e => <span key={e.month} style={{ flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'DM Mono, monospace' }}>{e.month}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#1abc9c' }} /><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Income</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(231,76,60,0.5)' }} /><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Spending</span></div>
          </div>
        </div>

        {/* Spending breakdown */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Spending Breakdown — August</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <p style={{ color: 'white', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: '0 0 16px' }}>{formatKES(6200)}</p>
          {SPENDING_CATEGORIES.map(c => (
            <div key={c.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                <span style={{ flex: 1, color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{c.label}</span>
                <span style={{ color: c.color, fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(c.amount)}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, minWidth: 30, textAlign: 'right' }}>{c.pct}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Savings suggestion */}
        <div style={{ background: 'linear-gradient(120deg, rgba(26,188,156,0.08), rgba(41,128,185,0.06))', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>💡 Savings Opportunity</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>
            You are spending KES 5,798/month on subscriptions — 40% of total spending. Switching to annual plans could save you up to KES 12,000/year.
          </p>
          <button onClick={onSubscriptions} style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(26,188,156,0.15)', border: '1px solid rgba(26,188,156,0.25)', color: '#1abc9c', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            Review Subscriptions →
          </button>
        </div>
      </div>
    </div>
  )
}

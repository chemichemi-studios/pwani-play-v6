import { useState } from 'react'
import { BUDGETS, SAVINGS_GOALS, TRANSACTIONS, formatKES, type Budget, type SavingsGoal } from './data'

type Props = { onBack: () => void }

export function actualSpend(b: Budget) {
  return TRANSACTIONS
    .filter(t => t.direction === 'out' && t.status === 'completed' && t.category === b.category && t.date.startsWith('2026-08'))
    .reduce((s, t) => s + t.amount, 0)
}

export default function PersonalFinance({ onBack }: Props) {
  const [tab, setTab] = useState<'budgets' | 'goals'>('budgets')
  const [goals, setGoals] = useState<SavingsGoal[]>(SAVINGS_GOALS)
  const [contributing, setContributing] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const contribute = (id: string) => {
    const amt = Number(amount)
    if (amt <= 0) return
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amt) } : g))
    showToast(`${formatKES(amt)} added toward your goal`)
    setContributing(null)
    setAmount('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Budgets & Goals" onBack={onBack} />
      {toast && <Toast text={toast} />}
      <div style={{ padding: '68px 20px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {(['budgets', 'goals'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 12, border: 'none', cursor: 'pointer', background: tab === t ? '#1e6091' : 'rgba(255,255,255,0.06)', color: tab === t ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700 }}>
              {t === 'budgets' ? `Budgets (${BUDGETS.length})` : `Goals (${goals.length})`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {tab === 'budgets' ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
              "Actual" is calculated from your real transactions this month — not a separate estimate.
            </p>
            {BUDGETS.map(b => {
              const actual = actualSpend(b)
              const pct = Math.min(100, Math.round((actual / b.limit) * 100))
              const status = pct >= 100 ? { label: 'Over Budget', color: '#e74c3c' } : pct >= 80 ? { label: 'Near Limit', color: '#f39c12' } : { label: 'On Track', color: '#1abc9c' }
              const remaining = b.limit - actual
              return (
                <div key={b.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 15, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 17 }}>{b.icon}</span>
                      <span style={{ color: 'white', fontSize: 13.5, fontWeight: 700 }}>{b.label}</span>
                    </div>
                    <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${status.color}18`, color: status.color, fontWeight: 700 }}>{status.label}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: status.color, borderRadius: 100, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5 }}>{formatKES(actual)} of {formatKES(b.limit)} · {b.period}</span>
                    <span style={{ color: remaining >= 0 ? 'rgba(255,255,255,0.45)' : '#e74c3c', fontSize: 11.5, fontWeight: 700 }}>{remaining >= 0 ? `${formatKES(remaining)} left` : `${formatKES(-remaining)} over`}</span>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <>
            {goals.map(g => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
              const remaining = g.targetAmount - g.currentAmount
              return (
                <div key={g.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${g.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{g.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{g.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{g.goalType} · Target {g.targetDate}</p>
                    </div>
                  </div>
                  <div style={{ height: 9, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${g.color}, ${g.color}dd)`, borderRadius: 100, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: g.color, fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(g.currentAmount)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{pct}% of {formatKES(g.targetAmount)}</span>
                  </div>
                  {remaining > 0 && (
                    contributing === g.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`up to ${remaining}`} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '8px 10px', color: 'white', fontSize: 12 }} />
                        <button onClick={() => contribute(g.id)} style={{ padding: '8px 14px', borderRadius: 9, background: g.color, border: 'none', color: '#0a1628', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add</button>
                        <button onClick={() => { setContributing(null); setAmount('') }} style={{ padding: '8px 10px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>×</button>
                      </div>
                    ) : (
                      <button onClick={() => setContributing(g.id)} style={{ width: '100%', padding: '9px', borderRadius: 10, background: `${g.color}15`, border: `1px solid ${g.color}30`, color: g.color, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>+ Add Contribution</button>
                    )
                  )}
                  {remaining <= 0 && (
                    <div style={{ padding: '9px', borderRadius: 10, background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', color: '#1abc9c', fontSize: 12.5, fontWeight: 700, textAlign: 'center' }}>🎉 Goal Reached!</div>
                  )}
                </div>
              )
            })}
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '4px 0 0', lineHeight: 1.6, textAlign: 'center' }}>
              Contributions here are tracked toward your goal — they use the same available balance shown on your Wallet dashboard, not a separate account.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
    </div>
  )
}

function Toast({ text }: { text: string }) {
  return <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{text}</div>
}

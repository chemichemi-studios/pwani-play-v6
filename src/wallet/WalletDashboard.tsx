import { useState } from 'react'
import { WALLET_BALANCE, TRANSACTIONS, AI_INSIGHTS, PAYMENT_METHODS, ESCROW_HOLDS, GRANT_AWARDS, formatKES, formatDate } from './data'

type Props = {
  onAddMoney: () => void
  onWithdraw: () => void
  onSendMoney: () => void
  onTip: () => void
  onCoins: () => void
  onInsights: () => void
  onTransactionDetail: (id: string) => void
  onNotifications: () => void
  onEscrow: () => void
  onResolution: () => void
  onPersonalFinance: () => void
  onGrantFinance: () => void
  onProductionAccounting: () => void
  onSeeAllTransactions: () => void
}

const QUICK_ACTIONS = [
  { icon: '⬇️', label: 'Add Money', color: '#1abc9c' },
  { icon: '📤', label: 'Withdraw', color: '#2980b9' },
  { icon: '→', label: 'Send', color: '#9b59b6' },
  { icon: '💛', label: 'Tip', color: '#f39c12' },
  { icon: '🪙', label: 'Coins', color: '#f1c40f' },
  { icon: '📊', label: 'Insights', color: '#e67e22' },
]

export default function WalletDashboard({ onAddMoney, onWithdraw, onSendMoney, onTip, onCoins, onInsights, onTransactionDetail, onNotifications, onEscrow, onResolution, onPersonalFinance, onGrantFinance, onProductionAccounting, onSeeAllTransactions }: Props) {
  const [balanceHidden, setBalanceHidden] = useState(false)
  const bal = WALLET_BALANCE
  const recentTx = TRANSACTIONS.slice(0, 5)
  const topInsight = AI_INSIGHTS[0]
  const defaultPM = PAYMENT_METHODS.find(p => p.isDefault)

  const handleAction = (label: string) => {
    if (label === 'Add Money') onAddMoney()
    else if (label === 'Withdraw') onWithdraw()
    else if (label === 'Send') onSendMoney()
    else if (label === 'Tip') onTip()
    else if (label === 'Coins') onCoins()
    else if (label === 'Insights') onInsights()
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '56px 20px 20px', background: 'linear-gradient(160deg, #0d1f3c 0%, #0a1628 60%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Pwani Wallet</p>
            <p style={{ color: 'white', fontSize: 22, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Good morning, Amara 👋</p>
          </div>
          <button onClick={onNotifications} style={{ position: 'relative', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}>
            🔔
            <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', border: '2px solid #0a1628' }} />
          </button>
        </div>

        {/* Main balance card */}
        <div style={{ background: 'linear-gradient(135deg, #1a4a7a 0%, #0d2b4f 100%)', border: '1px solid rgba(41,128,185,0.3)', borderRadius: 20, padding: '20px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(41,128,185,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(26,188,156,0.07)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DM Mono, monospace', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Available Balance</p>
            <button onClick={() => setBalanceHidden(!balanceHidden)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', padding: 0 }}>
              {balanceHidden ? '👁' : '🙈'}
            </button>
          </div>
          <p style={{ color: 'white', fontSize: 38, fontFamily: 'DM Serif Display, serif', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            {balanceHidden ? '••••••' : formatKES(bal.available)}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 16px', fontFamily: 'DM Mono, monospace' }}>
            + {formatKES(bal.pending)} pending
          </p>

          {/* Sub-balances */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Monthly In', value: formatKES(bal.monthlyEarnings), color: '#1abc9c', icon: '↑' },
              { label: 'Monthly Out', value: formatKES(bal.monthlySpending), color: '#e74c3c', icon: '↓' },
              { label: 'Coins', value: bal.coins.toLocaleString(), color: '#f8c471', icon: '🪙' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 10px' }}>
                <p style={{ color: s.color, fontSize: 11, fontFamily: 'DM Mono, monospace', margin: '0 0 4px' }}>{s.icon} {s.label}</p>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{balanceHidden ? '•••' : s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Flow Pipeline: Income Received → Pending → Escrow → Available → Withdrawn */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 14px 10px', marginBottom: 16 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Cash Flow Pipeline</p>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 0, paddingBottom: 4 }}>
            {[
              { label: 'Income Received', value: bal.monthlyEarnings, color: '#5dade2' },
              { label: 'Pending', value: bal.pending, color: '#f39c12' },
              { label: 'Escrow', value: bal.heldInEscrow, color: '#8e44ad' },
              { label: 'Available', value: bal.available, color: '#1abc9c' },
              { label: 'Withdrawn', value: bal.totalWithdrawn, color: 'rgba(255,255,255,0.4)' },
            ].map((stage, i, arr) => (
              <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', width: 84 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color, margin: '0 auto 6px' }} />
                  <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{balanceHidden ? '•••' : formatKES(stage.value)}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9.5, margin: 0, lineHeight: 1.3 }}>{stage.label}</p>
                </div>
                {i < arr.length - 1 && <div style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Verified badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 100 }}>
            <span style={{ color: '#1abc9c', fontSize: 12 }}>✓</span>
            <span style={{ color: '#1abc9c', fontSize: 12, fontWeight: 700 }}>Identity Verified</span>
          </div>
          {defaultPM && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100 }}>
              <span style={{ fontSize: 12 }}>{defaultPM.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{defaultPM.label} · Default</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, margin: '20px 0' }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} onClick={() => handleAction(a.label)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 4px', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: `1px solid ${a.color}25` }}>
                {a.icon}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: 'DM Mono, monospace', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* AI Insight banner */}
        <div style={{ background: 'linear-gradient(120deg, rgba(41,128,185,0.1), rgba(26,188,156,0.07))', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }} onClick={onInsights}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✨</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{topInsight.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{topInsight.description}</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18, flexShrink: 0 }}>›</span>
        </div>

        {/* Protected Payments (Escrow) — funds held for active Hub contracts */}
        {ESCROW_HOLDS.filter(e => e.status === 'held' || e.status === 'pending_release').length > 0 && (
          <div onClick={onEscrow} style={{ background: 'rgba(243,156,18,0.06)', border: '1px solid rgba(243,156,18,0.2)', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(243,156,18,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>🔒</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#f39c12', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>Protected Payments</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{formatKES(WALLET_BALANCE.heldInEscrow)} held across {ESCROW_HOLDS.length} active contracts</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18, flexShrink: 0 }}>›</span>
          </div>
        )}

        {/* Refunds & Disputes — quiet entry point, doesn't need item count to justify existing */}
        <div onClick={onResolution} style={{ background: 'rgba(155,89,182,0.05)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: 16, padding: '13px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(155,89,182,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>↩️</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#9b59b6', fontSize: 12.5, fontWeight: 700, margin: '0 0 1px' }}>Refunds & Disputes</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>Track requests and open cases</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16, flexShrink: 0 }}>›</span>
        </div>

        {/* Budgets & Goals */}
        <div onClick={onPersonalFinance} style={{ background: 'rgba(26,188,156,0.05)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 16, padding: '13px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#1abc9c', fontSize: 12.5, fontWeight: 700, margin: '0 0 1px' }}>Budgets & Goals</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>Track spending limits and savings targets</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16, flexShrink: 0 }}>›</span>
        </div>

        {/* Grant Funding — only shown when there's an active award to track */}
        {GRANT_AWARDS.length > 0 && (
          <div onClick={onGrantFinance} style={{ background: 'rgba(142,68,173,0.05)', border: '1px solid rgba(142,68,173,0.15)', borderRadius: 16, padding: '13px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(142,68,173,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏆</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#8e44ad', fontSize: 12.5, fontWeight: 700, margin: '0 0 1px' }}>Grant Funding</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{GRANT_AWARDS.length} active award{GRANT_AWARDS.length > 1 ? 's' : ''} — disbursements & budget</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16, flexShrink: 0 }}>›</span>
          </div>
        )}

        {/* Advances & Reimbursements */}
        <div onClick={onProductionAccounting} style={{ background: 'rgba(93,173,226,0.05)', border: '1px solid rgba(93,173,226,0.15)', borderRadius: 16, padding: '13px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(93,173,226,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🧾</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#5dade2', fontSize: 12.5, fontWeight: 700, margin: '0 0 1px' }}>Advances & Reimbursements</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>Production costs you've fronted or drawn</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16, flexShrink: 0 }}>›</span>
        </div>

        {/* Recent Transactions */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Activity</p>
            <button onClick={onSeeAllTransactions} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 13, cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>See all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentTx.map(tx => (
              <TxRow key={tx.id} tx={tx} onPress={() => onTransactionDetail(tx.id)} />
            ))}
          </div>
        </div>

        {/* Monthly summary bar */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>August 2026 Summary</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Total Earned', value: formatKES(bal.monthlyEarnings), color: '#1abc9c' },
              { label: 'Total Spent', value: formatKES(bal.monthlySpending), color: '#e74c3c' },
              { label: 'All-time Earned', value: formatKES(bal.totalEarned), color: '#f8c471' },
              { label: 'All-time Withdrawn', value: formatKES(bal.totalWithdrawn), color: '#5dade2' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 2px' }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TxRow({ tx, onPress }: { tx: typeof TRANSACTIONS[0]; onPress: () => void }) {
  const sign = tx.direction === 'in' ? '+' : '-'
  const color = tx.direction === 'in' ? '#1abc9c' : tx.status === 'refunded' ? '#9b59b6' : 'rgba(255,255,255,0.65)'
  const statusColor = { completed: '#1abc9c', pending: '#f39c12', failed: '#e74c3c', refunded: '#9b59b6', processing: '#2980b9' }[tx.status]
  return (
    <div onClick={onPress} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, cursor: 'pointer', alignItems: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{tx.counterpartyAvatar}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatDate(tx.date)}</p>
          <span style={{ color: statusColor, fontSize: 10, fontWeight: 700, background: `${statusColor}15`, padding: '1px 6px', borderRadius: 100 }}>{tx.status}</span>
        </div>
      </div>
      <p style={{ color, fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{sign}{formatKES(tx.amount)}</p>
    </div>
  )
}

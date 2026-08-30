import { useState } from 'react'
import { TRANSACTIONS, CATEGORY_COLORS, CATEGORY_ICONS, formatKES, formatDate, formatTime } from './data'
import type { TransactionCategory } from './data'

type Props = { onDetail: (id: string) => void; onAllExpenses: () => void }

const FILTERS: { key: TransactionCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'subscription', label: 'Subscriptions' },
  { key: 'tip', label: 'Tips' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'reward', label: 'Rewards' },
  { key: 'refund', label: 'Refunds' },
]

export default function Transactions({ onDetail, onAllExpenses }: Props) {
  const [filter, setFilter] = useState<TransactionCategory | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = TRANSACTIONS.filter(tx => {
    const matchCat = filter === 'all' || tx.category === filter
    const matchSearch = !search || tx.description.toLowerCase().includes(search.toLowerCase()) || tx.reference.toLowerCase().includes(search.toLowerCase()) || tx.counterparty.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalIn = filtered.filter(t => t.direction === 'in').reduce((s, t) => s + t.amount, 0)
  const totalOut = filtered.filter(t => t.direction === 'out').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '16px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Transactions</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 12px' }}>{TRANSACTIONS.length} total transactions</p>

        <button onClick={onAllExpenses} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 13, background: 'rgba(93,173,226,0.08)', border: '1px solid rgba(93,173,226,0.2)', cursor: 'pointer', marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>🧠</span>
          <span style={{ color: '#5dade2', fontSize: 12.5, fontWeight: 700, flex: 1, textAlign: 'left' }}>All Expenses — Wallet, Grant & Production combined</span>
          <span style={{ color: '#5dade2', fontSize: 14 }}>›</span>
        </button>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: '12px 14px', background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 3px' }}>Total In</p>
            <p style={{ color: '#1abc9c', fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>+{formatKES(totalIn)}</p>
          </div>
          <div style={{ padding: '12px 14px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.12)', borderRadius: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 3px' }}>Total Out</p>
            <p style={{ color: '#e74c3c', fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>-{formatKES(totalOut)}</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>🔍</span>
          <input
            className="input-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by description, ID, or counterparty"
            style={{ paddingLeft: 38, marginBottom: 0 }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: filter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)',
              color: filter === f.key ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Transaction list grouped by date */}
      <div style={{ padding: '0 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💸</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No transactions found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Try a different filter or search term.</p>
          </div>
        ) : (
          filtered.map(tx => {
            const sign = tx.direction === 'in' ? '+' : '-'
            const amtColor = tx.direction === 'in' ? '#1abc9c' : tx.status === 'refunded' ? '#9b59b6' : 'rgba(255,255,255,0.75)'
            const statusColor = { completed: '#1abc9c', pending: '#f39c12', failed: '#e74c3c', refunded: '#9b59b6', processing: '#2980b9' }[tx.status]
            const catColor = CATEGORY_COLORS[tx.category]
            return (
              <div key={tx.id} onClick={() => onDetail(tx.id)} style={{ display: 'flex', gap: 12, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, cursor: 'pointer', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: `1px solid ${catColor}22` }}>
                  {tx.counterpartyAvatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>{tx.description}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 4px' }}>{tx.counterparty}</p>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{formatDate(tx.date)} · {formatTime(tx.date)}</span>
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: `${catColor}15`, color: catColor, fontWeight: 700 }}>{CATEGORY_ICONS[tx.category]} {tx.category}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: amtColor, fontSize: 14, fontWeight: 700, margin: '0 0 3px', fontFamily: 'DM Mono, monospace' }}>{sign}{formatKES(tx.amount)}</p>
                  <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 100, background: `${statusColor}15`, color: statusColor, fontWeight: 700 }}>{tx.status}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

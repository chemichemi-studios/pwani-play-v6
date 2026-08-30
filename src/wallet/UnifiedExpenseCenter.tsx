import { useState, useMemo } from 'react'
import { TRANSACTIONS, GRANT_AWARDS, REIMBURSEMENTS, formatKES } from './data'

type Props = { onBack: () => void }
type Source = 'All' | 'Personal' | 'Grant' | 'Production'

export type UnifiedExpense = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  source: Exclude<Source, 'All'>
  status: string
  statusColor: string
}

// ─── Pulls from the three authoritative expense records that already exist —
// nothing here is a new ledger, just organized reads of TRANSACTIONS,
// GRANT_AWARDS[].expenses, and REIMBURSEMENTS. ───────────────────────────────

export function buildUnifiedList(): UnifiedExpense[] {
  const personal: UnifiedExpense[] = TRANSACTIONS
    .filter(t => t.direction === 'out' && t.status === 'completed')
    .map(t => ({ id: t.id, date: t.date.slice(0, 10), description: t.description, amount: t.amount, category: t.category, source: 'Personal', status: 'Completed', statusColor: '#1abc9c' }))

  const grant: UnifiedExpense[] = GRANT_AWARDS.flatMap(g =>
    g.expenses.map(e => ({
      id: e.id, date: e.date, description: e.description, amount: e.amount,
      category: g.budgetCategories.find(c => c.id === e.categoryId)?.label ?? 'Grant',
      source: 'Grant', status: e.status === 'approved' ? 'Approved' : e.status === 'pending' ? 'Pending Review' : 'Rejected',
      statusColor: e.status === 'approved' ? '#1abc9c' : e.status === 'pending' ? '#f39c12' : '#e74c3c',
    }))
  )

  const production: UnifiedExpense[] = REIMBURSEMENTS.map(r => ({
    id: r.id, date: r.date, description: r.description, amount: r.amount, category: r.category,
    source: 'Production',
    status: r.status === 'paid' ? 'Paid' : r.status === 'rejected' ? 'Rejected' : r.status === 'under_review' ? 'Under Review' : 'Submitted',
    statusColor: r.status === 'paid' ? '#1abc9c' : r.status === 'rejected' ? '#e74c3c' : '#f39c12',
  }))

  return [...personal, ...grant, ...production]
}

export default function UnifiedExpenseCenter({ onBack }: Props) {
  const all = useMemo(buildUnifiedList, [])
  const [source, setSource] = useState<Source>('All')
  const [query, setQuery] = useState('')

  const filtered = all.filter(e =>
    (source === 'All' || e.source === source) &&
    (query.trim() === '' || e.description.toLowerCase().includes(query.toLowerCase()) || e.category.toLowerCase().includes(query.toLowerCase()))
  )

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  // Category breakdown, computed — not a stored duplicate
  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach(e => map.set(e.category, (map.get(e.category) || 0) + e.amount))
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [filtered])

  const maxCategory = byCategory[0]?.[1] || 1

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="All Expenses" badge={`${filtered.length}`} onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
          Every expense across your Wallet, Grant Funding, and Production accounting — organized in one place, not a separate record.
        </p>

        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search expenses…" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 14px', color: 'white', fontSize: 13, marginBottom: 12 }} />

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
          {(['All', 'Personal', 'Grant', 'Production'] as const).map(s => (
            <button key={s} onClick={() => setSource(s)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', background: source === s ? '#1e6091' : 'rgba(255,255,255,0.06)', color: source === s ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700 }}>{s}</button>
          ))}
        </div>

        {/* Summary + category breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5 }}>Total shown</span>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>{formatKES(total)}</span>
          </div>
          {byCategory.map(([cat, amt]) => (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11.5, textTransform: 'capitalize' }}>{cat}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11.5, fontFamily: 'DM Mono, monospace' }}>{formatKES(amt)}</span>
              </div>
              <div style={{ height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((amt / maxCategory) * 100)}%`, height: '100%', background: '#5dade2', borderRadius: 100 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Unified list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.sort((a, b) => b.date.localeCompare(a.date)).map(e => (
            <div key={`${e.source}-${e.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontSize: 12.5, fontWeight: 600, margin: '0 0 3px' }}>{e.description}</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <SourceTag source={e.source} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5 }}>{e.category} · {e.date}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: 'white', fontSize: 12.5, fontWeight: 700, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>{formatKES(e.amount)}</p>
                <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 100, background: `${e.statusColor}18`, color: e.statusColor, fontWeight: 700 }}>{e.status}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 30, fontSize: 13 }}>No expenses match that search.</p>}
        </div>
      </div>
    </div>
  )
}

function SourceTag({ source }: { source: Exclude<Source, 'All'> }) {
  const colors: Record<string, string> = { Personal: '#5dade2', Grant: '#8e44ad', Production: '#f39c12' }
  const c = colors[source]
  return <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 100, background: `${c}18`, color: c, fontWeight: 700 }}>{source}</span>
}

function Header({ title, onBack, badge }: { title: string; onBack: () => void; badge?: string }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
      {badge && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(93,173,226,0.12)', color: '#5dade2', fontWeight: 700, border: '1px solid rgba(93,173,226,0.2)' }}>{badge}</span>}
    </div>
  )
}

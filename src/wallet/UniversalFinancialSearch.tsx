import { useState } from 'react'
import {
  TRANSACTIONS, INVOICES, QUOTES, ESCROW_HOLDS, REFUND_REQUESTS, DISPUTES,
  GRANT_AWARDS, ADVANCES, REIMBURSEMENTS, FINANCIAL_REQUESTS, BUDGETS, SAVINGS_GOALS,
  formatKES,
} from './data'
import type { WalletScreen } from './WalletShell'

type Props = { onClose: () => void; onNavigate: (target: WalletScreen) => void }

type Result = { icon: string; title: string; subtitle: string; amount?: string; module: string; moduleColor: string; go: WalletScreen }

function buildIndex(): Result[] {
  const results: Result[] = []

  TRANSACTIONS.forEach(t => results.push({ icon: '💳', title: t.description, subtitle: t.counterparty, amount: formatKES(t.amount), module: 'Transaction', moduleColor: '#5dade2', go: { id: 'tx-detail', txId: t.id } }))
  INVOICES.forEach(i => results.push({ icon: '📃', title: i.description, subtitle: `${i.counterparty} · ${i.invoiceNumber}`, amount: formatKES(i.amount), module: 'Invoice', moduleColor: '#f39c12', go: { id: 'invoice-detail', invoiceId: i.id } }))
  QUOTES.forEach(q => results.push({ icon: '📝', title: q.description, subtitle: `${q.counterparty} · ${q.quoteNumber}`, amount: formatKES(q.amount), module: 'Quote', moduleColor: '#5dade2', go: { id: 'quotes' } }))
  ESCROW_HOLDS.forEach(e => results.push({ icon: '🔒', title: e.projectTitle, subtitle: e.counterparty, amount: formatKES(e.totalAmount), module: 'Protected Payment', moduleColor: '#f39c12', go: { id: 'escrow' } }))
  REFUND_REQUESTS.forEach(r => results.push({ icon: '↩️', title: r.orderDesc, subtitle: `${r.counterparty} · ${r.refundNumber}`, amount: formatKES(r.requestedAmount), module: 'Refund', moduleColor: '#9b59b6', go: { id: 'resolution' } }))
  DISPUTES.forEach(d => results.push({ icon: '⚖️', title: d.subject, subtitle: `${d.counterparty} · ${d.disputeNumber}`, amount: formatKES(d.amount), module: 'Dispute', moduleColor: '#e74c3c', go: { id: 'resolution' } }))
  GRANT_AWARDS.forEach(g => results.push({ icon: '🏆', title: g.grantName, subtitle: g.funder, amount: formatKES(g.totalAmount), module: 'Grant', moduleColor: '#8e44ad', go: { id: 'grant-finance' } }))
  ADVANCES.forEach(a => results.push({ icon: '💵', title: a.purpose, subtitle: a.production, amount: formatKES(a.amount), module: 'Advance', moduleColor: '#5dade2', go: { id: 'production-accounting' } }))
  REIMBURSEMENTS.forEach(r => results.push({ icon: '🧾', title: r.description, subtitle: `${r.production} · ${r.category}`, amount: formatKES(r.amount), module: 'Reimbursement', moduleColor: '#5dade2', go: { id: 'production-accounting' } }))
  FINANCIAL_REQUESTS.forEach(f => results.push({ icon: '📨', title: f.purpose, subtitle: `${f.context} · ${f.type}`, amount: formatKES(f.amount), module: 'Request', moduleColor: '#5dade2', go: { id: 'production-accounting' } }))
  BUDGETS.forEach(b => results.push({ icon: b.icon, title: b.label, subtitle: b.period, amount: formatKES(b.limit), module: 'Budget', moduleColor: '#1abc9c', go: { id: 'personal-finance' } }))
  SAVINGS_GOALS.forEach(g => results.push({ icon: g.icon, title: g.title, subtitle: g.goalType, amount: formatKES(g.targetAmount), module: 'Goal', moduleColor: '#1abc9c', go: { id: 'personal-finance' } }))

  return results
}

export default function UniversalFinancialSearch({ onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState<string>('All')
  const all = buildIndex()
  const modules = ['All', ...Array.from(new Set(all.map(r => r.module)))]

  const filtered = query.trim() === '' ? [] : all.filter(r =>
    (moduleFilter === 'All' || r.module === moduleFilter) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) || r.subtitle.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 30)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0f1f38', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '52px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>🔎</span>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transactions, invoices, grants, advances…" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 14px', color: 'white', fontSize: 14, outline: 'none' }} />
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 12, padding: '8px 12px', cursor: 'pointer' }}>Close</button>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {modules.map(m => (
            <button key={m} onClick={() => setModuleFilter(m)} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 100, background: moduleFilter === m ? '#1e6091' : 'rgba(255,255,255,0.06)', border: 'none', color: moduleFilter === m ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>{m}</button>
          ))}
        </div>
      </div>
      <div onClick={e => e.stopPropagation()} style={{ flex: 1, overflowY: 'auto', background: '#0a1628', padding: '12px 16px 40px' }}>
        {query.trim() === '' && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>Search across every part of your Wallet — transactions, invoices, grants, escrow, budgets, and more.</p>
        )}
        {query.trim() !== '' && filtered.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No matches for "{query}"</p>
        )}
        {filtered.map((r, i) => (
          <button key={i} onClick={() => { onNavigate(r.go); onClose() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 15, marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 9.5, padding: '1px 7px', borderRadius: 100, background: `${r.moduleColor}18`, color: r.moduleColor, fontWeight: 700 }}>{r.module}</span>
              </div>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subtitle}</p>
            </div>
            {r.amount && <span style={{ color: 'white', fontSize: 12.5, fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{r.amount}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

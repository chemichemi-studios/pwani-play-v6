import { useState } from 'react'
import { GRANT_AWARDS, formatKES, type GrantAward, type GrantDisbursement, type GrantExpenseStatus } from './data'

type Props = { onBack: () => void }

const DISBURSEMENT_META: Record<GrantDisbursement['status'], { label: string; color: string }> = {
  scheduled:  { label: 'Scheduled',  color: 'rgba(255,255,255,0.4)' },
  processing: { label: 'Processing', color: '#5dade2' },
  received:   { label: 'Received',   color: '#1abc9c' },
  delayed:    { label: 'Delayed',    color: '#e74c3c' },
}

const EXPENSE_META: Record<GrantExpenseStatus, { label: string; color: string }> = {
  pending:  { label: 'Pending Review', color: '#f39c12' },
  approved: { label: 'Approved',       color: '#1abc9c' },
  rejected: { label: 'Rejected',       color: '#e74c3c' },
}

export default function GrantFinance({ onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(GRANT_AWARDS.length === 1 ? GRANT_AWARDS[0].id : null)
  const grant = GRANT_AWARDS.find(g => g.id === selected)

  if (!grant) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <Header title="Grant Funding" onBack={onBack} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
          {GRANT_AWARDS.map(g => (
            <div key={g.id} onClick={() => setSelected(g.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{g.grantName}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{g.funder} · {formatKES(g.totalAmount)}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const disbursed = grant.disbursements.filter(d => d.status === 'received').reduce((s, d) => s + d.amount, 0)
  const approvedSpend = grant.expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0)
  const pendingSpend = grant.expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0)
  const availableToSpend = disbursed - approvedSpend
  const remainingToDisburse = grant.totalAmount - disbursed

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Grant Funding" onBack={() => (GRANT_AWARDS.length === 1 ? onBack() : setSelected(null))} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        {/* Summary */}
        <div style={{ background: 'rgba(26,188,156,0.06)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 18, padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 4px' }}>{grant.funder}</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: '0 0 8px', lineHeight: 1.3 }}>{grant.grantName}</h2>
          <p style={{ color: 'white', fontSize: 30, fontFamily: 'DM Serif Display, serif', margin: '0 0 4px' }}>{formatKES(grant.totalAmount)}</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11.5, margin: 0 }}>Total awarded · {grant.awardDate}</p>
        </div>

        {/* Fund status — never combined without labeling */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <StatBox label="Received So Far" value={formatKES(disbursed)} color="#1abc9c" />
          <StatBox label="Remaining to Disburse" value={formatKES(remainingToDisburse)} color="#f39c12" />
          <StatBox label="Available to Spend" value={formatKES(availableToSpend)} color="#5dade2" />
          <StatBox label="Pending Approval" value={formatKES(pendingSpend)} color="rgba(255,255,255,0.5)" />
        </div>

        {/* Restrictions */}
        {grant.restrictions.length > 0 && (
          <div style={{ background: 'rgba(243,156,18,0.06)', border: '1px solid rgba(243,156,18,0.18)', borderRadius: 14, padding: 14, marginBottom: 20 }}>
            <p style={{ color: '#f39c12', fontSize: 11.5, fontWeight: 700, margin: '0 0 8px' }}>⚠ Funding Restrictions</p>
            {grant.restrictions.map((r, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 4px' }}>• {r}</p>)}
          </div>
        )}

        {/* Disbursement schedule */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Disbursement Schedule</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {grant.disbursements.map(d => {
            const meta = DISBURSEMENT_META[d.status]
            return (
              <div key={d.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'white', fontSize: 12.5, fontWeight: 700 }}>{d.label}</span>
                  <span style={{ color: 'white', fontSize: 12.5, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(d.amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Expected {d.expectedDate}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                </div>
                {d.condition && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '6px 0 0', fontStyle: 'italic' }}>{d.condition}</p>}
              </div>
            )
          })}
        </div>

        {/* Budget categories */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Grant Budget</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {grant.budgetCategories.map(c => {
            const spent = grant.expenses.filter(e => e.categoryId === c.id && e.status === 'approved').reduce((s, e) => s + e.amount, 0)
            const pct = Math.min(100, Math.round((spent / c.allocated) * 100))
            return (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: 'white', fontSize: 12.5, fontWeight: 700 }}>{c.label}</span>
                  {c.restricted && <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 100, background: 'rgba(243,156,18,0.15)', color: '#f39c12', fontWeight: 700 }}>Restricted</span>}
                </div>
                <div style={{ height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#e74c3c' : '#1abc9c', borderRadius: 100 }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{formatKES(spent)} of {formatKES(c.allocated)} allocated</p>
              </div>
            )
          })}
        </div>

        {/* Expenses */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Claimed Expenses</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {grant.expenses.map(e => {
            const meta = EXPENSE_META[e.status]
            const cat = grant.budgetCategories.find(c => c.id === e.categoryId)
            return (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 12.5, fontWeight: 600, margin: '0 0 2px' }}>{e.description}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{cat?.label} · {e.date}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: 'white', fontSize: 12.5, fontWeight: 700, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>{formatKES(e.amount)}</p>
                  <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '20px 0 0', lineHeight: 1.6, textAlign: 'center' }}>
          Grant funds are tracked separately from your general Wallet balance because they carry eligibility rules ordinary spending doesn't.
        </p>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{value}</p>
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

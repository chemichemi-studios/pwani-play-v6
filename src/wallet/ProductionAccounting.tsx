import { useState } from 'react'
import {
  ADVANCES, ADVANCE_STATUS_META, REIMBURSEMENTS, REIMBURSEMENT_STATUS_META, REIMBURSEMENT_CATEGORIES,
  FINANCIAL_REQUESTS, FINANCIAL_REQUEST_STATUS_META, SPENDING_LIMIT,
  formatKES, type Reimbursement, type ReimbursementStatus,
} from './data'

type Props = { onBack: () => void }
type View = { id: 'list' } | { id: 'new-reimbursement' }

export default function ProductionAccounting({ onBack }: Props) {
  const [tab, setTab] = useState<'advances' | 'reimbursements' | 'requests'>('advances')
  const [view, setView] = useState<View>({ id: 'list' })
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(REIMBURSEMENTS)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  if (view.id === 'new-reimbursement') {
    return (
      <NewReimbursement
        onCancel={() => setView({ id: 'list' })}
        onSubmit={(r) => {
          setReimbursements(p => [r, ...p])
          showToast('Reimbursement request submitted')
          setView({ id: 'list' })
        }}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Advances & Reimbursements" onBack={onBack} />
      {toast && <Toast text={toast} />}
      <div style={{ padding: '68px 20px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['advances', 'reimbursements', 'requests'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 12, border: 'none', cursor: 'pointer', background: tab === t ? '#1e6091' : 'rgba(255,255,255,0.06)', color: tab === t ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12.5, fontWeight: 700 }}>
              {t === 'advances' ? `Advances (${ADVANCES.length})` : t === 'reimbursements' ? `Reimbursements (${reimbursements.length})` : `Requests (${FINANCIAL_REQUESTS.length})`}
            </button>
          ))}
        </div>

        {/* Spending limit — set by an organization, shown from the individual's side */}
        {tab !== 'reimbursements' && (
          <div style={{ background: 'rgba(243,156,18,0.06)', border: '1px solid rgba(243,156,18,0.18)', borderRadius: 14, padding: '11px 14px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 15 }}>🔐</span>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, margin: 0, lineHeight: 1.4 }}>
              <strong style={{ color: '#f39c12' }}>{SPENDING_LIMIT.setBy}</strong> caps {SPENDING_LIMIT.appliesTo} at <strong style={{ color: 'white' }}>{formatKES(SPENDING_LIMIT.amount)}</strong> {SPENDING_LIMIT.limitType.toLowerCase()} — requests above this need approval.
            </p>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {tab === 'requests' ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
              Requests you've sent to an organization or funder — tracked through to a decision, not something you can approve yourself.
            </p>
            {FINANCIAL_REQUESTS.map(r => {
              const meta = FINANCIAL_REQUEST_STATUS_META[r.status]
              return (
                <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(93,173,226,0.15)', color: '#5dade2', fontWeight: 700 }}>{r.type}</span>
                    <span style={{ color: 'white', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(r.amount)}</span>
                  </div>
                  <p style={{ color: 'white', fontSize: 12.5, fontWeight: 600, margin: '6px 0 4px' }}>{r.purpose}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 8px' }}>{r.context} · Approver: {r.approver} · {r.date}</p>
                  <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                </div>
              )
            })}
          </>
        ) : tab === 'advances' ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
              Money issued ahead of production costs, tracked against what you've actually spent.
            </p>
            {ADVANCES.map(a => {
              const meta = ADVANCE_STATUS_META[a.status]
              const remaining = a.amount - a.settledAmount
              const pct = Math.round((a.settledAmount / a.amount) * 100)
              return (
                <div key={a.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 15, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <p style={{ color: 'white', fontSize: 13.5, fontWeight: 700, margin: '0 0 2px' }}>{a.purpose}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{a.production}</p>
                    </div>
                    <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700, flexShrink: 0 }}>{meta.label}</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#5dade2', borderRadius: 100 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>{formatKES(a.settledAmount)} settled of {formatKES(a.amount)}</span>
                    <span style={{ color: '#f39c12', fontWeight: 700 }}>{formatKES(remaining)} outstanding</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '8px 0 0' }}>Issued {a.issueDate} · Settlement due {a.expectedSettlementDate}</p>
                </div>
              )
            })}
          </>
        ) : (
          <>
            <button onClick={() => setView({ id: 'new-reimbursement' })} style={{ width: '100%', padding: '11px', borderRadius: 13, background: 'rgba(26,188,156,0.08)', border: '1px dashed rgba(26,188,156,0.25)', color: '#1abc9c', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 14 }}>+ Request Reimbursement</button>
            {reimbursements.map(r => {
              const meta = REIMBURSEMENT_STATUS_META[r.status]
              return (
                <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0, flex: 1 }}>{r.description}</p>
                    <span style={{ color: 'white', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{formatKES(r.amount)}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 8px' }}>{r.production} · {r.category} · {r.date}</p>
                  <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                  {r.reason && <p style={{ color: '#e74c3c', fontSize: 11.5, margin: '8px 0 0', lineHeight: 1.4 }}>{r.reason}</p>}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

function NewReimbursement({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (r: Reimbursement) => void }) {
  const [description, setDescription] = useState('')
  const [production, setProduction] = useState('"Lagos Dreams"')
  const [category, setCategory] = useState(REIMBURSEMENT_CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const [receiptAttached, setReceiptAttached] = useState(false)

  const submit = () => {
    if (!description.trim() || !amount || Number(amount) <= 0) return
    const r: Reimbursement = {
      id: 'rb' + Date.now(),
      production,
      description: description.trim(),
      category,
      amount: Number(amount),
      currency: 'KES',
      date: 'Just now',
      status: 'submitted',
    }
    onSubmit(r)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Request Reimbursement" onBack={onCancel} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Production</p>
        <select value={production} onChange={e => setProduction(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 12px', color: 'white', fontSize: 13, marginBottom: 16 }}>
          <option value={'"Lagos Dreams"'} style={{ background: '#0a1628' }}>"Lagos Dreams"</option>
          <option value={'"Coastal Echoes"'} style={{ background: '#0a1628' }}>"Coastal Echoes"</option>
        </select>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>What did you pay for?</p>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Taxi to set, replacement batteries…" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 12px', color: 'white', fontSize: 13, marginBottom: 16 }} />

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Category</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          {REIMBURSEMENT_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '7px 13px', borderRadius: 100, background: category === c ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${category === c ? 'rgba(26,188,156,0.3)' : 'rgba(255,255,255,0.08)'}`, color: category === c ? '#1abc9c' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Amount</p>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 12px', color: 'white', fontSize: 14, marginBottom: 16 }} />

        <button onClick={() => setReceiptAttached(p => !p)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: receiptAttached ? 'rgba(26,188,156,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${receiptAttached ? 'rgba(26,188,156,0.25)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', marginBottom: 20 }}>
          <span style={{ fontSize: 16 }}>{receiptAttached ? '✅' : '📎'}</span>
          <span style={{ color: receiptAttached ? '#1abc9c' : 'rgba(255,255,255,0.6)', fontSize: 12.5, fontWeight: 600 }}>{receiptAttached ? 'Receipt attached' : 'Attach a receipt (recommended)'}</span>
        </button>

        <button onClick={submit} disabled={!description.trim() || !amount} style={{ width: '100%', padding: 14, borderRadius: 13, background: description.trim() && amount ? 'linear-gradient(90deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.08)', border: 'none', color: description.trim() && amount ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: description.trim() && amount ? 'pointer' : 'not-allowed' }}>Submit Request</button>
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

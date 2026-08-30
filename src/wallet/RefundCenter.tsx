import { useState } from 'react'
import { TRANSACTIONS, formatKES, formatDate } from './data'

type Props = { txId: string; onBack: () => void }

const REASONS = ['Item not as described', 'Never received', 'Duplicate charge', 'Changed my mind', 'Other']

export default function RefundCenter({ txId, onBack }: Props) {
  const tx = TRANSACTIONS.find(t => t.id === txId)
  const [mode, setMode] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState('')
  const [reason, setReason] = useState(REASONS[0])
  const [note, setNote] = useState('')
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form')

  if (!tx) return <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'white' }}>Transaction not found.</p></div>

  const refundAmount = mode === 'full' ? tx.amount : Math.min(Number(partialAmount) || 0, tx.amount)
  const platformFee = Math.round(tx.amount * 0.025)
  const netRefund = mode === 'full' ? tx.amount - platformFee : refundAmount

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <Header title="Refund Requested" onBack={onBack} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '68px 32px 40px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(155,89,182,0.15)', border: '2px solid rgba(155,89,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 18 }}>↩️</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 8px' }}>Refund Requested</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 4px', lineHeight: 1.6 }}>
            {formatKES(netRefund)} refund requested from <strong style={{ color: 'white' }}>{tx.counterparty}</strong>.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12.5, margin: '0 0 28px' }}>Sellers typically respond within 3–5 business days. You'll be notified either way.</p>
          <button onClick={onBack} style={{ padding: '13px 30px', borderRadius: 13, background: '#1e6091', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Done</button>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <Header title="Refund Preview" onBack={() => setStep('form')} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
          <div style={{ background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.2)', borderRadius: 18, padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, margin: '0 0 6px' }}>You'll receive</p>
            <p style={{ color: 'white', fontSize: 32, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{formatKES(netRefund)}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            {[
              { label: 'Original Purchase', value: formatKES(tx.amount) },
              { label: mode === 'full' ? 'Refund Type' : 'Refund Type', value: mode === 'full' ? 'Full Refund' : 'Partial Refund' },
              ...(mode === 'full' ? [{ label: 'Platform Fee (non-refundable)', value: `–${formatKES(platformFee)}` }] : []),
              { label: 'Reason', value: reason },
              { label: 'Refund To', value: tx.paymentMethod },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{row.label}</span>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', marginTop: 4 }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>Net Refund</span>
              <span style={{ color: '#9b59b6', fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(netRefund)}</span>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11.5, margin: '0 0 20px', lineHeight: 1.6, textAlign: 'center' }}>
            This sends a refund request to {tx.counterparty} — it isn't an automatic refund. They can accept, offer a different amount, or decline with a reason.
          </p>
          <button onClick={() => setStep('done')} style={{ width: '100%', padding: 14, borderRadius: 13, background: 'linear-gradient(90deg,#8e44ad,#9b59b6)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Confirm Refund Request</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Request Refund" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 24 }}>{tx.counterpartyAvatar}</span>
          <div>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{tx.description}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{tx.counterparty} · {formatDate(tx.date)} · {formatKES(tx.amount)}</p>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Refund Amount</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setMode('full')} style={{ flex: 1, padding: '11px', borderRadius: 12, background: mode === 'full' ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${mode === 'full' ? 'rgba(155,89,182,0.35)' : 'rgba(255,255,255,0.08)'}`, color: mode === 'full' ? '#9b59b6' : 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Full Refund</button>
          <button onClick={() => setMode('partial')} style={{ flex: 1, padding: '11px', borderRadius: 12, background: mode === 'partial' ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${mode === 'partial' ? 'rgba(155,89,182,0.35)' : 'rgba(255,255,255,0.08)'}`, color: mode === 'partial' ? '#9b59b6' : 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Partial Refund</button>
        </div>

        {mode === 'partial' && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 6px' }}>Amount (up to {formatKES(tx.amount)}):</p>
            <input type="number" value={partialAmount} onChange={e => setPartialAmount(e.target.value)} placeholder="e.g. 300" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 14px', color: 'white', fontSize: 14 }} />
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Reason</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          {REASONS.map(r => (
            <button key={r} onClick={() => setReason(r)} style={{ padding: '7px 13px', borderRadius: 100, background: reason === r ? 'rgba(155,89,182,0.18)' : 'rgba(255,255,255,0.05)', border: `1px solid ${reason === r ? 'rgba(155,89,182,0.35)' : 'rgba(255,255,255,0.08)'}`, color: reason === r ? '#9b59b6' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{r}</button>
          ))}
        </div>

        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add any extra detail for the seller (optional)…" style={{ width: '100%', boxSizing: 'border-box', height: 80, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 12, color: 'white', fontSize: 13, resize: 'vertical', marginBottom: 20 }} />

        <button
          disabled={mode === 'partial' && (!partialAmount || Number(partialAmount) <= 0 || Number(partialAmount) > tx.amount)}
          onClick={() => setStep('preview')}
          style={{ width: '100%', padding: 14, borderRadius: 13, background: (mode === 'full' || (partialAmount && Number(partialAmount) > 0 && Number(partialAmount) <= tx.amount)) ? 'linear-gradient(90deg,#8e44ad,#9b59b6)' : 'rgba(255,255,255,0.08)', border: 'none', color: (mode === 'full' || (partialAmount && Number(partialAmount) > 0)) ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >Preview Refund →</button>
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

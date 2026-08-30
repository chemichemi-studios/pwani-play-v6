import { useState } from 'react'
import { TRANSACTIONS, CATEGORY_COLORS, CATEGORY_ICONS, formatKES, formatDate, formatTime } from './data'

type Props = { txId: string; onBack: () => void; onRefund: (txId: string) => void; onDispute: (info: { txId: string; subject: string; counterparty: string; amount: number }) => void }

export default function TransactionDetail({ txId, onBack, onRefund, onDispute }: Props) {
  const tx = TRANSACTIONS.find(t => t.id === txId)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000) }
  if (!tx) return <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'white' }}>Transaction not found.</p></div>

  const refundEligible = tx.direction === 'out' && tx.status === 'completed' && tx.category === 'marketplace'

  const sign = tx.direction === 'in' ? '+' : '-'
  const amtColor = tx.direction === 'in' ? '#1abc9c' : tx.status === 'refunded' ? '#9b59b6' : 'rgba(255,255,255,0.9)'
  const statusColor = { completed: '#1abc9c', pending: '#f39c12', failed: '#e74c3c', refunded: '#9b59b6', processing: '#2980b9' }[tx.status]
  const catColor = CATEGORY_COLORS[tx.category]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'linear-gradient(160deg, #0d1f3c, #0a1628)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>Transaction Receipt</h2>
        </div>

        {/* Amount hero */}
        <div style={{ textAlign: 'center', paddingBottom: 4 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${catColor}18`, border: `2px solid ${catColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>
            {tx.counterpartyAvatar}
          </div>
          <p style={{ color: amtColor, fontSize: 36, fontFamily: 'DM Serif Display, serif', margin: '0 0 4px' }}>{sign}{formatKES(tx.amount)}</p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: '0 0 10px' }}>{tx.description}</p>
          <span style={{ fontSize: 12, padding: '4px 14px', borderRadius: 100, background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}33`, fontWeight: 700 }}>
            {tx.status === 'completed' ? '✓ ' : tx.status === 'pending' ? '⏳ ' : ''}
            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
        {/* Details card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { label: 'Date', value: `${formatDate(tx.date)} at ${formatTime(tx.date)}` },
            { label: 'Reference', value: tx.reference },
            { label: 'Category', value: `${CATEGORY_ICONS[tx.category]} ${tx.category}` },
            { label: tx.direction === 'in' ? 'From' : 'To', value: tx.counterparty },
            { label: 'Payment Method', value: tx.paymentMethod },
            ...(tx.note ? [{ label: 'Note', value: tx.note }] : []),
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, flexShrink: 0 }}>{row.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, textAlign: 'right', fontFamily: row.label === 'Reference' ? 'DM Mono, monospace' : 'inherit', wordBreak: 'break-all' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={() => showToast('Downloaded PDF')} style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>📥 Download</button>
          <button onClick={() => showToast(`Emailed to ${tx.counterparty}`)} style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>📧 Email</button>
          <button onClick={() => showToast('Share link copied')} style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>🔗 Share</button>
        </div>

        {/* Request Refund — only for eligible marketplace purchases */}
        {refundEligible && (
          <button onClick={() => onRefund(tx.id)} style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'rgba(155,89,182,0.1)', border: '1px solid rgba(155,89,182,0.22)', color: '#9b59b6', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>↩️ Request Refund</button>
        )}

        {/* Dispute */}
        {tx.status === 'completed' && (
          <div style={{ background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.12)', borderRadius: 14, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>Problem with this transaction?</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>Raise a dispute within 30 days</p>
            </div>
            <button onClick={() => onDispute({ txId: tx.id, subject: tx.description, counterparty: tx.counterparty, amount: tx.amount })} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>Dispute</button>
          </div>
        )}
      </div>
    </div>
  )
}

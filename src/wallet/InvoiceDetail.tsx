import { useState } from 'react'
import { INVOICES, formatKES, formatDate } from './data'

type Props = { invoiceId: string; onBack: () => void }

export default function InvoiceDetail({ invoiceId, onBack }: Props) {
  const original = INVOICES.find(i => i.id === invoiceId) ?? INVOICES[0]
  const [status, setStatus] = useState(original.status)
  const [amountPaid, setAmountPaid] = useState(original.amountPaid)
  const [toast, setToast] = useState('')
  const [showRecord, setShowRecord] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const inv = original
  const TYPE_ICONS = { receipt: '🧾', invoice: '📃', withdrawal: '📤' }
  const STATUS_COLORS = { paid: '#1abc9c', pending: '#f39c12', overdue: '#e74c3c' }
  const color = STATUS_COLORS[status]
  const remaining = amountPaid !== undefined ? inv.amount - amountPaid : inv.amount

  const recordPayment = () => {
    const amt = Number(payAmount)
    if (amt <= 0 || amt > remaining) return
    const newPaid = (amountPaid || 0) + amt
    setAmountPaid(newPaid)
    if (newPaid >= inv.amount) setStatus('paid')
    setShowRecord(false)
    setPayAmount('')
    showToast(newPaid >= inv.amount ? 'Marked as fully paid' : `Recorded ${formatKES(amt)} payment`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: '0 0 1px' }}>{TYPE_ICONS[inv.type]} {inv.type.charAt(0).toUpperCase() + inv.type.slice(1)}</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>{inv.invoiceNumber}</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Amount hero */}
        <div style={{ background: `${color}0a`, border: `1px solid ${color}18`, borderRadius: 18, padding: '22px', marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 6px' }}>Total Amount</p>
          <p style={{ color: 'white', fontSize: 38, fontFamily: 'DM Serif Display, serif', margin: '0 0 8px' }}>{formatKES(inv.amount)}</p>
          <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: `${color}18`, color, border: `1px solid ${color}25`, fontWeight: 700 }}>{status.toUpperCase()}</span>
          {amountPaid !== undefined && status !== 'paid' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 2px' }}>Paid</p>
                <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatKES(amountPaid)}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 2px' }}>Remaining</p>
                <p style={{ color: '#f39c12', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatKES(remaining)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Details</p>
          {[
            { label: 'Description', value: inv.description },
            { label: 'Issued to', value: inv.counterparty },
            { label: 'Date', value: formatDate(inv.date) },
            ...(inv.dueDate ? [{ label: 'Due Date', value: inv.dueDate }] : []),
            { label: 'Invoice No', value: inv.invoiceNumber },
            { label: 'Type', value: inv.type },
            { label: 'Currency', value: inv.currency },
          ].map(d => (
            <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{d.label}</span>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 600, textAlign: 'right', maxWidth: '55%', fontFamily: d.label === 'Invoice No' ? 'DM Mono, monospace' : 'Outfit, sans-serif' }}>{d.value}</span>
            </div>
          ))}
        </div>

        {/* Line items */}
        {inv.items.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Line Items</p>
            {inv.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < inv.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{item.label}</span>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{formatKES(item.amount)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 4 }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>Total</span>
              <span style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(inv.amount)}</span>
            </div>
          </div>
        )}

        {/* Record payment (pending/overdue only) */}
        {status !== 'paid' && (
          <div style={{ background: 'rgba(26,188,156,0.06)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 16, padding: 14, marginBottom: 16 }}>
            {!showRecord ? (
              <button onClick={() => setShowRecord(true)} style={{ width: '100%', padding: '10px', borderRadius: 11, background: 'rgba(26,188,156,0.15)', border: '1px solid rgba(26,188,156,0.3)', color: '#1abc9c', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Record a Payment</button>
            ) : (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 6px' }}>Amount received (up to {formatKES(remaining)}):</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder={String(remaining)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '8px 10px', color: 'white', fontSize: 12 }} />
                  <button onClick={recordPayment} style={{ padding: '8px 14px', borderRadius: 9, background: '#1abc9c', border: 'none', color: '#0a1628', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Record</button>
                  <button onClick={() => setShowRecord(false)} style={{ padding: '8px 10px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>×</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <button onClick={() => showToast('Downloaded PDF')} style={{ padding: '14px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📥 Download PDF</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => showToast(`Emailed to ${inv.counterparty}`)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>📧 Email</button>
            <button onClick={() => showToast('Share link copied')} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🔗 Share</button>
          </div>
        </div>

        {status === 'pending' && (
          <div style={{ background: 'rgba(243,156,18,0.07)', border: '1px solid rgba(243,156,18,0.15)', borderRadius: 14, padding: '14px', marginBottom: 8 }}>
            <p style={{ color: '#f39c12', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>⚠ Payment Pending</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>This invoice is awaiting payment. Contact {inv.counterparty} if payment has already been made.</p>
          </div>
        )}
        {status === 'overdue' && (
          <div style={{ background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: 14, padding: '14px', marginBottom: 8 }}>
            <p style={{ color: '#e74c3c', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>⚠ Overdue</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>This invoice is past its due date. Consider sending a payment reminder.</p>
          </div>
        )}
      </div>
    </div>
  )
}

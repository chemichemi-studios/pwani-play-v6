import { useState } from 'react'
import { INVOICES, formatKES, formatDate } from './data'
import type { Invoice } from './data'

type Props = { onDetail: (id: string) => void; onBack?: () => void; onQuotes: () => void }

type Filter = 'all' | 'receipt' | 'invoice' | 'withdrawal'

export default function Invoices({ onDetail, onQuotes }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const filtered = INVOICES.filter(inv => filter === 'all' || inv.type === filter)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Invoices & Receipts</h2>
          <button onClick={() => showToast('Draft invoice created')} style={{ padding: '8px 14px', borderRadius: 10, background: '#1e6091', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Create</button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 12px' }}>{INVOICES.length} documents</p>

        <button onClick={onQuotes} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 13, background: 'rgba(93,173,226,0.08)', border: '1px solid rgba(93,173,226,0.2)', cursor: 'pointer', marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>📝</span>
          <span style={{ color: '#5dade2', fontSize: 12.5, fontWeight: 700, flex: 1, textAlign: 'left' }}>Quotes — send, accept, and convert to invoices</span>
          <span style={{ color: '#5dade2', fontSize: 14 }}>›</span>
        </button>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {(['all', 'receipt', 'invoice', 'withdrawal'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', background: filter === f ? '#1e6091' : 'rgba(255,255,255,0.06)', color: filter === f ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
              {{ all: 'All', receipt: 'Receipts', invoice: 'Invoices', withdrawal: 'Withdrawals' }[f]}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(inv => <InvoiceCard key={inv.id} inv={inv} onPress={() => onDetail(inv.id)} onAction={showToast} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No documents found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Documents will appear here when you make transactions.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InvoiceCard({ inv, onPress, onAction }: { inv: Invoice; onPress: () => void; onAction: (msg: string) => void }) {
  const TYPE_ICONS = { receipt: '🧾', invoice: '📃', withdrawal: '📤' }
  const STATUS_COLORS = { paid: '#1abc9c', pending: '#f39c12', overdue: '#e74c3c' }
  const color = STATUS_COLORS[inv.status]
  const remaining = inv.amountPaid !== undefined ? inv.amount - inv.amountPaid : null
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${inv.status === 'overdue' ? 'rgba(231,76,60,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '14px 16px' }}>
      <div onClick={onPress} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{TYPE_ICONS[inv.type]}</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{inv.description}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 2px' }}>{inv.counterparty}</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{inv.invoiceNumber} · {formatDate(inv.date)}</p>
          {inv.status === 'overdue' && inv.dueDate && <p style={{ color: '#e74c3c', fontSize: 11, margin: '4px 0 0', fontWeight: 700 }}>⚠ Overdue since {inv.dueDate}</p>}
          {remaining !== null && remaining > 0 && inv.status !== 'overdue' && <p style={{ color: '#f39c12', fontSize: 11, margin: '4px 0 0' }}>{formatKES(inv.amountPaid!)} paid · {formatKES(remaining)} remaining</p>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>{formatKES(inv.amount)}</p>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${color}15`, color, border: `1px solid ${color}25`, fontWeight: 700 }}>{inv.status}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onAction('Downloaded PDF')} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>📥 Download</button>
        <button onClick={() => onAction(`Emailed to ${inv.counterparty}`)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>📧 Email</button>
        <button onClick={() => onAction('Share link copied')} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>🔗 Share</button>
      </div>
    </div>
  )
}

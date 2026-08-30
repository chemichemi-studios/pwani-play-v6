import { useState } from 'react'
import { QUOTES, QUOTE_STATUS_META, formatKES, formatDate, type Quote } from './data'

type Props = { onBack: () => void }

export default function QuoteCenter({ onBack }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>(QUOTES)
  const [selected, setSelected] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const quote = quotes.find(q => q.id === selected)

  const accept = (id: string) => { setQuotes(p => p.map(q => q.id === id ? { ...q, status: 'accepted' } : q)); showToast('Quote accepted') }
  const decline = (id: string) => { setQuotes(p => p.map(q => q.id === id ? { ...q, status: 'declined' } : q)); showToast('Quote declined') }
  const convert = (id: string, num: string) => { setQuotes(p => p.map(q => q.id === id ? { ...q, status: 'converted' } : q)); showToast(`Converted to invoice — INV-2026-0${150 + Math.floor(Math.random() * 40)}`) }

  if (quote) {
    const meta = QUOTE_STATUS_META[quote.status]
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <Header title="Quote" onBack={() => setSelected(null)} />
        {toast && <Toast text={toast} />}
        <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
          <div style={{ background: `${meta.color}0d`, border: `1px solid ${meta.color}30`, borderRadius: 18, padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', margin: '0 0 6px' }}>{quote.quoteNumber}</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: '0 0 4px', lineHeight: 1.3 }}>{quote.description}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 10px' }}>For {quote.counterparty}</p>
            <p style={{ color: 'white', fontSize: 30, fontFamily: 'DM Serif Display, serif', margin: '0 0 10px' }}>{formatKES(quote.amount)}</p>
            <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Line Items</p>
            {quote.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < quote.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{item.label}</span>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{formatKES(item.amount)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 4 }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>Total</span>
              <span style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(quote.amount)}</span>
            </div>
          </div>

          {quote.notes && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 16 }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Notes</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>{quote.notes}</p>
            </div>
          )}

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 20px', textAlign: 'center' }}>
            {quote.status === 'converted' ? 'This quote has been converted — find the invoice under Invoices & Receipts.' : `Valid until ${quote.expiryDate}`}
          </p>

          {quote.status === 'sent' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => decline(quote.id)} style={{ flex: 1, padding: 14, borderRadius: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Decline</button>
              <button onClick={() => accept(quote.id)} style={{ flex: 1, padding: 14, borderRadius: 13, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Accept Quote</button>
            </div>
          )}
          {quote.status === 'accepted' && (
            <button onClick={() => convert(quote.id, quote.quoteNumber)} style={{ width: '100%', padding: 14, borderRadius: 13, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Convert to Invoice →</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Quotes" badge={`${quotes.length}`} onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, margin: '0 0 18px', lineHeight: 1.6 }}>
          Quotes sent to prospective clients. Accept a quote, then convert it into a real invoice once the work is agreed.
        </p>
        {quotes.map(q => {
          const meta = QUOTE_STATUS_META[q.status]
          return (
            <div key={q.id} onClick={() => setSelected(q.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <p style={{ color: 'white', fontSize: 13.5, fontWeight: 700, margin: '0 0 2px', flex: 1 }}>{q.description}</p>
                <span style={{ color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{formatKES(q.amount)}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 8px' }}>{q.counterparty} · {q.quoteNumber}</p>
              <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
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

function Toast({ text }: { text: string }) {
  return <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{text}</div>
}

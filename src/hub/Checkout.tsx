import { useState } from 'react'
import { SERVICES, ORDER_STATUS_META, type HubService, type HubOrder } from './data'

export type CartLine = { svcId: string; qty: number }

const PLATFORM_FEE_RATE = 0.05
const VAT_RATE = 0.16

function lineTotal(svc: HubService, qty: number) {
  const unit = Number(svc.price.replace(/[^0-9]/g, '')) || 0
  return unit * qty
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export function CartScreen({ cart, orders, onQtyChange, onRemove, onBack, onCheckout }: {
  cart: CartLine[]
  orders: HubOrder[]
  onQtyChange: (svcId: string, qty: number) => void
  onRemove: (svcId: string) => void
  onBack: () => void
  onCheckout: () => void
}) {
  const lines = cart.map(c => ({ ...c, svc: SERVICES.find(s => s.id === c.svcId)! })).filter(l => l.svc)
  const subtotal = lines.reduce((s, l) => s + lineTotal(l.svc, l.qty), 0)
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE)
  const vat = Math.round((subtotal + platformFee) * VAT_RATE)
  const total = subtotal + platformFee + vat

  const alreadyOwned = (svcId: string) => {
    const svc = SERVICES.find(s => s.id === svcId)
    return svc ? orders.some(o => o.type === 'buyer' && o.counterparty === svc.provider && (o.status === 'active' || o.status === 'pending')) : false
  }

  return (
    <FullScreen title="Cart" badge={`${lines.length}`} onBack={onBack}>
      <div style={{ padding: '0 20px' }}>
        {lines.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🛒</div>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>Your cart is empty</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Add equipment, locations, or services from the Marketplace.</p>
          </div>
        )}
        {lines.map(({ svc, qty }) => {
          const owned = alreadyOwned(svc.id)
          return (
            <div key={svc.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <img src={svc.image} alt={svc.title} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 8px' }}>{svc.provider} · {svc.price}{svc.priceUnit}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => onQtyChange(svc.id, Math.max(1, qty - 1))} style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14 }}>−</button>
                      <span style={{ color: 'white', fontSize: 12.5, minWidth: 14, textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => onQtyChange(svc.id, qty + 1)} style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14 }}>+</button>
                    </div>
                    <span style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>KES {lineTotal(svc, qty).toLocaleString()}</span>
                  </div>
                  {owned && (
                    <p style={{ color: '#f39c12', fontSize: 11, margin: '8px 0 0', background: 'rgba(243,156,18,0.08)', padding: '6px 9px', borderRadius: 8 }}>⚠ You already have an active order with {svc.provider} — check My Work before booking again.</p>
                  )}
                  <button onClick={() => onRemove(svc.id)} style={{ marginTop: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: 0 }}>Remove</button>
                </div>
              </div>
            </div>
          )
        })}

        {lines.length > 0 && (
          <>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, margin: '16px 0 20px' }}>
              <PriceRow label="Subtotal" value={subtotal} />
              <PriceRow label="Platform Fee (5%)" value={platformFee} />
              <PriceRow label="VAT (16%)" value={vat} />
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>Total Payable</span>
                <span style={{ color: '#1abc9c', fontSize: 15, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>KES {total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={onCheckout} style={{ width: '100%', padding: 15, borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Proceed to Checkout →</button>
          </>
        )}
      </div>
    </FullScreen>
  )
}

// ─── Checkout ───────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: '📱', detail: '···6721' },
  { id: 'card', label: 'Card', icon: '💳', detail: 'Visa ···4242' },
  { id: 'wallet', label: 'Pwani Wallet Balance', icon: '👛', detail: 'KES 47,850 available' },
]

export function CheckoutScreen({ cart, onBack, onConfirm }: { cart: CartLine[]; onBack: () => void; onConfirm: () => void }) {
  const [method, setMethod] = useState('mpesa')
  const [processing, setProcessing] = useState(false)
  const lines = cart.map(c => ({ ...c, svc: SERVICES.find(s => s.id === c.svcId)! })).filter(l => l.svc)
  const subtotal = lines.reduce((s, l) => s + lineTotal(l.svc, l.qty), 0)
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE)
  const vat = Math.round((subtotal + platformFee) * VAT_RATE)
  const total = subtotal + platformFee + vat

  const pay = () => {
    setProcessing(true)
    setTimeout(onConfirm, 1400)
  }

  if (processing) {
    return (
      <FullScreen title="Processing" onBack={() => {}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 32px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(93,173,226,0.2)', borderTopColor: '#5dade2', animation: 'spin 0.9s linear infinite', marginBottom: 20 }} />
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>Confirming payment via {PAYMENT_METHODS.find(m => m.id === method)?.label}…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </FullScreen>
    )
  }

  return (
    <FullScreen title="Checkout" onBack={onBack}>
      <div style={{ padding: '0 20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>{lines.length} item{lines.length !== 1 ? 's' : ''}</p>
        {lines.map(({ svc, qty }) => (
          <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5 }}>{svc.title} {qty > 1 ? `× ${qty}` : ''}</span>
            <span style={{ color: 'white', fontSize: 12.5, fontFamily: 'DM Mono, monospace' }}>KES {lineTotal(svc, qty).toLocaleString()}</span>
          </div>
        ))}

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, margin: '16px 0 20px' }}>
          <PriceRow label="Subtotal" value={subtotal} />
          <PriceRow label="Platform Fee (5%)" value={platformFee} />
          <PriceRow label="VAT (16%)" value={vat} />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>Total Payable</span>
            <span style={{ color: '#1abc9c', fontSize: 15, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>KES {total.toLocaleString()}</span>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Pay With</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 14, background: method === m.id ? 'rgba(93,173,226,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${method === m.id ? 'rgba(93,173,226,0.3)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>{m.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{m.detail}</p>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === m.id ? '#5dade2' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {method === m.id && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#5dade2' }} />}
              </div>
            </button>
          ))}
        </div>

        <button onClick={pay} style={{ width: '100%', padding: 15, borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Confirm & Pay KES {total.toLocaleString()}</button>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10.5, textAlign: 'center', margin: '10px 0 0' }}>Fees shown are final — nothing is added after this screen.</p>
      </div>
    </FullScreen>
  )
}

// ─── Confirmation ───────────────────────────────────────────────────────────

export function OrderConfirmationScreen({ createdOrders, onViewOrders, onDone }: { createdOrders: HubOrder[]; onViewOrders: () => void; onDone: () => void }) {
  return (
    <FullScreen title="Order Confirmed" onBack={onDone}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px 24px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '2px solid rgba(26,188,156,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, marginBottom: 18 }}>✓</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: '0 0 8px' }}>Payment Successful</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 }}>Your order{createdOrders.length > 1 ? 's have' : ' has'} been created. Providers have been notified.</p>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        {createdOrders.map(o => {
          const meta = ORDER_STATUS_META[o.status]
          return (
            <div key={o.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{o.title}</span>
                <span style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>KES {o.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>Order #{o.id}</span>
                <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
              </div>
            </div>
          )
        })}
        <button onClick={onViewOrders} style={{ width: '100%', padding: 14, borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>View in My Work →</button>
      </div>
    </FullScreen>
  )
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontFamily: 'DM Mono, monospace' }}>KES {value.toLocaleString()}</span>
    </div>
  )
}

// Minimal local copy of HubShell's FullScreen wrapper (kept identical in style)
function FullScreen({ title, badge, onBack, children }: { title: string; badge?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
        {badge && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(93,173,226,0.12)', color: '#5dade2', fontWeight: 700, border: '1px solid rgba(93,173,226,0.2)' }}>{badge}</span>}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 68 }}>{children}</div>
    </div>
  )
}

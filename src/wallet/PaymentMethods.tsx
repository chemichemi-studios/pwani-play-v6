import { useState } from 'react'
import { PAYMENT_METHODS } from './data'
import type { PaymentMethod } from './data'

type Props = { onAdd: () => void; onBack?: () => void }

export default function PaymentMethods({ onAdd }: Props) {
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS)
  const [removing, setRemoving] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const setDefault = (id: string) => setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })))
  const remove = (id: string) => {
    setRemoving(id)
    setTimeout(() => { setMethods(prev => prev.filter(m => m.id !== id)); setRemoving(null) }, 600)
  }
  const verify = (id: string, label: string) => {
    showToast(`Verification code sent for ${label}`)
    setTimeout(() => {
      setMethods(prev => prev.map(m => m.id === id ? { ...m, verified: true } : m))
      showToast(`${label} verified`)
    }, 1400)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Payment Methods</h2>
          <button onClick={onAdd} style={{ padding: '8px 16px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Add</button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Manage your linked accounts</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {methods.map(m => (
            <div key={m.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${m.isDefault ? 'rgba(41,128,185,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '14px 16px', opacity: removing === m.id ? 0.3 : 1, transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: m.isDefault ? 10 : 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{m.label}</p>
                    {m.isDefault && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.25)', fontWeight: 700 }}>Default</span>}
                    {!m.verified && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(243,156,18,0.12)', color: '#f8c471', border: '1px solid rgba(243,156,18,0.2)', fontWeight: 700 }}>Unverified</span>}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0, fontFamily: 'DM Mono, monospace' }}>{m.detail}</p>
                  {m.expiresAt && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>Expires {m.expiresAt}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!m.isDefault && <button onClick={() => setDefault(m.id)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Set Default</button>}
                {!m.verified && <button onClick={() => verify(m.id, m.label)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.15)', color: '#1abc9c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Verify</button>}
                {!m.isDefault && <button onClick={() => remove(m.id)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.12)', color: '#e74c3c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Remove</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Add new prompt */}
        <div onClick={onAdd} style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>➕</span>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>Add Payment Method</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: 0 }}>M-Pesa, Airtel, Card, Bank Account</p>
        </div>

        {/* Security note */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 0', marginTop: 16 }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>Your payment details are encrypted and stored securely. Pwani never stores your full card number.</p>
        </div>
      </div>
    </div>
  )
}

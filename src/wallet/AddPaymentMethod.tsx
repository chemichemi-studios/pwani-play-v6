import { useState } from 'react'

type Props = { onBack: () => void; onAdded: () => void }

type MethodType = 'mpesa' | 'card' | 'bank' | 'airtel'

const METHOD_TYPES: { key: MethodType; label: string; icon: string; desc: string }[] = [
  { key: 'mpesa', label: 'M-Pesa', icon: '💚', desc: 'Link your Safaricom M-Pesa account' },
  { key: 'airtel', label: 'Airtel Money', icon: '🔴', desc: 'Link your Airtel Money account' },
  { key: 'card', label: 'Debit / Credit Card', icon: '💳', desc: 'Visa or Mastercard' },
  { key: 'bank', label: 'Bank Account', icon: '🏦', desc: 'Direct bank account (EFT/RTGS)' },
]

export default function AddPaymentMethod({ onBack, onAdded }: Props) {
  const [type, setType] = useState<MethodType>('mpesa')
  const [phone, setPhone] = useState('+254 ')
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAcc, setBankAcc] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const save = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setDone(true) }, 1200)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(26,188,156,0.15)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>✅</div>
        <p style={{ color: '#1abc9c', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Method Linked!</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 24px', textAlign: 'center' }}>Your {METHOD_TYPES.find(m => m.key === type)?.label} has been added successfully.</p>
        <button className="btn-primary" onClick={onAdded} style={{ width: '100%', maxWidth: 280 }}>Back to Payment Methods</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Add Payment Method</h2>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Select Type</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {METHOD_TYPES.map(m => (
            <button key={m.key} onClick={() => setType(m.key)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', background: type === m.key ? 'rgba(41,128,185,0.1)' : 'rgba(255,255,255,0.04)', border: `2px solid ${type === m.key ? '#2980b9' : 'rgba(255,255,255,0.07)'}` }}>
              <span style={{ fontSize: 24 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{m.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.desc}</p>
              </div>
              {type === m.key && <span style={{ color: '#2980b9', fontSize: 18 }}>✓</span>}
            </button>
          ))}
        </div>

        {/* Mobile money */}
        {(type === 'mpesa' || type === 'airtel') && (
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Phone Number</label>
            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" style={{ marginBottom: 8, fontFamily: 'DM Mono, monospace' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 20px' }}>An OTP will be sent to verify your number.</p>
          </div>
        )}

        {/* Card */}
        {type === 'card' && (
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Card Number</label>
            <input className="input-field" value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="0000 0000 0000 0000" style={{ marginBottom: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }} />
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Cardholder Name</label>
            <input className="input-field" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="AMARA OSEI-WUSU" style={{ marginBottom: 12, textTransform: 'uppercase' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Expiry</label>
                <input className="input-field" value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" style={{ marginBottom: 0, fontFamily: 'DM Mono, monospace' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>CVV</label>
                <input className="input-field" value={cardCVV} onChange={e => setCardCVV(e.target.value)} placeholder="•••" style={{ marginBottom: 0, fontFamily: 'DM Mono, monospace' }} type="password" maxLength={4} />
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '10px 0 20px', lineHeight: 1.4 }}>🔒 Your card details are encrypted with 256-bit SSL and never stored in full.</p>
          </div>
        )}

        {/* Bank */}
        {type === 'bank' && (
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Bank Name</label>
            <input className="input-field" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Equity Bank Kenya" style={{ marginBottom: 12 }} />
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Account Number</label>
            <input className="input-field" value={bankAcc} onChange={e => setBankAcc(e.target.value)} placeholder="e.g. 0123456789" style={{ marginBottom: 8, fontFamily: 'DM Mono, monospace' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 20px' }}>Bank accounts are verified via a micro-deposit (KES 1) within 1–2 business days.</p>
          </div>
        )}

        <button className="btn-primary" onClick={save} disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Linking…' : 'Link Payment Method'}
        </button>
      </div>
    </div>
  )
}

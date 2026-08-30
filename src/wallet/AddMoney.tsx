import { useState } from 'react'
import { WALLET_BALANCE, formatKES } from './data'

type Props = { onBack: () => void; onSuccess: () => void }

type Method = 'mpesa' | 'card' | 'bank' | 'voucher'

const METHODS: { key: Method; label: string; icon: string; desc: string; fee: string; time: string }[] = [
  { key: 'mpesa', label: 'M-Pesa', icon: '💚', desc: 'Pay via M-Pesa STK Push', fee: 'Free', time: 'Instant' },
  { key: 'card', label: 'Debit / Credit Card', icon: '💳', desc: 'Visa, Mastercard', fee: '1.5%', time: '~2 min' },
  { key: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'RTGS / EFT bank transfer', fee: 'KES 50', time: '1–2 business days' },
  { key: 'voucher', label: 'Voucher / Promo Code', icon: '🎟', desc: 'Enter a code to add credit', fee: 'Free', time: 'Instant' },
]

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

export default function AddMoney({ onBack, onSuccess }: Props) {
  const [method, setMethod] = useState<Method>('mpesa')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('+254 ')
  const [voucher, setVoucher] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input')
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const numAmount = parseFloat(amount.replace(/,/g, '')) || 0
  const selectedMethod = METHODS.find(m => m.key === method)!
  const fee = method === 'card' ? Math.round(numAmount * 0.015) : method === 'bank' ? 50 : 0
  const total = numAmount + fee

  const confirm = () => {
    if (numAmount < 10) return
    setStep('confirm')
  }

  const process = () => {
    setStep('processing')
    setTimeout(() => setStep('success'), 2000)
  }

  if (step === 'processing') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(41,128,185,0.15)', border: '3px solid #2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, animation: 'spin 1s linear infinite' }}>💚</div>
        <p style={{ color: 'white', fontSize: 20, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Processing…</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0, textAlign: 'center' }}>Waiting for M-Pesa confirmation on your phone.</p>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.15)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, animation: 'fadeIn 0.5s ease' }}>✅</div>
        <p style={{ color: '#1abc9c', fontSize: 28, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Money Added!</p>
        <p style={{ color: 'white', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{formatKES(numAmount)}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px', textAlign: 'center' }}>Your Pwani Wallet balance has been updated.</p>
        <button className="btn-primary" onClick={onSuccess} style={{ width: '100%', maxWidth: 280 }}>Back to Wallet</button>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>New balance: {formatKES(WALLET_BALANCE.available + numAmount)}</p>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setStep('input')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Confirm Payment</h2>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px 20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Amount', value: formatKES(numAmount) },
              { label: 'Method', value: `${selectedMethod.icon} ${selectedMethod.label}` },
              ...(fee > 0 ? [{ label: 'Fee', value: formatKES(fee) }] : []),
              { label: 'Total Charged', value: formatKES(total) },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{row.label}</span>
                <span style={{ color: 'white', fontSize: 14, fontWeight: row.label === 'Total Charged' ? 700 : 400 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 14, padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ color: '#5dade2', fontSize: 12, margin: 0, lineHeight: 1.5 }}>⏱ {selectedMethod.time} · {fee === 0 ? 'No fees apply' : `Fee: ${selectedMethod.fee}`}</p>
          </div>
          <button className="btn-primary" onClick={process} style={{ width: '100%', marginBottom: 10 }}>
            {method === 'mpesa' ? '📲 Send M-Pesa Request' : 'Confirm Payment'}
          </button>
          <button onClick={() => setStep('input')} style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer' }}>Edit Amount</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Add Money</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Current balance: {formatKES(WALLET_BALANCE.available)}</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* Amount input */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Amount (KES)</p>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: 16, fontFamily: 'DM Mono, monospace' }}>KES</span>
          <input
            className="input-field"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            style={{ paddingLeft: 52, fontSize: 20, fontFamily: 'DM Mono, monospace', marginBottom: 0 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {QUICK_AMOUNTS.map(a => (
            <button key={a} onClick={() => setAmount(String(a))} style={{ flex: 1, padding: '8px', borderRadius: 10, background: amount === String(a) ? '#1e6091' : 'rgba(255,255,255,0.06)', border: 'none', color: amount === String(a) ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>
              {a.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Payment method */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Payment Method</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {METHODS.map(m => (
            <button key={m.key} onClick={() => setMethod(m.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', background: method === m.key ? 'rgba(41,128,185,0.1)' : 'rgba(255,255,255,0.04)', border: `2px solid ${method === m.key ? '#2980b9' : 'rgba(255,255,255,0.07)'}` }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{m.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.desc}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: m.fee === 'Free' ? '#1abc9c' : '#f8c471', fontSize: 12, fontWeight: 700, margin: '0 0 1px' }}>{m.fee}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>{m.time}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Phone input for M-Pesa */}
        {method === 'mpesa' && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>M-Pesa Phone Number</label>
            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" />
          </div>
        )}

        {/* Voucher input */}
        {method === 'voucher' && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Voucher / Promo Code</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input-field" value={voucher} onChange={e => setVoucher(e.target.value)} placeholder="PWANI-XXXXXX" style={{ flex: 1, marginBottom: 0, fontFamily: 'DM Mono, monospace' }} />
              <button onClick={() => { if (voucher.trim().length >= 4) { setVoucherApplied(true); showToast('Voucher applied!') } else showToast('Enter a valid voucher code') }} style={{ padding: '0 18px', borderRadius: 12, background: voucherApplied ? 'rgba(26,188,156,0.15)' : '#1e6091', border: voucherApplied ? '1px solid rgba(26,188,156,0.3)' : 'none', color: voucherApplied ? '#1abc9c' : 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13, flexShrink: 0 }}>{voucherApplied ? '✓ Applied' : 'Apply'}</button>
            </div>
          </div>
        )}

        <button className="btn-primary" onClick={confirm} disabled={numAmount < 10} style={{ width: '100%' }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { WALLET_BALANCE, PAYMENT_METHODS, formatKES } from './data'

type Props = { onBack: () => void; onSuccess: () => void }

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000]

export default function Withdraw({ onBack, onSuccess }: Props) {
  const [amount, setAmount] = useState('')
  const [methodId, setMethodId] = useState(PAYMENT_METHODS[0].id)
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input')
  const [pin, setPin] = useState('')

  const numAmount = parseFloat(amount) || 0
  const fee = Math.round(numAmount * 0.025)
  const netAmount = numAmount - fee
  const selectedMethod = PAYMENT_METHODS.find(p => p.id === methodId)!
  const canWithdraw = numAmount >= 100 && numAmount <= WALLET_BALANCE.available

  const confirm = () => { if (canWithdraw) setStep('confirm') }
  const processWithPin = () => {
    if (pin.length < 4) return
    setStep('processing')
    setTimeout(() => setStep('success'), 2000)
  }

  if (step === 'processing') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(41,128,185,0.12)', border: '3px solid #2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>📤</div>
        <p style={{ color: 'white', fontSize: 20, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Processing Withdrawal…</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0, textAlign: 'center' }}>Sending funds to {selectedMethod.label}. This usually takes a moment.</p>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.15)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>✅</div>
        <p style={{ color: '#1abc9c', fontSize: 28, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Withdrawal Sent!</p>
        <p style={{ color: 'white', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{formatKES(netAmount)}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 8px', textAlign: 'center' }}>Funds sent to {selectedMethod.detail}.</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 20px', marginBottom: 24, width: '100%', maxWidth: 280 }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '0 0 3px', textAlign: 'center' }}>Remaining balance</p>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: 0, textAlign: 'center', fontFamily: 'DM Mono, monospace' }}>{formatKES(WALLET_BALANCE.available - numAmount)}</p>
        </div>
        <button className="btn-primary" onClick={onSuccess} style={{ width: '100%', maxWidth: 280 }}>Back to Wallet</button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setStep('input')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Confirm Withdrawal</h2>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px 20px 40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Withdrawal amount', value: formatKES(numAmount) },
              { label: 'Processing fee (2.5%)', value: `-${formatKES(fee)}` },
              { label: 'You receive', value: formatKES(netAmount) },
              { label: 'Destination', value: `${selectedMethod.icon} ${selectedMethod.label} ${selectedMethod.detail}` },
              { label: 'Estimated arrival', value: '~10 minutes (M-Pesa)' },
              { label: 'Daily limit remaining', value: formatKES(50000 - numAmount) },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{row.label}</span>
                <span style={{ color: row.label === 'You receive' ? '#1abc9c' : 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: row.label === 'You receive' ? 700 : 400, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* PIN entry */}
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Enter Wallet PIN to confirm</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `2px solid ${i < pin.length ? '#2980b9' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {i < pin.length ? '●' : ''}
              </div>
            ))}
          </div>
          {/* PIN keypad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, maxWidth: 280, margin: '0 auto 24px' }}>
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(k => (
              <button key={k} onClick={() => {
                if (!k) return
                if (k === '⌫') setPin(p => p.slice(0, -1))
                else if (pin.length < 4) setPin(p => p + k)
              }} style={{ padding: '14px', borderRadius: 14, background: k === '⌫' ? 'rgba(231,76,60,0.1)' : 'rgba(255,255,255,0.06)', border: 'none', color: k === '⌫' ? '#e74c3c' : 'white', fontSize: 18, fontWeight: 700, cursor: k ? 'pointer' : 'default', fontFamily: 'DM Mono, monospace' }}>
                {k}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={processWithPin} disabled={pin.length < 4} style={{ width: '100%' }}>
            Confirm Withdrawal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Withdraw Funds</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Available: {formatKES(WALLET_BALANCE.available)}</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* Limits info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[{ label: 'Daily Limit', value: 'KES 50,000', icon: '📅' }, { label: 'Monthly Limit', value: 'KES 500,000', icon: '📆' }].map(l => (
            <div key={l.label} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>{l.icon}</span>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: '0 0 1px' }}>{l.label}</p>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{l.value}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Amount (KES)</p>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'DM Mono, monospace' }}>KES</span>
          <input className="input-field" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ paddingLeft: 52, fontSize: 20, fontFamily: 'DM Mono, monospace', marginBottom: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {QUICK_AMOUNTS.map(a => (
            <button key={a} onClick={() => setAmount(String(a))} style={{ flex: 1, padding: '8px', borderRadius: 10, background: amount === String(a) ? '#1e6091' : 'rgba(255,255,255,0.06)', border: 'none', color: amount === String(a) ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{(a / 1000).toFixed(0)}K</button>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Destination</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {PAYMENT_METHODS.map(pm => (
            <button key={pm.id} onClick={() => setMethodId(pm.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', background: methodId === pm.id ? 'rgba(41,128,185,0.1)' : 'rgba(255,255,255,0.04)', border: `2px solid ${methodId === pm.id ? '#2980b9' : 'rgba(255,255,255,0.07)'}` }}>
              <span style={{ fontSize: 24 }}>{pm.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{pm.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>{pm.detail}</p>
              </div>
              {pm.isDefault && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(26,188,156,0.12)', color: '#1abc9c', border: '1px solid rgba(26,188,156,0.2)', fontWeight: 700 }}>Default</span>}
              {methodId === pm.id && <span style={{ color: '#2980b9', fontSize: 18 }}>✓</span>}
            </button>
          ))}
        </div>

        {numAmount > 0 && (
          <div style={{ background: 'rgba(41,128,185,0.06)', border: '1px solid rgba(41,128,185,0.12)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ color: '#5dade2', fontSize: 13, margin: '0 0 4px', fontWeight: 700 }}>Fee breakdown</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>Processing fee 2.5% = {formatKES(fee)} · You receive {formatKES(netAmount)}</p>
          </div>
        )}

        {numAmount > WALLET_BALANCE.available && (
          <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ color: '#e74c3c', fontSize: 13, margin: 0 }}>⚠️ Amount exceeds your available balance ({formatKES(WALLET_BALANCE.available)})</p>
          </div>
        )}

        <button className="btn-primary" onClick={confirm} disabled={!canWithdraw} style={{ width: '100%' }}>Continue →</button>
      </div>
    </div>
  )
}

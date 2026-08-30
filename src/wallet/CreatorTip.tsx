import { useState } from 'react'
import { formatKES } from './data'

type Props = { onBack: () => void; onSuccess: () => void }

const TIP_AMOUNTS = [50, 100, 250, 500, 1000]

const FEATURED_CREATOR = {
  name: 'Kofi Mensah',
  username: '@kofi.mensah',
  avatar: '🎥',
  role: 'Award-Winning Cinematographer',
  verified: true,
  followers: '12.4K',
  latestProject: 'Nairobi Nights — Director of Photography',
  coverColor: '#1e3a5f',
}

export default function CreatorTip({ onBack, onSuccess }: Props) {
  const [amount, setAmount] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [shared, setShared] = useState(false)
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')

  const finalAmount = amount ?? (parseFloat(custom) || 0)

  const confirm = () => { if (finalAmount >= 10) setStep('confirm') }

  const send = () => {
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(241,196,15,0.15)', border: '3px solid #f1c40f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>💛</div>
        <p style={{ color: '#f8c471', fontSize: 28, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Tip Sent!</p>
        <p style={{ color: 'white', fontSize: 22, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{formatKES(finalAmount)}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 8px', textAlign: 'center' }}>
          {anonymous ? 'Sent anonymously to' : 'Your tip was sent to'} {FEATURED_CREATOR.name} ❤️
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button onClick={() => setShared(true)} style={{ padding: '10px 18px', borderRadius: 12, background: shared ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.06)', border: shared ? '1px solid rgba(26,188,156,0.25)' : 'none', color: shared ? '#1abc9c' : 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>{shared ? '✓ Link Copied' : '📤 Share Support'}</button>
        </div>
        <button className="btn-primary" onClick={onSuccess} style={{ width: '100%', maxWidth: 280 }}>Back to Wallet</button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setStep('input')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Confirm Tip</h2>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px 20px 40px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{FEATURED_CREATOR.avatar}</div>
            <div>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{FEATURED_CREATOR.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{FEATURED_CREATOR.role}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Tip amount', value: formatKES(finalAmount) },
              { label: 'Fee', value: 'Free' },
              { label: 'From', value: anonymous ? 'Anonymous' : 'Amara Osei-Wusu' },
              ...(message ? [{ label: 'Message', value: message }] : []),
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.label}</span>
                <span style={{ color: r.label === 'Fee' ? '#1abc9c' : 'rgba(255,255,255,0.85)', fontSize: 13 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={send} style={{ width: '100%' }}>💛 Send Tip</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Tip a Creator</h2>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* Creator card */}
        <div style={{ background: `linear-gradient(135deg, ${FEATURED_CREATOR.coverColor}, #0a1628)`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 20, marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{FEATURED_CREATOR.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <p style={{ color: 'white', fontSize: 17, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{FEATURED_CREATOR.name}</p>
              {FEATURED_CREATOR.verified && <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.2)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.3)', fontWeight: 700 }}>✓</span>}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 2px' }}>{FEATURED_CREATOR.role}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>🎬 {FEATURED_CREATOR.latestProject}</p>
          </div>
        </div>

        {/* Tip amounts */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Choose Amount (KES)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
          {TIP_AMOUNTS.map(a => (
            <button key={a} onClick={() => { setAmount(a); setCustom('') }} style={{ padding: '14px 8px', borderRadius: 12, background: amount === a ? 'rgba(241,196,15,0.15)' : 'rgba(255,255,255,0.05)', border: `2px solid ${amount === a ? '#f1c40f' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', textAlign: 'center' }}>
              <p style={{ color: amount === a ? '#f8c471' : 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>KES {a}</p>
            </button>
          ))}
          <button onClick={() => setAmount(null)} style={{ padding: '14px 8px', borderRadius: 12, background: amount === null && custom ? 'rgba(241,196,15,0.15)' : 'rgba(255,255,255,0.05)', border: `2px solid ${amount === null && custom ? '#f1c40f' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700, margin: 0 }}>Custom</p>
          </button>
        </div>

        {amount === null && (
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>KES</span>
            <input className="input-field" type="number" value={custom} onChange={e => setCustom(e.target.value)} placeholder="Enter custom amount" style={{ paddingLeft: 48, marginBottom: 0 }} />
          </div>
        )}

        <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Message (Optional)</label>
        <input className="input-field" value={message} onChange={e => setMessage(e.target.value)} placeholder="Amazing work! Keep creating…" style={{ marginBottom: 16 }} />

        <div onClick={() => setAnonymous(!anonymous)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, cursor: 'pointer', marginBottom: 24 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${anonymous ? '#2980b9' : 'rgba(255,255,255,0.2)'}`, background: anonymous ? '#2980b9' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{anonymous && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}</div>
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 1px' }}>Send anonymously</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>Creator won't see your name</p>
          </div>
        </div>

        <button className="btn-primary" onClick={confirm} disabled={finalAmount < 10} style={{ width: '100%', background: 'linear-gradient(90deg,#ca6f1e,#f39c12)' }}>
          💛 Send {finalAmount >= 10 ? `${formatKES(finalAmount)} Tip` : 'Tip'}
        </button>
      </div>
    </div>
  )
}

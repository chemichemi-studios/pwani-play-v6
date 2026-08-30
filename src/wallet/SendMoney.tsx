import { useState } from 'react'
import { WALLET_BALANCE, formatKES } from './data'

type Props = { onBack: () => void; onSuccess: () => void }

type FindMethod = 'username' | 'passport' | 'phone'

const QUICK_AMOUNTS = [200, 500, 1000, 2000]

const RECENT_CONTACTS = [
  { name: 'Kofi Mensah', username: '@kofi.mensah', avatar: '🎥', verified: true },
  { name: 'Zara Mutua', username: '@zara.mutua', avatar: '🎬', verified: true },
  { name: 'Juma Kariuki', username: '@juma.kariuki', avatar: '🎵', verified: false },
  { name: 'Wanjiru Kamau', username: '@wanjiru.k', avatar: '🎙️', verified: true },
]

export default function SendMoney({ onBack, onSuccess }: Props) {
  const [findMethod, setFindMethod] = useState<FindMethod>('username')
  const [recipient, setRecipient] = useState('')
  const [selectedContact, setSelectedContact] = useState<typeof RECENT_CONTACTS[0] | null>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [step, setStep] = useState<'find' | 'amount' | 'confirm' | 'success'>('find')
  const [sending, setSending] = useState(false)

  const numAmount = parseFloat(amount) || 0

  const selectContact = (c: typeof RECENT_CONTACTS[0]) => {
    setSelectedContact(c)
    setRecipient(c.username)
    setStep('amount')
  }

  const confirmSend = () => {
    setSending(true)
    setTimeout(() => { setSending(false); setStep('success') }, 1500)
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.15)', border: '3px solid #1abc9c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>✅</div>
        <p style={{ color: '#1abc9c', fontSize: 28, fontFamily: 'DM Serif Display, serif', margin: 0 }}>Sent!</p>
        <p style={{ color: 'white', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{formatKES(numAmount)}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 24px', textAlign: 'center' }}>Successfully sent to {selectedContact?.name ?? recipient}.</p>
        <button className="btn-primary" onClick={onSuccess} style={{ width: '100%', maxWidth: 280 }}>Back to Wallet</button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setStep('amount')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Confirm Transfer</h2>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px 20px 40px' }}>
          {selectedContact && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{selectedContact.avatar}</div>
              <div>
                <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 2px' }}>{selectedContact.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0, fontFamily: 'DM Mono, monospace' }}>{selectedContact.username}</p>
              </div>
              {selectedContact.verified && <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.2)', fontWeight: 700 }}>✓ Verified</span>}
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Amount', value: formatKES(numAmount) },
              { label: 'Fee', value: 'Free (Pwani-to-Pwani)' },
              { label: 'Total', value: formatKES(numAmount) },
              ...(note ? [{ label: 'Note', value: note }] : []),
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.label}</span>
                <span style={{ color: r.label === 'Fee' ? '#1abc9c' : 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: r.label === 'Total' ? 700 : 400 }}>{r.value}</span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={confirmSend} disabled={sending} style={{ width: '100%', marginBottom: 10 }}>
            {sending ? 'Sending…' : `Send ${formatKES(numAmount)}`}
          </button>
          <button onClick={() => setStep('amount')} style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer' }}>Edit</button>
        </div>
      </div>
    )
  }

  if (step === 'amount') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setStep('find')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Send Money</h2>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px 20px 40px' }}>
          {selectedContact && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{selectedContact.avatar}</div>
              <div>
                <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{selectedContact.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{selectedContact.username}</p>
              </div>
            </div>
          )}

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Amount (KES)</p>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'DM Mono, monospace' }}>KES</span>
            <input className="input-field" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ paddingLeft: 52, fontSize: 20, fontFamily: 'DM Mono, monospace', marginBottom: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {QUICK_AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(String(a))} style={{ flex: 1, padding: '8px', borderRadius: 10, background: amount === String(a) ? '#1e6091' : 'rgba(255,255,255,0.06)', border: 'none', color: amount === String(a) ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{a}</button>
            ))}
          </div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Note (Optional)</label>
          <input className="input-field" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a message…" style={{ marginBottom: 24 }} />
          <button className="btn-primary" onClick={() => setStep('confirm')} disabled={numAmount < 10} style={{ width: '100%' }}>Review Transfer →</button>
        </div>
      </div>
    )
  }

  // Step: find recipient
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Send Money</h2>
        </div>
        <div style={{ display: 'flex', marginBottom: 0 }}>
          {(['username', 'passport', 'phone'] as const).map(m => (
            <button key={m} onClick={() => setFindMethod(m)} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', color: findMethod === m ? '#2980b9' : 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 700, fontFamily: 'Outfit, sans-serif', borderBottom: `2px solid ${findMethod === m ? '#2980b9' : 'transparent'}` }}>
              {{ username: 'Username', passport: 'Passport ID', phone: 'Phone' }[m]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        <input className="input-field" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder={{ username: '@username or name', passport: 'PP-KE-XXXX-XXXXXX', phone: '+254 700 000 000' }[findMethod]} style={{ marginBottom: 20, fontFamily: 'DM Mono, monospace' }} />

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recent Contacts</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECENT_CONTACTS.map(c => (
            <div key={c.username} onClick={() => selectContact(c)} style={{ display: 'flex', gap: 12, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, cursor: 'pointer', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{c.name}</p>
                  {c.verified && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', border: '1px solid rgba(41,128,185,0.2)', fontWeight: 700 }}>✓</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.username}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

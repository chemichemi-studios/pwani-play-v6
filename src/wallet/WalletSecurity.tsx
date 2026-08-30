import { useState } from 'react'

type Props = { onBack?: () => void }

const TRUSTED_DEVICES = [
  { id: 'd1', name: 'Pixel 8 Pro', location: 'Nairobi, Kenya', lastActive: 'Now · Current device', icon: '📱', current: true },
  { id: 'd2', name: 'iPad Air', location: 'Nairobi, Kenya', lastActive: '2 days ago', icon: '📱', current: false },
]

const LOGIN_HISTORY = [
  { time: 'Today 09:14', device: 'Pixel 8 Pro', location: 'Nairobi, KE', status: 'success' },
  { time: 'Yesterday 18:02', device: 'iPad Air', location: 'Nairobi, KE', status: 'success' },
  { time: '4 Aug 2026 12:30', device: 'Chrome Browser', location: 'Mombasa, KE', status: 'success' },
  { time: '3 Aug 2026 22:15', device: 'Unknown device', location: 'Lagos, NG', status: 'blocked' },
]

export default function WalletSecurity({ onBack }: Props) {
  const [biometrics, setBiometrics] = useState(true)
  const [twoFA, setTwoFA] = useState(false)
  const [alerts, setAlerts] = useState(true)
  const [pinSet, setPinSet] = useState(true)
  const [changingPin, setChangingPin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [devices, setDevices] = useState(TRUSTED_DEVICES)
  const [reportedLogins, setReportedLogins] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 46, height: 26, borderRadius: 100, background: value ? '#2980b9' : 'rgba(255,255,255,0.12)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Wallet Security</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Keep your funds safe</p>

        {/* Security score */}
        <div style={{ background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 16, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(26,188,156,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0 }}>Security Score: Strong</p>
              <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>82/100</p>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg,#1abc9c,#27ae60)', borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* PIN */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>PIN & Authentication</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
            <span style={{ fontSize: 22 }}>🔢</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>Wallet PIN</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{pinSet ? 'Set — 4-digit PIN active' : 'Not set'}</p>
            </div>
            <button onClick={() => setChangingPin(!changingPin)} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Change</button>
          </div>

          {changingPin && (
            <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 14, padding: '14px 16px', animation: 'slideUp 0.2s ease' }}>
              <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 12px' }}>Set New PIN</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: `2px solid ${i < newPin.length ? '#2980b9' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {i < newPin.length ? '●' : ''}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, maxWidth: 240, margin: '0 auto 12px' }}>
                {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(k => (
                  <button key={k} onClick={() => {
                    if (!k) return
                    if (k === '⌫') setNewPin(p => p.slice(0, -1))
                    else if (newPin.length < 4) setNewPin(p => p + k)
                  }} style={{ padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: k ? 'pointer' : 'default', fontFamily: 'DM Mono, monospace' }}>{k}</button>
                ))}
              </div>
              {newPin.length === 4 && <button className="btn-primary" onClick={() => { setPinSet(true); setChangingPin(false); setNewPin('') }} style={{ width: '100%' }}>Save New PIN</button>}
            </div>
          )}

          {[
            { icon: '👁', label: 'Face / Fingerprint ID', desc: 'Biometric authentication for transactions', value: biometrics, toggle: () => setBiometrics(!biometrics) },
            { icon: '📲', label: 'Two-Factor Authentication', desc: 'SMS code required for withdrawals', value: twoFA, toggle: () => setTwoFA(!twoFA) },
            { icon: '🔔', label: 'Security Alerts', desc: 'Notify me of suspicious activity', value: alerts, toggle: () => setAlerts(!alerts) },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{s.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{s.desc}</p>
              </div>
              <Toggle value={s.value} onToggle={s.toggle} />
            </div>
          ))}
        </div>

        {/* Trusted devices */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Trusted Devices</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {devices.map(d => (
            <div key={d.id} style={{ display: 'flex', gap: 12, padding: '13px 16px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${d.current ? 'rgba(41,128,185,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>{d.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{d.name}</p>
                  {d.current && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(26,188,156,0.15)', color: '#1abc9c', fontWeight: 700 }}>Current</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{d.lastActive} · {d.location}</p>
              </div>
              {!d.current && <button onClick={() => { setDevices(prev => prev.filter(x => x.id !== d.id)); showToast(`${d.name} removed`) }} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Remove</button>}
            </div>
          ))}
          {devices.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: '8px 0' }}>No other devices linked.</p>}
        </div>

        {/* Login history */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Recent Logins</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {LOGIN_HISTORY.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: l.status === 'blocked' ? 'rgba(231,76,60,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${l.status === 'blocked' ? 'rgba(231,76,60,0.15)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: l.status === 'blocked' ? '#e74c3c' : '#1abc9c' }}>{l.status === 'blocked' ? '⛔' : '✓'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: l.status === 'blocked' ? '#e74c3c' : 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600, margin: '0 0 1px' }}>{l.device} · {l.location}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{l.time}</p>
              </div>
              {l.status === 'blocked' && (
                reportedLogins.includes(l.time)
                  ? <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}>Reported</span>
                  : <button onClick={() => { setReportedLogins(p => [...p, l.time]); showToast('Reported to our security team') }} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Report</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

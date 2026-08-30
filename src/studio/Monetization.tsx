import { useState } from 'react'

type Props = { projectId: string; onBack: () => void }

type Model = 'free' | 'svod' | 'tvod' | 'avod' | 'ppv'

const MODELS: { key: Model; icon: string; name: string; desc: string; recommended?: boolean }[] = [
  { key: 'free', icon: '🎁', name: 'Free', desc: 'No paywall. Maximum reach.' },
  { key: 'avod', icon: '📺', name: 'Ad-Supported (AVOD)', desc: 'Free with ads. Earn from impressions.', recommended: true },
  { key: 'svod', icon: '🔐', name: 'Subscription (SVOD)', desc: 'Subscribers-only access via Pwani Play plans.' },
  { key: 'tvod', icon: '🎟', name: 'Transactional (TVOD)', desc: 'Pay-per-episode or rent-to-watch.' },
  { key: 'ppv', icon: '🏆', name: 'Pay-Per-View (PPV)', desc: 'Premium pricing for live events or premieres.' },
]

const CURRENCIES = ['KES', 'UGX', 'TZS', 'NGN', 'ZAR', 'USD']

export default function Monetization({ projectId: _projectId, onBack }: Props) {
  const [model, setModel] = useState<Model>('avod')
  const [price, setPrice] = useState('299')
  const [currency, setCurrency] = useState('KES')
  const [tipEnabled, setTipEnabled] = useState(true)
  const [brandDeals, setBrandDeals] = useState(false)
  const [nftEnabled, setNftEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  const save = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); onBack() }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 2px' }}>Monetization</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Configure revenue model</p>
          </div>
        </div>
      </div>

      {/* Revenue summary */}
      <div style={{ margin: '20px 20px 0', background: 'linear-gradient(135deg,rgba(243,156,18,0.15),rgba(202,111,30,0.08))', border: '1px solid rgba(243,156,18,0.25)', borderRadius: 16, padding: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 2px' }}>Estimated Monthly Earnings</p>
        <p style={{ color: '#f39c12', fontSize: 28, fontWeight: 700, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>KES 1,840</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>+22% vs last month · 4 active streams</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* Revenue model */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 12px', fontFamily: 'DM Mono, monospace' }}>REVENUE MODEL</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MODELS.map(m => (
              <button key={m.key} onClick={() => setModel(m.key)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${model === m.key ? '#f39c12' : 'rgba(255,255,255,0.08)'}`, background: model === m.key ? 'rgba(243,156,18,0.08)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', position: 'relative' }}>
                <span style={{ fontSize: 26 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: model === m.key ? '#f8c471' : 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{m.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.desc}</p>
                </div>
                {m.recommended && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(26,188,156,0.2)', border: '1px solid rgba(26,188,156,0.3)', color: '#1abc9c', fontWeight: 700, flexShrink: 0 }}>Recommended</span>}
                {model === m.key && <span style={{ fontSize: 16, color: '#f39c12', flexShrink: 0 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Price (for TVOD / PPV) */}
        {(model === 'tvod' || model === 'ppv') && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>PRICE PER EPISODE</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="input-field" style={{ width: 90, marginBottom: 0, flexShrink: 0 }}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input-field" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
            </div>
          </div>
        )}

        {/* Additional streams */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '0 0 12px', fontFamily: 'DM Mono, monospace' }}>ADDITIONAL REVENUE STREAMS</p>
          {[
            { icon: '🎁', label: 'Viewer Tips', sub: 'Allow fans to send tips during episodes', val: tipEnabled, set: setTipEnabled },
            { icon: '🤝', label: 'Brand Partnerships', sub: 'Accept brand deal requests', val: brandDeals, set: setBrandDeals },
            { icon: '🖼️', label: 'NFT Collectibles', sub: 'Mint scene collectibles (Pwani Web3)', val: nftEnabled, set: setNftEnabled, badge: 'Beta' },
          ].map(({ icon, label, sub, val, set, badge }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>{label}</p>
                  {badge && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(243,156,18,0.2)', border: '1px solid rgba(243,156,18,0.3)', color: '#f8c471', fontWeight: 700 }}>{badge}</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{sub}</p>
              </div>
              <div onClick={() => set(!val)} style={{ width: 48, height: 28, borderRadius: 14, background: val ? '#2980b9' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: val ? 22 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Revenue split info */}
        <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 14, padding: 16 }}>
          <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>ℹ️ Revenue Split</p>
          {[
            { label: 'Creator Share', val: '70%', color: '#1abc9c' },
            { label: 'Pwani Platform Fee', val: '20%', color: '#5dade2' },
            { label: 'Processing & Tax', val: '10%', color: 'rgba(255,255,255,0.4)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{s.label}</span>
              <span style={{ color: s.color, fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)' }}>
        <button className="btn-primary" onClick={save} disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Saving…' : '💰 Save Monetization Settings'}
        </button>
      </div>
    </div>
  )
}

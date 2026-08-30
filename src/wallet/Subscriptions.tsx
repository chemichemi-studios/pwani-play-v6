import { useState } from 'react'
import { SUBSCRIPTIONS, formatKES, formatDate } from './data'
import type { Subscription } from './data'

type Props = { onBack?: () => void; onMembershipTiers: () => void }

export default function Subscriptions({ onBack, onMembershipTiers }: Props) {
  const [subs, setSubs] = useState<Subscription[]>(SUBSCRIPTIONS)
  const [voucher, setVoucher] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2600) }

  const cancel = (id: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s))
    showToast('Subscription cancelled')
  }

  const totalMonthly = subs.filter(s => s.status === 'active').reduce((a, s) => a + s.amount, 0)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>{toast}</div>
      )}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Subscriptions</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 12px' }}>Manage your recurring payments</p>

        <button onClick={onMembershipTiers} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 13, background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.2)', cursor: 'pointer', marginBottom: 20 }}>
          <span style={{ fontSize: 16 }}>💎</span>
          <span style={{ color: '#1abc9c', fontSize: 12.5, fontWeight: 700, flex: 1, textAlign: 'left' }}>Manage your own Membership Tiers for fans</span>
          <span style={{ color: '#1abc9c', fontSize: 14 }}>›</span>
        </button>

        {/* Summary card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.15), rgba(26,188,156,0.08))', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 18, padding: '16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 4px' }}>Monthly recurring cost</p>
            <p style={{ color: 'white', fontSize: 26, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{formatKES(totalMonthly)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 4px' }}>Active plans</p>
            <p style={{ color: '#1abc9c', fontSize: 26, fontFamily: 'DM Serif Display, serif', margin: 0 }}>{subs.filter(s => s.status === 'active').length}</p>
          </div>
        </div>

        {/* Subscription list */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Active Subscriptions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {subs.map(sub => <SubCard key={sub.id} sub={sub} onCancel={() => cancel(sub.id)} onShowToast={showToast} />)}
        </div>

        {/* Voucher */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Apply Voucher Code</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input
            className="input-field"
            value={voucher}
            onChange={e => setVoucher(e.target.value.toUpperCase())}
            placeholder="e.g. PWANI50"
            style={{ flex: 1, margin: 0, fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}
          />
          <button
            onClick={() => { if (voucher.length >= 4) showToast('Voucher applied! 15% off next renewal'); else showToast('Invalid voucher code'); setVoucher('') }}
            style={{ padding: '0 18px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}
          >Apply</button>
        </div>

        {/* Billing history stub */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Billing History</p>
        {[
          { date: '2026-08-01', desc: 'Pwani Play Creator Pro', amount: 1299, status: 'paid' },
          { date: '2026-08-01', desc: 'Pwani Learn Creator Pro', amount: 1499, status: 'paid' },
          { date: '2026-07-01', desc: 'Pwani Play Creator Pro', amount: 1299, status: 'paid' },
          { date: '2026-07-01', desc: 'Pwani Learn Creator Pro', amount: 1499, status: 'paid' },
        ].map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 18 }}>🧾</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, margin: '0 0 1px' }}>{h.desc}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatDate(h.date)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{formatKES(h.amount)}</p>
              <span style={{ fontSize: 11, color: '#1abc9c', fontWeight: 700 }}>✓ {h.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubCard({ sub, onCancel, onShowToast }: { sub: Subscription; onCancel: () => void; onShowToast: (m: string) => void }) {
  const [expanded, setExpanded] = useState(false)

  const STATUS_COLORS = { active: '#1abc9c', cancelled: '#e74c3c', expired: 'rgba(255,255,255,0.3)' }
  const color = STATUS_COLORS[sub.status]

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', cursor: 'pointer' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{sub.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{sub.name}</p>
            <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: `${color}15`, color, border: `1px solid ${color}25`, fontWeight: 700 }}>{sub.status}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{sub.plan} · Renews {formatDate(sub.renewsAt)}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px', fontFamily: 'DM Mono, monospace' }}>{formatKES(sub.amount)}</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>/mo</p>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '12px 0 12px', fontFamily: 'DM Mono, monospace' }}>Payment via {sub.paymentMethod}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onShowToast('Plan upgraded!')} style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Upgrade</button>
            <button onClick={() => onShowToast('Plan changed!')} style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Change Plan</button>
            {sub.status === 'active' && <button onClick={onCancel} style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.12)', color: '#e74c3c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>}
          </div>
        </div>
      )}
    </div>
  )
}

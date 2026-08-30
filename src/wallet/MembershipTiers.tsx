import { useState } from 'react'
import { MEMBERSHIP_TIERS, MEMBERSHIP_INSIGHT, formatKES, type MembershipTier } from './data'

type Props = { onBack: () => void; onRoyalties: () => void }
type View = { id: 'list' } | { id: 'new-tier' }

const PERIODS = ['Monthly', 'Annual', 'Lifetime'] as const
const COLORS = ['#5dade2', '#1abc9c', '#f39c12', '#9b59b6', '#e74c3c']

export default function MembershipTiers({ onBack, onRoyalties }: Props) {
  const [tiers, setTiers] = useState<MembershipTier[]>(MEMBERSHIP_TIERS)
  const [view, setView] = useState<View>({ id: 'list' })
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const toggleActive = (id: string) => {
    setTiers(p => p.map(t => t.id === id ? { ...t, active: !t.active } : t))
    showToast('Tier updated')
  }

  const monthlyRevenue = tiers.filter(t => t.active && t.period === 'Monthly').reduce((s, t) => s + t.price * t.memberCount, 0)
  const totalMembers = tiers.reduce((s, t) => s + t.memberCount, 0)

  if (view.id === 'new-tier') {
    return (
      <NewTier
        onCancel={() => setView({ id: 'list' })}
        onCreate={(t) => { setTiers(p => [...p, t]); showToast('Tier created'); setView({ id: 'list' }) }}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Membership Tiers" onBack={onBack} />
      {toast && <Toast text={toast} />}
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
          What fans see when they subscribe to you directly, separate from what you pay for in Subscriptions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <StatBox label="Monthly Recurring" value={formatKES(monthlyRevenue)} color="#1abc9c" />
          <StatBox label="Total Members" value={String(totalMembers)} color="#5dade2" />
        </div>

        {/* AI Membership Assistant — non-automated insight, per spec */}
        <div style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.18)', borderRadius: 14, padding: 14, marginBottom: 18 }}>
          <p style={{ color: '#5dade2', fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>🤖 Membership Insight</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{MEMBERSHIP_INSIGHT}</p>
        </div>

        <button onClick={() => setView({ id: 'new-tier' })} style={{ width: '100%', padding: '11px', borderRadius: 13, background: 'rgba(26,188,156,0.08)', border: '1px dashed rgba(26,188,156,0.25)', color: '#1abc9c', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>+ Create New Tier</button>

        <button onClick={onRoyalties} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 13, background: 'rgba(142,68,173,0.08)', border: '1px solid rgba(142,68,173,0.2)', cursor: 'pointer', marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>©️</span>
          <span style={{ color: '#8e44ad', fontSize: 12.5, fontWeight: 700, flex: 1, textAlign: 'left' }}>Royalties & Licensing income</span>
          <span style={{ color: '#8e44ad', fontSize: 14 }}>›</span>
        </button>

        {tiers.map(t => (
          <div key={t.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${t.color}30`, borderRadius: 16, padding: 16, marginBottom: 10, opacity: t.active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <p style={{ color: t.color, fontSize: 15, fontWeight: 800, margin: '0 0 2px' }}>{t.name}</p>
                <p style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatKES(t.price)}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}> / {t.period === 'Monthly' ? 'mo' : t.period === 'Annual' ? 'yr' : 'once'}</span></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 2px' }}>Members</p>
                <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>{t.memberCount}</p>
              </div>
            </div>
            {t.benefits.map((b, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 4px' }}>✓ {b}</p>)}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{formatKES(t.price * t.memberCount)}/mo from this tier</span>
              <button onClick={() => toggleActive(t.id)} style={{ padding: '5px 12px', borderRadius: 9, background: t.active ? 'rgba(231,76,60,0.1)' : 'rgba(26,188,156,0.1)', border: `1px solid ${t.active ? 'rgba(231,76,60,0.25)' : 'rgba(26,188,156,0.25)'}`, color: t.active ? '#e74c3c' : '#1abc9c', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{t.active ? 'Pause Tier' : 'Reactivate'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewTier({ onCancel, onCreate }: { onCancel: () => void; onCreate: (t: MembershipTier) => void }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [period, setPeriod] = useState<typeof PERIODS[number]>('Monthly')
  const [benefitInput, setBenefitInput] = useState('')
  const [benefits, setBenefits] = useState<string[]>([])

  const addBenefit = () => { if (benefitInput.trim()) { setBenefits(p => [...p, benefitInput.trim()]); setBenefitInput('') } }

  const create = () => {
    if (!name.trim() || !price || Number(price) <= 0) return
    onCreate({
      id: 'mt' + Date.now(), name: name.trim(), price: Number(price), currency: 'KES', period,
      benefits: benefits.length ? benefits : ['Access to private posts'],
      memberCount: 0, active: true, color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Create New Tier" onBack={onCancel} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Tier Name</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Founding Member" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 12px', color: 'white', fontSize: 13, marginBottom: 16 }} />

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Price (KES)</p>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 12px', color: 'white', fontSize: 14, marginBottom: 16 }} />

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Billing Period</p>
        <div style={{ display: 'flex', gap: 7, marginBottom: 16 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ flex: 1, padding: '9px', borderRadius: 11, background: period === p ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${period === p ? 'rgba(26,188,156,0.3)' : 'rgba(255,255,255,0.08)'}`, color: period === p ? '#1abc9c' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{p}</button>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Benefits</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <input value={benefitInput} onChange={e => setBenefitInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBenefit()} placeholder="e.g. Early access to new uploads" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 12px', color: 'white', fontSize: 12.5 }} />
          <button onClick={addBenefit} style={{ padding: '9px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </div>
        {benefits.map((b, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 9, marginBottom: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>✓ {b}</span>
            <button onClick={() => setBenefits(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>×</button>
          </div>
        ))}

        <button onClick={create} disabled={!name.trim() || !price} style={{ width: '100%', padding: 14, borderRadius: 13, background: name.trim() && price ? 'linear-gradient(90deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.08)', border: 'none', color: name.trim() && price ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: name.trim() && price ? 'pointer' : 'not-allowed', marginTop: 12 }}>Create Tier</button>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color, fontSize: 17, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{value}</p>
    </div>
  )
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
    </div>
  )
}

function Toast({ text }: { text: string }) {
  return <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{text}</div>
}

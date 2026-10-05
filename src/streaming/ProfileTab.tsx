import { useState } from 'react'
import { type Role } from '../App'

type Props = {
  name: string
  username: string
  role: Role | null
  coinBalance: number
  onPremium: () => void
  onOpenWatchlist?: () => void
  onOpenHistory?: () => void
  onOpenAIRecs?: () => void
  onOpenOffline?: () => void
  onOpenStudio?: () => void
  onOpenPassport?: () => void
  onOpenWallet?: () => void
  onOpenConnect?: () => void
  onOpenNotifications?: () => void
  onOpenHub?: () => void
  onOpenAI?: () => void
  onOpenLearn?: () => void
  onSignOut?: () => Promise<void>
  onSignIn?: () => void
}

const PLAN_FEATURES = ['Ad-free viewing', 'Offline downloads', '4K & 1080p quality', 'Early access to originals', 'Exclusive content', 'Stream on 3 devices', 'Creator Analytics (Creator role)']

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: 'KSH 499', period: '/mo', badge: null },
  { id: 'quarterly', label: 'Quarterly', price: 'KSH 1,299', period: '/3mo', badge: 'Save 13%' },
  { id: 'annual', label: 'Annual', price: 'KSH 4,499', period: '/yr', badge: 'Best Value' },
]

const ROLE_EMOJIS: Record<string, string> = { viewer: '🎬', creator: '🎥', organization: '🏢', student: '🎓', educator: '📚' }

export default function ProfileTab({ name, username, role, coinBalance, onPremium, onOpenWatchlist, onOpenHistory, onOpenAIRecs, onOpenOffline, onOpenStudio, onOpenPassport, onOpenWallet, onOpenConnect, onOpenNotifications, onOpenHub, onOpenAI, onOpenLearn, onSignOut, onSignIn }: Props) {
  const [activeSection, setActiveSection] = useState<null | 'premium' | 'history' | 'watchlist' | 'notifications'>(null)
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [isPremium] = useState(false)

  const watchlist = [
    { title: 'Kilimanjaro', type: 'Movie', img: 'https://images.unsplash.com/photo-1637759898746-283c2d6c24c5?w=120&h=80&fit=crop&auto=format' },
    { title: 'Mama Afrika', type: 'Series', img: 'https://images.unsplash.com/photo-1782111665987-62d3eabb64c6?w=120&h=80&fit=crop&auto=format' },
  ]

  if (activeSection === 'premium') {
    return (
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <button onClick={() => setActiveSection(null)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: 0 }}>Go Premium</h2>
          </div>

          {/* Hero */}
          <div style={{ background: 'linear-gradient(135deg, #ca6f1e, #f39c12)', borderRadius: 24, padding: '28px 20px', textAlign: 'center', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
            <span style={{ fontSize: 52 }}>⭐</span>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '8px 0 6px' }}>Pwani Premium</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>Unlock the full African storytelling experience</p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 24 }}>
            {PLAN_FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 18, color: '#1abc9c', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Plans */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Choose a Plan</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.id} onClick={() => setSelectedPlan(plan.id)} style={{
                background: selectedPlan === plan.id ? 'rgba(243,156,18,0.12)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${selectedPlan === plan.id ? '#f39c12' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 16, padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selectedPlan === plan.id ? '#f39c12' : 'rgba(255,255,255,0.2)'}`, background: selectedPlan === plan.id ? '#f39c12' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedPlan === plan.id && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{plan.label}</p>
                    {plan.badge && <span style={{ fontSize: 11, color: '#f8c471', background: 'rgba(243,156,18,0.15)', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>{plan.badge}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{plan.price}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>{plan.period}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Pay With</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[{ icon: '📱', label: 'M-Pesa' }, { icon: '💳', label: 'Card' }, { icon: '💰', label: 'Wallet' }].map(m => (
              <button key={m.label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 22 }}>{m.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit, sans-serif' }}>{m.label}</span>
              </button>
            ))}
          </div>

          <button className="btn-gold" onClick={onPremium}>
            Subscribe to {PLANS.find(p => p.id === selectedPlan)?.label} · {PLANS.find(p => p.id === selectedPlan)?.price}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    )
  }

  if (activeSection === 'watchlist') {
    return (
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <button onClick={() => setActiveSection(null)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: 0 }}>My Watchlist</h2>
          </div>
          {['Saved Movies', 'Saved Series'].map(section => (
            <div key={section} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>{section}</p>
              {watchlist.filter(w => section.includes(w.type)).map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                  <img src={item.img} alt={item.title} style={{ width: 80, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#103058' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{item.type}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: 'rgba(41,128,185,0.15)', border: '1px solid rgba(41,128,185,0.3)', borderRadius: 10, padding: '8px 12px', color: '#5dade2', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>▶ Watch</button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 18, cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
              {watchlist.filter(w => section.includes(w.type)).length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>Nothing saved here yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activeSection === 'notifications') {
    const notifs = [
      { icon: '🎬', title: 'New Episode Available', body: 'Nairobi Nights S2 E4 is now streaming', time: '5m ago', unread: true },
      { icon: '💾', title: 'Download Complete', body: 'Studio Masters E7 is ready to watch offline', time: '1h ago', unread: true },
      { icon: '🪙', title: 'Coins Earned', body: 'You earned 15 coins for watching today', time: '2h ago', unread: true },
      { icon: '⭐', title: 'New African Original', body: 'Mama Afrika Season 4 premieres this Friday', time: '1d ago', unread: false },
      { icon: '💎', title: 'Premium Offer', body: '3 months for the price of 2 — ends Sunday', time: '2d ago', unread: false },
    ]
    return (
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <button onClick={() => setActiveSection(null)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: 0 }}>Notifications</h2>
          </div>
          {notifs.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'flex-start', background: n.unread ? 'rgba(41,128,185,0.05)' : 'transparent' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: n.unread ? 'rgba(41,128,185,0.12)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: n.unread ? 'white' : 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: n.unread ? 700 : 500, margin: '0 0 2px' }}>{n.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 4px', lineHeight: 1.4 }}>{n.body}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{n.time}</p>
              </div>
              {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980b9', flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Main profile
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Profile hero */}
      <div style={{ background: 'linear-gradient(180deg, #103058 0%, #0a1628 100%)', padding: '20px 20px 28px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, border: '3px solid rgba(255,255,255,0.15)' }}>
            {name ? name[0].toUpperCase() : '🌊'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 2px' }}>{name || 'Creative'}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '0 0 6px' }}>@{username || 'pwaniplay_user'}</p>
            {role && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>{ROLE_EMOJIS[role]}</span>
                <span style={{ fontSize: 12, color: '#5dade2', fontWeight: 600, textTransform: 'capitalize' }}>{role}</span>
              </div>
            )}
          </div>
          <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '8px 14px', color: 'white', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Edit</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { label: 'Watching', value: '24' },
            { label: 'Completed', value: '147' },
            { label: 'Coins', value: coinBalance.toLocaleString() },
          ].map(({ label, value }, i) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{value}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      {!isPremium && (
        <div style={{ margin: '20px 20px 0', background: 'linear-gradient(135deg, rgba(202,111,30,0.3), rgba(243,156,18,0.2))', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 18, padding: '18px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>⭐</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Upgrade to Premium</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>Ad-free · 4K · Offline · Exclusive content</p>
          </div>
          <button onClick={() => setActiveSection('premium')} style={{ background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', border: 'none', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>Go Pro</button>
        </div>
      )}

      {/* Creative Passport */}
      <div style={{ margin: '16px 20px 0', background: 'rgba(30,96,145,0.12)', border: '1px solid rgba(30,96,145,0.25)', borderRadius: 18, padding: '18px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 32, flexShrink: 0 }}>🛂</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Creative Passport</p>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6 }}>
            <div style={{ width: '35%', height: '100%', background: '#2980b9', borderRadius: 2 }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 0' }}>35% complete — Keep building!</p>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18, flexShrink: 0 }}>›</span>
      </div>

      {/* Menu items */}
      <div style={{ margin: '20px 20px 0' }}>
        {[
          { icon: '🎬', label: 'Pwani Studio', action: () => onOpenStudio?.(), highlight: true },
          { icon: '🪪', label: 'Pwani Passport', action: () => onOpenPassport?.(), highlight: true },
          { icon: '💳', label: 'Pwani Wallet', action: () => onOpenWallet?.(), highlight: true },
          { icon: '🤝', label: 'Pwani Connect', action: () => onOpenConnect?.(), highlight: true },
          { icon: '🛒', label: 'Pwani Hub', action: () => onOpenHub?.(), highlight: true },
          { icon: '🎓', label: 'Pwani Learn', action: () => onOpenLearn?.(), highlight: true },
          { icon: '🤖', label: 'Pwani AI', action: () => onOpenAI?.(), highlight: true },
          { icon: '🔔', label: 'Notifications', action: () => onOpenNotifications?.(), highlight: true },
          { icon: '📋', label: 'My Watchlist', action: () => onOpenWatchlist ? onOpenWatchlist() : setActiveSection('watchlist') },
          { icon: '📜', label: 'Viewing History', action: () => onOpenHistory?.() },
          { icon: '🤖', label: 'AI For You', action: () => onOpenAIRecs?.() },
          { icon: '📡', label: 'Offline Library', action: () => onOpenOffline?.() },
          { icon: '🌍', label: 'Language & Region', action: () => {} },
          { icon: '♿', label: 'Accessibility', action: () => {} },
          { icon: '🔒', label: 'Privacy & Security', action: () => {} },
          { icon: '❓', label: 'Help & Support', action: () => {} },
          { icon: '🚪', label: onSignOut ? 'Sign Out' : 'Sign In', action: () => { if (onSignOut) void onSignOut(); else onSignIn?.() }, danger: Boolean(onSignOut) },
        ].map(item => (
          <button key={item.label} onClick={item.action} style={{
            display: 'flex', alignItems: 'center', gap: 16, width: '100%',
            padding: '15px 0', background: 'none', border: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'left',
          }}>
            <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1, color: (item as any).danger ? '#e74c3c' : (item as any).highlight ? '#f8c471' : 'rgba(255,255,255,0.8)', fontSize: 15, fontFamily: 'Outfit, sans-serif', fontWeight: (item as any).highlight ? 700 : 500 }}>{item.label}{(item as any).highlight ? ' →' : ''}</span>
            {!(item as any).danger && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: '24px 0', fontFamily: 'DM Mono, monospace' }}>
        v1.0.0 · Powered by Chemichemi Studios
      </p>
    </div>
  )
}

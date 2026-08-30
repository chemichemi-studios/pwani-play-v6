import { useState } from 'react'
import { CHALLENGES } from './data'

type Props = { coinBalance: number; onEarnCoins: (n: number) => void }

const REDEEM_OPTIONS = [
  { id: 'r1', title: '1 Premium Day', icon: '⭐', cost: 50, desc: 'Ad-free streaming for 24 hours' },
  { id: 'r2', title: '1 Week Premium', icon: '🌟', cost: 300, desc: 'Full premium access for 7 days' },
  { id: 'r3', title: '10% Discount', icon: '🎟', cost: 200, desc: 'Off any subscription plan' },
  { id: 'r4', title: 'Support a Creator', icon: '💖', cost: 100, desc: 'Gift coins to your favourite creator' },
  { id: 'r5', title: 'Marketplace Voucher', icon: '🛒', cost: 500, desc: 'KSH 500 off in Pwani Marketplace' },
]

const EARNINGS_HISTORY = [
  { desc: 'Watched Nairobi Nights S2 E3', coins: +15, time: '2h ago', icon: '📺' },
  { desc: 'Daily Check-In streak · Day 4', coins: +10, time: '8h ago', icon: '📅' },
  { desc: 'Shared Studio Masters', coins: +10, time: '1d ago', icon: '📤' },
  { desc: 'Watched Sound of Mombasa', coins: +20, time: '2d ago', icon: '📺' },
  { desc: 'Profile completion bonus', coins: +25, time: '3d ago', icon: '✅' },
]

export default function RewardsTab({ coinBalance, onEarnCoins }: Props) {
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem' | 'history'>('earn')
  const [checkedIn, setCheckedIn] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [redeemed, setRedeemed] = useState<string[]>([])

  const handleCheckIn = () => {
    if (!checkedIn) { setCheckedIn(true); onEarnCoins(5) }
  }

  const handleChallengeClaim = (id: string, coins: number) => {
    if (!completedChallenges.includes(id)) { setCompletedChallenges(prev => [...prev, id]); onEarnCoins(coins) }
  }

  const handleRedeem = (id: string, cost: number) => {
    if (coinBalance >= cost && !redeemed.includes(id)) { setRedeemed(prev => [...prev, id]); onEarnCoins(-cost) }
  }

  const level = coinBalance < 100 ? 1 : coinBalance < 300 ? 2 : coinBalance < 600 ? 3 : 4
  const levelNames = ['', 'Explorer', 'Creator', 'Artisan', 'Legend']
  const nextThreshold = [100, 300, 600, 1000][level - 1] ?? 1000
  const levelProgress = Math.min(coinBalance / nextThreshold, 1)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Hero coin balance */}
      <div style={{ margin: '16px 20px', background: 'linear-gradient(135deg, rgba(202,111,30,0.4), rgba(243,156,18,0.3))', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 24, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 100, opacity: 0.1 }}>🪙</div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>Your Balance</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 52, color: '#f8c471', lineHeight: 1 }}>{coinBalance.toLocaleString()}</span>
          <span style={{ fontSize: 20 }}>🪙</span>
        </div>

        {/* Level */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Level {level} · {levelNames[level]}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Mono, monospace' }}>{nextThreshold - coinBalance} to Level {level + 1}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
          <div style={{ width: `${levelProgress * 100}%`, height: '100%', background: 'linear-gradient(90deg,#ca6f1e,#f39c12)', borderRadius: 3, transition: 'width 0.5s ease' }} />
        </div>

        {/* Daily check-in */}
        <button onClick={handleCheckIn} disabled={checkedIn} style={{
          marginTop: 16, background: checkedIn ? 'rgba(26,188,156,0.2)' : 'rgba(255,255,255,0.15)',
          border: `1px solid ${checkedIn ? 'rgba(26,188,156,0.4)' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: 12, padding: '12px 20px', color: checkedIn ? '#1abc9c' : 'white',
          fontSize: 14, fontWeight: 700, cursor: checkedIn ? 'default' : 'pointer',
          fontFamily: 'Outfit, sans-serif', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {checkedIn ? '✅ Checked In Today!' : '📅 Daily Check-In · +5 🪙'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, width: '100%' }}>
          {(['earn', 'redeem', 'history'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === t ? '#1e6091' : 'transparent',
              color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s', textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Earn tab */}
        {activeTab === 'earn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Active Challenges</p>
            {CHALLENGES.map(c => {
              const done = completedChallenges.includes(c.id) || c.progress === c.total
              const pct = c.total > 1 ? c.progress / c.total : (done ? 1 : 0)
              return (
                <div key={c.id} style={{ background: done ? 'rgba(26,188,156,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? 'rgba(26,188,156,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: '16px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: c.total > 1 ? 12 : 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: done ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ color: done ? '#1abc9c' : 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{c.title}</p>
                        <span style={{ fontSize: 13, color: '#f8c471', fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 8 }}>+{c.coins} 🪙</span>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>{c.desc}</p>
                    </div>
                  </div>
                  {c.total > 1 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{c.progress}/{c.total} completed</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                        <div style={{ width: `${pct * 100}%`, height: '100%', background: done ? '#1abc9c' : '#2980b9', borderRadius: 3 }} />
                      </div>
                    </div>
                  )}
                  {(c.progress === c.total || c.total === 1) && !done && (
                    <button onClick={() => handleChallengeClaim(c.id, c.coins)} style={{ marginTop: 10, background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', border: 'none', borderRadius: 10, padding: '10px 16px', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', width: '100%' }}>
                      Claim Reward 🪙
                    </button>
                  )}
                  {done && <p style={{ marginTop: 8, color: '#1abc9c', fontSize: 12, fontWeight: 600 }}>✓ Completed!</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* Redeem tab */}
        {activeTab === 'redeem' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Redeem Options</p>
            {REDEEM_OPTIONS.map(opt => {
              const canAfford = coinBalance >= opt.cost
              const done = redeemed.includes(opt.id)
              return (
                <div key={opt.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(243,156,18,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{opt.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 8px' }}>{opt.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>🪙</span>
                      <span style={{ fontSize: 15, color: canAfford ? '#f8c471' : '#e74c3c', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{opt.cost}</span>
                      {!canAfford && <span style={{ fontSize: 11, color: '#e74c3c' }}>(need {opt.cost - coinBalance} more)</span>}
                    </div>
                  </div>
                  <button onClick={() => handleRedeem(opt.id, opt.cost)} disabled={!canAfford || done} style={{
                    background: done ? 'rgba(26,188,156,0.15)' : canAfford ? 'linear-gradient(135deg,#ca6f1e,#f39c12)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${done ? 'rgba(26,188,156,0.3)' : canAfford ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 10, padding: '10px 14px', color: done ? '#1abc9c' : canAfford ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: 13, fontWeight: 700, cursor: canAfford && !done ? 'pointer' : 'default',
                    fontFamily: 'Outfit, sans-serif', flexShrink: 0,
                  }}>
                    {done ? '✓ Done' : 'Redeem'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* History tab */}
        {activeTab === 'history' && (
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recent Earnings</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {EARNINGS_HISTORY.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{entry.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 500, margin: '0 0 2px' }}>{entry.desc}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{entry.time}</p>
                  </div>
                  <span style={{ fontSize: 14, color: entry.coins > 0 ? '#1abc9c' : '#e74c3c', fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>
                    {entry.coins > 0 ? '+' : ''}{entry.coins} 🪙
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

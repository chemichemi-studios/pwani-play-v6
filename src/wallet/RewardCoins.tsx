import { useState } from 'react'
import { WALLET_BALANCE, COIN_CHALLENGES, COIN_REDEMPTION_OPTIONS } from './data'

type Props = { onBack?: () => void }

type SubTab = 'earn' | 'redeem' | 'history'

export default function RewardCoins({ onBack }: Props) {
  const [subtab, setSubtab] = useState<SubTab>('earn')
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const coins = WALLET_BALANCE.coins

  const doRedeem = (key: string, cost: number) => {
    if (coins < cost) return
    setRedeeming(key)
    setTimeout(() => { setRedeeming(null); setRedeemed(prev => [...prev, key]) }, 1200)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      {/* Header */}
      <div style={{ padding: '0 20px 0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Reward Coins</h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Earn coins, unlock rewards</p>

        {/* Coin balance hero */}
        <div style={{ background: 'linear-gradient(135deg, #3d2b00, #7d5400, #3d2b00)', border: '1px solid rgba(248,196,113,0.3)', borderRadius: 20, padding: '20px', marginBottom: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(248,196,113,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(243,156,18,0.08)' }} />
          <p style={{ color: 'rgba(248,196,113,0.6)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Your Balance</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>🪙</span>
            <p style={{ color: '#f8c471', fontSize: 44, fontFamily: 'DM Serif Display, serif', margin: 0, lineHeight: 1 }}>{coins.toLocaleString()}</p>
          </div>
          <p style={{ color: 'rgba(248,196,113,0.5)', fontSize: 13, margin: '0 0 14px' }}>≈ KES {(coins * 0.17).toFixed(0)} equivalent value</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ label: 'Earned today', value: '+340' }, { label: 'This month', value: '+2,400' }, { label: 'All-time', value: '12,840' }].map(s => (
              <div key={s.label} style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '8px' }}>
                <p style={{ color: 'rgba(248,196,113,0.5)', fontSize: 10, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.label}</p>
                <p style={{ color: '#f8c471', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
          {([['earn', '🔥 Earn'], ['redeem', '🎁 Redeem'], ['history', '📋 History']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setSubtab(key)} style={{ flex: 1, padding: '11px 0', border: 'none', background: 'none', cursor: 'pointer', color: subtab === key ? '#f39c12' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif', borderBottom: `2px solid ${subtab === key ? '#f39c12' : 'transparent'}` }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Earn tab: daily challenges */}
      {subtab === 'earn' && (
        <div style={{ padding: '0 20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Daily Challenges</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {COIN_CHALLENGES.map(c => {
              const pct = Math.min((c.progress / c.target) * 100, 100)
              return (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(248,196,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{c.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 2px' }}>{c.description}</p>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>Expires: {c.expiresAt}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: '#f8c471', fontSize: 15, fontWeight: 700, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>+{c.reward}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0 }}>coins</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#ca6f1e,#f8c471)', borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{c.progress}/{c.target}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Referral bonus */}
          <div style={{ background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
            <p style={{ color: '#bb8fce', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>👥 Refer Friends — 1,000 coins each</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>Share your referral code and earn 1,000 coins for every friend who joins Pwani Play.</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, fontFamily: 'DM Mono, monospace', color: '#f8c471', fontSize: 13, fontWeight: 700 }}>AMARA-PWANI-2026</div>
              <button onClick={() => { navigator.clipboard?.writeText('AMARA-PWANI-2026'); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(155,89,182,0.2)', border: '1px solid rgba(155,89,182,0.3)', color: '#bb8fce', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem tab */}
      {subtab === 'redeem' && (
        <div style={{ padding: '0 20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>Coins are separate from your cash balance and can only be used for Pwani rewards.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COIN_REDEMPTION_OPTIONS.map(opt => {
              const canRedeem = coins >= opt.coins && !redeemed.includes(opt.key)
              const isRedeeming = redeeming === opt.key
              const done = redeemed.includes(opt.key)
              return (
                <div key={opt.key} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${done ? 'rgba(26,188,156,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(248,196,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{opt.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 2px' }}>{opt.desc}</p>
                    <p style={{ color: '#f8c471', fontSize: 12, fontWeight: 700, margin: 0 }}>🪙 {opt.coins.toLocaleString()} coins · {opt.value}</p>
                  </div>
                  <button
                    onClick={() => doRedeem(opt.key, opt.coins)}
                    disabled={!canRedeem}
                    style={{ padding: '8px 14px', borderRadius: 10, background: done ? 'rgba(26,188,156,0.15)' : canRedeem ? 'rgba(248,196,113,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${done ? 'rgba(26,188,156,0.3)' : canRedeem ? 'rgba(248,196,113,0.3)' : 'rgba(255,255,255,0.08)'}`, color: done ? '#1abc9c' : canRedeem ? '#f8c471' : 'rgba(255,255,255,0.25)', fontSize: 13, fontWeight: 700, cursor: canRedeem && !done ? 'pointer' : 'default', flexShrink: 0, fontFamily: 'Outfit, sans-serif', minWidth: 72, textAlign: 'center' }}
                  >
                    {done ? '✓ Done' : isRedeeming ? '…' : 'Redeem'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* History tab */}
      {subtab === 'history' && (
        <div style={{ padding: '0 20px' }}>
          {[
            { date: 'Today', desc: 'Daily watch streak', amount: '+50', icon: '🔥' },
            { date: 'Yesterday', desc: 'Referral bonus — @zara.mutua', amount: '+1,000', icon: '👥' },
            { date: '4 Aug', desc: 'Redeem — Marketplace discount', amount: '-500', icon: '🛒' },
            { date: '3 Aug', desc: 'Weekly binge reward', amount: '+500', icon: '🎬' },
            { date: '2 Aug', desc: 'Share & Earn', amount: '+100', icon: '📤' },
            { date: '1 Aug', desc: 'Bonus campaign — Creator Support Week', amount: '+750', icon: '🎉' },
          ].map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, marginBottom: 8, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(248,196,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{h.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{h.desc}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>{h.date}</p>
              </div>
              <p style={{ color: h.amount.startsWith('+') ? '#f8c471' : 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{h.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

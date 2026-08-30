import { useState } from 'react'

type Props = { onBack?: () => void }

type WalletNotif = {
  id: string
  type: 'received' | 'sent' | 'withdrawal' | 'subscription' | 'coin' | 'tip' | 'refund' | 'security' | 'system'
  title: string
  body: string
  time: string
  read: boolean
  amount?: string
}

const NOTIF_DATA: WalletNotif[] = [
  { id: 'n1', type: 'received', title: 'Payment Received', body: 'Fatima Hassan tipped you KES 250 on your short film "Nairobi Nights"', time: '2h ago', read: false, amount: '+KES 250' },
  { id: 'n2', type: 'withdrawal', title: 'Withdrawal Processed', body: 'KES 5,000 sent to your M-Pesa (+254 712 345 678). Usually arrives in minutes.', time: '5h ago', read: false, amount: '-KES 5,000' },
  { id: 'n3', type: 'subscription', title: 'Subscription Renewed', body: 'Pwani Play Creator Pro renewed for KES 1,299. Next billing: 1 Sep 2026.', time: 'Yesterday', read: true, amount: '-KES 1,299' },
  { id: 'n4', type: 'coin', title: 'Coins Earned', body: 'You earned 150 Pwani Coins for completing the "Upload 3 Short Films" challenge!', time: 'Yesterday', read: true, amount: '+150 coins' },
  { id: 'n5', type: 'received', title: 'Earnings Credited', body: 'KES 3,400 from subscription revenue credited to your wallet.', time: '2 days ago', read: true, amount: '+KES 3,400' },
  { id: 'n6', type: 'tip', title: 'Creator Tip Received', body: 'Amara Osei-Wusu sent you an anonymous tip of KES 500', time: '3 days ago', read: true, amount: '+KES 500' },
  { id: 'n7', type: 'security', title: 'New Device Login', body: 'Your wallet was accessed from iPad Air in Nairobi. If this was not you, review your security settings.', time: '4 days ago', read: true },
  { id: 'n8', type: 'refund', title: 'Refund Processed', body: 'KES 890 refunded for marketplace purchase "Drone Footage Pack". Funds in your wallet.', time: '5 days ago', read: true, amount: '+KES 890' },
  { id: 'n9', type: 'security', title: 'Blocked Login Attempt', body: 'A suspicious login was blocked from Lagos, Nigeria. Your account remains secure.', time: '6 days ago', read: true },
  { id: 'n10', type: 'system', title: 'Wallet Update Available', body: 'New wallet features: Request Money, Split Bills, and Business Invoices are now live.', time: '1 week ago', read: true },
]

const TYPE_CONFIG: Record<WalletNotif['type'], { icon: string; color: string }> = {
  received:     { icon: '💸', color: '#1abc9c' },
  sent:         { icon: '📤', color: '#3498db' },
  withdrawal:   { icon: '🏦', color: '#f39c12' },
  subscription: { icon: '🔄', color: '#9b59b6' },
  coin:         { icon: '🪙', color: '#f8c471' },
  tip:          { icon: '💝', color: '#e91e8c' },
  refund:       { icon: '↩️', color: '#1abc9c' },
  security:     { icon: '🔐', color: '#e74c3c' },
  system:       { icon: '📣', color: '#5dade2' },
}

export default function Notifications({ onBack }: Props) {
  const [notifs, setNotifs] = useState<WalletNotif[]>(NOTIF_DATA)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const unread = notifs.filter(n => !n.read).length
  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>Notifications</h2>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Mark all read</button>
          )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px' }}>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 18px', borderRadius: 100, border: 'none', cursor: 'pointer', background: filter === f ? '#1e6091' : 'rgba(255,255,255,0.06)', color: filter === f ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
              {f === 'all' ? 'All' : `Unread${unread > 0 ? ` (${unread})` : ''}`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type]
            return (
              <div key={n.id} onClick={() => markRead(n.id)} style={{ display: 'flex', gap: 12, padding: '13px 14px', borderRadius: 16, cursor: 'pointer', background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(41,128,185,0.07)', border: `1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(41,128,185,0.12)'}`, position: 'relative' }}>
                {!n.read && <div style={{ position: 'absolute', top: 14, right: 14, width: 7, height: 7, borderRadius: '50%', background: '#2980b9' }} />}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{cfg.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                    <p style={{ color: n.read ? 'rgba(255,255,255,0.75)' : 'white', fontSize: 13, fontWeight: n.read ? 600 : 700, margin: 0, lineHeight: 1.3 }}>{n.title}</p>
                    {n.amount && <span style={{ color: cfg.color, fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{n.amount}</span>}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 4px', lineHeight: 1.4 }}>{n.body}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{n.time}</p>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No unread notifications</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>You are all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

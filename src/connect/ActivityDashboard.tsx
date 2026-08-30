type Props = { onBack?: () => void }

const STATS = [
  { label: 'Profile Views', value: 284, change: '+24%', color: '#2980b9', icon: '👁' },
  { label: 'Search Appearances', value: 47, change: '+12%', color: '#9b59b6', icon: '🔍' },
  { label: 'New Followers', value: 18, change: '+8%', color: '#1abc9c', icon: '👥' },
  { label: 'New Connections', value: 6, change: '+3', color: '#f39c12', icon: '🤝' },
  { label: 'Post Impressions', value: 1240, change: '+34%', color: '#e91e8c', icon: '📣' },
  { label: 'Invitations Sent', value: 12, change: '8 accepted', color: '#5dade2', icon: '📤' },
]

const WEEKLY = [42, 68, 55, 90, 110, 74, 95]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_W = Math.max(...WEEKLY)

export default function ActivityDashboard({ onBack }: Props) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Networking Analytics</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Your professional activity — last 30 days</p>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: `${s.color}15`, color: s.color, fontWeight: 700 }}>{s.change}</span>
              </div>
              <p style={{ color: 'white', fontSize: 24, fontFamily: 'DM Serif Display, serif', margin: '0 0 3px' }}>{s.value.toLocaleString()}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly activity chart */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Weekly Profile Views</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {WEEKLY.map((v, i) => {
              const h = (v / MAX_W) * 100
              const isToday = i === 6
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: isToday ? '#5dade2' : 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{v}</span>
                  <div style={{ width: '100%', height: `${h}%`, background: isToday ? 'linear-gradient(to top,#1e6091,#2980b9)' : 'rgba(255,255,255,0.12)', borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {DAYS.map((d, i) => <span key={d} style={{ flex: 1, textAlign: 'center', color: i === 6 ? '#5dade2' : 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{d}</span>)}
          </div>
        </div>

        {/* Who viewed your profile */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recent Profile Viewers</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
          {[
            { name: 'Aisha Diallo', role: 'Executive Producer · Dakar', time: '2h ago' },
            { name: 'Obinna Eze', role: 'VFX Artist · Lagos', time: '5h ago' },
            { name: 'Documentary Filmmakers Community', role: 'Community · 4,280 members', time: 'Yesterday' },
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{v.name.startsWith('Documentary') ? '🌐' : '👤'}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 1px' }}>{v.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{v.role}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{v.time}</span>
            </div>
          ))}
          <div style={{ padding: '12px 16px', background: 'rgba(41,128,185,0.05)' }}>
            <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: 0, textAlign: 'center', cursor: 'pointer' }}>See all 284 viewers →</p>
          </div>
        </div>

        {/* Growth tips */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Growth Opportunities</p>
        {[
          { icon: '📸', title: 'Add a portfolio piece', desc: 'Profiles with portfolios get 3× more views', action: 'Add Portfolio' },
          { icon: '🎯', title: 'Complete your skills', desc: 'You have 4 skills — adding 3 more boosts search visibility', action: 'Add Skills' },
          { icon: '✍️', title: 'Write a post this week', desc: 'You have not posted in 5 days. Consistent posting triples engagement.', action: 'Create Post' },
        ].map(tip => (
          <div key={tip.title} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{tip.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{tip.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 8px', lineHeight: 1.4 }}>{tip.desc}</p>
              <button style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{tip.action}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

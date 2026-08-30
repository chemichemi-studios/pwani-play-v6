import { MOCK_ACTIVITY } from './data'

type Props = { onBack: () => void }

const ACTIVITY_COLORS: Record<string, string> = {
  verification_approved: '#1abc9c',
  credit_added: '#2980b9',
  skill_endorsed: '#9b59b6',
  recommendation_received: '#f39c12',
  portfolio_added: '#27ae60',
  portfolio_updated: '#3498db',
  certificate_earned: '#e67e22',
  trust_score_up: '#f1c40f',
}

export default function Activity({ onBack }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Activity</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Your Passport activity log</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>Recent Activity</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MOCK_ACTIVITY.map(a => {
            const color = ACTIVITY_COLORS[a.type] || 'rgba(255,255,255,0.5)'
            return (
              <div key={a.id} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 3px', lineHeight: 1.4 }}>{a.description}</p>
                  {a.metadata && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 4px' }}>{a.metadata}</p>}
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{a.time}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, margin: 0 }}>You have reached the beginning of your activity log.</p>
        </div>
      </div>
    </div>
  )
}

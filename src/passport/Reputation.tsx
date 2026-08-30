import { MOCK_TRUST_SCORE, TRUST_LEVELS, MOCK_PROFILE } from './data'

type Props = { onImprove: () => void }

const BREAKDOWN_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  verification: { label: 'Identity Verification', icon: '🛡️', desc: 'Government ID and biometric checks' },
  portfolioCompleteness: { label: 'Portfolio Completeness', icon: '📂', desc: 'Depth and quality of portfolio' },
  communityReputation: { label: 'Community Reputation', icon: '👥', desc: 'Endorsements, recommendations, followers' },
  collaborationRating: { label: 'Collaboration Rating', icon: '🤝', desc: 'Ratings from past collaborators' },
  projectCompletion: { label: 'Project Completion', icon: '✅', desc: 'Reliability and delivery record' },
  learningProgress: { label: 'Learning Progress', icon: '📚', desc: 'Certificates, courses, workshops' },
  professionalConduct: { label: 'Professional Conduct', icon: '⭐', desc: 'Reports, disputes, community standards' },
}

export default function Reputation({ onImprove }: Props) {
  const ts = MOCK_TRUST_SCORE
  const tl = TRUST_LEVELS[ts.level]
  const maxChart = Math.max(...ts.history.map(h => h.score))

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '16px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Reputation</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Your trust across the Pwani ecosystem</p>

        {/* Big score card */}
        <div style={{ background: 'linear-gradient(135deg,rgba(243,156,18,0.15),rgba(41,128,185,0.1))', border: '1px solid rgba(243,156,18,0.25)', borderRadius: 20, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 4px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trust Score</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 52, color: '#f8c471', lineHeight: 1 }}>{ts.total}</span>
                <span style={{ color: 'rgba(248,196,113,0.5)', fontSize: 18 }}>/100</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${tl.color}22`, border: `2px solid ${tl.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 6 }}>{tl.icon}</div>
              <p style={{ color: tl.color, fontSize: 13, fontWeight: 700, margin: 0 }}>{tl.label}</p>
            </div>
          </div>

          {/* Score bar */}
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 8 }}>
            <div style={{ width: `${ts.total}%`, height: '100%', background: 'linear-gradient(90deg,#f39c12,#f8c471)', borderRadius: 4 }} />
          </div>

          {/* Level tiers */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {Object.values(TRUST_LEVELS).map(l => (
              <div key={l.label} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 14 }}>{l.icon}</span>
                <p style={{ color: ts.total >= l.min ? l.color : 'rgba(255,255,255,0.2)', fontSize: 9, margin: '2px 0 0', fontFamily: 'DM Mono, monospace' }}>{l.min}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Score history chart */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>Score History (7 months)</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
            {ts.history.map((h, i) => (
              <div key={h.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', background: i === ts.history.length - 1 ? '#f39c12' : 'rgba(243,156,18,0.3)', borderRadius: '3px 3px 0 0', height: `${(h.score / maxChart) * 100}%`, minHeight: 4 }} />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Score Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(ts.breakdown).map(([key, value]) => {
              const item = BREAKDOWN_LABELS[key]
              if (!item) return null
              const color = value >= 90 ? '#1abc9c' : value >= 70 ? '#f39c12' : '#e74c3c'
              return (
                <div key={key} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '0 0 1px' }}>{item.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{item.desc}</p>
                    </div>
                    <span style={{ color, fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{value}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Next level progress */}
        <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 16, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ color: '#5dade2', fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>💎 You are at {tl.label} level</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>Reach Elite (95+) by completing your portfolio, adding verified credits, and earning more endorsements.</p>
          <button className="btn-primary" onClick={onImprove} style={{ width: '100%' }}>Improve Score →</button>
        </div>

        {/* Collaboration rating */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Public Reputation Signals</p>
          {[
            { label: 'On-time delivery', value: 4.8, max: 5, icon: '⏱' },
            { label: 'Communication', value: 4.9, max: 5, icon: '💬' },
            { label: 'Creative quality', value: 5.0, max: 5, icon: '🎨' },
            { label: 'Collaboration spirit', value: 4.7, max: 5, icon: '🤝' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span style={{ flex: 1, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{r.label}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <div key={star} style={{ width: 20, height: 4, borderRadius: 2, background: star <= Math.round(r.value) ? '#f39c12' : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
              <span style={{ color: '#f8c471', fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace', minWidth: 26, textAlign: 'right' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { ME } from './data'

type Props = { onBack?: () => void }

const RECOMMENDATIONS = [
  { author: 'Amara Osei-Wusu', role: 'Cinematographer & Director', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&auto=format', text: 'Working with Kofi on "Nairobi Nights" was exceptional. His directorial instincts and collaborative spirit made the whole crew better. His storytelling sense is rare.', date: 'July 2026', relation: 'Worked together on project' },
  { author: 'Aisha Diallo', role: 'Executive Producer', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format', text: 'Kofi brings authenticity and professionalism to every project. His ability to communicate a director\'s vision to the crew is outstanding. Would produce with him again.', date: 'May 2026', relation: 'Supervised directly' },
]

const BADGES = [
  { icon: '🎬', label: 'Verified Creator', desc: 'Identity verified via Pwani Passport', color: '#2980b9' },
  { icon: '⭐', label: 'Top Collaborator', desc: '4.8 average collaboration rating', color: '#f8c471' },
  { icon: '🏆', label: 'Festival Selection', desc: 'Official selection at ZIFF 2025', color: '#e67e22' },
  { icon: '📚', label: 'Mentor', desc: 'Active mentor in Pwani Learn', color: '#9b59b6' },
  { icon: '🌍', label: 'East Africa Network', desc: 'Connected in 4 East African countries', color: '#1abc9c' },
]

export default function Reputation({ onBack }: Props) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Professional Reputation</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Your verified professional standing on Pwani</p>

        {/* Reputation score */}
        <div style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.12), rgba(26,188,156,0.06))', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 18, padding: '20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(41,128,185,0.15)', border: '3px solid #2980b9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: 22, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{ME.reputationScore}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>/ 100</span>
          </div>
          <div>
            <p style={{ color: '#5dade2', fontSize: 16, fontWeight: 700, margin: '0 0 3px' }}>Strong Reputation</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', lineHeight: 1.4 }}>You are in the top 25% of creators in your region</p>
            <div style={{ height: 5, width: 180, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <div style={{ width: `${ME.reputationScore}%`, height: '100%', background: 'linear-gradient(90deg,#2980b9,#1abc9c)', borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* Badges */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Achievements & Badges</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {BADGES.map(b => (
            <div key={b.label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${b.color}15`, border: `1px solid ${b.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{b.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{b.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{b.desc}</p>
              </div>
              <span style={{ color: b.color, fontSize: 16 }}>✓</span>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recommendations ({RECOMMENDATIONS.length})</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {RECOMMENDATIONS.map(r => (
            <div key={r.author} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <img src={r.photo} alt={r.author} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{r.author}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 1px' }}>{r.role}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{r.relation} · {r.date}</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{r.text}"</p>
            </div>
          ))}
          <button style={{ padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Request a Recommendation</button>
        </div>

        {/* Privacy note */}
        <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>You control what is visible on your reputation profile. Manage visibility in Privacy Settings.</p>
        </div>
      </div>
    </div>
  )
}

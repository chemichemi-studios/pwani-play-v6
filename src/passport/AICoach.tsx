import { useState } from 'react'
import { AI_COACH_SUGGESTIONS, MOCK_TRUST_SCORE, TRUST_LEVELS } from './data'
import type { AICoachSuggestion } from './data'

type Props = { onBack: () => void }

type Msg = { role: 'user' | 'ai'; text: string }

const STARTER_MSGS: Msg[] = [
  { role: 'ai', text: "Hi! I'm your Pwani AI Career Coach. I've reviewed your Passport and have some personalised insights to share. Ask me anything about your career, portfolio strategy, or how to boost your Trust Score." },
]

const QUICK_PROMPTS = [
  "How do I reach Elite trust level?",
  "What skills should I add?",
  "Review my portfolio",
  "Best roles for my experience",
  "How to get more endorsements?",
]

const AI_RESPONSES: Record<string, string> = {
  "How do I reach Elite trust level?": "Your Trust Score is currently 78 (Established). To reach Elite (95+), focus on: 1) Verifying 2 more credits with production companies, 2) Adding at least 5 more endorsements on your top skills, 3) Completing your Pwani Learn Film Directing certificate, and 4) Maintaining your 100% project completion rate. You are about 17 points away — achievable in 3-4 months with consistent activity.",
  "What skills should I add?": "Based on your existing credits and current industry demand in East Africa, I recommend adding: **Drone Operation** (high demand for commercial and narrative work), **DaVinci Resolve** (grading work is booming), and **Swahili Dubbing Direction** (growing OTT demand). Your portfolio already demonstrates strong narrative instincts — lean into those with course certifications from Pwani Learn.",
  "Review my portfolio": "Your portfolio is strong with 6 pieces spanning narrative film and music video. Strengths: consistent cinematography style and strong festival pedigree. Gaps: no commercial work shown (this limits corporate opportunities), and your NGO documentary project is unlisted — consider featuring it as it shows versatility. I also recommend adding a showreel as your featured item.",
  "Best roles for my experience": "Given your 8 years of directing experience and festival credits, you are most competitive for: **Lead Director** on mid-budget features, **Creative Director** for OTT pilot projects, and **Series Director** for streaming platforms like Showmax and Netflix Africa. Your Trust Score and verified credits make you bookable directly without an agent for projects under KES 5M.",
  "How to get more endorsements?": "Your 23 current endorsements are good, but you can grow them by: reaching out to 5 past collaborators you have not connected with on Pwani yet, endorsing others first (reciprocity works), and sharing your Passport publicly — each share typically results in 2-3 endorsements from viewers who have worked with you.",
}

export default function AICoach({ onBack }: Props) {
  const [messages, setMessages] = useState<Msg[]>(STARTER_MSGS)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])

  const tl = TRUST_LEVELS[MOCK_TRUST_SCORE.level]

  const send = (text: string) => {
    if (!text.trim() || thinking) return
    const userMsg: Msg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const response = AI_RESPONSES[text] || "That's a great question. Based on your Passport data, I'd recommend focusing on your verification steps first — each verified item significantly boosts your visibility to casting directors and production companies in the network."
      setMessages(prev => [...prev, { role: 'ai', text: response }])
      setThinking(false)
    }, 1200)
  }

  const activeSuggestions = AI_COACH_SUGGESTIONS.filter(s => !dismissed.includes(s.id))

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>AI Career Coach</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Personalised guidance powered by Pwani AI</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✨</div>
        </div>
      </div>

      {/* Suggestions carousel */}
      {activeSuggestions.length > 0 && (
        <div style={{ padding: '14px 0 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px', padding: '0 20px' }}>Suggested for You</p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 14, paddingLeft: 20, paddingRight: 20 }}>
            {activeSuggestions.map(s => (
              <SuggestionCard key={s.id} s={s} onDismiss={() => setDismissed(prev => [...prev, s.id])} onAction={() => send(s.title)} />
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {m.role === 'ai' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>✨</div>}
            <div style={{
              maxWidth: '80%', padding: '11px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? '#1e6091' : 'rgba(255,255,255,0.07)',
              border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <p style={{ color: 'white', fontSize: 14, lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap' }}>{m.text}</p>
            </div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>✨</div>
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px 16px 16px 4px' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '10px 20px 8px', overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} style={{ flexShrink: 0, padding: '7px 12px', borderRadius: 100, background: 'rgba(41,128,185,0.1)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '8px 16px 28px', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="input-field" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Ask your career coach..." style={{ flex: 1, marginBottom: 0 }} />
          <button onClick={() => send(input)} disabled={!input.trim() || thinking} style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? '#2980b9' : 'rgba(255,255,255,0.08)', border: 'none', color: 'white', fontSize: 18, cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>→</button>
        </div>
      </div>
    </div>
  )
}

function SuggestionCard({ s, onDismiss, onAction }: { s: AICoachSuggestion; onDismiss: () => void; onAction: () => void }) {
  const PRIORITY_COLORS = { high: '#e74c3c', medium: '#f39c12', low: '#1abc9c' }
  const color = PRIORITY_COLORS[s.priority]
  return (
    <div style={{ flexShrink: 0, width: 220, padding: '14px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22`, borderRadius: 14, cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: `${color}15`, color, fontWeight: 700 }}>{s.priority.toUpperCase()}</span>
        <button onClick={e => { e.stopPropagation(); onDismiss() }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 14, cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
      </div>
      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 4px', lineHeight: 1.35 }}>{s.title}</p>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: '0 0 10px', lineHeight: 1.4 }}>{s.description}</p>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '0 0 10px', lineHeight: 1.35 }}>{s.reason}</p>
      <button onClick={onAction} style={{ width: '100%', padding: '7px', borderRadius: 8, background: `${color}15`, border: `1px solid ${color}33`, color, fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{s.actionLabel}</button>
    </div>
  )
}

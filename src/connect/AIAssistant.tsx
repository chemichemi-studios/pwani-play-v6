import { useState } from 'react'
import { PROFILES, COMMUNITIES, EVENTS } from './data'

type Props = { onProfile: (id: string) => void; onCommunity: (id: string) => void; onEvent: (id: string) => void }

type Message = { role: 'user' | 'ai'; content: string }

const QUICK_PROMPTS = [
  'Who should I connect with this week?',
  'Which communities match my profile?',
  'How can I improve my profile visibility?',
  'Find me mentors in cinematography',
  'What events are coming up near me?',
]

const SUGGESTIONS = [
  { type: 'profile', data: PROFILES[1], reason: 'Both are documentary filmmakers with overlapping skills. She has 8 mutual connections with you.', tag: '🎬 Collaborator Match' },
  { type: 'profile', data: PROFILES[5], reason: 'Senior producer with 15+ mutual connections. She actively mentors emerging directors.', tag: '🎓 Potential Mentor' },
  { type: 'community', data: COMMUNITIES[0], reason: 'Your profession and location match this community perfectly. 12 of your connections are already members.', tag: '🌐 Community' },
  { type: 'event', data: EVENTS[1], reason: 'A documentary workshop starting in 16 days. Based on your content history, this aligns with your learning goals.', tag: '📅 Event' },
]

const AI_RESPONSES: Record<string, string> = {
  default: "Based on your Pwani Passport profile, activity, and connections, here are my top recommendations for this week:",
  "Who should I connect with this week?": "Looking at your profile (Cinematography, Directing, Storytelling) and your recent activity, I recommend connecting with:\n\n**Fatima Hassan** — Documentary filmmaker in Dar es Salaam with 8 mutual connections. You both focus on East African stories and her projects could benefit from your cinematography skills.\n\n**Aisha Diallo** — Executive Producer who has 15 mutual connections with you. She actively co-produces with emerging directors in the region.\n\n**Kwame Asante** — Music Producer who has already sent you a connection request. His cinematic scores could complement your directing work.\n\nWould you like me to draft an introduction message for any of them?",
  "Which communities match my profile?": "Based on your skills and profession, these communities would be most valuable:\n\n**Filmmakers Kenya** ✓ Already joined — you're active here, great!\n\n**East African Producers** — Private community for senior producers. With your growing portfolio, you now meet the criteria to apply.\n\n**Swahili Storytellers** — 3 of your connections are active members. Joining would give you access to their script feedback sessions.\n\nWould you like me to help you apply to any of these?",
  "How can I improve my profile visibility?": "Here are 3 high-impact improvements for your Pwani Connect profile:\n\n1. **Add 3 more skills** — You currently have 5 listed. Adding 'Color Grading', 'Drone Operation', and 'DCP Delivery' would match you to 40% more search queries in your field.\n\n2. **Post 2× per week** — You last posted 5 days ago. Accounts that post consistently get 3× more profile visits.\n\n3. **Complete your Passport verification** — Verified profiles appear 60% more in recruiter searches.\n\nWant me to help draft your next post?",
}

export default function AIAssistant({ onProfile, onCommunity, onEvent }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: AI_RESPONSES.default }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const send = (text?: string) => {
    const content = text || input.trim()
    if (!content) return
    setMessages(prev => [...prev, { role: 'user', content }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const response = AI_RESPONSES[content] || `Great question about "${content}"! Based on your profile and network activity in the East African creative ecosystem, I'd recommend focusing on building connections with documentary filmmakers and executive producers this month. Your cinematography skills are in high demand for international co-productions. Would you like specific introductions?`
      setMessages(prev => [...prev, { role: 'ai', content: response }])
      setTyping(false)
    }, 1400)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: 0 }}>AI Networking Assistant</h2>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Powered by Pwani AI · Personalised for you</p>

        {/* Smart Suggestions */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Top Recommendations This Week</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {SUGGESTIONS.map((s, i) => (
            <div key={i} onClick={() => {
              if (s.type === 'profile') onProfile((s.data as typeof PROFILES[0]).id)
              else if (s.type === 'community') onCommunity((s.data as typeof COMMUNITIES[0]).id)
              else onEvent((s.data as typeof EVENTS[0]).id)
            }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '12px 14px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                {s.type === 'profile' && <img src={(s.data as typeof PROFILES[0]).photo} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />}
                {s.type === 'community' && <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(41,128,185,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌐</div>}
                {s.type === 'event' && <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(156,39,176,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📅</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', color: '#5dade2', fontWeight: 700 }}>{s.tag}</span>
                </div>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>
                  {s.type === 'profile' ? (s.data as typeof PROFILES[0]).name : (s.data as typeof COMMUNITIES[0]).name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{s.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat interface */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Ask Pwani AI</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', marginBottom: 16, maxHeight: 320, overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: i < messages.length - 1 ? 12 : 0 }}>
              {msg.role === 'ai' ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✨</div>
                  <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.12)', borderRadius: '4px 12px 12px 12px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '80%', padding: '10px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px 12px 4px 12px' }}>
                    <p style={{ color: 'white', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{msg.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2980b9,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
              <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: 'rgba(41,128,185,0.08)', borderRadius: '4px 12px 12px 12px' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12 }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} style={{ flexShrink: 0, padding: '7px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>{p}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask me anything about networking…" className="input-field" style={{ flex: 1, margin: 0 }} />
          <button onClick={() => send()} style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? 'linear-gradient(135deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>➤</button>
        </div>
      </div>
    </div>
  )
}

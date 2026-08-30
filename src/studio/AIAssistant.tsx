import { useState } from 'react'
import { AI_PROMPTS } from './data'

type Props = { onBack: () => void }

type Tool = 'synopsis' | 'script' | 'tags' | 'thumbnail' | 'translate' | 'subtitles' | 'mood' | 'pitch'

const TOOLS: { key: Tool; icon: string; name: string; desc: string; badge?: string }[] = [
  { key: 'synopsis', icon: '📝', name: 'Synopsis Writer', desc: 'Generate or improve your synopsis with AI' },
  { key: 'script', icon: '🎬', name: 'Script Assistant', desc: 'Scene breakdowns, dialogue polish, and story notes' },
  { key: 'tags', icon: '🏷️', name: 'Tag Generator', desc: 'Auto-generate SEO-optimized tags' },
  { key: 'thumbnail', icon: '🖼️', name: 'Thumbnail AI', desc: 'AI-generated thumbnail concepts', badge: 'Beta' },
  { key: 'translate', icon: '🌍', name: 'Auto-Translate', desc: 'Translate synopsis and metadata to 20+ languages' },
  { key: 'subtitles', icon: '💬', name: 'Auto-Subtitles', desc: 'AI speech-to-text subtitle generation' },
  { key: 'mood', icon: '🎵', name: 'Mood Analyzer', desc: 'Analyze emotional arc across episodes' },
  { key: 'pitch', icon: '💡', name: 'Pitch Generator', desc: 'Create a compelling pitch deck or logline' },
]

type Msg = { role: 'user' | 'assistant'; text: string; loading?: boolean }

const CONVERSATION: Msg[] = [
  { role: 'assistant', text: "Hello! I'm Pwani AI, your creative assistant. I can help with scripts, synopses, subtitles, tags, translations, and more. What are you working on?" },
]

const AI_RESPONSES: Partial<Record<Tool, string>> = {
  synopsis: "Here's an improved synopsis for your project:\n\n\"In the electric heart of modern Nairobi, four friends navigate ambition, love, and betrayal against a backdrop of music, hustle, and the ever-present pull of home. Nairobi Nights is a gripping drama that captures the soul of a city in motion.\"\n\nWant me to create variations for different platforms?",
  tags: 'Here are optimized tags:\n#NairobiNights #AfricanDrama #KenyanFilm #EastAfrica #SwahiliCinema #AfricanStorytelling #PWANIPlay #BlackCreatives #FilmAfrica #NairobiCity #AfricanTV #KenyaFilm\n\nThese are trending on Pwani Play and social platforms right now.',
  subtitles: 'I can generate subtitles for your uploaded episodes. Upload an episode and I\'ll transcribe and time-stamp it automatically. I support Swahili, English, Yoruba, Amharic, and 17 more languages.',
  pitch: 'Here\'s a logline for Nairobi Nights:\n\n"A pulsating drama set in contemporary Nairobi where four childhood friends discover that chasing their dreams means confronting the city\'s underbelly — and each other."\n\nShall I expand this into a full one-page pitch?',
}

export default function AIAssistant({ onBack }: Props) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null)
  const [messages, setMessages] = useState<Msg[]>(CONVERSATION)
  const [input, setInput] = useState('')
  const [showSuggested, setShowSuggested] = useState(true)

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: Msg = { role: 'user', text }
    const loadingMsg: Msg = { role: 'assistant', text: '', loading: true }
    setMessages(prev => [...prev, userMsg, loadingMsg])
    setInput('')
    setShowSuggested(false)
    setTimeout(() => {
      const tool = Object.keys(AI_RESPONSES).find(k => text.toLowerCase().includes(k)) as Tool | undefined
      const response = tool ? AI_RESPONSES[tool] : `I understand you're asking about "${text}". Let me help with that. Based on your project data, here's my recommendation: Consider focusing on your core emotional hook first, then build outward to secondary themes. Your audience in East Africa resonates strongly with authenticity and cultural grounding.`
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'assistant', text: response ?? '' } : m))
    }, 1400)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Pwani AI Assistant</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1abc9c', animation: 'pulse-glow 2s infinite' }} />
              <p style={{ color: '#1abc9c', fontSize: 12, margin: 0, fontWeight: 600 }}>Online · Powered by Pwani AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      {!activeTool && (
        <div style={{ padding: '16px 20px', flexShrink: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, margin: '0 0 10px', fontFamily: 'DM Mono, monospace' }}>AI TOOLS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {TOOLS.map(t => (
              <button key={t.key} onClick={() => { setActiveTool(t.key); send(`Help me with ${t.name}`) }} style={{ background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: 12, padding: '10px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', position: 'relative' }}>
                <span style={{ fontSize: 22 }}>{t.icon}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{t.name}</span>
                {t.badge && <span style={{ position: 'absolute', top: 4, right: 4, fontSize: 8, padding: '1px 4px', borderRadius: 100, background: 'rgba(243,156,18,0.25)', color: '#f8c471', fontWeight: 700 }}>{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}>
            {m.role === 'assistant' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#9b59b6,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginBottom: 2 }}>🤖</div>}
            <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? '#1e6091' : 'rgba(255,255,255,0.06)', border: `1px solid ${m.role === 'user' ? 'rgba(41,128,185,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
              {m.loading ? (
                <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
                  {[0, 1, 2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(155,89,182,0.8)', animation: `pulse-glow 1.2s ${j * 0.2}s infinite` }} />)}
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.text}</p>
              )}
            </div>
          </div>
        ))}

        {/* Suggested prompts */}
        {showSuggested && (
          <div style={{ marginTop: 8 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>Suggested</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {AI_PROMPTS.slice(0, 4).map(p => (
                <button key={p.id} onClick={() => send(p.label)} style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 12, background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', lineHeight: 1.4 }}>
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 20px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)', display: 'flex', gap: 10 }}>
        <input
          className="input-field"
          placeholder="Ask Pwani AI anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button onClick={() => send(input)} disabled={!input.trim()} style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? 'linear-gradient(135deg,#9b59b6,#2980b9)' : 'rgba(255,255,255,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', fontSize: 18, flexShrink: 0 }}>▶</button>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { AI_TOOLS, AI_SESSIONS, TOOL_META, TOOL_CONTEXT, generateAIResponse, PROMPT_LIBRARY, ECOSYSTEM_DIGEST, AI_MEMORY, type AITool, type ChatMessage, type LibraryPrompt, type MemoryItem } from './data'

type Tab = 'home' | 'chat' | 'tools' | 'history' | 'settings'
type SubScreen = { id: 'root' } | { id: 'tool-chat'; tool: AITool; autoSend?: string } | { id: 'session'; sessionId: string } | { id: 'library' } | { id: 'memory' }
type Props = { onExit: () => void }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'home',     label: 'Home',     icon: '🤖' },
  { key: 'chat',     label: 'Chat',     icon: '💬' },
  { key: 'tools',    label: 'Tools',    icon: '🛠️' },
  { key: 'history',  label: 'History',  icon: '🕐' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

// ─── Shared ───────────────────────────────────────────────────────────────────

function FullScreen({ title, badge, onBack, actions, children }: { title: string; badge?: string; onBack: () => void; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, background: 'rgba(243,156,18,0.12)', color: '#f5b041', fontWeight: 700, border: '1px solid rgba(243,156,18,0.25)' }}>Sample data</span>
        {badge && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(93,173,226,0.12)', color: '#5dade2', fontWeight: 700, border: '1px solid rgba(93,173,226,0.2)' }}>{badge}</span>}
        {actions}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 68 }}>{children}</div>
    </div>
  )
}

// ─── Chat Interface ───────────────────────────────────────────────────────────

function ChatInterface({ tool, onBack, autoSend }: { tool: AITool; onBack: () => void; autoSend?: string }) {
  const meta = TOOL_META[tool]
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'ai0', role: 'ai', content: `Hi! I am the **${meta.label}**. ${meta.desc}\n\nTry one of the suggestions below or ask me anything.`, time: 'Now', tool },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [toast, setToast] = useState('')
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})
  const [versions, setVersions] = useState<{ id: string; label: string; content: string; savedAt: string }[]>([])
  const [showVersions, setShowVersions] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const autoSentRef = useRef(false)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', content: text, time: 'Now' }
    setMessages(p => [...p, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const response = generateAIResponse(tool, text)
      const aiMsg: ChatMessage = { id: `a${Date.now()}`, role: 'ai', content: response, time: 'Now', tool }
      setMessages(p => [...p, aiMsg])
      setTyping(false)
    }, 1200)
  }

  useEffect(() => {
    if (autoSend && !autoSentRef.current) { autoSentRef.current = true; send(autoSend) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend])

  const regenerate = (aiMsgId: string) => {
    const idx = messages.findIndex(m => m.id === aiMsgId)
    if (idx < 1) return
    const priorUser = [...messages.slice(0, idx)].reverse().find(m => m.role === 'user')
    if (!priorUser) return
    setTyping(true)
    setTimeout(() => {
      const response = generateAIResponse(tool, priorUser.content)
      setMessages(p => p.map(m => m.id === aiMsgId ? { ...m, content: response } : m))
      setTyping(false)
      showToast('Regenerated')
    }, 1000)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard?.writeText(content.replace(/\*\*/g, '')).then(() => showToast('Copied to clipboard')).catch(() => showToast('Could not copy'))
  }

  const saveVersion = (content: string) => {
    setVersions(p => [...p, { id: `v${Date.now()}`, label: `Version ${p.length + 1}`, content, savedAt: 'Just now' }])
    showToast('Saved to version history')
  }

  const restoreVersion = (content: string) => {
    setMessages(p => [...p, { id: `a${Date.now()}`, role: 'ai', content: `**Restored draft**\n\n${content}`, time: 'Now', tool }])
    setShowVersions(false)
    showToast('Draft restored to conversation')
  }

  const editPrompt = (content: string) => setInput(content)

  const exportConversation = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : meta.label}: ${m.content.replace(/\*\*/g, '')}`).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${meta.label.replace(/\s+/g, '-').toLowerCase()}-conversation.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Conversation exported')
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '6px 0 3px' }}>{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <p key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '2px 0', paddingLeft: 12 }}>· {line.slice(2)}</p>
      }
      if (line === '') return <div key={i} style={{ height: 6 }} />
      return <p key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: '2px 0', lineHeight: 1.6 }}>{line}</p>
    })
  }

  return (
    <FullScreen
      title={meta.label}
      badge={meta.icon}
      onBack={onBack}
      actions={
        <div style={{ display: 'flex', gap: 6 }}>
          {versions.length > 0 && (
            <button onClick={() => setShowVersions(true)} title="Version history" style={{ background: 'rgba(93,173,226,0.12)', border: '1px solid rgba(93,173,226,0.25)', borderRadius: 10, height: 34, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#5dade2' }}>📜 {versions.length}</button>
          )}
          <button onClick={() => { setPinned(p => !p); showToast(pinned ? 'Unpinned' : 'Pinned conversation') }} title="Pin conversation" style={{ background: pinned ? 'rgba(243,156,18,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${pinned ? 'rgba(243,156,18,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>📌</button>
          <button onClick={() => showToast('Share link copied')} title="Share conversation" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>🔗</button>
          <button onClick={exportConversation} title="Export conversation" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>⬇️</button>
        </div>
      }
    >
      {showVersions && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowVersions(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxHeight: '70vh', overflowY: 'auto', background: '#0f1f38', borderRadius: '24px 24px 0 0', padding: '20px 20px 32px' }}>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Version History</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px' }}>Saved drafts from this conversation</p>
            {versions.map(v => (
              <div key={v.id} style={{ padding: '13px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{v.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{v.savedAt}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 10px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>{v.content.replace(/\*\*/g, '')}</p>
                <button onClick={() => restoreVersion(v.content)} style={{ padding: '6px 14px', borderRadius: 9, background: 'rgba(93,173,226,0.15)', border: '1px solid rgba(93,173,226,0.3)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Restore to conversation</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {toast && <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>{toast}</div>}
      {/* Context indicator — always shows what the AI is drawing from */}
      <div style={{ padding: '10px 16px 0' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '5px 12px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1abc9c' }} />
          Context: Sample data only. No account records are connected.
        </span>
      </div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, width: '100%' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${meta.color}20`, border: `1px solid ${meta.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginTop: 2 }}>{meta.icon}</div>
              )}
              <div style={{ maxWidth: '78%', padding: '11px 14px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.06)', border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                {msg.role === 'user'
                  ? <p style={{ color: 'white', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                  : <div>{renderContent(msg.content)}</div>
                }
              </div>
            </div>
            {/* Message actions */}
            <div style={{ display: 'flex', gap: 4, marginTop: 4, marginRight: msg.role === 'user' ? 0 : undefined, marginLeft: msg.role === 'ai' ? 40 : undefined }}>
              {msg.role === 'ai' && msg.id !== 'ai0' && (
                <>
                  <button onClick={() => copyMessage(msg.content)} title="Copy" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>Copy</button>
                  <button onClick={() => regenerate(msg.id)} title="Regenerate" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>Regenerate</button>
                  <button onClick={() => saveVersion(msg.content)} title="Save as version" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>Save Version</button>
                  <button onClick={() => { setFeedback(p => ({ ...p, [msg.id]: 'up' })); showToast('Thanks for the feedback') }} title="Good response" style={{ background: 'none', border: 'none', color: feedback[msg.id] === 'up' ? '#1abc9c' : 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>👍</button>
                  <button onClick={() => { setFeedback(p => ({ ...p, [msg.id]: 'down' })); showToast('Thanks — noted') }} title="Poor response" style={{ background: 'none', border: 'none', color: feedback[msg.id] === 'down' ? '#e74c3c' : 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>👎</button>
                </>
              )}
              {msg.role === 'user' && (
                <button onClick={() => editPrompt(msg.content)} title="Edit and resend" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>Edit</button>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${meta.color}20`, border: `1px solid ${meta.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{meta.icon}</div>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse-glow 1.2s ease-in-out ${i * 0.3}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '6px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {meta.prompts.map(p => (
          <button key={p} onClick={() => send(p)} style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 100, background: `${meta.color}12`, border: `1px solid ${meta.color}25`, color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>{p}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 16px 24px', display: 'flex', gap: 10 }}>
        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
          placeholder={`Ask ${meta.label}…`}
          style={{ flex: 1, margin: 0 }}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || typing} style={{ width: 46, height: 46, borderRadius: 13, background: input.trim() && !typing ? `linear-gradient(135deg,${meta.color},${meta.color}cc)` : 'rgba(255,255,255,0.06)', border: 'none', color: 'white', fontSize: 18, cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>↑</button>
      </div>
    </FullScreen>
  )
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ onTool, onHistory, onLibrary }: { onTool: (t: AITool, autoSend?: string) => void; onHistory: () => void; onLibrary: () => void }) {
  const highlights = [
    { icon: '📝', title: 'Script ready', desc: '"Swahili Sunrise" opening — 3 scenes developed', time: '2h ago', tool: 'script' as AITool },
    { icon: '🎯', title: 'Grant match found', desc: 'KFC Grant 2026 — 91% profile match', time: 'Yesterday', tool: 'opportunity' as AITool },
    { icon: '📊', title: 'Performance insight', desc: 'Upload Tuesday 7–9 PM for 3× reach', time: '2d ago', tool: 'analytics' as AITool },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, rgba(93,173,226,0.12), rgba(142,68,173,0.1))', border: '1px solid rgba(93,173,226,0.2)', borderRadius: 22, padding: '22px 20px', marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(93,173,226,0.15) 0%, transparent 70%)' }} />
          <div style={{ fontSize: 42, marginBottom: 10 }}>🤖</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: 'white', margin: '0 0 6px' }}>Pwani AI</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.6 }}>Your creative intelligence for African storytelling. 10 specialised AI tools to write, plan, translate, and grow.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onTool('chat')} style={{ padding: '11px 22px', borderRadius: 12, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Start a Conversation →</button>
            <button onClick={onLibrary} style={{ padding: '11px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📚 Prompt Library</button>
          </div>
        </div>

        {/* Ecosystem Insights — cross-module intelligence */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Pwani Ecosystem Insights</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ECOSYSTEM_DIGEST.map(item => {
              const pColor = item.priority === 'Critical' ? '#e74c3c' : item.priority === 'Important' ? '#f39c12' : '#5dade2'
              return (
                <div key={item.id} onClick={() => onTool(item.tool, item.prompt)} style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 15, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{item.title}</p>
                        <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: `${pColor}18`, color: pColor, fontWeight: 700, flexShrink: 0 }}>{item.priority}</span>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '3px 0 0', lineHeight: 1.4 }}>{item.evidence}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent AI activity */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Recent Activity</p>
          <button onClick={onHistory} style={{ background: 'none', border: 'none', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>See all →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {highlights.map((h, i) => {
            const meta = TOOL_META[h.tool]
            return (
              <div key={i} onClick={() => onTool(h.tool)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 15, cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{h.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{h.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 3px' }}>{h.desc}</p>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{h.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick access tools */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Quick Access</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {AI_TOOLS.slice(0, 4).map(t => (
            <button key={t.key} onClick={() => onTool(t.key)} style={{ padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{t.icon}</div>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>{t.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{t.desc.split('.')[0]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Prompt Library ───────────────────────────────────────────────────────────

function PromptLibraryScreen({ onBack, onRun }: { onBack: () => void; onRun: (p: LibraryPrompt) => void }) {
  const [category, setCategory] = useState<string>('All')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const activeCategories = ['All', ...Array.from(new Set(PROMPT_LIBRARY.map(p => p.category)))]
  const filtered = category === 'All' ? PROMPT_LIBRARY : PROMPT_LIBRARY.filter(p => p.category === category)
  const diffColor = { Beginner: '#1abc9c', Intermediate: '#f39c12', Advanced: '#e74c3c' }

  return (
    <FullScreen title="Prompt Library" badge={`${PROMPT_LIBRARY.length}`} onBack={onBack}>
      <div style={{ padding: '10px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {activeCategories.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 100, background: category === c ? 'rgba(93,173,226,0.18)' : 'rgba(255,255,255,0.05)', border: `1px solid ${category === c ? 'rgba(93,173,226,0.35)' : 'rgba(255,255,255,0.08)'}`, color: category === c ? '#5dade2' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>{c}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(p => {
          const meta = TOOL_META[p.tool]
          const isFav = favorites.has(p.id)
          return (
            <div key={p.id} style={{ padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>{meta.icon}</span>
                  <div>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{p.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{p.description}</p>
                  </div>
                </div>
                <button onClick={() => setFavorites(prev => { const next = new Set(prev); next.has(p.id) ? next.delete(p.id) : next.add(p.id); return next })} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: isFav ? '#f39c12' : 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{isFav ? '★' : '☆'}</button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${diffColor[p.difficulty]}18`, color: diffColor[p.difficulty], fontWeight: 700 }}>{p.difficulty}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>⏱ ~{p.estMinutes} min</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.category}</span>
              </div>
              <button onClick={() => onRun(p)} style={{ width: '100%', padding: '9px', borderRadius: 10, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, color: meta.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Run Prompt →</button>
            </div>
          )
        })}
      </div>
    </FullScreen>
  )
}

// ─── AI Memory ────────────────────────────────────────────────────────────────

function MemoryScreen({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<MemoryItem[]>(AI_MEMORY)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000) }
  const categories = Array.from(new Set(items.map(i => i.category)))

  const forget = (id: string) => {
    setItems(p => p.filter(i => i.id !== id))
    showToast('Forgotten')
  }

  return (
    <FullScreen title="What Pwani AI Remembers" badge={`${items.length}`} onBack={onBack}>
      {toast && <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{toast}</div>}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 100px' }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 18px', lineHeight: 1.5 }}>
          Sample memory only. No personal memory is connected or persisted in this prototype.
        </p>
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>{cat}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.filter(i => i.category === cat).map(item => (
                <div key={item.id} style={{ padding: '13px 14px', borderRadius: 15, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ color: 'white', fontSize: 13, margin: '0 0 6px', lineHeight: 1.4 }}>{item.fact}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '0 0 2px' }}>Why: {item.reason}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{item.source} · {item.date}</span>
                    <button onClick={() => forget(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '2px 6px' }}>Forget</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>Nothing saved right now.</p>
        )}
      </div>
    </FullScreen>
  )
}

// ─── AI Command Palette ────────────────────────────────────────────────────────

type PaletteResult = { icon: string; label: string; sub: string; action: () => void }

function CommandPalette({ onClose, onTool, onLibrary, onMemory }: { onClose: () => void; onTool: (t: AITool, autoSend?: string) => void; onLibrary: () => void; onMemory: () => void }) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const results: PaletteResult[] = [
    ...AI_TOOLS.map(t => ({ icon: t.icon, label: `Open ${t.label}`, sub: 'Tool', action: () => onTool(t.key) })),
    ...PROMPT_LIBRARY.map(p => ({ icon: '📚', label: p.title, sub: `Prompt · ${p.category}`, action: () => onTool(p.tool, p.prompt) })),
    { icon: '🧠', label: 'What Pwani AI Remembers', sub: 'Memory', action: onMemory },
    { icon: '📚', label: 'Browse Prompt Library', sub: 'Library', action: onLibrary },
  ]
  const filtered = q.trim() === '' ? results.slice(0, 8) : results.filter(r => r.label.toLowerCase().includes(q.toLowerCase()) || r.sub.toLowerCase().includes(q.toLowerCase())).slice(0, 10)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '14vh' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, margin: '0 16px', background: '#0f1f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: 16 }}>🔎</span>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search tools, prompts, memory…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif' }} />
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.5)', fontSize: 11, padding: '4px 8px', cursor: 'pointer' }}>Esc</button>
        </div>
        <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: 8 }}>
          {filtered.map((r, i) => (
            <button key={i} onClick={() => { r.action(); onClose() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 17, width: 26, textAlign: 'center' }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 13, margin: 0 }}>{r.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{r.sub}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No matches</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Voice Conversation ───────────────────────────────────────────────────────

function VoiceSheet({ onClose, onTranscribed }: { onClose: () => void; onTranscribed: (text: string) => void }) {
  const [phase, setPhase] = useState<'listening' | 'processing' | 'confirm'>('listening')
  const sample = 'Help me find grants that match my profile'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('processing'), 1800)
    const t2 = setTimeout(() => setPhase('confirm'), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#0f1f38', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 18px', background: 'linear-gradient(135deg,#5dade2,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, animation: phase === 'listening' ? 'pulse-glow 1.1s ease-in-out infinite' : 'none' }}>🎙</div>
        <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{phase === 'listening' ? 'Listening…' : phase === 'processing' ? 'Processing…' : 'Did I get that right?'}</p>
        <p style={{ color: phase === 'confirm' ? 'white' : 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 20px', fontStyle: phase === 'confirm' ? 'italic' : 'normal' }}>{phase === 'listening' ? 'Speak naturally — say what you need help with' : `"${sample}"`}</p>
        {phase === 'confirm' ? (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={onClose} style={{ padding: '10px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
            <button onClick={() => setPhase('listening')} style={{ padding: '10px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Try Again</button>
            <button onClick={() => onTranscribed(sample)} style={{ padding: '10px 22px', borderRadius: 12, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Send →</button>
          </div>
        ) : (
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
        )}
      </div>
    </div>
  )
}

// ─── Chat Tab (general) ───────────────────────────────────────────────────────

function GeneralChat() {
  return <ChatInterface tool="chat" onBack={() => {}} />
}

// ─── Tools Tab ────────────────────────────────────────────────────────────────

function ToolsTab({ onTool }: { onTool: (t: AITool) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>AI Tools</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Specialised AI for every creative workflow</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AI_TOOLS.map(t => (
            <button key={t.key} onClick={() => onTool(t.key)} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${t.color}15`, border: `1px solid ${t.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{t.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20, flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ onSession }: { onSession: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = AI_SESSIONS.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.preview.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>History</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 14px' }}>Past AI sessions</p>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
          <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions…" style={{ margin: 0, paddingLeft: 36, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(s => {
            const meta = TOOL_META[s.tool]
            return (
              <div key={s.id} onClick={() => onSession(s.id)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{meta.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{s.title}</p>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 8 }}>{s.time}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 5px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>{s.preview}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${meta.color}12`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{s.messages} messages</span>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🕐</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No sessions yet</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Start a conversation with any AI tool to see your history here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function AISettingsTab({ onMemory }: { onMemory: () => void }) {
  const [settings, setSettings] = useState({ language: 'English', tone: 'Professional', memory: true, suggestions: true, saveHistory: true })
  const [automation, setAutomation] = useState<'suggest' | 'confirm' | 'routine'>('suggest')
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  const AUTOMATION_LEVELS = [
    { key: 'suggest' as const, label: 'Suggestions Only', desc: 'AI never acts on its own — every recommendation waits for you to act on it manually.' },
    { key: 'confirm' as const, label: 'Confirm Every Action', desc: 'AI can prepare actions (drafts, applications, schedules) but always asks before anything is sent or saved.' },
    { key: 'routine' as const, label: 'Approved Routine Actions', desc: 'Low-risk, repetitive actions you\'ve approved before (like saving a draft) can happen automatically. High-impact actions still always ask.' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      {toast && <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>{toast}</div>}
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>AI Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Personalise your AI experience</p>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Language & Tone</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
          {[
            { label: 'Preferred Language', value: settings.language, options: ['English', 'Kiswahili', 'French', 'Hausa', 'Yoruba', 'Amharic'] },
            { label: 'AI Tone', value: settings.tone, options: ['Professional', 'Casual', 'Creative', 'Technical', 'Motivational'] },
          ].map((row, i) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{row.label}</span>
              <select value={row.value} onChange={e => { setSettings(p => ({ ...p, [row.label === 'Preferred Language' ? 'language' : 'tone']: e.target.value })); showToast('Saved') }} style={{ padding: '6px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, cursor: 'pointer', outline: 'none', fontFamily: 'Outfit, sans-serif' }}>
                {row.options.map(o => <option key={o} value={o} style={{ background: '#0a1628' }}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Automation Level</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
          {AUTOMATION_LEVELS.map((lvl, i) => (
            <button key={lvl.key} onClick={() => { setAutomation(lvl.key); showToast('Saved') }} style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', borderBottom: i < AUTOMATION_LEVELS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', borderLeft: 'none', borderRight: 'none', borderTop: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${automation === lvl.key ? '#5dade2' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                {automation === lvl.key && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#5dade2' }} />}
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{lvl.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{lvl.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Features</p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
          {[
            { key: 'memory' as const, label: 'AI Memory', desc: 'AI remembers context across sessions' },
            { key: 'suggestions' as const, label: 'Smart Suggestions', desc: 'Show AI-powered prompts and tips' },
            { key: 'saveHistory' as const, label: 'Save History', desc: 'Keep a log of all AI conversations' },
          ].map((item, i) => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>{item.desc}</p>
              </div>
              <button onClick={() => { setSettings(p => ({ ...p, [item.key]: !p[item.key] })); showToast('Saved') }} style={{ width: 46, height: 26, borderRadius: 13, background: settings[item.key] ? '#1e6091' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: settings[item.key] ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </button>
            </div>
          ))}
        </div>

        <button onClick={onMemory} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>
          <span>🧠 What Pwani AI Remembers</span> <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>›</span>
        </button>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Data & Privacy</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Export my AI data', 'Clear conversation history', 'Reset AI preferences'].map((label, i) => (
            <button key={label} onClick={() => showToast('Prototype only — no data was changed.')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: i === 1 ? '#e74c3c' : 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {label} <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function AIShell({ onExit }: Props) {
  const [tab, setTab] = useState<Tab>('home')
  const [sub, setSub] = useState<SubScreen>({ id: 'root' })
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const push = (s: SubScreen) => setSub(s)
  const back = () => setSub({ id: 'root' })
  const isRoot = sub.id === 'root'

  const renderSub = () => {
    if (sub.id === 'tool-chat') return <ChatInterface tool={sub.tool} onBack={back} autoSend={sub.autoSend} />
    if (sub.id === 'session') {
      const session = AI_SESSIONS.find(s => s.id === sub.sessionId)
      return session ? <ChatInterface tool={session.tool} onBack={back} /> : null
    }
    if (sub.id === 'library') return <PromptLibraryScreen onBack={back} onRun={p => push({ id: 'tool-chat', tool: p.tool, autoSend: p.prompt })} />
    if (sub.id === 'memory') return <MemoryScreen onBack={back} />
    return null
  }

  const renderTab = () => {
    switch (tab) {
      case 'home':     return <HomeTab onTool={(t, autoSend) => push({ id: 'tool-chat', tool: t, autoSend })} onHistory={() => setTab('history')} onLibrary={() => push({ id: 'library' })} />
      case 'chat':     return <ChatInterface tool="script" onBack={() => {}} />
      case 'tools':    return <ToolsTab onTool={t => push({ id: 'tool-chat', tool: t })} />
      case 'history':  return <HistoryTab onSession={id => push({ id: 'session', sessionId: id })} />
      case 'settings': return <AISettingsTab onMemory={() => push({ id: 'memory' })} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {isRoot && (
        <>
          {/* Header */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={onExit} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#5dade2,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
              <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Pwani AI</span>
              <span style={{ fontSize: 9, padding: '3px 6px', borderRadius: 8, color: '#f5b041', background: 'rgba(243,156,18,0.12)', border: '1px solid rgba(243,156,18,0.25)', fontWeight: 700 }}>SAMPLE DATA</span>
            </div>
            <button onClick={() => setPaletteOpen(true)} title="Search (⌘K)" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, color: 'white' }}>🔎</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{renderTab()}</div>

          {/* Floating voice conversation button */}
          <button
            onClick={() => setVoiceOpen(true)}
            title="Voice conversation"
            style={{
              position: 'fixed', right: 16, bottom: 92, zIndex: 90,
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg,#8e44ad,#5b2c6f)',
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: '0 6px 20px rgba(142,68,173,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, cursor: 'pointer',
            }}
          >🎙</button>

          {/* Bottom nav */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', padding: '8px 0 20px' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setSub({ id: 'root' }) }} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
                <span style={{ fontSize: 20, filter: tab === t.key ? 'none' : 'grayscale(1) opacity(0.4)' }}>{t.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: tab === t.key ? '#5dade2' : 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>{t.label}</span>
                {tab === t.key && <div style={{ width: 18, height: 2, borderRadius: 1, background: '#5dade2' }} />}
              </button>
            ))}
          </div>
        </>
      )}

      {!isRoot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0a1628', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.22s ease' }}>
          {renderSub()}
        </div>
      )}

      {voiceOpen && (
        <VoiceSheet
          onClose={() => setVoiceOpen(false)}
          onTranscribed={text => { setVoiceOpen(false); push({ id: 'tool-chat', tool: 'chat', autoSend: text }) }}
        />
      )}

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onTool={(t, autoSend) => push({ id: 'tool-chat', tool: t, autoSend })}
          onLibrary={() => push({ id: 'library' })}
          onMemory={() => push({ id: 'memory' })}
        />
      )}
    </div>
  )
}

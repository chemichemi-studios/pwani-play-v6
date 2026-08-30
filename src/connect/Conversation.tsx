import { useState, useRef, useEffect } from 'react'
import { CONVERSATIONS, ME } from './data'

type Props = { conversationId: string; onBack: () => void; onProfile: (id: string) => void }

const QUICK_REPLIES = ['Sounds great!', 'Let me check and get back to you', 'Can we schedule a call?', '👍', '🙏']

export default function Conversation({ conversationId, onBack, onProfile }: Props) {
  const conv = CONVERSATIONS.find(c => c.id === conversationId) ?? CONVERSATIONS[0]
  const [messages, setMessages] = useState(conv.messages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [isRequest] = useState(conv.isRequest)
  const [requestAccepted, setRequestAccepted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const displayName = conv.participant?.name || conv.name || 'Group'
  const photo = conv.participant?.photo || ''
  const isGroup = conv.type === 'group'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text?: string) => {
    const content = text || input.trim()
    if (!content) return
    const newMsg = { id: `msg${Date.now()}`, senderId: 'me', content, timestamp: 'Just now', type: 'text' as const, read: false }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    // Simulate typing reply
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { id: `msg${Date.now()}r`, senderId: conv.participant?.id || 'p1', content: 'Thanks for reaching out! I\'ll get back to you soon. 🙏', timestamp: 'Just now', type: 'text', read: true }])
    }, 1800)
  }

  const TYPE_ICONS = { text: null, image: '🖼️', document: '📄', voice: '🎙️', portfolio: '🎬', project_link: '🔗' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'white', flexShrink: 0 }}>←</button>
        <div onClick={() => conv.participant && onProfile(conv.participant.id)} style={{ cursor: conv.participant ? 'pointer' : 'default', flexShrink: 0 }}>
          {isGroup ? (
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👥</div>
          ) : (
            <img src={photo} alt={displayName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 1px' }}>{displayName}</p>
          <p style={{ color: '#1abc9c', fontSize: 11, margin: 0 }}>{isGroup ? `${(conv.participants?.length ?? 0) + 1} members` : 'Active now'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>📞</button>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>📹</button>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>···</button>
        </div>
      </div>

      {/* Message request banner */}
      {isRequest && !requestAccepted && (
        <div style={{ margin: '12px 16px', padding: '14px', background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.18)', borderRadius: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <img src={conv.participant?.photo || ''} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 1px' }}>{displayName} sent you a message request</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>You are not connected. Review before responding.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setRequestAccepted(true)} style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Accept</button>
            <button style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)', color: '#e74c3c', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Decline</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 80 }}>
        {messages.map(msg => {
          const isMe = msg.senderId === 'me'
          const typeIcon = msg.type !== 'text' ? TYPE_ICONS[msg.type] : null
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
              {!isMe && (
                <img src={conv.participant?.photo || CONVERSATIONS[0].participant?.photo || ''} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 2 }} />
              )}
              <div style={{ maxWidth: '72%' }}>
                <div style={{ padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? 'linear-gradient(135deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.07)', border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  {typeIcon && <span style={{ marginRight: 6 }}>{typeIcon}</span>}
                  <span style={{ color: 'white', fontSize: 14, lineHeight: 1.5 }}>{msg.content}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, margin: '3px 4px 0', textAlign: isMe ? 'right' : 'left', fontFamily: 'DM Mono, monospace' }}>{msg.timestamp}{isMe && (msg.read ? ' ✓✓' : ' ✓')}</p>
              </div>
            </div>
          )
        })}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <img src={conv.participant?.photo || ''} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.07)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Attach options */}
      {showAttach && (
        <div style={{ padding: '8px 16px 0', display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[{ icon: '🖼️', label: 'Photo' }, { icon: '📄', label: 'File' }, { icon: '🎬', label: 'Portfolio' }, { icon: '🔗', label: 'Project' }, { icon: '🎙️', label: 'Voice' }].map(a => (
            <button key={a.label} onClick={() => setShowAttach(false)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{a.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick replies */}
      {messages.length > 0 && !isRequest && (
        <div style={{ padding: '8px 16px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {QUICK_REPLIES.map(qr => (
            <button key={qr} onClick={() => send(qr)} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>{qr}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding: '8px 16px 24px', display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setShowAttach(!showAttach)} style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, flexShrink: 0, color: 'white' }}>+</button>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message…" disabled={isRequest && !requestAccepted}
          style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, color: 'white', fontSize: 14, fontFamily: 'Outfit, sans-serif', outline: 'none', opacity: isRequest && !requestAccepted ? 0.4 : 1 }}
        />
        <button onClick={() => send()} disabled={!input.trim() || (isRequest && !requestAccepted)} style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', fontSize: 18, flexShrink: 0 }}>
          ➤
        </button>
      </div>
    </div>
  )
}

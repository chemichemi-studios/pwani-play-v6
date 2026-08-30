import { useState } from 'react'

type Props = { onBack: () => void }

type CommentTab = 'comments' | 'mentions' | 'followers'

const COMMENTS = [
  { id: 'c1', user: 'Amara Osei', avatar: '🌟', text: 'This episode was absolutely breathtaking. The cinematography is next level!', time: '2h ago', likes: 42, project: 'Nairobi Nights', episode: 'S1E3', replied: false },
  { id: 'c2', user: 'Kwame Mensah', avatar: '🎭', text: 'When is Season 2 coming? I need more! The cliffhanger ending was too much 😭', time: '4h ago', likes: 88, project: 'Nairobi Nights', episode: 'S1E4', replied: false },
  { id: 'c3', user: 'Fatima Al-Rashid', avatar: '🌺', text: 'The way you captured the Swahili coast... I felt like I was right there.', time: '6h ago', likes: 124, project: 'Mama Afrika', episode: 'E2', replied: true },
  { id: 'c4', user: 'Chidi Nwosu', avatar: '🎪', text: 'The soundtrack is amazing. Who did the original score?', time: '1d ago', likes: 16, project: 'Rhythm & Soul', episode: 'E1', replied: false },
  { id: 'c5', user: 'Zanele Mokoena', avatar: '🦋', text: 'Representation matters. So proud to see stories like this on screen.', time: '2d ago', likes: 203, project: 'Nairobi Nights', episode: 'S1E1', replied: true },
]

const MENTIONS = [
  { id: 'm1', user: 'FilmAfrica Network', avatar: '📽️', text: 'Just watched @creator\'s latest episode — this is what African cinema should look like!', time: '3h ago', source: 'Twitter / X' },
  { id: 'm2', user: 'Pwani Play Editorial', avatar: '🎬', text: 'Featured in our "Best of the Month" editorial. Congrats to @creator!', time: '1d ago', source: 'Pwani Play' },
  { id: 'm3', user: 'Kenyan Film Commission', avatar: '🇰🇪', text: '@creator\'s work is a shining example of East African storytelling excellence.', time: '2d ago', source: 'Instagram' },
]

const FOLLOWERS = [
  { id: 'f1', name: 'Amara Osei', avatar: '🌟', since: '2025-01', projects: 4, verified: false },
  { id: 'f2', name: 'FilmAfrica Network', avatar: '📽️', since: '2025-06', projects: 0, verified: true },
  { id: 'f3', name: 'Kwame Mensah', avatar: '🎭', since: '2026-01', projects: 1, verified: false },
  { id: 'f4', name: 'Zanele Mokoena', avatar: '🦋', since: '2025-09', projects: 2, verified: false },
  { id: 'f5', name: 'Fatima Al-Rashid', avatar: '🌺', since: '2026-03', projects: 0, verified: true },
]

export default function Community({ onBack }: Props) {
  const [tab, setTab] = useState<CommentTab>('comments')
  const [comments, setComments] = useState(COMMENTS)
  const [reply, setReply] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const sendReply = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, replied: true } : c))
    setReply(null)
    setReplyText('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Community</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>18.4K followers · {comments.filter(c => !c.replied).length} unread comments</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
          {([
            { key: 'comments', label: '💬 Comments', count: comments.filter(c => !c.replied).length },
            { key: 'mentions', label: '@ Mentions', count: MENTIONS.length },
            { key: 'followers', label: '👥 Followers', count: 0 },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '12px 8px', border: 'none', background: 'none', cursor: 'pointer',
              color: tab === t.key ? '#2980b9' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              borderBottom: `2px solid ${tab === t.key ? '#2980b9' : 'transparent'}`,
              position: 'relative',
            }}>
              {t.label}
              {t.count > 0 && <span style={{ marginLeft: 4, fontSize: 10, background: '#e74c3c', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>
        {tab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map(c => (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${!c.replied ? 'rgba(41,128,185,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '14px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{c.user}</p>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{c.time}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>{c.project} · {c.episode}</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 }}>{c.text}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>❤️ {c.likes}</span>
                  {c.replied
                    ? <span style={{ fontSize: 11, color: '#1abc9c', fontWeight: 600 }}>✓ Replied</span>
                    : <button onClick={() => setReply(reply === c.id ? null : c.id)} style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Reply</button>
                  }
                </div>
                {reply === c.id && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <input className="input-field" placeholder="Write a reply…" value={replyText} onChange={e => setReplyText(e.target.value)} style={{ flex: 1, marginBottom: 0, fontSize: 13 }} />
                    <button onClick={() => sendReply(c.id)} disabled={!replyText.trim()} style={{ padding: '0 16px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Send</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'mentions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MENTIONS.map(m => (
              <div key={m.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{m.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{m.user}</p>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{m.time}</span>
                    </div>
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2' }}>{m.source}</span>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{m.text}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'followers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FOLLOWERS.map(f => (
              <div key={f.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{f.name}</p>
                    {f.verified && <span style={{ fontSize: 12 }}>✓</span>}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>Since {f.since} {f.projects > 0 ? `· ${f.projects} collab${f.projects !== 1 ? 's' : ''}` : ''}</p>
                </div>
                <button style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(41,128,185,0.12)', border: '1px solid rgba(41,128,185,0.2)', color: '#5dade2', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Follow Back</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

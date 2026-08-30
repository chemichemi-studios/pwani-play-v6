import { useState } from 'react'
import { POSTS, ME } from './data'
import type { Post } from './data'

type Props = {
  onProfile: (userId: string) => void
  onCreatePost: () => void
}

const POST_TYPE_LABELS = { update: 'Update', announcement: '📣 Announcement', behind_scenes: '🎬 Behind the Scenes', news: '📰 News', opportunity: '💼 Opportunity', discussion: '💬 Discussion', milestone: '🏆 Milestone' }

export default function ConnectFeed({ onProfile }: Props) {
  const [posts, setPosts] = useState(POSTS)
  const [activeFilter, setActiveFilter] = useState('all')

  const toggleLike = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  const toggleSave = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p))

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'announcement', label: 'Announcements' },
    { key: 'opportunity', label: 'Opportunities' },
    { key: 'discussion', label: 'Discussions' },
  ]

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.type === activeFilter)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 56 }}>
      {/* Your story / quick post */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <img src={ME.photo} alt={ME.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(41,128,185,0.4)' }} />
          <div style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)', cursor: 'text' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Share an update, announcement, or opportunity…</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingLeft: 50 }}>
          {[{ icon: '📷', label: 'Photo' }, { icon: '🎬', label: 'Video' }, { icon: '💼', label: 'Opportunity' }].map(a => (
            <button key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 16px', overflowX: 'auto' }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', background: activeFilter === f.key ? '#1e6091' : 'rgba(255,255,255,0.06)', color: activeFilter === f.key ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{f.label}</button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filtered.map(post => (
          <PostCard key={post.id} post={post} onAuthorPress={() => onProfile(post.author.id)} onLike={() => toggleLike(post.id)} onSave={() => toggleSave(post.id)} />
        ))}
      </div>
    </div>
  )
}

function PostCard({ post, onAuthorPress, onLike, onSave }: { post: Post; onAuthorPress: () => void; onLike: () => void; onSave: () => void }) {
  const [showActions, setShowActions] = useState(false)
  const [commented, setCommented] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent' }}>
      {/* Author row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '14px 16px 10px' }}>
        <div onClick={onAuthorPress} style={{ cursor: 'pointer', flexShrink: 0, position: 'relative' }}>
          <img src={post.author.photo} alt={post.author.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
          {post.author.verified && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 16, height: 16, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>✓</div>}
        </div>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onAuthorPress}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>{post.author.name}</span>
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', fontWeight: 600 }}>{POST_TYPE_LABELS[post.type]}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '1px 0 0' }}>{post.author.profession} · {post.timestamp}</p>
        </div>
        <button onClick={() => setShowActions(!showActions)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>···</button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 10px' }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div style={{ margin: '0 0 10px', overflow: 'hidden' }}>
          <img src={post.image} alt="Post" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {post.tags.map(tag => <span key={tag} style={{ color: '#5dade2', fontSize: 12, cursor: 'pointer' }}>#{tag}</span>)}
        </div>
      )}

      {/* Stats */}
      <div style={{ padding: '4px 16px 10px', display: 'flex', gap: 12, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        <span>{post.likes.toLocaleString()} likes</span>
        <span>{post.comments} comments</span>
        <span>{post.shares} shares</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2px 0' }}>
        {[
          { icon: post.liked ? '❤️' : '🤍', label: post.liked ? 'Liked' : 'Like', color: post.liked ? '#e74c3c' : 'rgba(255,255,255,0.5)', action: onLike },
          { icon: '💬', label: 'Comment', color: 'rgba(255,255,255,0.5)', action: () => setCommented(!commented) },
          { icon: '↗️', label: 'Share', color: 'rgba(255,255,255,0.5)', action: () => {} },
          { icon: post.saved ? '🔖' : '🏷️', label: post.saved ? 'Saved' : 'Save', color: post.saved ? '#f39c12' : 'rgba(255,255,255,0.5)', action: onSave },
        ].map(a => (
          <button key={a.label} onClick={a.action} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 16 }}>{a.icon}</span>
            <span style={{ color: a.color, fontSize: 10, fontWeight: 600 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Comment input */}
      {commented && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <img src={ME.photo} alt="Me" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Add a comment…</span>
          </div>
        </div>
      )}

      {/* Action sheet */}
      {showActions && (
        <div style={{ margin: '0 16px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          {['Copy Link', 'Follow ' + post.author.name, 'Not Interested', '⚠️ Report Post'].map(action => (
            <button key={action} onClick={() => setShowActions(false)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', color: action.startsWith('⚠️') ? '#e74c3c' : 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', textAlign: 'left', fontFamily: 'Outfit, sans-serif' }}>
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

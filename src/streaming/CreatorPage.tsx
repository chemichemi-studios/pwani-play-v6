import { useState } from 'react'
import { CREATORS, CONTENT, type ContentItem } from './data'

type Props = {
  creatorId: string
  onBack: () => void
  onOpenContent: (item: ContentItem) => void
  onShare: () => void
  onEarnCoins: (n: number) => void
}

export default function CreatorPage({ creatorId, onBack, onOpenContent, onShare, onEarnCoins }: Props) {
  const creator = CREATORS.find(c => c.id === creatorId) ?? CREATORS[0]
  const [following, setFollowing] = useState(false)
  const [supported, setSupported] = useState(false)
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'awards' | 'about'>('videos')
  const [supportAmount, setSupportAmount] = useState<number | null>(null)
  const [showSupportSheet, setShowSupportSheet] = useState(false)

  const creatorContent = CONTENT.filter((_, i) => i % 2 === (CREATORS.indexOf(creator) % 2))

  const SUPPORT_TIERS = [
    { coins: 50,  label: 'Coffee ☕', desc: 'Show your appreciation' },
    { coins: 150, label: 'Supporter 🌟', desc: 'Keep the cameras rolling' },
    { coins: 500, label: 'Patron 🏆', desc: 'You\'re a legend' },
  ]

  const AWARDS = [
    { title: 'AMAA Best Director 2024', body: 'Africa Movie Academy Awards', icon: '🏆' },
    { title: 'AFRIFF Grand Prize', body: 'Africa International Film Festival', icon: '🥇' },
    { title: 'Pwani Creator of the Year', body: 'Platform-wide recognition', icon: '⭐' },
  ]

  const PLAYLISTS = [
    { title: 'Best of 2024', count: 8, img: creatorContent[0]?.img },
    { title: 'Behind the Lens', count: 5, img: creatorContent[1]?.img ?? creatorContent[0]?.img },
    { title: 'Masterclasses', count: 12, img: creatorContent[0]?.img },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', overflowY: 'auto', paddingBottom: 40 }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: 200 }}>
        <img src={creator.banner} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#103058' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.2) 0%, #0a1628 100%)' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 52, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>←</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onShare} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>📤</button>
          </div>
        </div>
      </div>

      {/* Profile section */}
      <div style={{ padding: '0 20px', marginTop: -40, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, border: '3px solid #0a1628', flexShrink: 0, position: 'relative' }}>
            {creator.avatar}
            {creator.verified && (
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#2980b9', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>{creator.name}</h2>
            </div>
            <p style={{ color: '#5dade2', fontSize: 13, margin: '0 0 4px', fontWeight: 600 }}>{creator.role}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>
          {[
            { label: 'Followers', value: creator.followers },
            { label: 'Content', value: `${creator.content}` },
            { label: 'Trust Score', value: '98%' },
          ].map(({ label, value }, i) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', padding: '14px 8px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{value}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '0 0 20px' }}>{creator.bio}</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button
            onClick={() => { setFollowing(!following) }}
            style={{
              flex: 2, padding: '14px', borderRadius: 12, cursor: 'pointer',
              background: following ? 'rgba(41,128,185,0.15)' : 'linear-gradient(135deg,#1e6091,#2980b9)',
              color: following ? '#5dade2' : 'white',
              fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              border: `1px solid ${following ? 'rgba(41,128,185,0.3)' : 'transparent'}`,
              transition: 'all 0.2s ease',
            }}
          >
            {following ? '✓ Following' : '+ Follow'}
          </button>
          <button
            onClick={() => setShowSupportSheet(true)}
            style={{
              flex: 2, padding: '14px', borderRadius: 12, border: '1px solid rgba(243,156,18,0.3)', cursor: 'pointer',
              background: supported ? 'rgba(243,156,18,0.15)' : 'rgba(243,156,18,0.08)',
              color: supported ? '#f8c471' : 'rgba(243,156,18,0.8)',
              fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {supported ? '💛 Supported' : '💖 Support'}
          </button>
          <button style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', fontSize: 18 }}>
            💬
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ position: 'sticky', top: 0, background: '#0a1628', zIndex: 5, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 4 }}>
        <div style={{ display: 'flex', padding: '0 20px' }}>
          {(['videos', 'playlists', 'awards', 'about'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '14px 0', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? '#2980b9' : 'transparent'}`,
              color: activeTab === tab ? '#2980b9' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 20px' }}>
        {activeTab === 'videos' && (
          <>
            {creatorContent.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {creatorContent.map(item => (
                  <div key={item.id} onClick={() => onOpenContent(item)} style={{ display: 'flex', gap: 14, cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={item.img} alt={item.title} style={{ width: 110, height: 70, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 12, color: '#0a1628', marginLeft: 2 }}>▶</span>
                        </div>
                      </div>
                      {item.premium && (
                        <div style={{ position: 'absolute', top: 6, left: 6, background: 'linear-gradient(135deg,#ca6f1e,#f39c12)', borderRadius: 4, padding: '1px 6px' }}>
                          <span style={{ fontSize: 9, color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>PRO</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{item.type} · {item.runtime}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#f8c471' }}>⭐ {item.rating}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{item.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎥</div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>No videos published yet</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'playlists' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PLAYLISTS.map(pl => (
              <div key={pl.title} style={{ display: 'flex', gap: 14, cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={pl.img} alt={pl.title} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 10, display: 'block', background: '#103058' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22 }}>🎞</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{pl.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{pl.count} titles</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'awards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(creator.verified ? AWARDS : AWARDS.slice(0, 1)).map(award => (
              <div key={award.title} style={{ display: 'flex', gap: 14, padding: '16px', background: 'rgba(243,156,18,0.06)', border: '1px solid rgba(243,156,18,0.15)', borderRadius: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{award.icon}</span>
                <div>
                  <p style={{ color: '#f8c471', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{award.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>{award.body}</p>
                </div>
              </div>
            ))}
            {!creator.verified && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No awards listed yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16 }}>
              {[
                { label: 'Role', value: creator.role },
                { label: 'Content Count', value: `${creator.content} titles` },
                { label: 'Followers', value: creator.followers },
                { label: 'Verified', value: creator.verified ? '✓ Verified Creator' : 'Unverified' },
                { label: 'Trust Score', value: '98 / 100' },
                { label: 'Member Since', value: '2022' },
                { label: 'Languages', value: 'Swahili, English' },
                { label: 'Based In', value: 'Nairobi, Kenya' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span style={{ fontSize: 13, color: 'white', fontWeight: 500, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Support bottom sheet */}
      {showSupportSheet && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setShowSupportSheet(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0d2040', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.1)', padding: '20px 20px 48px', maxWidth: 430, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
            </div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: '0 0 6px', textAlign: 'center' }}>Support {creator.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', margin: '0 0 24px' }}>Your support goes directly to this creator 💖</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {SUPPORT_TIERS.map(tier => (
                <button
                  key={tier.coins}
                  onClick={() => setSupportAmount(tier.coins)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', borderRadius: 14, cursor: 'pointer',
                    background: supportAmount === tier.coins ? 'rgba(243,156,18,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${supportAmount === tier.coins ? '#f39c12' : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{tier.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>{tier.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 18 }}>🪙</span>
                    <span style={{ fontSize: 18, color: '#f8c471', fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>{tier.coins}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (supportAmount) {
                  setSupported(true)
                  onEarnCoins(-supportAmount)
                  setShowSupportSheet(false)
                }
              }}
              className="btn-gold"
              style={{ opacity: supportAmount ? 1 : 0.4 }}
            >
              {supportAmount ? `Send ${supportAmount} Coins to ${creator.name}` : 'Select a tier above'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

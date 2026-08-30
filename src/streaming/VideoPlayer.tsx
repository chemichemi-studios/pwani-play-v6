import { useState, useEffect, useRef } from 'react'
import { type ContentItem } from './data'

type Props = { item: ContentItem; onClose: () => void; onNextEpisode?: () => void }

export default function VideoPlayer({ item, onClose, onNextEpisode }: Props) {
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(item.progress ?? 0)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState('1080p')
  const [speed, setSpeed] = useState('1×')
  const [subtitles, setSubtitles] = useState(true)
  const [showQuality, setShowQuality] = useState(false)
  const [showSpeed, setShowSpeed] = useState(false)
  const [showSubMenu, setShowSubMenu] = useState(false)
  const [locked, setLocked] = useState(false)
  const [skipIntroVisible] = useState(progress < 0.12)
  const [showNextEp, setShowNextEp] = useState(false)
  const [showTriviaCard, setShowTriviaCard] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [brightness, setBrightness] = useState(1)
  const [mini, setMini] = useState(false)
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (playing) {
      progressTimer.current = setInterval(() => {
        setProgress(p => {
          const next = Math.min(p + 0.002, 1)
          if (next > 0.85 && !showNextEp && item.episodes) setShowNextEp(true)
          if (next > 0.4 && next < 0.42) setShowTriviaCard(true)
          return next
        })
      }, 200)
    }
    return () => { if (progressTimer.current) clearInterval(progressTimer.current) }
  }, [playing, item.episodes, showNextEp])

  const resetControlsTimer = () => {
    setShowControls(true)
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => { resetControlsTimer() }, [])

  const formatTime = (frac: number) => {
    const totalSec = parseInt(item.runtime) * 60
    const elapsed = Math.floor(frac * totalSec)
    const remaining = totalSec - elapsed
    const m = Math.floor(remaining / 60)
    const s = remaining % 60
    return `-${m}:${s.toString().padStart(2, '0')}`
  }

  const QUALITIES = ['4K', '1080p', '720p', '480p', '360p']
  const SPEEDS = ['0.5×', '0.75×', '1×', '1.25×', '1.5×', '2×']

  // ─── Mini-player ─────────────────────────────────────────────────────────────
  if (mini) {
    return (
      <div
        style={{
          position: 'fixed', bottom: 100, right: 16, zIndex: 100,
          width: 220, borderRadius: 16, overflow: 'hidden',
          background: '#0a1628', boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.12)',
          animation: 'slideInRight 0.25s ease',
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setMini(false)}>
          <img
            src={item.backdrop}
            alt=""
            style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block', filter: `brightness(${brightness})` }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={e => { e.stopPropagation(); setPlaying(!playing) }}
              style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#0a1628' }}
            >
              {playing ? '⏸' : '▶'}
            </button>
          </div>
          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: '#2980b9' }} />
          </div>
        </div>
        {/* Info row */}
        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: '2px 0 0', fontFamily: 'DM Mono, monospace' }}>{formatTime(1 - progress)}</p>
          </div>
          <button
            onClick={() => setMini(false)}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 14, flexShrink: 0 }}
            title="Expand"
          >⤢</button>
          <button
            onClick={onClose}
            style={{ background: 'rgba(231,76,60,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#e74c3c', fontSize: 14, flexShrink: 0 }}
          >✕</button>
        </div>
      </div>
    )
  }

  // ─── Screen-lock overlay ──────────────────────────────────────────────────────
  if (locked) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🔒</div>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 600, margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' }}>Screen Locked</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 24px' }}>Tap and hold to unlock</p>
          <button onPointerDown={() => setTimeout(() => setLocked(false), 800)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '12px 24px', color: 'white', fontSize: 15, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Hold to Unlock</button>
        </div>
      </div>
    )
  }

  // ─── Full player ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}
      onClick={() => { resetControlsTimer(); setShowQuality(false); setShowSpeed(false); setShowSubMenu(false) }}
    >
      {/* Video frame */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img
          src={item.backdrop}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.5, filter: `brightness(${brightness})`, transition: 'filter 0.1s' }}
        />

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,${showControls ? 0.5 : 0}) 0%, transparent 30%, transparent 60%, rgba(0,0,0,${showControls ? 0.7 : 0}) 100%)`, transition: 'background 0.3s ease' }} />

        {/* Top bar */}
        {showControls && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18, backdropFilter: 'blur(8px)' }}>←</button>
            <div style={{ flex: 1, textAlign: 'center', margin: '0 16px' }}>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'Outfit, sans-serif' }}>{item.title}</p>
              {item.episodes && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>S1 E3 — The Informant</p>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Minimise to PiP */}
              <button onClick={() => setMini(true)} style={{ background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, backdropFilter: 'blur(8px)', color: 'white' }} title="Mini player">⤡</button>
              {/* Lock */}
              <button onClick={() => setLocked(true)} style={{ background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, backdropFilter: 'blur(8px)' }}>🔓</button>
            </div>
          </div>
        )}

        {/* Center transport */}
        {showControls && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
            {item.episodes && (
              <button onClick={() => {}} style={{ background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, backdropFilter: 'blur(8px)' }}>⏮</button>
            )}
            <button onClick={() => setPlaying(!playing)} style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
              <span style={{ fontSize: 28, color: 'white', marginLeft: playing ? 0 : 4 }}>{playing ? '⏸' : '▶'}</span>
            </button>
            {item.episodes && (
              <button onClick={onNextEpisode} style={{ background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, backdropFilter: 'blur(8px)' }}>⏭</button>
            )}
          </div>
        )}

        {/* Skip intro */}
        {skipIntroVisible && showControls && (
          <div style={{ position: 'absolute', bottom: 120, right: 20 }}>
            <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '10px 18px', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)', fontFamily: 'Outfit, sans-serif' }}>
              Skip Intro →
            </button>
          </div>
        )}

        {/* Next Episode card */}
        {showNextEp && (
          <div style={{ position: 'absolute', bottom: 120, right: 20, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: 14, width: 200 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>UP NEXT</p>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>S1 E4 — The Informant</p>
            <button onClick={onNextEpisode} className="btn-primary" style={{ fontSize: 13, padding: '10px 14px' }}>Play Now →</button>
          </div>
        )}

        {/* AI Trivia card */}
        {showTriviaCard && showControls && (
          <div style={{ position: 'absolute', top: 100, left: 20, right: 20 }}>
            <div style={{ background: 'rgba(108,52,131,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(108,52,131,0.5)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#c39bd3', fontSize: 11, fontFamily: 'DM Mono, monospace', margin: '0 0 4px' }}>AI TRIVIA</p>
                <p style={{ color: 'white', fontSize: 13, margin: 0, lineHeight: 1.4 }}>This scene was filmed at Uhuru Park in Nairobi during golden hour — the crew waited 3 days for perfect lighting!</p>
              </div>
              <button onClick={() => setShowTriviaCard(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}>✕</button>
            </div>
          </div>
        )}

        {/* Volume slider — left side */}
        {showControls && (
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>🔊</span>
            <div style={{ position: 'relative', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="range" min="0" max="1" step="0.05" value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                onClick={e => e.stopPropagation()}
                style={{ writingMode: 'vertical-lr', direction: 'rtl', height: 80, cursor: 'pointer', accentColor: '#2980b9' }}
              />
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Mono, monospace' }}>{Math.round(volume * 100)}</span>
          </div>
        )}

        {/* Brightness slider — right side */}
        {showControls && (
          <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>☀️</span>
            <div style={{ position: 'relative', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="range" min="0.3" max="1.5" step="0.05" value={brightness}
                onChange={e => setBrightness(parseFloat(e.target.value))}
                onClick={e => e.stopPropagation()}
                style={{ writingMode: 'vertical-lr', direction: 'rtl', height: 80, cursor: 'pointer', accentColor: '#f39c12' }}
              />
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Mono, monospace' }}>{Math.round(brightness * 100)}%</span>
          </div>
        )}

        {/* Bottom controls */}
        {showControls && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 24px' }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, cursor: 'pointer', position: 'relative' }}>
                <div style={{ width: `${progress * 100}%`, height: '100%', background: '#2980b9', borderRadius: 2, transition: 'width 0.2s' }} />
                <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace' }}>{formatTime(1 - progress)}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace' }}>{item.runtime}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Speed */}
              <div style={{ position: 'relative' }}>
                <button onClick={e => { e.stopPropagation(); setShowSpeed(!showSpeed); setShowQuality(false); setShowSubMenu(false) }} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 12px', color: 'white', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{speed}</button>
                {showSpeed && (
                  <div style={{ position: 'absolute', bottom: 44, left: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 8, minWidth: 90, zIndex: 10 }}>
                    {SPEEDS.map(s => <button key={s} onClick={e => { e.stopPropagation(); setSpeed(s); setShowSpeed(false) }} style={{ display: 'block', width: '100%', padding: '8px 12px', background: speed === s ? 'rgba(41,128,185,0.3)' : 'none', border: 'none', color: speed === s ? '#2980b9' : 'white', fontSize: 13, cursor: 'pointer', borderRadius: 8, textAlign: 'left', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{s}</button>)}
                  </div>
                )}
              </div>

              {/* Subtitles */}
              <div style={{ position: 'relative' }}>
                <button onClick={e => { e.stopPropagation(); setShowSubMenu(!showSubMenu); setShowQuality(false); setShowSpeed(false) }} style={{ background: subtitles ? 'rgba(41,128,185,0.3)' : 'rgba(0,0,0,0.4)', border: `1px solid ${subtitles ? '#2980b9' : 'rgba(255,255,255,0.2)'}`, borderRadius: 8, padding: '6px 12px', color: subtitles ? '#5dade2' : 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>CC</button>
                {showSubMenu && (
                  <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 8, minWidth: 130, zIndex: 10 }}>
                    <button onClick={e => { e.stopPropagation(); setSubtitles(false); setShowSubMenu(false) }} style={{ display: 'block', width: '100%', padding: '8px 12px', background: !subtitles ? 'rgba(41,128,185,0.3)' : 'none', border: 'none', color: !subtitles ? '#2980b9' : 'white', fontSize: 13, cursor: 'pointer', borderRadius: 8, textAlign: 'left', fontFamily: 'Outfit, sans-serif' }}>Off</button>
                    {item.subtitles.map(s => <button key={s} onClick={e => { e.stopPropagation(); setSubtitles(true); setShowSubMenu(false) }} style={{ display: 'block', width: '100%', padding: '8px 12px', background: subtitles ? 'rgba(41,128,185,0.3)' : 'none', border: 'none', color: subtitles ? '#2980b9' : 'white', fontSize: 13, cursor: 'pointer', borderRadius: 8, textAlign: 'left', fontFamily: 'Outfit, sans-serif' }}>{s}</button>)}
                  </div>
                )}
              </div>

              {/* Quality */}
              <div style={{ position: 'relative' }}>
                <button onClick={e => { e.stopPropagation(); setShowQuality(!showQuality); setShowSpeed(false); setShowSubMenu(false) }} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 12px', color: 'white', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{quality}</button>
                {showQuality && (
                  <div style={{ position: 'absolute', bottom: 44, right: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 8, minWidth: 90, zIndex: 10 }}>
                    {QUALITIES.map(q => <button key={q} onClick={e => { e.stopPropagation(); setQuality(q); setShowQuality(false) }} style={{ display: 'block', width: '100%', padding: '8px 12px', background: quality === q ? 'rgba(41,128,185,0.3)' : 'none', border: 'none', color: quality === q ? '#2980b9' : 'white', fontSize: 13, cursor: 'pointer', borderRadius: 8, textAlign: 'left', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{q}</button>)}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 10px', color: 'white', fontSize: 14, cursor: 'pointer' }}>⛶</button>
            </div>
          </div>
        )}
      </div>

      {/* Coin badge */}
      {playing && progress > 0.05 && (
        <div style={{ position: 'absolute', top: 100, right: 20, background: 'rgba(243,156,18,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(243,156,18,0.4)', borderRadius: 100, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>🪙</span>
          <span style={{ fontSize: 12, color: '#f8c471', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>+{item.coins} coins earned</span>
        </div>
      )}
    </div>
  )
}

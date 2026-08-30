import { useState } from 'react'
import PassportDashboard from './PassportDashboard'
import ProfileEditor from './ProfileEditor'
import IdentityVerification from './IdentityVerification'
import Portfolio from './Portfolio'
import PortfolioAdd from './PortfolioAdd'
import PortfolioDetail from './PortfolioDetail'
import Skills from './Skills'
import Credits from './Credits'
import Certificates from './Certificates'
import Reputation from './Reputation'
import Endorsements from './Endorsements'
import CareerTimeline from './CareerTimeline'
import ResumeBuilder from './ResumeBuilder'
import Availability from './Availability'
import PassportShare from './PassportShare'
import Privacy from './Privacy'
import Activity from './Activity'
import AICoach from './AICoach'
import { MOCK_PROFILE, MOCK_TRUST_SCORE, TRUST_LEVELS } from './data'

type PassportScreen =
  | 'dashboard'
  | 'profile-editor'
  | 'verify'
  | 'portfolio'
  | 'portfolio-add'
  | 'portfolio-detail'
  | 'skills'
  | 'credits'
  | 'certificates'
  | 'reputation'
  | 'endorsements'
  | 'timeline'
  | 'resume'
  | 'availability'
  | 'share'
  | 'privacy'
  | 'activity'
  | 'ai-coach'

type Tab = 'identity' | 'portfolio' | 'credits' | 'reputation' | 'settings'

type Props = { onExit: () => void }

export default function PassportShell({ onExit }: Props) {
  const [screen, setScreen] = useState<PassportScreen>('dashboard')
  const [tab, setTab] = useState<Tab>('identity')
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
  const [stack, setStack] = useState<PassportScreen[]>([])

  const tl = TRUST_LEVELS[MOCK_TRUST_SCORE.level]

  const push = (s: PassportScreen) => {
    setStack(prev => [...prev, screen])
    setScreen(s)
  }

  const back = () => {
    if (stack.length === 0) { onExit(); return }
    const prev = stack[stack.length - 1]
    setStack(s => s.slice(0, -1))
    setScreen(prev)
  }

  const goTab = (t: Tab) => {
    setTab(t)
    setStack([])
    setScreen('dashboard')
    if (t === 'portfolio') setScreen('portfolio')
    if (t === 'credits') setScreen('credits')
    if (t === 'reputation') setScreen('reputation')
    if (t === 'settings') setScreen('activity')
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'identity', label: 'Passport', icon: '🪪' },
    { key: 'portfolio', label: 'Portfolio', icon: '📂' },
    { key: 'credits', label: 'Credits', icon: '🎬' },
    { key: 'reputation', label: 'Trust', icon: '⭐' },
    { key: 'settings', label: 'More', icon: '⚙️' },
  ]

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <PassportDashboard
            onEdit={() => push('profile-editor')}
            onVerify={() => push('verify')}
            onShare={() => push('share')}
            onDownloadCV={() => push('resume')}
            onOpenPortfolio={() => { setTab('portfolio'); setScreen('portfolio') }}
            onOpenReputation={() => { setTab('reputation'); setScreen('reputation') }}
            onOpenItem={id => { setSelectedPortfolioId(id); push('portfolio-detail') }}
          />
        )
      case 'profile-editor':
        return <ProfileEditor onBack={back} onSaved={back} />
      case 'verify':
        return <IdentityVerification onBack={back} onVerified={back} />
      case 'portfolio':
        return (
          <Portfolio
            onAdd={() => push('portfolio-add')}
            onOpenItem={id => { setSelectedPortfolioId(id); push('portfolio-detail') }}
          />
        )
      case 'portfolio-add':
        return <PortfolioAdd onBack={back} onSave={back} />
      case 'portfolio-detail':
        return selectedPortfolioId ? <PortfolioDetail itemId={selectedPortfolioId} onBack={back} /> : null
      case 'skills':
        return <Skills onOpenEndorsements={() => push('endorsements')} />
      case 'credits':
        return <Credits onAdd={() => {}} />
      case 'certificates':
        return <Certificates onBack={back} />
      case 'reputation':
        return <Reputation onImprove={() => push('skills')} />
      case 'endorsements':
        return <Endorsements onBack={back} />
      case 'timeline':
        return <CareerTimeline onBack={back} />
      case 'resume':
        return <ResumeBuilder onBack={back} />
      case 'availability':
        return <Availability onBack={back} />
      case 'share':
        return <PassportShare onBack={back} />
      case 'privacy':
        return <Privacy onBack={back} />
      case 'activity':
        return <ActivitySettingsWrapper onBack={back} onNavigate={push} />
      case 'ai-coach':
        return <AICoach onBack={back} />
      default:
        return null
    }
  }

  const isTabScreen = ['dashboard', 'portfolio', 'credits', 'reputation', 'activity'].includes(screen)

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Global header for tab screens */}
      {isTabScreen && screen === 'dashboard' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 20, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', padding: 0, fontFamily: 'Outfit, sans-serif' }}>← Play</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: 'white' }}>Pwani Passport</span>
            <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: `${tl.color}20`, color: tl.color, border: `1px solid ${tl.color}33`, fontWeight: 700 }}>{tl.icon} {tl.label}</span>
          </div>
          <button onClick={() => push('ai-coach')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>✨</button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: isTabScreen ? 0 : 0 }}>
        {renderScreen()}
      </div>

      {/* Bottom tab bar — only for main tab views */}
      {isTabScreen && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(10,22,40,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', zIndex: 50 }}>
          {screen === 'activity' && (
            <div style={{ padding: '12px 20px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>More Features</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                {([
                  { icon: '📅', label: 'Timeline', screen: 'timeline' },
                  { icon: '🤝', label: 'Endorsements', screen: 'endorsements' },
                  { icon: '📜', label: 'Certificates', screen: 'certificates' },
                  { icon: '📆', label: 'Availability', screen: 'availability' },
                  { icon: '🔐', label: 'Privacy', screen: 'privacy' },
                  { icon: '📄', label: 'Resume', screen: 'resume' },
                ] as const).map(item => (
                  <button key={item.label} onClick={() => push(item.screen as PassportScreen)} style={{ padding: '12px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>{item.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', padding: '6px 0 10px' }}>
            {TABS.map(t => {
              const isActive = (t.key === 'identity' && screen === 'dashboard') ||
                (t.key === 'portfolio' && screen === 'portfolio') ||
                (t.key === 'credits' && screen === 'credits') ||
                (t.key === 'reputation' && screen === 'reputation') ||
                (t.key === 'settings' && screen === 'activity')
              return (
                <button key={t.key} onClick={() => goTab(t.key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 0' }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: isActive ? '#2980b9' : 'rgba(255,255,255,0.3)', fontWeight: 700, transition: 'color 0.2s' }}>{t.label}</span>
                  {isActive && <div style={{ width: 20, height: 2, borderRadius: 2, background: '#2980b9', marginTop: 1 }} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ActivitySettingsWrapper({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: PassportScreen) => void }) {
  return <Activity onBack={onBack} />
}

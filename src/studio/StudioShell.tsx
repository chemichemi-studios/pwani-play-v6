import { useState } from 'react'
import DashboardTab from './DashboardTab'
import ProjectsTab from './ProjectsTab'
import UploadsTab from './UploadsTab'
import AnalyticsTab from './AnalyticsTab'
import StudioProfileTab from './StudioProfileTab'
import ProjectDetail from './ProjectDetail'
import EpisodeManager from './EpisodeManager'
import MetadataEditor from './MetadataEditor'
import PublishCenter from './PublishCenter'
import Monetization from './Monetization'
import AssetLibrary from './AssetLibrary'
import CastCrew from './CastCrew'
import Collaboration from './Collaboration'
import Community from './Community'
import AIAssistant from './AIAssistant'
import StudioNotifications from './StudioNotifications'
import NewProject from './NewProject'

type Tab = 'dashboard' | 'projects' | 'uploads' | 'analytics' | 'profile'

type StudioScreen =
  | { type: 'tab' }
  | { type: 'project'; id: string }
  | { type: 'episodes'; id: string }
  | { type: 'metadata'; id: string }
  | { type: 'publish'; id: string }
  | { type: 'monetization'; id: string }
  | { type: 'assets'; id: string }
  | { type: 'cast'; id: string }
  | { type: 'collaboration'; id: string }
  | { type: 'community' }
  | { type: 'ai' }
  | { type: 'notifications' }
  | { type: 'new-project' }

type Props = {
  userName: string
  onExit: () => void
}

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'dashboard', icon: '🏠', label: 'Home' },
  { key: 'projects', icon: '📂', label: 'Projects' },
  { key: 'uploads', icon: '📤', label: 'Uploads' },
  { key: 'analytics', icon: '📊', label: 'Analytics' },
  { key: 'profile', icon: '👤', label: 'Profile' },
]

export default function StudioShell({ userName, onExit }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [stack, setStack] = useState<StudioScreen[]>([{ type: 'tab' }])

  const current = stack[stack.length - 1]
  const push = (screen: StudioScreen) => setStack(prev => [...prev, screen])
  const back = () => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  const goTab = (t: Tab) => { setTab(t); setStack([{ type: 'tab' }]) }

  const openProject = (id: string) => push({ type: 'project', id })
  const openUpload = () => { goTab('uploads') }
  const openNotifs = () => push({ type: 'notifications' })
  const openAI = () => push({ type: 'ai' })
  const openAnalytics = () => { goTab('analytics') }
  const openNewProject = () => push({ type: 'new-project' })

  const showNav = current.type === 'tab'

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Studio header bar (visible on tab screens) */}
      {showNav && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: 52, background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', paddingLeft: 12, paddingRight: 12, gap: 8 }}>
          <button onClick={onExit} aria-label="Back to Pwani Play" title="Back to Pwani Play" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#1e6091,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎬</div>
          <div style={{ flex: 1 }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'DM Serif Display, serif', letterSpacing: '0.02em' }}>PWANI STUDIO</span>
          </div>
          <button onClick={() => push({ type: 'ai' })} style={{ background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.2)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>🤖</button>
          <button onClick={() => push({ type: 'notifications' })} style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
            🔔
            <div style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#e74c3c', border: '2px solid #0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, color: 'white', fontWeight: 700 }}>3</span>
            </div>
          </button>
        </div>
      )}

      {/* Screen content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {current.type === 'tab' && tab === 'dashboard' && (
          <DashboardTab
            name={userName}
            coinBalance={420}
            onOpenProject={openProject}
            onOpenUpload={openUpload}
            onOpenNotifs={openNotifs}
            onOpenAI={openAI}
            onNewProject={openNewProject}
            onOpenAnalytics={openAnalytics}
          />
        )}
        {current.type === 'tab' && tab === 'projects' && (
          <ProjectsTab onOpenProject={openProject} onNewProject={openNewProject} />
        )}
        {current.type === 'tab' && tab === 'uploads' && (
          <UploadsTab onOpenProject={openProject} />
        )}
        {current.type === 'tab' && tab === 'analytics' && (
          <AnalyticsTab />
        )}
        {current.type === 'tab' && tab === 'profile' && (
          <StudioProfileTab
            name={userName}
            onOpenCommunity={() => push({ type: 'community' })}
            onOpenAnalytics={openAnalytics}
          />
        )}

        {current.type === 'project' && (
          <ProjectDetail
            projectId={current.id}
            onBack={back}
            onUpload={openUpload}
            onPublish={() => push({ type: 'publish', id: current.id })}
            onManageEpisodes={() => push({ type: 'episodes', id: current.id })}
            onOpenAssets={() => push({ type: 'assets', id: current.id })}
            onOpenCast={() => push({ type: 'cast', id: current.id })}
            onOpenCollaboration={() => push({ type: 'collaboration', id: current.id })}
            onOpenMonetization={() => push({ type: 'monetization', id: current.id })}
            onOpenAnalytics={openAnalytics}
            onOpenMetadata={() => push({ type: 'metadata', id: current.id })}
          />
        )}

        {current.type === 'episodes' && (
          <EpisodeManager projectId={current.id} onBack={back} onUpload={openUpload} />
        )}

        {current.type === 'metadata' && (
          <MetadataEditor projectId={current.id} onBack={back} onSave={back} />
        )}

        {current.type === 'publish' && (
          <PublishCenter projectId={current.id} onBack={back} onPublished={() => { back(); back() }} />
        )}

        {current.type === 'monetization' && (
          <Monetization projectId={current.id} onBack={back} />
        )}

        {current.type === 'assets' && (
          <AssetLibrary projectId={current.id} onBack={back} />
        )}

        {current.type === 'cast' && (
          <CastCrew projectId={current.id} onBack={back} />
        )}

        {current.type === 'collaboration' && (
          <Collaboration projectId={current.id} onBack={back} />
        )}

        {current.type === 'community' && (
          <Community onBack={back} />
        )}

        {current.type === 'ai' && (
          <AIAssistant onBack={back} />
        )}

        {current.type === 'notifications' && (
          <StudioNotifications onBack={back} />
        )}

        {current.type === 'new-project' && (
          <NewProject onBack={back} onCreate={id => { back(); openProject(id) }} />
        )}
      </div>

      {/* FAB for new project (tab screens only) */}
      {showNav && tab !== 'profile' && (
        <button
          onClick={openNewProject}
          style={{ position: 'fixed', bottom: 80, right: 20, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', border: 'none', boxShadow: '0 4px 20px rgba(41,128,185,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, zIndex: 35 }}
        >+</button>
      )}

      {/* Bottom navigation */}
      {showNav && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => goTab(t.key)} style={{
              flex: 1, padding: '10px 4px 8px', border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 20, transition: 'transform 0.15s', transform: tab === t.key ? 'scale(1.1)' : 'scale(1)' }}>{t.icon}</span>
              <span style={{ fontSize: 10, color: tab === t.key ? '#5dade2' : 'rgba(255,255,255,0.4)', fontWeight: tab === t.key ? 700 : 400, fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s' }}>{t.label}</span>
              {tab === t.key && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#2980b9' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

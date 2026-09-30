import { useState } from 'react'
import {
  OPPORTUNITIES, SERVICES, ORDERS, APPLICATIONS, CONTRACTS,
  OPP_TYPE_META, SVC_TYPE_META, ORDER_STATUS_META, APP_STATUS_META, HUB_PASSPORT_SUMMARY,
  type Opportunity, type HubService, type HubOrder, type OppType, type ServiceType,
} from './data'
import { CartScreen, CheckoutScreen, OrderConfirmationScreen, type CartLine } from './Checkout'
import { usePlatform } from '../platform/store'

type Tab = 'discover' | 'marketplace' | 'mywork' | 'post' | 'dashboard'
type SubScreen =
  | { id: 'root' }
  | { id: 'opp-detail'; oppId: string }
  | { id: 'svc-detail'; svcId: string }
  | { id: 'order-detail'; orderId: string }
  | { id: 'contract-detail'; contractId: string }
  | { id: 'apply'; oppId: string }
  | { id: 'hire'; svcId: string }
  | { id: 'applications' }
  | { id: 'deadlines' }
  | { id: 'cart' }
  | { id: 'checkout' }
  | { id: 'order-confirmation' }

type Props = { onExit: () => void }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'discover',     label: 'Discover',     icon: '🔭' },
  { key: 'marketplace',  label: 'Market',       icon: '🛒' },
  { key: 'mywork',       label: 'My Work',      icon: '📂' },
  { key: 'post',         label: 'Post',         icon: '➕' },
  { key: 'dashboard',    label: 'Dashboard',    icon: '📊' },
]

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Toast({ msg }: { msg: string }) {
  return <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1abc9c', color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease', pointerEvents: 'none' }}>{msg}</div>
}

function FullScreen({ title, badge, onBack, children }: { title: string; badge?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
        {badge && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(41,128,185,0.15)', color: '#5dade2', fontWeight: 700, border: '1px solid rgba(41,128,185,0.2)' }}>{badge}</span>}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 68, paddingBottom: 32 }}>{children}</div>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return <span style={{ color: '#f8c471', fontSize: 12 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))} <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{rating.toFixed(1)}</span></span>
}

// ─── Discover Tab ─────────────────────────────────────────────────────────────

function DiscoverTab({ onOpp, onApplications, onDeadlines }: { onOpp: (id: string) => void; onApplications: () => void; onDeadlines: () => void }) {
  const [saved, setSaved] = useState<string[]>(OPPORTUNITIES.filter(o => o.saved).map(o => o.id))
  const [typeFilter, setTypeFilter] = useState<OppType | 'all'>('all')
  const [search, setSearch] = useState('')

  const toggleSave = (id: string) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const filtered = OPPORTUNITIES.filter(o => {
    if (typeFilter !== 'all' && o.type !== typeFilter) return false
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.org.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const types: (OppType | 'all')[] = ['all', 'job', 'casting', 'grant', 'competition', 'festival', 'fellowship']

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 3px' }}>Discover</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Opportunities matched to your profile</p>
          </div>
          <button onClick={onApplications} style={{ padding: '8px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>My Applications</button>
        </div>

        {/* Deadline Center entry — Section 38 */}
        <button onClick={onDeadlines} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14, background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.18)', cursor: 'pointer', marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>⏰</span>
          <span style={{ color: '#e74c3c', fontSize: 12.5, fontWeight: 700, flex: 1, textAlign: 'left' }}>Deadline Center — see everything coming up</span>
          <span style={{ color: '#e74c3c', fontSize: 14 }}>›</span>
        </button>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
          <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities…" style={{ margin: 0, paddingLeft: 36, width: '100%', boxSizing: 'border-box' }} />
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 14 }}>
          {types.map(t => {
            const meta = t === 'all' ? null : OPP_TYPE_META[t]
            return (
              <button key={t} onClick={() => setTypeFilter(t)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 100, border: 'none', cursor: 'pointer', background: typeFilter === t ? '#1e6091' : 'rgba(255,255,255,0.07)', color: typeFilter === t ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                {meta ? `${meta.icon} ${meta.label}` : 'All'}
              </button>
            )
          })}
        </div>

        {/* Opportunity cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(o => {
            const meta = OPP_TYPE_META[o.type]
            const isSaved = saved.includes(o.id)
            return (
              <div key={o.id} onClick={() => onOpp(o.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ padding: '14px 16px 12px' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{meta.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25`, fontWeight: 700 }}>{meta.label}</span>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(26,188,156,0.1)', color: '#1abc9c', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>⚡ {o.match}% match</span>
                      </div>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px', lineHeight: 1.3 }}>{o.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{o.org} {o.orgVerified && <span style={{ color: '#1abc9c' }}>✓</span>} · {o.location}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggleSave(o.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: isSaved ? '#f39c12' : 'rgba(255,255,255,0.2)', padding: 0, flexShrink: 0 }}>{isSaved ? '★' : '☆'}</button>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: '#1abc9c', fontSize: 14, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>{o.pay}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>📅 {o.deadline}</span>
                    {o.tags.slice(0, 2).map(tag => <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{tag}</span>)}
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔭</div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No opportunities found</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Marketplace Tab ──────────────────────────────────────────────────────────

function MarketplaceTab({ onService, cartCount, onCart }: { onService: (id: string) => void; cartCount: number; onCart: () => void }) {
  const [typeFilter, setTypeFilter] = useState<ServiceType | 'all'>('all')
  const types: (ServiceType | 'all')[] = ['all', 'equipment', 'studio', 'location', 'production', 'creative']

  const filtered = typeFilter === 'all' ? SERVICES : SERVICES.filter(s => s.type === typeFilter)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 3px' }}>Marketplace</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 16px' }}>Equipment, studios, locations, and creative services</p>
          </div>
          <button onClick={onCart} style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 17, flexShrink: 0 }}>
            🛒
            {cartCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#e74c3c', color: 'white', fontSize: 9.5, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 14 }}>
          {types.map(t => {
            const meta = t === 'all' ? null : SVC_TYPE_META[t]
            return (
              <button key={t} onClick={() => setTypeFilter(t)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 100, border: 'none', cursor: 'pointer', background: typeFilter === t ? '#1e6091' : 'rgba(255,255,255,0.07)', color: typeFilter === t ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                {meta ? `${meta.icon} ${meta.label}` : 'All'}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(svc => {
            const meta = SVC_TYPE_META[svc.type]
            return (
              <div key={svc.id} onClick={() => onService(svc.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 140, background: '#0d1f38', overflow: 'hidden', position: 'relative' }}>
                  <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 100, background: `${meta.color}cc`, color: 'white', fontWeight: 700 }}>{meta.icon} {meta.label}</span>
                    {svc.verified && <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 100, background: 'rgba(26,188,156,0.85)', color: 'white', fontWeight: 700 }}>✓ Verified</span>}
                  </div>
                </div>
                <div style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0, flex: 1, lineHeight: 1.3 }}>{svc.title}</p>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <p style={{ color: '#1abc9c', fontSize: 15, fontWeight: 800, margin: '0 0 1px', fontFamily: 'DM Mono, monospace' }}>{svc.price}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{svc.priceUnit}</p>
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{svc.provider} · {svc.location}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StarRating rating={svc.providerRating} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{svc.providerJobs} jobs</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── My Work Tab ──────────────────────────────────────────────────────────────

function MyWorkTab({ orders, onOrder, onApplications, onContract }: { orders: HubOrder[]; onOrder: (id: string) => void; onApplications: () => void; onContract: (id: string) => void }) {
  const [view, setView] = useState<'orders' | 'applications' | 'contracts'>('orders')

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 16px' }}>My Work</h2>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
          {([['orders', '📦 Orders'], ['applications', '📝 Applications'], ['contracts', '📄 Contracts']] as const).map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer', background: view === v ? '#1e6091' : 'transparent', color: view === v ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{label}</button>
          ))}
        </div>

        {view === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(ord => {
              const meta = ORDER_STATUS_META[ord.status]
              return (
                <div key={ord.id} onClick={() => onOrder(ord.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 3px', lineHeight: 1.3 }}>{ord.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 2px' }}>{ord.type === 'buyer' ? '📤 Buying from' : '📥 Selling to'} {ord.counterparty}</p>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>Due {ord.dueDate}</span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 800, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>KES {ord.amount.toLocaleString()}</p>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                    </div>
                  </div>
                  {ord.status === 'active' && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Progress</span>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{ord.progress}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ width: `${ord.progress}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #1e6091, #2980b9)' }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {view === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {APPLICATIONS.map(app => {
              const meta = APP_STATUS_META[app.status]
              const typeMeta = OPP_TYPE_META[app.oppType]
              return (
                <div key={app.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${typeMeta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{typeMeta.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', lineHeight: 1.3 }}>{app.oppTitle}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{app.org}</p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{app.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === 'contracts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CONTRACTS.map(ct => {
              const paid = ct.milestones.filter(m => m.done).reduce((a, m) => a + m.amount, 0)
              return (
                <div key={ct.id} onClick={() => onContract(ct.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{ct.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{ct.counterparty}</p>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(26,188,156,0.1)', color: '#1abc9c', fontWeight: 700 }}>✓ {ct.status}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>KES {ct.value.toLocaleString()}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, fontFamily: 'DM Mono, monospace' }}>KES {paid.toLocaleString()} paid</p>
                    </div>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginTop: 8 }}>
                    <div style={{ width: `${(paid / ct.value) * 100}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #1e6091, #1abc9c)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Post Tab ─────────────────────────────────────────────────────────────────

function PostTab() {
  const [type, setType] = useState<'opportunity' | 'service' | null>(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title: '', desc: '', pay: '', deadline: '', tags: '' })
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  if (submitted) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', paddingTop: 80, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '2px solid rgba(26,188,156,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>✓</div>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 10px' }}>Posted Successfully!</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>Your listing is live and visible to creators matching your requirements.</p>
      <button onClick={() => { setType(null); setStep(1); setForm({ title: '', desc: '', pay: '', deadline: '', tags: '' }); setSubmitted(false) }} style={{ padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Post Another</button>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Post a Listing</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Share opportunities or offer your services</p>

        {!type && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'opportunity', icon: '🎯', title: 'Post an Opportunity', desc: 'Casting calls, jobs, grants, competitions, festivals', color: '#f39c12' },
              { key: 'service', icon: '🛒', title: 'List a Service', desc: 'Equipment, studio, location, creative services', color: '#2980b9' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setType(opt.key as 'opportunity' | 'service')} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '20px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${opt.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{opt.icon}</div>
                <div>
                  <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>{opt.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {type && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? '#2980b9' : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Title</p>
                  <input className="input-field" style={{ margin: 0, width: '100%', boxSizing: 'border-box' }} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder={type === 'opportunity' ? 'e.g. Lead Actor — Short Film' : 'e.g. RED Komodo 6K Rental'} />
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</p>
                  <textarea className="input-field" style={{ margin: 0, width: '100%', boxSizing: 'border-box', height: 100, resize: 'vertical' }} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the opportunity or service…" />
                </div>
                <button onClick={() => { if (form.title) setStep(2); else showToast('Please add a title') }} style={{ padding: '14px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Continue →</button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pay / Rate</p>
                  <input className="input-field" style={{ margin: 0, width: '100%', boxSizing: 'border-box' }} value={form.pay} onChange={e => setForm(p => ({ ...p, pay: e.target.value }))} placeholder="e.g. KES 15,000 or KES 8,000/day" />
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deadline / Availability</p>
                  <input className="input-field" style={{ margin: 0, width: '100%', boxSizing: 'border-box' }} value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} placeholder="e.g. 20 Aug 2026 or Open" />
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tags (comma separated)</p>
                  <input className="input-field" style={{ margin: 0, width: '100%', boxSizing: 'border-box' }} value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. Acting, Drama, Nairobi" />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: '14px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Preview →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Preview</p>
                  <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{form.title || 'Untitled'}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 8px', lineHeight: 1.5 }}>{form.desc || '—'}</p>
                  <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: '0 0 4px', fontFamily: 'DM Mono, monospace' }}>{form.pay || '—'}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>📅 {form.deadline || 'Open'}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>← Edit</button>
                  <button onClick={() => setSubmitted(true)} style={{ flex: 2, padding: '14px', borderRadius: 14, background: 'linear-gradient(90deg,#1abc9c,#16a085)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>🚀 Publish</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab() {
  const stats = [
    { icon: '💰', label: 'Total Earned', val: 'KES 124,500', color: '#1abc9c' },
    { icon: '📦', label: 'Active Orders', val: '2', color: '#2980b9' },
    { icon: '📝', label: 'Applications', val: '4', color: '#9b59b6' },
    { icon: '⭐', label: 'Avg Rating', val: '4.9', color: '#f8c471' },
    { icon: '🤝', label: 'Completed Jobs', val: '18', color: '#27ae60' },
    { icon: '🎯', label: 'Match Rate', val: '87%', color: '#e67e22' },
  ]

  const recentActivity = [
    { icon: '💸', desc: 'KES 20,000 milestone paid by Nairobi Film Collective', time: '2h ago', color: '#1abc9c' },
    { icon: '📝', desc: 'Shortlisted for "Lead Actor — Lagos Dreams"', time: '5h ago', color: '#9b59b6' },
    { icon: '🌟', desc: 'New 5-star review from East African Film Co.', time: 'Yesterday', color: '#f8c471' },
    { icon: '📩', desc: 'Proposal received for Savannah Documentary Series', time: '2d ago', color: '#2980b9' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, paddingTop: 56 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Dashboard</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 20px' }}>Your Hub performance at a glance</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{s.val}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Recent Activity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 3px', lineHeight: 1.4 }}>{a.desc}</p>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{a.time}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Reputation Score</p>
        <div style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.12), rgba(26,188,156,0.07))', border: '1px solid rgba(41,128,185,0.2)', borderRadius: 18, padding: '18px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'conic-gradient(#2980b9 0deg 313deg, rgba(255,255,255,0.08) 313deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>87</span>
            </div>
          </div>
          <div>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>Hub Reputation: 87/100</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>Top 12% of creators on Pwani Hub</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {['On-time', 'Top Quality', 'Responsive'].map(b => <span key={b} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(26,188,156,0.1)', color: '#1abc9c', fontWeight: 700 }}>{b}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Sub-screens ───────────────────────────────────────────────────────

function OppDetail({ oppId, onBack, onApply }: { oppId: string; onBack: () => void; onApply: () => void }) {
  const opp = OPPORTUNITIES.find(o => o.id === oppId) ?? OPPORTUNITIES[0]
  const meta = OPP_TYPE_META[opp.type]
  const [showWhy, setShowWhy] = useState(false)
  return (
    <FullScreen title={meta.label} badge={`${opp.match}% match`} onBack={onBack}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: `${meta.color}0a`, border: `1px solid ${meta.color}18`, borderRadius: 18, padding: '18px', marginBottom: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{meta.icon}</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: '0 0 4px', lineHeight: 1.3 }}>{opp.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {opp.org} · {opp.location}
            {opp.orgVerified
              ? <span title="Verified organization" style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: 'rgba(26,188,156,0.12)', color: '#1abc9c', fontWeight: 700, border: '1px solid rgba(26,188,156,0.25)' }}>✓ Verified</span>
              : <span title="Not yet verified" style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>Unverified</span>}
          </p>
          <p style={{ color: '#1abc9c', fontSize: 20, fontWeight: 800, margin: 0, fontFamily: 'DM Mono, monospace' }}>{opp.pay}</p>
        </div>

        {/* Why this match — AI explanation, Section 32 */}
        <div style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.18)', borderRadius: 16, marginBottom: 14, overflow: 'hidden' }}>
          <button onClick={() => setShowWhy(p => !p)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>🤖 Why {opp.match}% match?</span>
            <span style={{ color: '#5dade2', fontSize: 13 }}>{showWhy ? '−' : '+'}</span>
          </button>
          {showWhy && (
            <div style={{ padding: '0 16px 14px' }}>
              {opp.matchReasons.map(r => <p key={r} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, margin: '0 0 6px', display: 'flex', gap: 8, lineHeight: 1.4 }}><span style={{ color: '#5dade2' }}>•</span>{r}</p>)}
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '8px 0 0' }}>Based on your Pwani Passport profile. Recommendations aren't guarantees of eligibility.</p>
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 14 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>About</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 12px', lineHeight: 1.6 }}>{opp.desc}</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>📅 Deadline: {opp.deadline}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Requirements</p>
          {opp.requirements.map(r => <p key={r} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 6px', display: 'flex', gap: 8 }}><span style={{ color: '#2980b9' }}>•</span>{r}</p>)}
        </div>

        <button onClick={onApply} style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Apply Now →</button>
      </div>
    </FullScreen>
  )
}

function ApplyScreen({ oppId, onBack, onSubmit }: { oppId: string; onBack: () => void; onSubmit: (note: string) => void }) {
  const opp = OPPORTUNITIES.find(o => o.id === oppId) ?? OPPORTUNITIES[0]
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const [attachPortfolio, setAttachPortfolio] = useState(true)
  const p = HUB_PASSPORT_SUMMARY

  if (done) return (
    <FullScreen title="Application Sent" onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '2px solid rgba(26,188,156,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>✓</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 10px' }}>Application Submitted!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 6px', lineHeight: 1.6 }}>Your application for <strong style={{ color: 'white' }}>{opp.title}</strong> is now under review.</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '0 0 28px' }}>You will be notified when there is an update.</p>
        <button onClick={onBack} style={{ padding: '14px 32px', borderRadius: 14, background: '#1e6091', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Done</button>
      </div>
    </FullScreen>
  )

  return (
    <FullScreen title="Apply" onBack={onBack}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{opp.title}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{opp.org}</p>
        </div>

        {/* Passport auto-population — Section 8 */}
        <div style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.18)', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
          <p style={{ color: '#5dade2', fontSize: 12, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>🪪 From your Pwani Passport</p>
          <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{p.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 8px' }}>{p.experience} · {p.education}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {p.skills.map(s => <span key={s} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>{s}</span>)}
          </div>
          {p.credits.map(c => <p key={c} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, margin: '0 0 3px' }}>• {c}</p>)}
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5, margin: '8px 0 0' }}>This is pulled automatically — edit it in Pwani Passport, not here.</p>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" checked={attachPortfolio} onChange={e => setAttachPortfolio(e.target.checked)} style={{ width: 16, height: 16 }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5 }}>Attach portfolio projects: {p.portfolioProjects.join(', ')}</span>
        </label>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 8px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cover Note</p>
        <textarea className="input-field" style={{ margin: '0 0 16px', width: '100%', boxSizing: 'border-box', height: 140, resize: 'vertical' }} value={note} onChange={e => setNote(e.target.value)} placeholder="Introduce yourself and explain why you are the right fit for this opportunity…" />
        <button onClick={() => { if (note.trim()) { onSubmit(note); setDone(true) } }} style={{ width: '100%', padding: '15px', borderRadius: 14, background: note.trim() ? 'linear-gradient(90deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.08)', border: 'none', color: note.trim() ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: note.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Outfit, sans-serif' }}>Submit Application</button>
      </div>
    </FullScreen>
  )
}

function SvcDetail({ svcId, onBack, onHire, onAddToCart }: { svcId: string; onBack: () => void; onHire: () => void; onAddToCart: () => void }) {
  const svc = SERVICES.find(s => s.id === svcId) ?? SERVICES[0]
  const meta = SVC_TYPE_META[svc.type]
  return (
    <FullScreen title={meta.label} onBack={onBack}>
      <div>
        <div style={{ height: 200, background: '#0d1f38', overflow: 'hidden' }}>
          <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0, flex: 1, lineHeight: 1.3 }}>{svc.title}</h2>
            <div style={{ textAlign: 'right', marginLeft: 12, flexShrink: 0 }}>
              <p style={{ color: '#1abc9c', fontSize: 18, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{svc.price}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>{svc.priceUnit}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>{svc.provider}</p>
            {svc.verified && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(26,188,156,0.1)', color: '#1abc9c', fontWeight: 700 }}>✓ Verified</span>}
          </div>
          <StarRating rating={svc.providerRating} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginLeft: 8, fontFamily: 'DM Mono, monospace' }}>{svc.providerJobs} completed jobs</span>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginTop: 16, marginBottom: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Description</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{svc.desc}</p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {svc.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>{t}</span>)}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onHire} style={{ flex: 2, padding: '14px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Book / Hire →</button>
            <button style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>💬 Message</button>
          </div>
          <button onClick={onAddToCart} style={{ width: '100%', marginTop: 10, padding: '13px', borderRadius: 14, background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.22)', color: '#1abc9c', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>🛒 Add to Cart — instant booking, no negotiation needed</button>
        </div>
      </div>
    </FullScreen>
  )
}

function HireScreen({ svcId, onBack }: { svcId: string; onBack: () => void }) {
  const svc = SERVICES.find(s => s.id === svcId) ?? SERVICES[0]
  const [dates, setDates] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  if (done) return (
    <FullScreen title="Booking Confirmed" onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(26,188,156,0.12)', border: '2px solid rgba(26,188,156,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>✓</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 10px' }}>Booking Sent!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>Your request has been sent to <strong style={{ color: 'white' }}>{svc.provider}</strong>. They will confirm within 24 hours.</p>
        <button onClick={onBack} style={{ padding: '14px 32px', borderRadius: 14, background: '#1e6091', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Done</button>
      </div>
    </FullScreen>
  )

  return (
    <FullScreen title="Book / Hire" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px', marginBottom: 20 }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{svc.title}</p>
          <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{svc.price}{svc.priceUnit}</p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 8px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dates / Schedule</p>
        <input className="input-field" style={{ margin: '0 0 16px', width: '100%', boxSizing: 'border-box' }} value={dates} onChange={e => setDates(e.target.value)} placeholder="e.g. 25–27 Aug 2026 or specify days needed" />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 8px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Project Details</p>
        <textarea className="input-field" style={{ margin: '0 0 20px', width: '100%', boxSizing: 'border-box', height: 110, resize: 'vertical' }} value={note} onChange={e => setNote(e.target.value)} placeholder="Describe your project and what you need…" />
        <button onClick={() => { if (dates && note) setDone(true); else showToast('Please fill in all fields') }} style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Confirm Booking</button>
      </div>
    </FullScreen>
  )
}

function OrderDetail({ order, onBack }: { order: HubOrder | undefined; onBack: () => void }) {
  const ord = order ?? ORDERS[0]
  const meta = ORDER_STATUS_META[ord.status]
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  return (
    <FullScreen title="Order Details" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: `${meta.color}0a`, border: `1px solid ${meta.color}18`, borderRadius: 18, padding: '18px', marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px' }}>Order Value</p>
          <p style={{ color: 'white', fontSize: 32, fontFamily: 'DM Serif Display, serif', margin: '0 0 6px' }}>KES {ord.amount.toLocaleString()}</p>
          <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', marginBottom: 14 }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{ord.title}</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 6px' }}>{ord.type === 'buyer' ? '📤 Buying from' : '📥 Selling to'} {ord.counterparty}</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>📅 Due {ord.dueDate}</p>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Deliverables</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
          {ord.deliverables.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '11px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: i < Math.ceil((ord.progress / 100) * ord.deliverables.length) ? '#1abc9c' : 'rgba(255,255,255,0.08)', border: `1px solid ${i < Math.ceil((ord.progress / 100) * ord.deliverables.length) ? '#1abc9c' : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', flexShrink: 0 }}>{i < Math.ceil((ord.progress / 100) * ord.deliverables.length) ? '✓' : ''}</div>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => showToast('Message sent!')} style={{ flex: 1, padding: '13px', borderRadius: 13, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>💬 Message</button>
          {ord.status === 'delivered' && <button onClick={() => showToast('Order approved!')} style={{ flex: 2, padding: '13px', borderRadius: 13, background: 'linear-gradient(90deg,#1abc9c,#16a085)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>✓ Approve & Pay</button>}
          {ord.status === 'active' && <button onClick={() => showToast('Update submitted')} style={{ flex: 2, padding: '13px', borderRadius: 13, background: 'linear-gradient(90deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>📤 Submit Update</button>}
        </div>
      </div>
    </FullScreen>
  )
}

function ContractDetail({ contractId, onBack }: { contractId: string; onBack: () => void }) {
  const ct = CONTRACTS.find(c => c.id === contractId) ?? CONTRACTS[0]
  const paid = ct.milestones.filter(m => m.done).reduce((a, m) => a + m.amount, 0)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  return (
    <FullScreen title="Contract" onBack={onBack}>
      {toast && <Toast msg={toast} />}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'rgba(26,188,156,0.07)', border: '1px solid rgba(26,188,156,0.15)', borderRadius: 18, padding: '18px', marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px' }}>Contract Value</p>
          <p style={{ color: 'white', fontSize: 32, fontFamily: 'DM Serif Display, serif', margin: '0 0 6px' }}>KES {ct.value.toLocaleString()}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>KES {paid.toLocaleString()} received of KES {ct.value.toLocaleString()}</p>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', margin: '0 20px' }}>
            <div style={{ width: `${(paid / ct.value) * 100}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #1abc9c, #2ecc71)' }} />
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Milestones</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {ct.milestones.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 14px', background: m.done ? 'rgba(26,188,156,0.05)' : 'rgba(255,255,255,0.04)', border: `1px solid ${m.done ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: m.done ? '#1abc9c' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', flexShrink: 0 }}>{m.done ? '✓' : i + 1}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: m.done ? 'rgba(255,255,255,0.5)' : 'white', fontSize: 13, fontWeight: 600, margin: '0 0 1px', textDecoration: m.done ? 'line-through' : 'none' }}>{m.label}</p>
              </div>
              <p style={{ color: m.done ? '#1abc9c' : 'white', fontSize: 13, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>KES {m.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <button onClick={() => showToast('Contract downloaded')} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>📥 Download PDF</button>
      </div>
    </FullScreen>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function HubShell({ onExit }: Props) {
  const { state: platformState, actions: platformActions } = usePlatform()
  const [tab, setTab] = useState<Tab>('discover')
  const [sub, setSub] = useState<SubScreen>({ id: 'root' })
  const [orders, setOrders] = useState<HubOrder[]>(ORDERS)
  const [cart, setCart] = useState<CartLine[]>([])
  const [lastCreatedOrders, setLastCreatedOrders] = useState<HubOrder[]>([])

  const push = (s: SubScreen) => setSub(s)
  const back = () => setSub({ id: 'root' })
  const isRoot = sub.id === 'root'

  const addToCart = (svcId: string) => {
    setCart(prev => prev.some(c => c.svcId === svcId) ? prev : [...prev, { svcId, qty: 1 }])
    push({ id: 'cart' })
  }
  const setCartQty = (svcId: string, qty: number) => setCart(prev => prev.map(c => c.svcId === svcId ? { ...c, qty } : c))
  const removeFromCart = (svcId: string) => setCart(prev => prev.filter(c => c.svcId !== svcId))

  const confirmCheckout = () => {
    const newOrders: HubOrder[] = cart.map(c => {
      const svc = SERVICES.find(s => s.id === c.svcId)!
      const unit = Number(svc.price.replace(/[^0-9]/g, '')) || 0
      return {
        id: `HUB${Math.floor(1000 + Math.random() * 9000)}`,
        title: svc.title, type: 'buyer', counterparty: svc.provider, amount: unit * c.qty,
        status: 'pending', dueDate: 'To be scheduled', deliverables: [svc.title], progress: 0,
      }
    })
    setOrders(prev => [...newOrders, ...prev])
    newOrders.forEach(order => platformActions.addTransaction({ label: `Demo marketplace order: ${order.title}`, amount: order.amount, type: 'debit', status: 'demo-confirmed' }))
    setLastCreatedOrders(newOrders)
    setCart([])
    push({ id: 'order-confirmation' })
  }

  const renderSub = () => {
    switch (sub.id) {
      case 'opp-detail':     return <OppDetail oppId={sub.oppId} onBack={back} onApply={() => push({ id: 'apply', oppId: sub.oppId })} />
      case 'apply':          return <ApplyScreen oppId={sub.oppId} onBack={back} onSubmit={() => {
        const opp = OPPORTUNITIES.find(item => item.id === sub.oppId) ?? OPPORTUNITIES[0]
        platformActions.submitApplication({ opportunityId: opp.id, title: opp.title, organization: opp.org })
      }} />
      case 'svc-detail':     return <SvcDetail svcId={sub.svcId} onBack={back} onHire={() => push({ id: 'hire', svcId: sub.svcId })} onAddToCart={() => addToCart(sub.svcId)} />
      case 'hire':           return <HireScreen svcId={sub.svcId} onBack={back} />
      case 'cart':           return <CartScreen cart={cart} orders={orders} onQtyChange={setCartQty} onRemove={removeFromCart} onBack={back} onCheckout={() => push({ id: 'checkout' })} />
      case 'checkout':       return <CheckoutScreen cart={cart} onBack={() => push({ id: 'cart' })} onConfirm={confirmCheckout} />
      case 'order-confirmation': return <OrderConfirmationScreen createdOrders={lastCreatedOrders} onViewOrders={() => { setTab('mywork'); back() }} onDone={() => { setTab('mywork'); back() }} />
      case 'order-detail':   return <OrderDetail order={orders.find(o => o.id === sub.orderId)} onBack={back} />
      case 'contract-detail':return <ContractDetail contractId={sub.contractId} onBack={back} />
      case 'applications':   return (
        <FullScreen title="My Applications" onBack={back}>
          <div style={{ padding: '0 20px' }}>
            {[...platformState.applications.map(app => ({ id: app.id, oppTitle: app.title, org: app.organization, appliedDate: app.createdAt.slice(0, 10), status: app.status === 'submitted' ? 'submitted' as const : 'reviewing' as const, oppType: 'job' as const })), ...APPLICATIONS].map(app => {
              const meta = APP_STATUS_META[app.status]
              const typeMeta = OPP_TYPE_META[app.oppType]
              return (
                <div key={app.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${typeMeta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{typeMeta.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{app.oppTitle}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 6px' }}>{app.org}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{app.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </FullScreen>
      )
      case 'deadlines': return (
        <FullScreen title="Deadline Center" badge={`${OPPORTUNITIES.filter(o => o.deadline !== 'Open').length}`} onBack={back}>
          <div style={{ padding: '0 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
              Every deadline across your saved and matched opportunities, soonest first.
            </p>
            {OPPORTUNITIES
              .filter(o => o.deadline !== 'Open')
              .slice()
              .sort((a, b) => a.deadline.localeCompare(b.deadline))
              .map(o => {
                const meta = OPP_TYPE_META[o.type]
                return (
                  <div key={o.id} onClick={() => push({ id: 'opp-detail', oppId: o.id })} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 14px', borderRadius: 15, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8, cursor: 'pointer' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{meta.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{o.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{o.org}</p>
                    </div>
                    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: 'rgba(231,76,60,0.1)', color: '#e74c3c', fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{o.deadline}</span>
                  </div>
                )
              })}
          </div>
        </FullScreen>
      )
    }
  }

  const renderTab = () => {
    switch (tab) {
      case 'discover':    return <DiscoverTab onOpp={id => push({ id: 'opp-detail', oppId: id })} onApplications={() => push({ id: 'applications' })} onDeadlines={() => push({ id: 'deadlines' })} />
      case 'marketplace': return <MarketplaceTab onService={id => push({ id: 'svc-detail', svcId: id })} cartCount={cart.reduce((s, c) => s + c.qty, 0)} onCart={() => push({ id: 'cart' })} />
      case 'mywork':      return <MyWorkTab orders={orders} onOrder={id => push({ id: 'order-detail', orderId: id })} onApplications={() => push({ id: 'applications' })} onContract={id => push({ id: 'contract-detail', contractId: id })} />
      case 'post':        return <PostTab />
      case 'dashboard':   return <DashboardTab />
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
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#8e44ad,#9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🛒</div>
              <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Pwani Hub</span>
            </div>
            <div style={{ width: 40, height: 40 }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{renderTab()}</div>

          {/* Bottom nav */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', padding: '8px 0 20px' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setSub({ id: 'root' }) }} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
                <span style={{ fontSize: 20, filter: tab === t.key ? 'none' : 'grayscale(1) opacity(0.4)' }}>{t.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: tab === t.key ? '#5dade2' : 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>{t.label}</span>
                {tab === t.key && <div style={{ width: 18, height: 2, borderRadius: 1, background: '#9b59b6' }} />}
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
    </div>
  )
}

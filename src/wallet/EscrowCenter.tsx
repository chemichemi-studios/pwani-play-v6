import { useState } from 'react'
import { ESCROW_HOLDS, ESCROW_STATUS_META, MILESTONE_STATUS_META, formatKES, type EscrowHold, type EscrowMilestone, type EscrowEvent } from './data'

type Props = { onBack: () => void }

const TODAY = new Date('2026-08-18')
function parseDMY(s: string): Date | null {
  const m = s.match(/^(\d{1,2}) (\w{3}) (\d{4})$/)
  if (!m) return null
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const mi = months.indexOf(m[2])
  if (mi === -1) return null
  return new Date(Number(m[3]), mi, Number(m[1]))
}
function isOverdue(m: EscrowMilestone): boolean {
  if (m.status === 'paid' || m.status === 'approved') return false
  const d = parseDMY(m.dueDate)
  return !!d && d < TODAY
}

export default function EscrowCenter({ onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [holds, setHolds] = useState<EscrowHold[]>(ESCROW_HOLDS)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const hold = holds.find(h => h.id === selected)

  const addEvent = (holdId: string, action: string) => {
    const ev: EscrowEvent = { id: 'ev' + Date.now(), timestamp: 'Just now', actor: 'You', action }
    setHolds(prev => prev.map(h => h.id !== holdId ? h : { ...h, events: [...h.events, ev] }))
  }

  const approveMilestone = (milestoneId: string, title: string, amount: number) => {
    if (!hold) return
    setHolds(prev => prev.map(h => h.id !== hold.id ? h : {
      ...h,
      status: h.milestones.every(m => m.id === milestoneId || m.status === 'paid') ? 'released' : h.status,
      milestones: h.milestones.map(m => m.id === milestoneId ? { ...m, status: 'paid', releasedAmount: undefined } : m),
    }))
    addEvent(hold.id, `Approved "${title}" — ${formatKES(amount)} released in full`)
    showToast('Milestone approved — funds released')
  }

  const partialRelease = (milestoneId: string, title: string, amount: number) => {
    if (!hold) return
    setHolds(prev => prev.map(h => h.id !== hold.id ? h : {
      ...h,
      milestones: h.milestones.map(m => m.id === milestoneId ? { ...m, releasedAmount: amount } : m),
    }))
    addEvent(hold.id, `Partial release for "${title}" — ${formatKES(amount)} released, remainder still held`)
    showToast('Partial release sent')
  }

  const requestRevision = (milestoneId: string, title: string, note: string) => {
    if (!hold) return
    setHolds(prev => prev.map(h => h.id !== hold.id ? h : {
      ...h,
      milestones: h.milestones.map(m => m.id === milestoneId ? { ...m, status: 'revision_requested', revisionNote: note } : m),
    }))
    addEvent(hold.id, `Requested revision on "${title}" — funds remain held`)
    showToast('Revision requested')
  }

  if (hold) {
    const statusMeta = ESCROW_STATUS_META[hold.status]
    const heldTotal = hold.milestones.reduce((s, m) => s + (m.status === 'paid' ? 0 : m.amount - (m.releasedAmount || 0)), 0)
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <Header title="Protected Payment" onBack={() => setSelected(null)} />
        {toast && <Toast text={toast} />}
        <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
          <div style={{ background: `${statusMeta.color}0d`, border: `1px solid ${statusMeta.color}30`, borderRadius: 18, padding: 18, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{hold.counterpartyAvatar}</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white', margin: '0 0 4px', lineHeight: 1.3 }}>{hold.projectTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 10px' }}>{hold.counterparty} · {hold.role === 'client' ? 'You are the client' : 'You are the provider'}</p>
            <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: `${statusMeta.color}18`, color: statusMeta.color, fontWeight: 700 }}>{statusMeta.label}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 12 }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 4px' }}>Total Contract</p>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatKES(hold.totalAmount)}</p>
            </div>
            <div style={{ background: 'rgba(243,156,18,0.06)', border: '1px solid rgba(243,156,18,0.2)', borderRadius: 14, padding: 12 }}>
              <p style={{ color: '#f39c12', fontSize: 10.5, margin: '0 0 4px' }}>Still Held</p>
              <p style={{ color: '#f39c12', fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{formatKES(heldTotal)}</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Milestones</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {hold.milestones.map(m => (
              <MilestoneRow
                key={m.id}
                m={m}
                overdue={isOverdue(m)}
                canApprove={hold.role === 'client'}
                onApprove={() => approveMilestone(m.id, m.title, m.amount - (m.releasedAmount || 0))}
                onPartialRelease={(amt) => partialRelease(m.id, m.title, amt)}
                onRequestRevision={(note) => requestRevision(m.id, m.title, note)}
              />
            ))}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Activity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 16, borderLeft: '2px solid rgba(255,255,255,0.08)', paddingLeft: 14 }}>
            {hold.events.map((ev, i) => (
              <div key={ev.id} style={{ position: 'relative', paddingBottom: i === hold.events.length - 1 ? 0 : 14 }}>
                <div style={{ position: 'absolute', left: -18.5, top: 3, width: 7, height: 7, borderRadius: '50%', background: '#5dade2' }} />
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '0 0 2px', lineHeight: 1.4 }}>{ev.action}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5, margin: 0, fontFamily: 'DM Mono, monospace' }}>{ev.actor} · {ev.timestamp}</p>
              </div>
            ))}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '0', lineHeight: 1.6, textAlign: 'center' }}>
            Funds are held by Pwani Play until each milestone is approved, then released to {hold.role === 'client' ? 'the provider' : 'your available balance'}. This reflects the platform's payment protection status, not a legal escrow guarantee.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Protected Payments" badge={`${holds.length}`} onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, margin: '0 0 18px', lineHeight: 1.6 }}>
          Funds tied to a Pwani Hub contract or commission stay protected here until each milestone is approved — separate from your regular available balance.
        </p>
        {holds.map(h => {
          const meta = ESCROW_STATUS_META[h.status]
          const held = h.milestones.reduce((s, m) => s + (m.status === 'paid' ? 0 : m.amount - (m.releasedAmount || 0)), 0)
          const hasOverdue = h.milestones.some(isOverdue)
          return (
            <div key={h.id} onClick={() => setSelected(h.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{h.counterpartyAvatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.projectTitle}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 6px' }}>{h.counterparty} · {h.source}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                    <span style={{ color: '#f39c12', fontSize: 11.5, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{formatKES(held)} held</span>
                    {hasOverdue && <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 100, background: 'rgba(231,76,60,0.15)', color: '#e74c3c', fontWeight: 700 }}>⚠ Overdue</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {holds.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40, fontSize: 13 }}>No protected payments right now.</p>}
      </div>
    </div>
  )
}

function MilestoneRow({ m, overdue, canApprove, onApprove, onPartialRelease, onRequestRevision }: {
  m: EscrowMilestone
  overdue: boolean
  canApprove: boolean
  onApprove: () => void
  onPartialRelease: (amount: number) => void
  onRequestRevision: (note: string) => void
}) {
  const meta = MILESTONE_STATUS_META[m.status]
  const [showPartial, setShowPartial] = useState(false)
  const [showRevision, setShowRevision] = useState(false)
  const [partialAmount, setPartialAmount] = useState('')
  const [revisionNote, setRevisionNote] = useState('')
  const remaining = m.amount - (m.releasedAmount || 0)

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${overdue ? 'rgba(231,76,60,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 15, padding: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 8 }}>
        <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{m.title}</p>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {overdue && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(231,76,60,0.18)', color: '#e74c3c', fontWeight: 700 }}>⚠ Overdue</span>}
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 6px' }}>
        Due {m.dueDate} · {m.amount.toLocaleString()} KES
        {m.releasedAmount ? ` · ${formatKES(m.releasedAmount)} released, ${formatKES(remaining)} remaining` : ''}
      </p>
      {m.evidence && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11.5, margin: '0 0 8px', fontStyle: 'italic' }}>"{m.evidence}"</p>}
      {m.status === 'revision_requested' && m.revisionNote && (
        <p style={{ color: '#e67e22', fontSize: 11.5, margin: '0 0 8px', background: 'rgba(230,126,34,0.08)', padding: '6px 10px', borderRadius: 8 }}>Revision requested: {m.revisionNote}</p>
      )}

      {canApprove && m.status === 'submitted' && !showPartial && !showRevision && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={onApprove} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(26,188,156,0.15)', border: '1px solid rgba(26,188,156,0.3)', color: '#1abc9c', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Approve Full Amount</button>
          <button onClick={() => setShowPartial(true)} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(93,173,226,0.12)', border: '1px solid rgba(93,173,226,0.3)', color: '#5dade2', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Partial Release</button>
          <button onClick={() => setShowRevision(true)} style={{ padding: '7px 14px', borderRadius: 10, background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.3)', color: '#e67e22', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Request Revision</button>
        </div>
      )}

      {showPartial && (
        <div style={{ marginTop: 6 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '0 0 6px' }}>Amount to release now (of {formatKES(m.amount)}):</p>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="number" value={partialAmount} onChange={e => setPartialAmount(e.target.value)} placeholder="e.g. 4000" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '7px 10px', color: 'white', fontSize: 12 }} />
            <button onClick={() => { const amt = Number(partialAmount); if (amt > 0 && amt <= m.amount) { onPartialRelease(amt); setShowPartial(false); setPartialAmount('') } }} style={{ padding: '7px 14px', borderRadius: 9, background: '#2980b9', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Send</button>
            <button onClick={() => setShowPartial(false)} style={{ padding: '7px 10px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>×</button>
          </div>
        </div>
      )}

      {showRevision && (
        <div style={{ marginTop: 6 }}>
          <textarea value={revisionNote} onChange={e => setRevisionNote(e.target.value)} placeholder="What needs to change before this can be approved?" style={{ width: '100%', boxSizing: 'border-box', height: 60, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: 8, color: 'white', fontSize: 12, resize: 'vertical', marginBottom: 6 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { if (revisionNote.trim()) { onRequestRevision(revisionNote.trim()); setShowRevision(false); setRevisionNote('') } }} style={{ padding: '7px 14px', borderRadius: 9, background: '#e67e22', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Send Revision Request</button>
            <button onClick={() => setShowRevision(false)} style={{ padding: '7px 10px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Header({ title, onBack, badge }: { title: string; onBack: () => void; badge?: string }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
      {badge && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(243,156,18,0.12)', color: '#f39c12', fontWeight: 700, border: '1px solid rgba(243,156,18,0.2)' }}>{badge}</span>}
    </div>
  )
}

function Toast({ text }: { text: string }) {
  return <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{text}</div>
}

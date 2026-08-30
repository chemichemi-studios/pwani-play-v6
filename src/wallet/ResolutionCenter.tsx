import { useState } from 'react'
import {
  REFUND_REQUESTS, REFUND_STATUS_META, DISPUTES, DISPUTE_STATUS_META, DISPUTE_REASONS,
  formatKES, type RefundRequest, type Dispute, type DisputeEvent, type DisputeReason,
} from './data'

type Props = { onBack: () => void; openDisputeForTx?: { txId: string; subject: string; counterparty: string; amount: number } | null }
type View = { id: 'list' } | { id: 'refund-detail'; refundId: string } | { id: 'dispute-detail'; disputeId: string } | { id: 'new-dispute' }

export default function ResolutionCenter({ onBack, openDisputeForTx }: Props) {
  const [tab, setTab] = useState<'refunds' | 'disputes'>(openDisputeForTx ? 'disputes' : 'refunds')
  const [view, setView] = useState<View>(openDisputeForTx ? { id: 'new-dispute' } : { id: 'list' })
  const [disputes, setDisputes] = useState<Dispute[]>(DISPUTES)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const back = () => setView({ id: 'list' })

  if (view.id === 'new-dispute') {
    return <NewDispute
      prefill={openDisputeForTx}
      onCancel={back}
      onSubmit={(d) => {
        setDisputes(p => [d, ...p])
        showToast('Dispute opened — support will review within 48 hours')
        setTab('disputes')
        setView({ id: 'list' })
      }}
    />
  }

  if (view.id === 'refund-detail') {
    const rf = REFUND_REQUESTS.find(r => r.id === view.refundId)
    if (!rf) return null
    return <RefundRequestDetail rf={rf} onBack={back} />
  }

  if (view.id === 'dispute-detail') {
    const d = disputes.find(x => x.id === view.disputeId)
    if (!d) return null
    return <DisputeDetailView d={d} onBack={back} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Refunds & Disputes" onBack={onBack} />
      {toast && <Toast text={toast} />}
      <div style={{ padding: '68px 20px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['refunds', 'disputes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 12, border: 'none', cursor: 'pointer', background: tab === t ? '#1e6091' : 'rgba(255,255,255,0.06)', color: tab === t ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700 }}>
              {t === 'refunds' ? `Refunds (${REFUND_REQUESTS.length})` : `Disputes (${disputes.length})`}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {tab === 'refunds' ? (
          REFUND_REQUESTS.map(rf => {
            const meta = REFUND_STATUS_META[rf.status]
            return (
              <div key={rf.id} onClick={() => setView({ id: 'refund-detail', refundId: rf.id })} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0, flex: 1 }}>{rf.orderDesc}</p>
                  <span style={{ color: '#9b59b6', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(rf.requestedAmount)}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 8px' }}>{rf.counterparty} · {rf.refundNumber}</p>
                <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
              </div>
            )
          })
        ) : (
          <>
            <button onClick={() => setView({ id: 'new-dispute' })} style={{ width: '100%', padding: '11px', borderRadius: 13, background: 'rgba(231,76,60,0.08)', border: '1px dashed rgba(231,76,60,0.25)', color: '#e74c3c', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 14 }}>+ Open a Dispute</button>
            {disputes.map(d => {
              const meta = DISPUTE_STATUS_META[d.status]
              return (
                <div key={d.id} onClick={() => setView({ id: 'dispute-detail', disputeId: d.id })} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0, flex: 1 }}>{d.subject}</p>
                    <span style={{ color: '#e74c3c', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(d.amount)}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 8px' }}>{d.counterparty} · {d.reason} · {d.disputeNumber}</p>
                  <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                </div>
              )
            })}
            {disputes.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40, fontSize: 13 }}>No disputes right now.</p>}
          </>
        )}
      </div>
    </div>
  )
}

function RefundRequestDetail({ rf, onBack }: { rf: RefundRequest; onBack: () => void }) {
  const meta = REFUND_STATUS_META[rf.status]
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Refund Request" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <div style={{ background: `${meta.color}0d`, border: `1px solid ${meta.color}30`, borderRadius: 18, padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', margin: '0 0 6px' }}>{rf.refundNumber}</p>
          <p style={{ color: 'white', fontSize: 28, fontFamily: 'DM Serif Display, serif', margin: '0 0 8px' }}>{formatKES(rf.approvedAmount ?? rf.requestedAmount)}</p>
          <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          {[
            { label: 'Order', value: rf.orderDesc },
            { label: 'From', value: rf.counterparty },
            { label: 'Reason', value: rf.reason },
            { label: 'Requested', value: formatKES(rf.requestedAmount) },
            ...(rf.approvedAmount !== undefined ? [{ label: 'Approved', value: formatKES(rf.approvedAmount) }] : []),
            { label: 'Destination', value: rf.destination },
            { label: 'Requested On', value: rf.requestedDate },
            { label: 'Last Updated', value: rf.updatedDate },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{row.label}</span>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
            </div>
          ))}
        </div>
        {rf.note && (
          <div style={{ background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.15)', borderRadius: 14, padding: 14 }}>
            <p style={{ color: '#e74c3c', fontSize: 12.5, fontWeight: 700, margin: '0 0 4px' }}>Note from {rf.counterparty}</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>{rf.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DisputeDetailView({ d, onBack }: { d: Dispute; onBack: () => void }) {
  const meta = DISPUTE_STATUS_META[d.status]
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Dispute" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <div style={{ background: `${meta.color}0d`, border: `1px solid ${meta.color}30`, borderRadius: 18, padding: 18, marginBottom: 16, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', margin: '0 0 6px' }}>{d.disputeNumber}</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white', margin: '0 0 4px', lineHeight: 1.3 }}>{d.subject}</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 10px' }}>{d.counterparty} · {formatKES(d.amount)}</p>
          <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Reason: {d.reason}</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{d.description}</p>
        </div>

        {d.evidence.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Evidence Submitted</p>
            {d.evidence.map((e, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5, margin: '0 0 6px' }}>📎 {e}</p>)}
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Timeline</p>
        <div style={{ borderLeft: '2px solid rgba(255,255,255,0.08)', paddingLeft: 14, marginBottom: 16 }}>
          {d.timeline.map((ev, i) => (
            <div key={ev.id} style={{ position: 'relative', paddingBottom: i === d.timeline.length - 1 ? 0 : 14 }}>
              <div style={{ position: 'absolute', left: -18.5, top: 3, width: 7, height: 7, borderRadius: '50%', background: '#5dade2' }} />
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '0 0 2px', lineHeight: 1.4 }}>{ev.action}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5, margin: 0, fontFamily: 'DM Mono, monospace' }}>{ev.actor} · {ev.timestamp}</p>
            </div>
          ))}
        </div>

        {d.resolution && (
          <div style={{ background: 'rgba(26,188,156,0.06)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 14, padding: 14 }}>
            <p style={{ color: '#1abc9c', fontSize: 12.5, fontWeight: 700, margin: '0 0 4px' }}>Resolution</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>{d.resolution}</p>
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '16px 0 0', lineHeight: 1.6, textAlign: 'center' }}>
          Disputes are reviewed by Pwani Play support, not automatically decided by either side. This isn't a legal proceeding.
        </p>
      </div>
    </div>
  )
}

function NewDispute({ prefill, onCancel, onSubmit }: { prefill?: { txId: string; subject: string; counterparty: string; amount: number } | null; onCancel: () => void; onSubmit: (d: Dispute) => void }) {
  const [reason, setReason] = useState<DisputeReason>('Other')
  const [description, setDescription] = useState('')

  const submit = () => {
    if (!description.trim()) return
    const d: Dispute = {
      id: 'd' + Date.now(),
      disputeNumber: `DSP-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      subject: prefill?.subject ?? 'General Dispute',
      counterparty: prefill?.counterparty ?? 'Unknown',
      amount: prefill?.amount ?? 0,
      currency: 'KES',
      reason,
      description: description.trim(),
      status: 'open',
      priority: 'Medium',
      createdDate: 'Just now',
      updatedDate: 'Just now',
      evidence: [],
      timeline: [{ id: 'de' + Date.now(), timestamp: 'Just now', actor: 'You', action: 'Opened dispute — awaiting support review' }],
    }
    onSubmit(d)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Open a Dispute" onBack={onCancel} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        {prefill && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 20 }}>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{prefill.subject}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{prefill.counterparty} · {formatKES(prefill.amount)}</p>
          </div>
        )}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>Reason</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
          {DISPUTE_REASONS.map(r => (
            <button key={r} onClick={() => setReason(r)} style={{ padding: '7px 13px', borderRadius: 100, background: reason === r ? 'rgba(231,76,60,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${reason === r ? 'rgba(231,76,60,0.3)' : 'rgba(255,255,255,0.08)'}`, color: reason === r ? '#e74c3c' : 'rgba(255,255,255,0.55)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>{r}</button>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>What happened?</p>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail — this isn't a legal filing, just an honest account for our support team." style={{ width: '100%', boxSizing: 'border-box', height: 120, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 12, color: 'white', fontSize: 13, resize: 'vertical', marginBottom: 20 }} />
        <button onClick={submit} disabled={!description.trim()} style={{ width: '100%', padding: 14, borderRadius: 13, background: description.trim() ? 'linear-gradient(90deg,#c0392b,#e74c3c)' : 'rgba(255,255,255,0.08)', border: 'none', color: description.trim() ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: description.trim() ? 'pointer' : 'not-allowed' }}>Submit Dispute</button>
      </div>
    </div>
  )
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>{title}</h2>
    </div>
  )
}

function Toast({ text }: { text: string }) {
  return <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 400, background: '#1abc9c', color: 'white', padding: '8px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{text}</div>
}

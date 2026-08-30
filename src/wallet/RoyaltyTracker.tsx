import { LICENSED_WORKS, royaltyOwed, formatKES } from './data'

type Props = { onBack: () => void }

const STATUS_META: Record<string, { label: string; color: string }> = {
  active: { label: 'Licensed — Active', color: '#5dade2' },
  expired: { label: 'Expired', color: 'rgba(255,255,255,0.35)' },
  pending_payout: { label: 'Pending Payout', color: '#f39c12' },
}

export default function RoyaltyTracker({ onBack }: Props) {
  const totalOwed = LICENSED_WORKS.reduce((s, w) => s + royaltyOwed(w), 0)
  const pendingPayout = LICENSED_WORKS.filter(w => w.status === 'pending_payout').reduce((s, w) => s + royaltyOwed(w), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title="Royalties & Licensing" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
          Income from licensing your work to others — footage, music, and other IP — separate from what you earn directly on Pwani Play.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <StatBox label="Total Royalties Owed" value={formatKES(totalOwed)} color="#1abc9c" />
          <StatBox label="Pending Payout to Wallet" value={formatKES(pendingPayout)} color="#f39c12" />
        </div>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Licensed Works</p>
        {LICENSED_WORKS.map(w => {
          const meta = STATUS_META[w.status]
          const owed = royaltyOwed(w)
          return (
            <div key={w.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 15, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <p style={{ color: 'white', fontSize: 13.5, fontWeight: 700, margin: '0 0 2px' }}>{w.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{w.workType} · Licensed to {w.licensee}</p>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${meta.color}18`, color: meta.color, fontWeight: 700, flexShrink: 0 }}>{meta.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                <Tag text={w.licenseType} />
                <Tag text={w.territory} />
                <Tag text={w.period} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12 }}>
                <Row label="Gross Revenue" value={formatKES(w.grossRevenue)} />
                <Row label="Royalty Rate" value={`${Math.round(w.royaltyRate * 100)}%`} />
                {w.participantShare < 1 && <Row label="Your Share" value={`${Math.round(w.participantShare * 100)}% (co-owned)`} />}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ color: 'white', fontSize: 12.5, fontWeight: 700 }}>You're owed</span>
                  <span style={{ color: '#1abc9c', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{formatKES(owed)}</span>
                </div>
              </div>
            </div>
          )
        })}

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '16px 0 0', lineHeight: 1.6, textAlign: 'center' }}>
          Payouts follow: Gross Revenue → Royalty Engine → Participant Share → Pwani Wallet. Pending payouts appear in your Wallet once processed.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5 }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11.5, fontFamily: 'DM Mono, monospace' }}>{value}</span>
    </div>
  )
}

function Tag({ text }: { text: string }) {
  return <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>{text}</span>
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{value}</p>
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

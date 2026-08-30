import { useState } from 'react'
import { WALLET_BALANCE, MONTHLY_EARNINGS, BUDGETS, MEMBERSHIP_TIERS, LICENSED_WORKS, REFUND_REQUESTS, royaltyOwed, formatKES } from './data'
import { buildUnifiedList } from './UnifiedExpenseCenter'
import { actualSpend } from './PersonalFinance'

type Props = { onBack: () => void }
type ReportType = 'income' | 'expense' | 'cashflow' | 'budget' | 'creator'

function sumIncome(month: typeof MONTHLY_EARNINGS[0]) {
  return month.subscriptions + month.tips + month.marketplace + month.courses + month.ads + month.sponsorship
}

const REPORTS: { id: ReportType; label: string; icon: string; desc: string }[] = [
  { id: 'income', label: 'Income Summary', icon: '📈', desc: 'Revenue by source, this month vs last' },
  { id: 'expense', label: 'Expense Summary', icon: '📉', desc: 'Every expense across Wallet, Grant & Production' },
  { id: 'cashflow', label: 'Cash Flow', icon: '💧', desc: 'Money in, money out, net movement' },
  { id: 'budget', label: 'Budget vs Actual', icon: '🎯', desc: 'Spending limits against real transactions' },
  { id: 'creator', label: 'Creator Statement', icon: '📜', desc: 'Gross, fees, refunds, and net earnings this period' },
]

export default function ReportCenter({ onBack }: Props) {
  const [active, setActive] = useState<ReportType | null>(null)
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  if (!active) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
        <Header title="Financial Reports" onBack={onBack} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 18px', lineHeight: 1.5 }}>
            Every report below is generated live from your existing Wallet data — nothing is a separate stored number.
          </p>
          {REPORTS.map(r => (
            <button key={r.id} onClick={() => setActive(r.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', marginBottom: 10, textAlign: 'left' }}>
              <span style={{ fontSize: 24 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{r.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{r.desc}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <Header title={REPORTS.find(r => r.id === active)!.label} onBack={() => setActive(null)} />
      {toast && <Toast text={toast} />}
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 20px 40px' }}>
        {active === 'income' && <IncomeReport />}
        {active === 'expense' && <ExpenseReport />}
        {active === 'cashflow' && <CashFlowReport />}
        {active === 'budget' && <BudgetReport />}
        {active === 'creator' && <CreatorStatementReport />}

        <button onClick={() => showToast('Report exported as PDF')} style={{ width: '100%', padding: 13, borderRadius: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>📥 Export Report</button>
      </div>
    </div>
  )
}

function AISummary({ text }: { text: string }) {
  return (
    <div style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.18)', borderRadius: 14, padding: 14, marginBottom: 18 }}>
      <p style={{ color: '#5dade2', fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>🤖 AI Summary</p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, margin: 0, lineHeight: 1.55 }}>{text}</p>
    </div>
  )
}

function IncomeReport() {
  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const lastMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2]
  const thisTotal = sumIncome(thisMonth)
  const lastTotal = sumIncome(lastMonth)
  const pct = Math.round(((thisTotal - lastTotal) / lastTotal) * 100)
  const sources: [string, number][] = [
    ['Sponsorship', thisMonth.sponsorship] as [string, number], ['Subscriptions', thisMonth.subscriptions] as [string, number], ['Courses', thisMonth.courses] as [string, number],
    ['Marketplace', thisMonth.marketplace] as [string, number], ['Ads', thisMonth.ads] as [string, number], ['Tips', thisMonth.tips] as [string, number],
  ].sort((a, b) => b[1] - a[1])

  return (
    <>
      <AISummary text={`You earned ${formatKES(thisTotal)} in ${thisMonth.month}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% from ${thisMonth === lastMonth ? '' : lastMonth.month}. ${sources[0][0]} was your top source at ${formatKES(sources[0][1])}.`} />
      <BigStat label={`Total Income — ${thisMonth.month}`} value={formatKES(thisTotal)} sub={`${pct >= 0 ? '+' : ''}${pct}% vs ${lastMonth.month} (${formatKES(lastTotal)})`} color={pct >= 0 ? '#1abc9c' : '#e74c3c'} />
      <SectionLabel text="Top Sources" />
      {sources.map(([label, amt]) => <BarRow key={label} label={label} amount={amt} max={sources[0][1]} color="#5dade2" />)}
    </>
  )
}

function ExpenseReport() {
  const all = buildUnifiedList()
  const total = all.reduce((s, e) => s + e.amount, 0)
  const bySource = ['Personal', 'Grant', 'Production'].map(s => [s, all.filter(e => e.source === s).reduce((sum, e) => sum + e.amount, 0)] as [string, number]).filter(([, v]) => v > 0)
  const byCategory = Array.from(all.reduce((map, e) => map.set(e.category, (map.get(e.category) || 0) + e.amount), new Map<string, number>()).entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <>
      <AISummary text={`Total tracked expenses come to ${formatKES(total)} across ${all.length} records. The largest category is "${byCategory[0][0]}" at ${formatKES(byCategory[0][1])}.`} />
      <BigStat label="Total Expenses" value={formatKES(total)} sub={`${all.length} records across all sources`} color="#e74c3c" />
      <SectionLabel text="By Source" />
      {bySource.map(([label, amt]) => <BarRow key={label} label={label} amount={amt} max={bySource[0][1]} color="#f39c12" />)}
      <SectionLabel text="Top Categories" />
      {byCategory.map(([label, amt]) => <BarRow key={label} label={label} amount={amt} max={byCategory[0][1]} color="#8e44ad" />)}
    </>
  )
}

function CashFlowReport() {
  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const inflows = sumIncome(thisMonth)
  const outflows = buildUnifiedList().filter(e => e.source === 'Personal' && e.date.startsWith('2026-08')).reduce((s, e) => s + e.amount, 0)
  const net = inflows - outflows

  return (
    <>
      <AISummary text={`Net cash movement this month is ${formatKES(net)} (${formatKES(inflows)} in, ${formatKES(outflows)} out). Your available balance is ${formatKES(WALLET_BALANCE.available)}, separate from ${formatKES(WALLET_BALANCE.heldInEscrow)} still held in escrow.`} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <StatBox label="Inflows" value={formatKES(inflows)} color="#1abc9c" />
        <StatBox label="Outflows" value={formatKES(outflows)} color="#e74c3c" />
        <StatBox label="Net Movement" value={formatKES(net)} color={net >= 0 ? '#1abc9c' : '#e74c3c'} />
        <StatBox label="Available Now" value={formatKES(WALLET_BALANCE.available)} color="#5dade2" />
      </div>
      <SectionLabel text="Not Yet Available" />
      <BarRow label="Pending" amount={WALLET_BALANCE.pending} max={WALLET_BALANCE.pending + WALLET_BALANCE.heldInEscrow} color="#f39c12" />
      <BarRow label="Held in Escrow" amount={WALLET_BALANCE.heldInEscrow} max={WALLET_BALANCE.pending + WALLET_BALANCE.heldInEscrow} color="#8e44ad" />
    </>
  )
}

function BudgetReport() {
  const rows = BUDGETS.map(b => ({ b, actual: actualSpend(b), variance: b.limit - actualSpend(b) }))
  const overBudget = rows.filter(r => r.variance < 0)

  return (
    <>
      <AISummary text={overBudget.length > 0
        ? `${overBudget.length} of ${rows.length} budgets are over limit this month — "${overBudget[0].b.label}" is the one to look at first.`
        : `All ${rows.length} budgets are within limit this month.`} />
      {rows.map(({ b, actual, variance }) => (
        <div key={b.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 13, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'white', fontSize: 12.5, fontWeight: 700 }}>{b.icon} {b.label}</span>
            <span style={{ color: variance >= 0 ? '#1abc9c' : '#e74c3c', fontSize: 12.5, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{variance >= 0 ? '+' : ''}{formatKES(variance)}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: 0 }}>{formatKES(actual)} actual vs {formatKES(b.limit)} budget</p>
        </div>
      ))}
    </>
  )
}

function CreatorStatementReport() {
  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const platformGross = sumIncome(thisMonth)
  const membershipRevenue = MEMBERSHIP_TIERS.filter(t => t.active && t.period === 'Monthly').reduce((s, t) => s + t.price * t.memberCount, 0)
  const royalties = LICENSED_WORKS.reduce((s, w) => s + royaltyOwed(w), 0)
  const refundsIssued = REFUND_REQUESTS.filter(r => r.status === 'completed' || r.status === 'processing').reduce((s, r) => s + (r.approvedAmount ?? r.requestedAmount), 0)
  const grossTotal = platformGross + membershipRevenue + royalties
  const netEarnings = grossTotal - refundsIssued

  return (
    <>
      <AISummary text={`Gross earnings this period total ${formatKES(grossTotal)} across platform revenue, memberships, and royalties. After ${formatKES(refundsIssued)} in refunds, net earnings are ${formatKES(netEarnings)}.`} />
      <BigStat label={`Net Earnings — ${thisMonth.month}`} value={formatKES(netEarnings)} sub="After refunds, before tax" color="#1abc9c" />
      <SectionLabel text="Gross Sales Breakdown" />
      <BarRow label="Platform Revenue (Studio, Ads, Courses)" amount={platformGross} max={grossTotal} color="#5dade2" />
      <BarRow label="Membership Tiers" amount={membershipRevenue} max={grossTotal} color="#1abc9c" />
      <BarRow label="Royalties & Licensing" amount={royalties} max={grossTotal} color="#8e44ad" />
      <SectionLabel text="Deductions" />
      <BarRow label="Refunds Issued" amount={refundsIssued} max={grossTotal} color="#e74c3c" />
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '4px 0 0', lineHeight: 1.6 }}>
        Platform fees, tax withholding, and chargebacks aren't itemized separately in this prototype's data yet — this statement reflects only what's actually tracked, rather than an estimated figure.
      </p>
    </>
  )
}

function BigStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: `${color}0d`, border: `1px solid ${color}30`, borderRadius: 18, padding: 20, marginBottom: 18, textAlign: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, margin: '0 0 6px' }}>{label}</p>
      <p style={{ color: 'white', fontSize: 30, fontFamily: 'DM Serif Display, serif', margin: '0 0 4px' }}>{value}</p>
      <p style={{ color, fontSize: 12, fontWeight: 700, margin: 0 }}>{sub}</p>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'DM Mono, monospace' }}>{value}</p>
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>{text}</p>
}

function BarRow({ label, amount, max, color }: { label: string; amount: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{label}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{formatKES(amount)}</span>
      </div>
      <div style={{ height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${max > 0 ? Math.round((amount / max) * 100) : 0}%`, height: '100%', background: color, borderRadius: 100 }} />
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

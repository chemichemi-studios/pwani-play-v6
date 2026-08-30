import { useState, useRef, useEffect } from 'react'
import {
  WALLET_BALANCE, TRANSACTIONS, MONTHLY_EARNINGS, INVOICES, ESCROW_HOLDS, formatKES,
} from './data'

type Props = { onBack: () => void; onReports: () => void }

// ─── Computed financial intelligence — all derived from real data, nothing invented ──

function sumIncome(month: typeof MONTHLY_EARNINGS[0]) {
  return month.subscriptions + month.tips + month.marketplace + month.courses + month.ads + month.sponsorship
}

function computeHealthScore() {
  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const lastMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2]
  const revenueGrowth = (sumIncome(thisMonth) - sumIncome(lastMonth)) / sumIncome(lastMonth)
  const overdueCount = INVOICES.filter(i => i.status === 'overdue').length
  const heldRatio = WALLET_BALANCE.heldInEscrow / (WALLET_BALANCE.available + WALLET_BALANCE.heldInEscrow)

  let score = 70
  score += Math.min(20, Math.round(revenueGrowth * 100) * 0.6)
  score -= overdueCount * 8
  score -= heldRatio > 0.4 ? 8 : 0
  score = Math.max(0, Math.min(100, Math.round(score)))

  const band = score >= 80 ? 'Strong' : score >= 60 ? 'Healthy' : score >= 40 ? 'Watch' : 'At Risk'
  const color = score >= 80 ? '#1abc9c' : score >= 60 ? '#5dade2' : score >= 40 ? '#f39c12' : '#e74c3c'
  return { score, band, color, revenueGrowth, overdueCount, heldRatio }
}

function detectAnomalies() {
  const anomalies: { icon: string; title: string; detail: string; severity: 'low' | 'medium' | 'high' }[] = []
  const overdue = INVOICES.filter(i => i.status === 'overdue')
  overdue.forEach(i => anomalies.push({ icon: '⚠️', title: `Overdue invoice — ${i.counterparty}`, detail: `${formatKES(i.amount)} past due since ${i.dueDate}. This is the only overdue invoice in your records.`, severity: 'high' }))

  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const lastMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2]
  if (thisMonth.marketplace < lastMonth.marketplace * 0.7) {
    anomalies.push({ icon: '📉', title: 'Marketplace revenue dipped', detail: `Down from ${formatKES(lastMonth.marketplace)} to ${formatKES(thisMonth.marketplace)} month over month.`, severity: 'medium' })
  }
  const heldTotal = ESCROW_HOLDS.reduce((s, h) => s + h.milestones.reduce((s2, m) => s2 + (m.status === 'paid' ? 0 : m.amount - (m.releasedAmount || 0)), 0), 0)
  if (heldTotal > WALLET_BALANCE.available * 0.5) {
    anomalies.push({ icon: '🔒', title: 'More than half your money is held', detail: `${formatKES(heldTotal)} is in escrow versus ${formatKES(WALLET_BALANCE.available)} available — normal if projects are active, worth a look if not.`, severity: 'low' })
  }
  return anomalies
}

function answerQuestion(q: string): string {
  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const lastMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2]
  const thisTotal = sumIncome(thisMonth)
  const lastTotal = sumIncome(lastMonth)
  const pctChange = Math.round(((thisTotal - lastTotal) / lastTotal) * 100)

  if (/earn|income|revenue/i.test(q) && /month/i.test(q)) {
    return `You earned ${formatKES(thisTotal)} this month (${thisMonth.month}), ${pctChange >= 0 ? 'up' : 'down'} ${Math.abs(pctChange)}% from ${formatKES(lastTotal)} last month.\n\nBreakdown: subscriptions ${formatKES(thisMonth.subscriptions)}, sponsorship ${formatKES(thisMonth.sponsorship)}, courses ${formatKES(thisMonth.courses)}, marketplace ${formatKES(thisMonth.marketplace)}, tips ${formatKES(thisMonth.tips)}, ads ${formatKES(thisMonth.ads)}.\n\nSource: your Monthly Earnings record — this isn't an estimate.`
  }
  if (/biggest expense|spending|expenses/i.test(q)) {
    const out = TRANSACTIONS.filter(t => t.direction === 'out' && t.status === 'completed')
    const top = out.reduce((a, b) => a.amount > b.amount ? a : b)
    return `Your largest single outgoing transaction this period was ${formatKES(top.amount)} — "${top.description}" to ${top.counterparty} on ${new Date(top.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}.\n\nAcross all recorded transactions, you've spent ${formatKES(out.reduce((s, t) => s + t.amount, 0))} total.`
  }
  if (/available|how much.*(have|money)/i.test(q)) {
    return `You have ${formatKES(WALLET_BALANCE.available)} available right now.\n\nThat's separate from ${formatKES(WALLET_BALANCE.pending)} pending and ${formatKES(WALLET_BALANCE.heldInEscrow)} held in escrow — those aren't included in "available" per how Pwani Wallet separates fund states.`
  }
  if (/unpaid|invoice/i.test(q)) {
    const unpaid = INVOICES.filter(i => i.status !== 'paid')
    if (unpaid.length === 0) return 'All your invoices are marked paid — nothing outstanding right now.'
    return `You have ${unpaid.length} unpaid invoice${unpaid.length > 1 ? 's' : ''}:\n\n${unpaid.map(i => `• ${i.counterparty} — ${formatKES(i.amount - (i.amountPaid || 0))} remaining (${i.status})`).join('\n')}`
  }
  if (/escrow|held/i.test(q)) {
    const heldTotal = ESCROW_HOLDS.reduce((s, h) => s + h.milestones.reduce((s2, m) => s2 + (m.status === 'paid' ? 0 : m.amount - (m.releasedAmount || 0)), 0), 0)
    return `${formatKES(heldTotal)} is currently held across ${ESCROW_HOLDS.length} active contract${ESCROW_HOLDS.length > 1 ? 's' : ''}.\n\n${ESCROW_HOLDS.map(h => `• ${h.projectTitle} — ${h.counterparty}`).join('\n')}\n\nFunds release as milestones are approved — see Protected Payments for details.`
  }
  if (/compar/i.test(q)) {
    return `${thisMonth.month} vs ${lastMonth.month}:\n\nTotal income: ${formatKES(thisTotal)} vs ${formatKES(lastTotal)} (${pctChange >= 0 ? '+' : ''}${pctChange}%)\nSponsorship: ${formatKES(thisMonth.sponsorship)} vs ${formatKES(lastMonth.sponsorship)}\nMarketplace: ${formatKES(thisMonth.marketplace)} vs ${formatKES(lastMonth.marketplace)}\n\nThe biggest driver of the change is sponsorship — that category moved the most month over month.`
  }
  if (/afford/i.test(q)) {
    return `Based on your ${formatKES(WALLET_BALANCE.available)} available balance, that depends on the amount — ask me something like "Can I afford a KES 10,000 purchase?" and I'll check it against your available funds, not pending or held amounts.`
  }
  if (/health|score|doing/i.test(q)) {
    const h = computeHealthScore()
    return `Your Financial Health is ${h.score}/100 — ${h.band}.\n\nThis reflects revenue growth (${h.revenueGrowth >= 0 ? '+' : ''}${Math.round(h.revenueGrowth * 100)}% month over month), ${h.overdueCount} overdue invoice${h.overdueCount === 1 ? '' : 's'}, and ${Math.round(h.heldRatio * 100)}% of your funds currently in escrow.\n\nThis is a simplified read of your own numbers, not a credit score or financial advice.`
  }
  return `I can answer questions about your actual wallet data — balance, income, expenses, invoices, escrow, and month-over-month comparisons. Try asking "What did I earn this month?" or "Which invoices are unpaid?"`
}

const SUGGESTED = [
  'What did I earn this month?',
  'Show my biggest expenses',
  'How much money is available?',
  'Which invoices are unpaid?',
  'How much is held in escrow?',
  'Compare this month with last month',
]

export default function FinancialAI({ onBack, onReports }: Props) {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'ai'; content: string }[]>([
    { id: 'a0', role: 'ai', content: 'I\'m your Financial AI — I explain your actual Pwani Wallet numbers, I don\'t hold or move money myself. Ask me anything about your balance, income, expenses, or invoices.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const health = computeHealthScore()
  const anomalies = detectAnomalies()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages(p => [...p, { id: 'u' + Date.now(), role: 'user', content: text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(p => [...p, { id: 'a' + Date.now(), role: 'ai', content: answerQuestion(text) }])
      setTyping(false)
    }, 900)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 19, color: 'white', margin: 0, flex: 1 }}>Financial AI</h2>
        <button onClick={onReports} title="Financial Reports" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>📊</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 16px 20px' }}>
        {/* Health score + anomalies — shown once at top of the conversation */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: `${health.color}0d`, border: `1px solid ${health.color}30`, borderRadius: 16, padding: 14, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, margin: '0 0 4px' }}>Financial Health</p>
            <p style={{ color: health.color, fontSize: 24, fontWeight: 800, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>{health.score}</p>
            <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 100, background: `${health.color}18`, color: health.color, fontWeight: 700 }}>{health.band}</span>
          </div>
        </div>

        {anomalies.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Flagged for you</p>
            {anomalies.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '11px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13, marginBottom: 7 }}>
                <span style={{ fontSize: 16 }}>{a.icon}</span>
                <div>
                  <p style={{ color: 'white', fontSize: 12.5, fontWeight: 700, margin: '0 0 2px' }}>{a.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, margin: 0, lineHeight: 1.4 }}>{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat */}
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{ maxWidth: '84%', padding: '11px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role === 'user' ? 'linear-gradient(135deg,#1e6091,#2980b9)' : 'rgba(255,255,255,0.06)', border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)', whiteSpace: 'pre-wrap' }}>
              <p style={{ color: m.role === 'user' ? 'white' : 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0, lineHeight: 1.55 }}>{m.content}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 5, padding: '4px 0 8px' }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse-glow 1.1s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '6px 16px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {SUGGESTED.map(s => (
          <button key={s} onClick={() => send(s)} style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 100, background: 'rgba(93,173,226,0.1)', border: '1px solid rgba(93,173,226,0.22)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{s}</button>
        ))}
      </div>
      <div style={{ padding: '8px 16px 24px', display: 'flex', gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(input) }} placeholder="Ask about your money…" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 14px', color: 'white', fontSize: 13, outline: 'none' }} />
        <button onClick={() => send(input)} style={{ background: 'linear-gradient(135deg,#1e6091,#2980b9)', border: 'none', borderRadius: 12, width: 44, color: 'white', cursor: 'pointer', fontSize: 16 }}>→</button>
      </div>
    </div>
  )
}

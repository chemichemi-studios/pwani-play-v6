import { useState } from 'react'
import WalletDashboard from './WalletDashboard'
import Transactions from './Transactions'
import TransactionDetail from './TransactionDetail'
import RewardCoins from './RewardCoins'
import PaymentMethods from './PaymentMethods'
import AddPaymentMethod from './AddPaymentMethod'
import WalletSecurity from './WalletSecurity'
import FinancialInsights from './FinancialInsights'
import EarningsDashboard from './EarningsDashboard'
import Subscriptions from './Subscriptions'
import Invoices from './Invoices'
import InvoiceDetail from './InvoiceDetail'
import Notifications from './Notifications'
import AddMoney from './AddMoney'
import Withdraw from './Withdraw'
import SendMoney from './SendMoney'
import CreatorTip from './CreatorTip'
import EscrowCenter from './EscrowCenter'
import QuoteCenter from './QuoteCenter'
import RefundCenter from './RefundCenter'
import ResolutionCenter from './ResolutionCenter'
import FinancialAI from './FinancialAI'
import PersonalFinance from './PersonalFinance'
import GrantFinance from './GrantFinance'
import ProductionAccounting from './ProductionAccounting'
import UnifiedExpenseCenter from './UnifiedExpenseCenter'
import ReportCenter from './ReportCenter'
import UniversalFinancialSearch from './UniversalFinancialSearch'
import MembershipTiers from './MembershipTiers'
import RoyaltyTracker from './RoyaltyTracker'

type Tab = 'overview' | 'transactions' | 'rewards' | 'payments' | 'settings'

export type WalletScreen =
  | { id: 'root' }
  | { id: 'tx-detail'; txId: string }
  | { id: 'add-money' }
  | { id: 'withdraw' }
  | { id: 'send' }
  | { id: 'tip' }
  | { id: 'add-payment' }
  | { id: 'security' }
  | { id: 'insights' }
  | { id: 'earnings' }
  | { id: 'subscriptions' }
  | { id: 'invoices' }
  | { id: 'invoice-detail'; invoiceId: string }
  | { id: 'notifications' }
  | { id: 'escrow' }
  | { id: 'quotes' }
  | { id: 'refund'; txId: string }
  | { id: 'resolution'; openDisputeFor?: { txId: string; subject: string; counterparty: string; amount: number } }
  | { id: 'financial-ai' }
  | { id: 'personal-finance' }
  | { id: 'grant-finance' }
  | { id: 'production-accounting' }
  | { id: 'all-expenses' }
  | { id: 'reports' }
  | { id: 'membership-tiers' }
  | { id: 'royalties' }

type Props = { onExit: () => void; initialScreen?: WalletScreen['id'] }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview',      label: 'Overview',      icon: '💳' },
  { key: 'transactions',  label: 'Transactions',  icon: '📋' },
  { key: 'rewards',       label: 'Rewards',       icon: '🪙' },
  { key: 'payments',      label: 'Payments',      icon: '🏦' },
  { key: 'settings',      label: 'Settings',      icon: '⚙️' },
]

export default function WalletShell({ onExit, initialScreen }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [stack, setStack] = useState<WalletScreen[]>(
    initialScreen && initialScreen !== 'root' ? [{ id: 'root' }, { id: initialScreen } as WalletScreen] : [{ id: 'root' }]
  )
  const [fabOpen, setFabOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const current = stack[stack.length - 1]
  const push = (s: WalletScreen) => { setStack(p => [...p, s]); setFabOpen(false) }
  const back = () => setStack(p => p.length > 1 ? p.slice(0, -1) : p)

  const isOverlay = current.id !== 'root'

  const renderOverlay = () => {
    switch (current.id) {
      case 'tx-detail':      return <TransactionDetail txId={current.txId} onBack={back} onRefund={(id) => push({ id: 'refund', txId: id })} onDispute={(info) => push({ id: 'resolution', openDisputeFor: info })} />
      case 'refund':         return <RefundCenter txId={current.txId} onBack={back} />
      case 'resolution':     return <ResolutionCenter onBack={back} openDisputeForTx={current.openDisputeFor} />
      case 'financial-ai':   return <FinancialAI onBack={back} onReports={() => push({ id: 'reports' })} />
      case 'personal-finance': return <PersonalFinance onBack={back} />
      case 'grant-finance':  return <GrantFinance onBack={back} />
      case 'production-accounting': return <ProductionAccounting onBack={back} />
      case 'all-expenses':   return <UnifiedExpenseCenter onBack={back} />
      case 'reports':        return <ReportCenter onBack={back} />
      case 'membership-tiers': return <MembershipTiers onBack={back} onRoyalties={() => push({ id: 'royalties' })} />
      case 'royalties':      return <RoyaltyTracker onBack={back} />
      case 'add-money':      return <AddMoney onBack={back} onSuccess={back} />
      case 'withdraw':       return <Withdraw onBack={back} onSuccess={back} />
      case 'send':           return <SendMoney onBack={back} onSuccess={back} />
      case 'tip':            return <CreatorTip onBack={back} onSuccess={back} />
      case 'add-payment':    return <AddPaymentMethod onBack={back} onAdded={back} />
      case 'security':       return <FullScreen title="Wallet Security" onBack={back}><WalletSecurity /></FullScreen>
      case 'insights':       return <FullScreen title="Financial Insights" onBack={back}><FinancialInsights onSubscriptions={() => push({ id: 'subscriptions' })} /></FullScreen>
      case 'earnings':       return <FullScreen title="Earnings" onBack={back}><EarningsDashboard /></FullScreen>
      case 'subscriptions':  return <FullScreen title="Subscriptions" onBack={back}><Subscriptions onMembershipTiers={() => push({ id: 'membership-tiers' })} /></FullScreen>
      case 'invoices':       return <FullScreen title="Invoices" onBack={back}><Invoices onDetail={(id) => push({ id: 'invoice-detail', invoiceId: id })} onQuotes={() => push({ id: 'quotes' })} /></FullScreen>
      case 'invoice-detail': return <InvoiceDetail invoiceId={current.invoiceId} onBack={back} />
      case 'notifications':  return <FullScreen title="Notifications" onBack={back}><Notifications /></FullScreen>
      case 'escrow':         return <EscrowCenter onBack={back} />
      case 'quotes':         return <QuoteCenter onBack={back} />
    }
  }

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return (
          <WalletDashboard
            onAddMoney={() => push({ id: 'add-money' })}
            onWithdraw={() => push({ id: 'withdraw' })}
            onSendMoney={() => push({ id: 'send' })}
            onTip={() => push({ id: 'tip' })}
            onCoins={() => setTab('rewards')}
            onInsights={() => push({ id: 'insights' })}
            onTransactionDetail={(id: string) => push({ id: 'tx-detail', txId: id })}
            onNotifications={() => push({ id: 'notifications' })}
            onEscrow={() => push({ id: 'escrow' })}
            onResolution={() => push({ id: 'resolution' })}
            onPersonalFinance={() => push({ id: 'personal-finance' })}
            onGrantFinance={() => push({ id: 'grant-finance' })}
            onProductionAccounting={() => push({ id: 'production-accounting' })}
            onSeeAllTransactions={() => setTab('transactions')}
          />
        )
      case 'transactions':
        return <Transactions onDetail={(id: string) => push({ id: 'tx-detail', txId: id })} onAllExpenses={() => push({ id: 'all-expenses' })} />
      case 'rewards':
        return <RewardCoins />
      case 'payments':
        return (
          <PaymentMethods
            onAdd={() => push({ id: 'add-payment' })}
          />
        )
      case 'settings':
        return <SettingsTab
          onSecurity={() => push({ id: 'security' })}
          onSubscriptions={() => push({ id: 'subscriptions' })}
          onInvoices={() => push({ id: 'invoices' })}
          onNotifications={() => push({ id: 'notifications' })}
          onExit={onExit}
        />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
          <button onClick={onExit} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💳</div>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Pwani Wallet</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setSearchOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>🔎</button>
            <button onClick={() => push({ id: 'notifications' })} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: 'white', position: 'relative' }}>
            🔔
            <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', border: '2px solid #0a1628' }} />
          </button>
          </div>
        </div>
      </div>

      {/* Main tab content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 0 }}>
        {renderTab()}
      </div>

      {/* FAB */}
      {!isOverlay && (
        <>
          {fabOpen && (
            <div style={{ position: 'fixed', bottom: 100, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', animation: 'slideUp 0.2s ease' }}>
              {[
                { label: 'Add Money', icon: '💰', action: () => push({ id: 'add-money' }) },
                { label: 'Withdraw', icon: '🏦', action: () => push({ id: 'withdraw' }) },
                { label: 'Send Money', icon: '📤', action: () => push({ id: 'send' }) },
                { label: 'Tip Creator', icon: '💝', action: () => push({ id: 'tip' }) },
              ].map(f => (
                <button key={f.label} onClick={f.action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 14px', borderRadius: 100, background: 'rgba(30,96,145,0.95)', border: '1px solid rgba(41,128,185,0.3)', backdropFilter: 'blur(8px)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setFabOpen(!fabOpen)} style={{ position: 'fixed', bottom: 82, right: 20, zIndex: 201, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1e6091,#2980b9)', border: 'none', color: 'white', fontSize: fabOpen ? 22 : 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(41,128,185,0.4)', transition: 'transform 0.2s', transform: fabOpen ? 'rotate(45deg)' : 'none' }}>
            {fabOpen ? '✕' : '＋'}
          </button>
        </>
      )}

      {/* Ask Financial AI — persistent entry point across wallet screens */}
      {!isOverlay && !fabOpen && (
        <button onClick={() => push({ id: 'financial-ai' })} title="Ask Pwani AI about your money" style={{ position: 'fixed', bottom: 82, right: 84, zIndex: 201, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#5dade2,#8e44ad)', border: '2px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(93,173,226,0.35)' }}>
          🤖
        </button>
      )}

      {searchOpen && (
        <UniversalFinancialSearch onClose={() => setSearchOpen(false)} onNavigate={(target) => push(target)} />
      )}

      {/* Bottom nav */}
      {!isOverlay && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', padding: '8px 0 20px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setStack([{ id: 'root' }]); setFabOpen(false) }} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
              <span style={{ fontSize: 20, filter: tab === t.key ? 'none' : 'grayscale(1) opacity(0.4)' }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: tab === t.key ? '#5dade2' : 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>{t.label}</span>
              {tab === t.key && <div style={{ width: 18, height: 2, borderRadius: 1, background: '#2980b9' }} />}
            </button>
          ))}
        </div>
      )}

      {/* Overlay screens */}
      {isOverlay && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0a1628', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.22s ease' }}>
          {renderOverlay()}
        </div>
      )}
    </div>
  )
}

function FullScreen({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white' }}>←</button>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'white', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 68 }}>
        {children}
      </div>
    </div>
  )
}

function SettingsTab({ onSecurity, onSubscriptions, onInvoices, onNotifications, onExit }: { onSecurity: () => void; onSubscriptions: () => void; onInvoices: () => void; onNotifications: () => void; onExit: () => void }) {
  const items = [
    { icon: '🔐', label: 'Wallet Security', desc: 'PIN, biometrics, 2FA', action: onSecurity },
    { icon: '🔄', label: 'Subscriptions', desc: 'Manage recurring payments', action: onSubscriptions },
    { icon: '🧾', label: 'Invoices & Receipts', desc: 'View and download documents', action: onInvoices },
    { icon: '🔔', label: 'Notifications', desc: 'Payment alerts and updates', action: onNotifications },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, paddingTop: 52 }}>
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 4px' }}>Wallet Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 24px' }}>Manage your wallet preferences</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {items.map(item => (
            <button key={item.label} onClick={item.action} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{item.desc}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
        <button onClick={onExit} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.12)', color: '#e74c3c', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>← Back to Pwani Play</button>
      </div>
    </div>
  )
}

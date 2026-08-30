// ─── Pwani Wallet — Data Types & Mock Data ────────────────────────────────────

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'processing'
export type TransactionCategory = 'income' | 'expense' | 'reward' | 'refund' | 'withdrawal' | 'tip' | 'marketplace' | 'subscription' | 'transfer'
export type PaymentMethodType = 'mpesa' | 'card' | 'bank' | 'airtel' | 'tigopesa' | 'wallet'
export type CoinRedemptionType = 'subscription' | 'marketplace' | 'creator-support' | 'course' | 'promo'
export type WithdrawalStatus = 'available' | 'pending_kyc' | 'restricted'

export interface WalletBalance {
  available: number
  pending: number
  coins: number
  currency: string
  monthlyEarnings: number
  monthlySpending: number
  totalEarned: number
  totalWithdrawn: number
  withdrawalStatus: WithdrawalStatus
  heldInEscrow: number
}

export interface Transaction {
  id: string
  date: string
  amount: number
  currency: string
  direction: 'in' | 'out'
  status: TransactionStatus
  category: TransactionCategory
  description: string
  counterparty: string
  counterpartyAvatar: string
  paymentMethod: string
  reference: string
  note?: string
  receiptUrl?: string
}

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  label: string
  detail: string
  icon: string
  isDefault: boolean
  verified: boolean
  expiresAt?: string
  country?: string
}

export interface EarningsEntry {
  month: string
  subscriptions: number
  tips: number
  marketplace: number
  courses: number
  ads: number
  sponsorship: number
}

export interface CoinChallenge {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  target: number
  icon: string
  completed: boolean
  expiresAt: string
}

export interface Subscription {
  id: string
  name: string
  plan: string
  amount: number
  currency: string
  renewsAt: string
  paymentMethod: string
  status: 'active' | 'cancelled' | 'expired'
  icon: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  description: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'overdue'
  type: 'receipt' | 'invoice' | 'withdrawal'
  counterparty: string
  items: { label: string; amount: number }[]
  amountPaid?: number
  dueDate?: string
}

export interface AIInsight {
  id: string
  title: string
  description: string
  icon: string
  type: 'tip' | 'alert' | 'opportunity' | 'achievement'
  value?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const WALLET_BALANCE: WalletBalance = {
  available: 47850,
  pending: 12300,
  coins: 2840,
  currency: 'KES',
  monthlyEarnings: 28400,
  monthlySpending: 6200,
  totalEarned: 184000,
  totalWithdrawn: 136150,
  withdrawalStatus: 'available',
  heldInEscrow: 32500,
}

export const TRANSACTIONS: Transaction[] = [
  { id: 'tx001', date: '2026-08-06T09:14:00', amount: 12500, currency: 'KES', direction: 'in', status: 'completed', category: 'income', description: 'Creator earnings — Nairobi Nights S1', counterparty: 'Pwani Studio', counterpartyAvatar: '🎬', paymentMethod: 'Wallet', reference: 'REF-2026-08-001', note: 'August payout' },
  { id: 'tx002', date: '2026-08-05T16:30:00', amount: 499, currency: 'KES', direction: 'out', status: 'completed', category: 'subscription', description: 'Pwani Play Premium — Monthly', counterparty: 'Pwani Play', counterpartyAvatar: '▶️', paymentMethod: 'M-Pesa', reference: 'REF-2026-08-002' },
  { id: 'tx003', date: '2026-08-05T11:22:00', amount: 250, currency: 'KES', direction: 'in', status: 'completed', category: 'tip', description: 'Tip from @kofi.mensah', counterparty: 'Kofi Mensah', counterpartyAvatar: '🎥', paymentMethod: 'Wallet', reference: 'REF-2026-08-003', note: 'Great work on Mama Afrika!' },
  { id: 'tx004', date: '2026-08-04T14:05:00', amount: 5000, currency: 'KES', direction: 'out', status: 'completed', category: 'withdrawal', description: 'Withdrawal to M-Pesa', counterparty: 'Safaricom M-Pesa', counterpartyAvatar: '💚', paymentMethod: 'M-Pesa ···7891', reference: 'REF-2026-08-004' },
  { id: 'tx005', date: '2026-08-03T08:45:00', amount: 1800, currency: 'KES', direction: 'in', status: 'completed', category: 'marketplace', description: 'Equipment rental — LED Panel Kit', counterparty: 'CreativeGear KE', counterpartyAvatar: '📦', paymentMethod: 'Wallet', reference: 'REF-2026-08-005' },
  { id: 'tx006', date: '2026-08-02T20:15:00', amount: 3500, currency: 'KES', direction: 'in', status: 'completed', category: 'income', description: 'Course sales — Cinematography Masterclass', counterparty: 'Pwani Learn', counterpartyAvatar: '🎓', paymentMethod: 'Wallet', reference: 'REF-2026-08-006' },
  { id: 'tx007', date: '2026-08-01T12:30:00', amount: 850, currency: 'KES', direction: 'out', status: 'completed', category: 'marketplace', description: 'Studio lighting filter purchase', counterparty: 'ProPhoto East Africa', counterpartyAvatar: '🛒', paymentMethod: 'Card ···4242', reference: 'REF-2026-08-007' },
  { id: 'tx008', date: '2026-07-31T17:00:00', amount: 500, currency: 'KES', direction: 'in', status: 'pending', category: 'reward', description: 'Referral bonus — 5 new sign-ups', counterparty: 'Pwani Rewards', counterpartyAvatar: '⭐', paymentMethod: 'Wallet', reference: 'REF-2026-07-031' },
  { id: 'tx009', date: '2026-07-30T10:22:00', amount: 200, currency: 'KES', direction: 'out', status: 'refunded', category: 'refund', description: 'Refund — cancelled workshop', counterparty: 'Film Workshop KE', counterpartyAvatar: '🔄', paymentMethod: 'Card ···4242', reference: 'REF-2026-07-030' },
  { id: 'tx010', date: '2026-07-29T09:00:00', amount: 8000, currency: 'KES', direction: 'in', status: 'completed', category: 'income', description: 'Sponsorship payout — Brand Deal', counterparty: 'Safaricom Brand', counterpartyAvatar: '📡', paymentMethod: 'Wallet', reference: 'REF-2026-07-029' },
]

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', type: 'mpesa', label: 'M-Pesa', detail: '+254 ··· ··· 7891', icon: '💚', isDefault: true, verified: true, country: 'Kenya' },
  { id: 'pm2', type: 'card', label: 'Visa Card', detail: '•••• •••• •••• 4242', icon: '💳', isDefault: false, verified: true, expiresAt: '08/28' },
  { id: 'pm3', type: 'bank', label: 'Equity Bank', detail: 'Acc ···· 3401', icon: '🏦', isDefault: false, verified: true, country: 'Kenya' },
  { id: 'pm4', type: 'airtel', label: 'Airtel Money', detail: '+254 ··· ··· 2201', icon: '🔴', isDefault: false, verified: false, country: 'Kenya' },
]

export const MONTHLY_EARNINGS: EarningsEntry[] = [
  { month: 'Feb', subscriptions: 8200, tips: 1400, marketplace: 2100, courses: 1800, ads: 600, sponsorship: 0 },
  { month: 'Mar', subscriptions: 9100, tips: 1700, marketplace: 2400, courses: 2200, ads: 700, sponsorship: 3000 },
  { month: 'Apr', subscriptions: 10400, tips: 2100, marketplace: 1900, courses: 3100, ads: 850, sponsorship: 0 },
  { month: 'May', subscriptions: 11800, tips: 2600, marketplace: 3200, courses: 2800, ads: 1000, sponsorship: 5000 },
  { month: 'Jun', subscriptions: 13200, tips: 3100, marketplace: 2800, courses: 3600, ads: 1200, sponsorship: 2000 },
  { month: 'Jul', subscriptions: 15400, tips: 3800, marketplace: 3500, courses: 4100, ads: 1400, sponsorship: 8000 },
  { month: 'Aug', subscriptions: 17200, tips: 4200, marketplace: 4800, courses: 5600, ads: 1800, sponsorship: 12500 },
]

export const COIN_CHALLENGES: CoinChallenge[] = [
  { id: 'ch1', title: 'Daily Watch Streak', description: 'Watch 3 shows today', reward: 50, progress: 2, target: 3, icon: '🔥', completed: false, expiresAt: 'Today 23:59' },
  { id: 'ch2', title: 'Share & Earn', description: 'Share a show with a friend', reward: 100, progress: 0, target: 1, icon: '📤', completed: false, expiresAt: 'Today 23:59' },
  { id: 'ch3', title: 'Rate a Creator', description: 'Leave a review on any show', reward: 75, progress: 0, target: 1, icon: '⭐', completed: false, expiresAt: 'Today 23:59' },
  { id: 'ch4', title: 'Weekly Binge', description: 'Watch 10 episodes this week', reward: 500, progress: 7, target: 10, icon: '🎬', completed: false, expiresAt: 'Sun 23:59' },
  { id: 'ch5', title: 'Referral Bonus', description: 'Invite 3 friends to Pwani', reward: 1000, progress: 2, target: 3, icon: '👥', completed: false, expiresAt: '31 Aug 2026' },
]

export const SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub1', name: 'Pwani Play', plan: 'Premium Annual', amount: 4499, currency: 'KES', renewsAt: 'Oct 2027', paymentMethod: 'M-Pesa ···7891', status: 'active', icon: '▶️' },
  { id: 'sub2', name: 'Pwani Learn', plan: 'Creator Pro', amount: 1299, currency: 'KES', renewsAt: 'Sep 2026', paymentMethod: 'Card ···4242', status: 'active', icon: '🎓' },
]

export const INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2026-0142', date: '2026-08-06', description: 'Creator earnings — August payout', amount: 12500, currency: 'KES', status: 'paid', type: 'receipt', counterparty: 'Pwani Studio', items: [{ label: 'Nairobi Nights streaming revenue', amount: 9800 }, { label: 'Ad share', amount: 1800 }, { label: 'Tip collections', amount: 900 }] },
  { id: 'inv2', invoiceNumber: 'INV-2026-0138', date: '2026-08-04', description: 'Withdrawal to M-Pesa', amount: 5000, currency: 'KES', status: 'paid', type: 'withdrawal', counterparty: 'Safaricom M-Pesa', items: [{ label: 'Withdrawal amount', amount: 5125 }, { label: 'Processing fee (–2.5%)', amount: -125 }] },
  { id: 'inv3', invoiceNumber: 'INV-2026-0130', date: '2026-07-31', description: 'Course sales — Cinematography Masterclass', amount: 3500, currency: 'KES', status: 'paid', type: 'receipt', counterparty: 'Pwani Learn', items: [{ label: '7 course sales × KES 600', amount: 4200 }, { label: 'Platform fee (–16.7%)', amount: -700 }] },
  { id: 'inv4', invoiceNumber: 'INV-2026-0129', date: '2026-07-29', description: 'Brand sponsorship payout', amount: 8000, currency: 'KES', status: 'paid', type: 'invoice', counterparty: 'Safaricom Brand', items: [{ label: 'Instagram integration fee', amount: 5000 }, { label: 'Story shoutout × 3', amount: 3000 }] },
  { id: 'inv5', invoiceNumber: 'INV-2026-0151', date: '2026-08-10', description: 'Videography services — corporate event', amount: 18000, currency: 'KES', status: 'pending', type: 'invoice', counterparty: 'Equity Bank Kenya', items: [{ label: 'Half-day corporate event coverage', amount: 15000 }, { label: 'Same-day highlight edit', amount: 3000 }], amountPaid: 9000, dueDate: '24 Aug 2026' },
  { id: 'inv6', invoiceNumber: 'INV-2026-0121', date: '2026-07-20', description: 'Photography — product shoot', amount: 6500, currency: 'KES', status: 'overdue', type: 'invoice', counterparty: 'Maridadi Fashion House', items: [{ label: 'Studio product photography (40 items)', amount: 6500 }], dueDate: '3 Aug 2026' },
]

export const AI_INSIGHTS: AIInsight[] = [
  { id: 'ins1', title: "You're earning 38% more this month", description: 'Your August earnings are up KES 7,800 vs July. Course sales are your fastest-growing income stream.', icon: '📈', type: 'achievement', value: '+38%' },
  { id: 'ins2', title: 'Subscription renewal in 12 days', description: 'Pwani Learn Creator Pro renews on Sep 5 for KES 1,299. Your balance can cover it comfortably.', icon: '🔔', type: 'alert', value: '12 days' },
  { id: 'ins3', title: 'Redeem 840 coins for 1 month free', description: "You're 840 coins away from a free month of Pwani Play Premium worth KES 499.", icon: '🪙', type: 'opportunity', value: '840 coins' },
  { id: 'ins4', title: 'Set up a withdrawal schedule', description: 'Creators who withdraw monthly earn more consistently. Schedule a recurring payout on the 1st of each month.', icon: '💡', type: 'tip' },
  { id: 'ins5', title: 'Your Marketplace revenue doubled', description: 'Equipment rental income went from KES 2,400 in June to KES 4,800 in August — strong growth!', icon: '🛒', type: 'achievement', value: '+100%' },
]

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  income: '#1abc9c',
  expense: '#e74c3c',
  reward: '#f39c12',
  refund: '#9b59b6',
  withdrawal: '#2980b9',
  tip: '#f1c40f',
  marketplace: '#e67e22',
  subscription: '#3498db',
  transfer: '#5dade2',
}

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  income: '💰',
  expense: '💸',
  reward: '⭐',
  refund: '↩️',
  withdrawal: '📤',
  tip: '💛',
  marketplace: '🛒',
  subscription: '🔄',
  transfer: '→',
}

export const COIN_REDEMPTION_OPTIONS: { key: CoinRedemptionType; label: string; icon: string; coins: number; value: string; desc: string }[] = [
  { key: 'subscription', label: 'Premium Month', icon: '▶️', coins: 3000, value: 'KES 499 off', desc: '1 month Pwani Play Premium' },
  { key: 'marketplace', label: 'Shop Discount', icon: '🛒', coins: 500, value: '10% off', desc: 'Any marketplace purchase' },
  { key: 'creator-support', label: 'Creator Tip', icon: '💛', coins: 200, value: 'KES 50 tip', desc: 'Support any creator' },
  { key: 'course', label: 'Course Discount', icon: '🎓', coins: 1000, value: '20% off', desc: 'Any Pwani Learn course' },
  { key: 'promo', label: 'Promo Voucher', icon: '🎟', coins: 750, value: 'KES 150 credit', desc: 'Wallet top-up credit' },
]

export const formatKES = (amount: number) =>
  `KES ${amount.toLocaleString('en-KE')}`

export const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ─── Protected Payments (Escrow) ───────────────────────────────────────────────
// Additive: funds tied to a Pwani Hub contract or commission are held here,
// separately from the regular available balance, until milestones are
// approved. Ordinary wallet transactions/features above are unchanged.

export type EscrowStatus = 'held' | 'pending_release' | 'released' | 'disputed' | 'refunded'
export type MilestoneStatus = 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'paid' | 'revision_requested' | 'disputed'

export interface EscrowMilestone {
  id: string
  title: string
  amount: number
  dueDate: string
  status: MilestoneStatus
  evidence?: string
  revisionNote?: string
  releasedAmount?: number
}

export interface EscrowEvent {
  id: string
  timestamp: string
  actor: string
  action: string
}

export interface EscrowHold {
  id: string
  projectTitle: string
  counterparty: string
  counterpartyAvatar: string
  role: 'client' | 'provider'
  totalAmount: number
  currency: string
  status: EscrowStatus
  source: string
  milestones: EscrowMilestone[]
  events: EscrowEvent[]
}

export const ESCROW_HOLDS: EscrowHold[] = [
  {
    id: 'esc1', projectTitle: '"Lagos Dreams" — Cinematography Contract',
    counterparty: 'Nairobi Film Collective', counterpartyAvatar: '🎬', role: 'provider',
    totalAmount: 24000, currency: 'KES', status: 'held', source: 'Pwani Hub · Contract',
    milestones: [
      { id: 'm1', title: 'Pre-production & shot list', amount: 6000, dueDate: '18 Aug 2026', status: 'paid' },
      { id: 'm2', title: 'Principal photography', amount: 12000, dueDate: '28 Aug 2026', status: 'in_progress' },
      { id: 'm3', title: 'Final delivery & colour grade', amount: 6000, dueDate: '10 Sep 2026', status: 'not_started' },
    ],
    events: [
      { id: 'ev1', timestamp: '5 Aug 2026, 09:12', actor: 'Nairobi Film Collective', action: 'Contract funded — KES 24,000 held in escrow' },
      { id: 'ev2', timestamp: '17 Aug 2026, 14:30', actor: 'You', action: 'Submitted "Pre-production & shot list" for review' },
      { id: 'ev3', timestamp: '17 Aug 2026, 18:05', actor: 'Nairobi Film Collective', action: 'Approved "Pre-production & shot list" — KES 6,000 released' },
    ],
  },
  {
    id: 'esc2', projectTitle: 'Logo & Brand Kit — CreativeGear KE',
    counterparty: 'CreativeGear KE', counterpartyAvatar: '🎨', role: 'client',
    totalAmount: 8500, currency: 'KES', status: 'pending_release', source: 'Pwani Hub · Commission',
    milestones: [
      { id: 'm4', title: 'Concept & moodboard', amount: 2500, dueDate: '5 Aug 2026', status: 'paid' },
      { id: 'm5', title: 'Final brand kit delivery', amount: 6000, dueDate: '14 Aug 2026', status: 'submitted', evidence: 'Final files uploaded — awaiting your approval' },
    ],
    events: [
      { id: 'ev4', timestamp: '2 Aug 2026, 10:00', actor: 'You', action: 'Contract funded — KES 8,500 held in escrow' },
      { id: 'ev5', timestamp: '5 Aug 2026, 16:40', actor: 'You', action: 'Approved "Concept & moodboard" — KES 2,500 released' },
      { id: 'ev6', timestamp: '14 Aug 2026, 11:20', actor: 'CreativeGear KE', action: 'Submitted "Final brand kit delivery" for review' },
    ],
  },
  {
    id: 'esc3', projectTitle: 'Wedding Highlights Reel — Otieno Family',
    counterparty: 'Otieno Family', counterpartyAvatar: '💍', role: 'provider',
    totalAmount: 15000, currency: 'KES', status: 'held', source: 'Pwani Hub · Commission',
    milestones: [
      { id: 'm6', title: 'Raw footage handover', amount: 15000, dueDate: '12 Aug 2026', status: 'in_progress' },
    ],
    events: [
      { id: 'ev7', timestamp: '30 Jul 2026, 12:00', actor: 'Otieno Family', action: 'Contract funded — KES 15,000 held in escrow' },
    ],
  },
]

export const ESCROW_STATUS_META: Record<EscrowStatus, { label: string; color: string }> = {
  held:            { label: 'Held',            color: '#f39c12' },
  pending_release: { label: 'Pending Release',  color: '#5dade2' },
  released:        { label: 'Released',         color: '#1abc9c' },
  disputed:        { label: 'Disputed',         color: '#e74c3c' },
  refunded:        { label: 'Refunded',         color: '#9b59b6' },
}

export const MILESTONE_STATUS_META: Record<MilestoneStatus, { label: string; color: string }> = {
  not_started:        { label: 'Not Started',        color: 'rgba(255,255,255,0.35)' },
  in_progress:        { label: 'In Progress',        color: '#5dade2' },
  submitted:          { label: 'Submitted',          color: '#f39c12' },
  under_review:       { label: 'Under Review',       color: '#f39c12' },
  approved:           { label: 'Approved',           color: '#1abc9c' },
  paid:               { label: 'Paid',               color: '#1abc9c' },
  revision_requested: { label: 'Revision Requested', color: '#e67e22' },
  disputed:           { label: 'Disputed',           color: '#e74c3c' },
}

// ─── Quotes (Section 7–15) ──────────────────────────────────────────────────
// Additive: a Quote precedes an Invoice — sent to a prospective client,
// accepted or declined, then converted into a real Invoice once agreed.

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted'

export interface Quote {
  id: string
  quoteNumber: string
  date: string
  expiryDate: string
  description: string
  counterparty: string
  currency: string
  status: QuoteStatus
  items: { label: string; amount: number }[]
  amount: number
  notes?: string
}

export const QUOTES: Quote[] = [
  {
    id: 'q1', quoteNumber: 'QUO-2026-0031', date: '2026-08-12', expiryDate: '26 Aug 2026',
    description: 'Wedding videography — full day coverage', counterparty: 'Kamau & Njeri Wedding',
    currency: 'KES', status: 'sent',
    items: [{ label: 'Full-day coverage (10 hrs)', amount: 22000 }, { label: 'Drone footage add-on', amount: 5000 }, { label: 'Same-week highlight reel', amount: 6000 }],
    amount: 33000, notes: 'Includes travel within Nairobi County. Additional locations charged separately.',
  },
  {
    id: 'q2', quoteNumber: 'QUO-2026-0028', date: '2026-08-05', expiryDate: '19 Aug 2026',
    description: 'Product photography — 60 SKUs', counterparty: 'Maridadi Fashion House',
    currency: 'KES', status: 'accepted',
    items: [{ label: 'Studio product photography (60 items)', amount: 9500 }, { label: 'Retouching & colour correction', amount: 2000 }],
    amount: 11500,
  },
  {
    id: 'q3', quoteNumber: 'QUO-2026-0019', date: '2026-07-15', expiryDate: '29 Jul 2026',
    description: 'Corporate promo video — 90 seconds', counterparty: 'Twiga Foods',
    currency: 'KES', status: 'expired',
    items: [{ label: 'Concept, shoot & edit', amount: 28000 }],
    amount: 28000,
  },
]

export const QUOTE_STATUS_META: Record<QuoteStatus, { label: string; color: string }> = {
  draft:     { label: 'Draft',     color: 'rgba(255,255,255,0.4)' },
  sent:      { label: 'Sent',      color: '#5dade2' },
  accepted:  { label: 'Accepted',  color: '#1abc9c' },
  declined:  { label: 'Declined',  color: '#e74c3c' },
  expired:   { label: 'Expired',   color: 'rgba(255,255,255,0.3)' },
  converted: { label: 'Converted to Invoice', color: '#9b59b6' },
}

// ─── Refund tracking (Sections 5–20) ───────────────────────────────────────────
// A submitted refund request doesn't just disappear — it's tracked here
// through approval, processing, and completion (or failure).

export type RefundRequestStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'declined'

export interface RefundRequest {
  id: string
  refundNumber: string
  txId: string
  orderDesc: string
  counterparty: string
  requestedAmount: number
  approvedAmount?: number
  currency: string
  reason: string
  destination: string
  status: RefundRequestStatus
  requestedDate: string
  updatedDate: string
  note?: string
}

export const REFUND_REQUESTS: RefundRequest[] = [
  { id: 'rf1', refundNumber: 'RFD-2026-0011', txId: 'tx007', orderDesc: 'Studio lighting filter purchase', counterparty: 'ProPhoto East Africa', requestedAmount: 850, currency: 'KES', reason: 'Item not as described', destination: 'Card ···4242', status: 'processing', requestedDate: '15 Aug 2026', updatedDate: '16 Aug 2026', approvedAmount: 850 },
  { id: 'rf2', refundNumber: 'RFD-2026-0009', txId: 'tx009', orderDesc: 'Cancelled workshop registration', counterparty: 'Film Workshop KE', requestedAmount: 200, currency: 'KES', reason: 'Never received', destination: 'Card ···4242', status: 'completed', requestedDate: '28 Jul 2026', updatedDate: '30 Jul 2026', approvedAmount: 200 },
  { id: 'rf3', refundNumber: 'RFD-2026-0005', txId: 'tx004', orderDesc: 'Duplicate withdrawal fee', counterparty: 'Safaricom M-Pesa', requestedAmount: 125, currency: 'KES', reason: 'Duplicate charge', destination: 'M-Pesa ···7891', status: 'declined', requestedDate: '18 Jul 2026', updatedDate: '20 Jul 2026', note: 'Fee was correctly applied per M-Pesa transaction terms.' },
]

export const REFUND_STATUS_META: Record<RefundRequestStatus, { label: string; color: string }> = {
  pending:    { label: 'Pending Review', color: '#f39c12' },
  approved:   { label: 'Approved',       color: '#5dade2' },
  processing: { label: 'Processing',     color: '#5dade2' },
  completed:  { label: 'Completed',      color: '#1abc9c' },
  failed:     { label: 'Failed',         color: '#e74c3c' },
  declined:   { label: 'Declined',       color: '#e74c3c' },
}

// ─── Dispute Center (Sections 23–36) ───────────────────────────────────────────

export type DisputeStatus = 'open' | 'evidence_requested' | 'under_review' | 'resolved_refund' | 'resolved_release' | 'escalated'
export type DisputeReason = 'Non-Delivery' | 'Incorrect Delivery' | 'Service Not Completed' | 'Quality Issue' | 'Contract Disagreement' | 'Milestone Dispute' | 'Payment Issue' | 'Refund Issue' | 'Duplicate Charge' | 'Other'

export interface DisputeEvent {
  id: string
  timestamp: string
  actor: string
  action: string
}

export interface Dispute {
  id: string
  disputeNumber: string
  subject: string
  counterparty: string
  amount: number
  currency: string
  reason: DisputeReason
  description: string
  status: DisputeStatus
  priority: 'Low' | 'Medium' | 'High'
  createdDate: string
  updatedDate: string
  evidence: string[]
  timeline: DisputeEvent[]
  resolution?: string
}

export const DISPUTES: Dispute[] = [
  {
    id: 'd1', disputeNumber: 'DSP-2026-0004', subject: '"Lagos Dreams" — Cinematography Contract',
    counterparty: 'Nairobi Film Collective', amount: 12000, currency: 'KES',
    reason: 'Milestone Dispute', description: 'Principal photography milestone was marked in-progress but crew reports the shoot has stalled for a week with no update.',
    status: 'under_review', priority: 'Medium', createdDate: '15 Aug 2026', updatedDate: '17 Aug 2026',
    evidence: ['Crew call sheet showing no activity since 10 Aug', 'Message thread requesting status update'],
    timeline: [
      { id: 'de1', timestamp: '15 Aug 2026, 09:10', actor: 'You', action: 'Opened dispute — milestone stalled with no communication' },
      { id: 'de2', timestamp: '16 Aug 2026, 14:00', actor: 'Pwani Play Support', action: 'Dispute assigned for review' },
      { id: 'de3', timestamp: '17 Aug 2026, 10:30', actor: 'Nairobi Film Collective', action: 'Responded — requesting 3 extra days due to weather delays' },
    ],
  },
]

export const DISPUTE_STATUS_META: Record<DisputeStatus, { label: string; color: string }> = {
  open:                { label: 'Open',                color: '#f39c12' },
  evidence_requested:  { label: 'Evidence Requested',  color: '#e67e22' },
  under_review:        { label: 'Under Review',         color: '#5dade2' },
  resolved_refund:     { label: 'Resolved — Refunded',  color: '#9b59b6' },
  resolved_release:    { label: 'Resolved — Released',  color: '#1abc9c' },
  escalated:           { label: 'Escalated',             color: '#e74c3c' },
}

export const DISPUTE_REASONS: DisputeReason[] = ['Non-Delivery', 'Incorrect Delivery', 'Service Not Completed', 'Quality Issue', 'Contract Disagreement', 'Milestone Dispute', 'Payment Issue', 'Refund Issue', 'Duplicate Charge', 'Other']

// ─── Budgets (Sections 5–13) ────────────────────────────────────────────────
// "Actual" spend is always computed from real TRANSACTIONS by category —
// there's no second ledger here, just a limit set against existing data.

export interface Budget {
  id: string
  label: string
  icon: string
  category: TransactionCategory
  limit: number
  period: string
}

export const BUDGETS: Budget[] = [
  { id: 'b1', label: 'Subscriptions', icon: '🔁', category: 'subscription', limit: 1000, period: 'This Month' },
  { id: 'b2', label: 'Marketplace Purchases', icon: '🛒', category: 'marketplace', limit: 1500, period: 'This Month' },
  { id: 'b3', label: 'Withdrawals', icon: '🏦', category: 'withdrawal', limit: 6000, period: 'This Month' },
]

// ─── Savings Goals (Sections 34–45) ─────────────────────────────────────────

export interface SavingsGoal {
  id: string
  title: string
  icon: string
  goalType: string
  targetAmount: number
  currentAmount: number
  currency: string
  targetDate: string
  color: string
}

export const SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'g1', title: 'New Camera Lens', icon: '📷', goalType: 'Equipment', targetAmount: 45000, currentAmount: 18500, currency: 'KES', targetDate: '31 Oct 2026', color: '#5dade2' },
  { id: 'g2', title: 'Emergency Fund', icon: '🛡️', goalType: 'Emergency Fund', targetAmount: 30000, currentAmount: 22000, currency: 'KES', targetDate: '31 Dec 2026', color: '#1abc9c' },
  { id: 'g3', title: 'Studio Equipment Upgrade', icon: '🎬', goalType: 'Production', targetAmount: 80000, currentAmount: 12000, currency: 'KES', targetDate: '28 Feb 2027', color: '#f39c12' },
]

// ─── Grant Funding (Sections 25–44, 74) ────────────────────────────────────────
// Tracks a grant a creator has actually been AWARDED — disbursement schedule,
// restricted-vs-unrestricted budget categories, and claimed expenses. This is
// deliberately separate from ordinary Wallet transactions: grant funds carry
// eligibility rules a normal purchase doesn't, so keeping them as their own
// records (rather than reusing TRANSACTIONS) reflects a real distinction, not
// a duplicate ledger for the same money.

export type DisbursementStatus = 'scheduled' | 'processing' | 'received' | 'delayed'
export type GrantExpenseStatus = 'pending' | 'approved' | 'rejected'

export interface GrantDisbursement {
  id: string
  label: string
  amount: number
  expectedDate: string
  status: DisbursementStatus
  condition?: string
}

export interface GrantBudgetCategory {
  id: string
  label: string
  allocated: number
  restricted: boolean
}

export interface GrantExpense {
  id: string
  categoryId: string
  description: string
  amount: number
  date: string
  status: GrantExpenseStatus
}

export interface GrantAward {
  id: string
  grantName: string
  funder: string
  totalAmount: number
  currency: string
  awardDate: string
  restrictions: string[]
  disbursements: GrantDisbursement[]
  budgetCategories: GrantBudgetCategory[]
  expenses: GrantExpense[]
}

export const GRANT_AWARDS: GrantAward[] = [
  {
    id: 'ga1', grantName: 'Kenya Film Commission Grant 2026', funder: 'Kenya Film Commission',
    totalAmount: 250000, currency: 'KES', awardDate: '1 Aug 2026',
    restrictions: ['Project Only — "Swahili Sunrise"', 'Equipment Restricted', 'Personnel Restricted'],
    disbursements: [
      { id: 'gd1', label: 'Installment 1 — Pre-production', amount: 75000, expectedDate: '5 Aug 2026', status: 'received' },
      { id: 'gd2', label: 'Installment 2 — Principal photography', amount: 100000, expectedDate: '15 Sep 2026', status: 'scheduled', condition: 'Releases on approval of pre-production milestone report' },
      { id: 'gd3', label: 'Installment 3 — Post-production & delivery', amount: 75000, expectedDate: '30 Nov 2026', status: 'scheduled', condition: 'Releases on final cut submission' },
    ],
    budgetCategories: [
      { id: 'gc1', label: 'Equipment Rental', allocated: 90000, restricted: true },
      { id: 'gc2', label: 'Crew & Personnel', allocated: 100000, restricted: true },
      { id: 'gc3', label: 'Location & Logistics', allocated: 40000, restricted: false },
      { id: 'gc4', label: 'Post-Production', allocated: 20000, restricted: true },
    ],
    expenses: [
      { id: 'ge1', categoryId: 'gc1', description: 'Camera + lighting package rental (2 weeks)', amount: 32000, date: '6 Aug 2026', status: 'approved' },
      { id: 'ge2', categoryId: 'gc2', description: 'Crew wages — pre-production week', amount: 18000, date: '9 Aug 2026', status: 'approved' },
      { id: 'ge3', categoryId: 'gc3', description: 'Location scouting transport', amount: 4500, date: '11 Aug 2026', status: 'approved' },
      { id: 'ge4', categoryId: 'gc1', description: 'Drone rental — establishing shots', amount: 12000, date: '15 Aug 2026', status: 'pending' },
    ],
  },
]

// ─── Production Accounting: Advances & Reimbursements (Sections 38–45) ────────
// Scoped to what an individual freelancer/crew member actually deals with —
// fronting their own money on a shoot and getting it back, or drawing an
// advance against expected production costs. Tied to the "Lagos Dreams"
// production already referenced in Protected Payments (Pass 8).

export type AdvanceStatus = 'requested' | 'approved' | 'issued' | 'partially_settled' | 'settled' | 'overdue'

export interface Advance {
  id: string
  production: string
  purpose: string
  amount: number
  currency: string
  issueDate: string
  expectedSettlementDate: string
  status: AdvanceStatus
  settledAmount: number
}

export const ADVANCES: Advance[] = [
  { id: 'adv1', production: '"Lagos Dreams"', purpose: 'Travel & accommodation — Mombasa leg', amount: 15000, currency: 'KES', issueDate: '8 Aug 2026', expectedSettlementDate: '25 Aug 2026', status: 'partially_settled', settledAmount: 9200 },
]

export const ADVANCE_STATUS_META: Record<AdvanceStatus, { label: string; color: string }> = {
  requested:         { label: 'Requested',         color: '#f39c12' },
  approved:          { label: 'Approved',           color: '#5dade2' },
  issued:            { label: 'Issued',             color: '#5dade2' },
  partially_settled: { label: 'Partially Settled',  color: '#f39c12' },
  settled:           { label: 'Settled',            color: '#1abc9c' },
  overdue:           { label: 'Overdue',            color: '#e74c3c' },
}

export type ReimbursementStatus = 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected'

export interface Reimbursement {
  id: string
  production: string
  description: string
  category: string
  amount: number
  currency: string
  date: string
  status: ReimbursementStatus
  reason?: string
}

export const REIMBURSEMENTS: Reimbursement[] = [
  { id: 'rb1', production: '"Lagos Dreams"', description: 'Parking + fuel for location scout', category: 'Travel', amount: 2400, currency: 'KES', date: '9 Aug 2026', status: 'paid' },
  { id: 'rb2', production: '"Lagos Dreams"', description: 'Replacement SD cards (lost original batch)', category: 'Equipment', amount: 3200, currency: 'KES', date: '14 Aug 2026', status: 'under_review' },
  { id: 'rb3', production: '"Coastal Echoes"', description: 'Crew lunch — overtime day', category: 'Catering', amount: 1800, currency: 'KES', date: '2 Jul 2026', status: 'rejected', reason: 'Catering already covered under the production\'s standing caterer contract.' },
]

export const REIMBURSEMENT_STATUS_META: Record<ReimbursementStatus, { label: string; color: string }> = {
  submitted:    { label: 'Submitted',    color: '#f39c12' },
  under_review: { label: 'Under Review', color: '#5dade2' },
  approved:     { label: 'Approved',     color: '#5dade2' },
  paid:         { label: 'Paid',         color: '#1abc9c' },
  rejected:     { label: 'Rejected',     color: '#e74c3c' },
}

export const REIMBURSEMENT_CATEGORIES = ['Travel', 'Equipment', 'Catering', 'Accommodation', 'Supplies', 'Other']

// ─── Organization Finance — individual's own view (Sections 26, 31–33) ────────
// This doc is mostly org-admin tooling (roles, permission matrices, approval
// chains, member invites) that assumes an "organization mode" this app
// doesn't have yet. What's genuinely additive without that foundation: an
// individual seeing a spending limit an organization has set on them, and
// tracking their own financial requests through to a decision — the
// requester's view, not the approver's.

export interface SpendingLimit {
  setBy: string
  limitType: string
  amount: number
  currency: string
  period: string
  appliesTo: string
  approvalThreshold: number
}

export const SPENDING_LIMIT: SpendingLimit = {
  setBy: 'Nairobi Film Collective', limitType: 'Per Transaction', amount: 20000, currency: 'KES',
  period: 'No expiry', appliesTo: '"Lagos Dreams" production spending', approvalThreshold: 20000,
}

export type FinancialRequestType = 'Budget Request' | 'Funding Request' | 'Transfer Request'
export type FinancialRequestStatus = 'submitted' | 'under_review' | 'approved' | 'partially_approved' | 'rejected' | 'completed'

export interface FinancialRequest {
  id: string
  type: FinancialRequestType
  purpose: string
  amount: number
  currency: string
  context: string
  approver: string
  status: FinancialRequestStatus
  date: string
}

export const FINANCIAL_REQUESTS: FinancialRequest[] = [
  { id: 'fr1', type: 'Budget Request', purpose: 'Increase Equipment Rental allocation — extra drone day added to shoot', amount: 8000, currency: 'KES', context: 'Kenya Film Commission Grant 2026', approver: 'Grant Program Officer', status: 'under_review', date: '17 Aug 2026' },
  { id: 'fr2', type: 'Funding Request', purpose: 'Advance for Mombasa leg travel costs', amount: 15000, currency: 'KES', context: '"Lagos Dreams"', approver: 'Nairobi Film Collective', status: 'approved', date: '8 Aug 2026' },
]

export const FINANCIAL_REQUEST_STATUS_META: Record<FinancialRequestStatus, { label: string; color: string }> = {
  submitted:          { label: 'Submitted',          color: '#f39c12' },
  under_review:       { label: 'Under Review',       color: '#5dade2' },
  approved:           { label: 'Approved',           color: '#1abc9c' },
  partially_approved: { label: 'Partially Approved', color: '#5dade2' },
  rejected:           { label: 'Rejected',           color: '#e74c3c' },
  completed:          { label: 'Completed',          color: '#1abc9c' },
}

// ─── Creator Membership Tiers (Master Pack, Section 3) ─────────────────────────
// The creator-facing counterpart to SUBSCRIPTIONS (which tracks what the user
// pays for). This is what the user offers to their own fans.

export interface MembershipTier {
  id: string
  name: string
  price: number
  currency: string
  period: 'Monthly' | 'Annual' | 'Lifetime'
  benefits: string[]
  memberCount: number
  active: boolean
  color: string
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  { id: 'mt1', name: 'Supporter', price: 200, currency: 'KES', period: 'Monthly', benefits: ['Private community posts', 'Early access to new uploads'], memberCount: 84, active: true, color: '#5dade2' },
  { id: 'mt2', name: 'Insider', price: 500, currency: 'KES', period: 'Monthly', benefits: ['Everything in Supporter', 'Behind-the-scenes video', 'Monthly Pwani Connect room'], memberCount: 31, active: true, color: '#1abc9c' },
  { id: 'mt3', name: 'VIP', price: 1500, currency: 'KES', period: 'Monthly', benefits: ['Everything in Insider', '1-on-1 mentorship session per quarter', 'Name in end credits'], memberCount: 6, active: true, color: '#f39c12' },
]

export const MEMBERSHIP_INSIGHT = "Insider has 5x more members than VIP relative to its price gap — consider adding one more mid-tier-only perk to VIP, or introducing a tier between Insider and VIP to capture members ready to spend more than KES 500 but not ready for KES 1,500."

// ─── Creative Licensing & Royalties (Prompt 16B-2E, Sections 44–54) ───────────
// Money flowing to the wallet from licensed IP — genuinely new territory,
// distinct from marketplace/service income already tracked elsewhere.

export interface LicensedWork {
  id: string
  title: string
  workType: string
  licensee: string
  licenseType: string
  territory: string
  grossRevenue: number
  royaltyRate: number
  participantShare: number
  currency: string
  period: string
  status: 'active' | 'expired' | 'pending_payout'
}

export const LICENSED_WORKS: LicensedWork[] = [
  { id: 'lw1', title: '"Coastal Echoes" — B-roll footage', workType: 'Footage', licensee: 'Safaricom Brand', licenseType: 'Commercial — Broadcast', territory: 'Kenya', grossRevenue: 18000, royaltyRate: 0.7, participantShare: 1.0, currency: 'KES', period: 'Aug 2026', status: 'pending_payout' },
  { id: 'lw2', title: '"Nairobi Nights" theme — instrumental', workType: 'Music', licensee: 'Twiga Foods', licenseType: 'Sync — 1 Year', territory: 'East Africa', grossRevenue: 12000, royaltyRate: 0.6, participantShare: 0.5, currency: 'KES', period: 'Jul 2026', status: 'active' },
]

export function royaltyOwed(w: LicensedWork) {
  return Math.round(w.grossRevenue * w.royaltyRate * w.participantShare)
}

export type NotifModule =
  | 'play' | 'studio' | 'passport' | 'wallet' | 'connect'
  | 'learn' | 'hub' | 'ai' | 'system' | 'security'

export type NotifCategory =
  | 'content' | 'learning' | 'payments' | 'community' | 'jobs'
  | 'studio' | 'passport' | 'ai' | 'system' | 'security'

export type NotifPriority = 'high' | 'medium' | 'low'

export type PwaniNotif = {
  id: string
  module: NotifModule
  category: NotifCategory
  priority: NotifPriority
  icon: string
  title: string
  body: string
  time: string
  read: boolean
  archived: boolean
  actionLabel?: string
  snoozedUntil?: string
}

export type Task = {
  id: string
  title: string
  desc: string
  dueDate: string
  priority: NotifPriority
  module: NotifModule
  progress: number
  icon: string
  done: boolean
}

export type CollabRequest = {
  id: string
  type: 'team' | 'project' | 'community' | 'mentor' | 'partnership'
  fromName: string
  fromRole: string
  fromAvatar: string
  title: string
  body: string
  time: string
}

export type Download = {
  id: string
  title: string
  type: string
  size: string
  progress: number
  status: 'active' | 'paused' | 'failed' | 'done'
  icon: string
}

export type TimelineEvent = {
  id: string
  icon: string
  title: string
  body: string
  time: string
  module: NotifModule
  color: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const NOTIFS: PwaniNotif[] = [
  // High priority / unread
  { id: 'n1',  module: 'wallet',   category: 'payments',  priority: 'high',   icon: '💸', title: 'Payment Received',          body: 'Fatima Hassan tipped you KES 500 on "Nairobi Nights"',                    time: '5m ago',   read: false, archived: false, actionLabel: 'View Wallet' },
  { id: 'n2',  module: 'connect',  category: 'community', priority: 'high',   icon: '🤝', title: 'Connection Request',        body: 'Amara Osei-Wusu wants to connect with you',                               time: '12m ago',  read: false, archived: false, actionLabel: 'Respond' },
  { id: 'n3',  module: 'hub',      category: 'jobs',      priority: 'high',   icon: '🎯', title: 'New Casting Call',          body: 'Short Film Lead Actor — Nairobi & Mombasa. Deadline: 20 Aug 2026',         time: '1h ago',   read: false, archived: false, actionLabel: 'Apply Now' },
  { id: 'n4',  module: 'learn',    category: 'learning',  priority: 'high',   icon: '📚', title: 'Assignment Due Tomorrow',   body: 'Film Editing Fundamentals — Module 4 quiz closes at 11:59 PM',             time: '2h ago',   read: false, archived: false, actionLabel: 'Open Lesson' },
  { id: 'n5',  module: 'security', category: 'security',  priority: 'high',   icon: '🔐', title: 'New Login Detected',        body: 'iPad Air — Nairobi, Kenya. If this was not you, secure your account.',    time: '3h ago',   read: false, archived: false, actionLabel: 'Review' },
  // Medium / mixed
  { id: 'n6',  module: 'studio',   category: 'studio',    priority: 'medium', icon: '🎬', title: 'Draft Ready for Review',    body: 'Your upload "Swahili Coast" processed. 1080p + thumbnail generated.',      time: 'Yesterday',read: true,  archived: false, actionLabel: 'Publish' },
  { id: 'n7',  module: 'play',     category: 'content',   priority: 'medium', icon: '🎥', title: 'New Episode Available',     body: 'Season 2 Ep. 3 of "Mama Afrika" is now streaming',                        time: 'Yesterday',read: true,  archived: false, actionLabel: 'Watch Now' },
  { id: 'n8',  module: 'wallet',   category: 'payments',  priority: 'medium', icon: '🔄', title: 'Subscription Renewed',      body: 'Pwani Play Creator Pro — KES 1,299 charged. Next: 10 Sep 2026.',           time: '2d ago',   read: true,  archived: false },
  { id: 'n9',  module: 'ai',       category: 'ai',        priority: 'medium', icon: '🤖', title: 'AI Insight Ready',          body: 'Your weekly portfolio analysis is ready. 3 optimization suggestions.',      time: '2d ago',   read: true,  archived: false, actionLabel: 'View' },
  { id: 'n10', module: 'passport', category: 'passport',  priority: 'medium', icon: '🪪', title: 'Passport Level Up',         body: 'You reached Level 3: Verified Creator. New opportunities unlocked.',        time: '3d ago',   read: true,  archived: false },
  { id: 'n11', module: 'connect',  category: 'community', priority: 'low',    icon: '🏘️', title: 'Community Invite',          body: 'East African Cinematographers invited you to join their community.',        time: '3d ago',   read: true,  archived: false, actionLabel: 'Join' },
  { id: 'n12', module: 'system',   category: 'system',    priority: 'low',    icon: '📣', title: 'App Update',                body: 'Pwani Play v2.1 is live — Hub marketplace, AI tools, and more.',           time: '1w ago',   read: true,  archived: false },
  { id: 'n13', module: 'wallet',   category: 'payments',  priority: 'medium', icon: '🪙', title: 'Coins Earned',              body: '200 Pwani Coins for completing the "Upload 3 Short Films" milestone!',      time: '1w ago',   read: true,  archived: false },
  { id: 'n14', module: 'hub',      category: 'jobs',      priority: 'medium', icon: '🏆', title: 'Grant Alert: Matching',     body: 'Kenya Film Commission Grant 2026 matches your profile. Apply by 1 Sep.', time: '1w ago',   read: true,  archived: false, actionLabel: 'Apply' },
  // Archived
  { id: 'n15', module: 'system',   category: 'system',    priority: 'low',    icon: '📣', title: 'Welcome to Pwani Hub',      body: 'Your creative marketplace is now active. Start exploring opportunities.',  time: '2w ago',   read: true,  archived: true },
  { id: 'n16', module: 'wallet',   category: 'payments',  priority: 'low',    icon: '↩️', title: 'Refund Processed',          body: 'KES 890 refunded for "Drone Footage Pack". Funds in your wallet.',         time: '3w ago',   read: true,  archived: true },
]

export const TASKS: Task[] = [
  { id: 't1', title: 'Complete Passport Profile', desc: 'Add portfolio, skills, and bio to unlock Level 3', dueDate: '2026-08-15', priority: 'high', module: 'passport', progress: 65, icon: '🪪', done: false },
  { id: 't2', title: 'Film Editing Quiz — Module 4', desc: 'Pwani Learn • Due tomorrow at 11:59 PM', dueDate: '2026-08-11', priority: 'high', module: 'learn', progress: 0, icon: '📚', done: false },
  { id: 't3', title: 'Respond to Collab Request', desc: 'Amara Osei-Wusu wants you on "Lagos Dreams" project', dueDate: '2026-08-12', priority: 'high', module: 'connect', progress: 0, icon: '🤝', done: false },
  { id: 't4', title: 'Submit Grant Application', desc: 'Kenya Film Commission Grant 2026 — Deadline 1 Sep', dueDate: '2026-09-01', priority: 'medium', module: 'hub', progress: 40, icon: '🏆', done: false },
  { id: 't5', title: 'Publish Draft: Swahili Coast', desc: 'Your upload is processed and ready to go live', dueDate: '2026-08-14', priority: 'medium', module: 'studio', progress: 90, icon: '🎬', done: false },
  { id: 't6', title: 'Verify Identity', desc: 'Upload national ID to unlock Passport Level 4', dueDate: '2026-08-20', priority: 'medium', module: 'passport', progress: 0, icon: '🆔', done: false },
  { id: 't7', title: 'Update Portfolio', desc: 'Add 2 recent projects to strengthen Passport score', dueDate: '2026-08-25', priority: 'low', module: 'passport', progress: 20, icon: '🖼️', done: false },
  { id: 't8', title: 'Renew Studio Pro Plan', desc: 'Expires 30 Aug 2026 — auto-renew is off', dueDate: '2026-08-30', priority: 'low', module: 'wallet', progress: 0, icon: '💳', done: true },
]

export const COLLAB_REQUESTS: CollabRequest[] = [
  { id: 'c1', type: 'project', fromName: 'Amara Osei-Wusu', fromRole: 'Film Director', fromAvatar: '🎬', title: 'Lagos Dreams — Short Film', body: 'I need a cinematographer for my upcoming short. 3-week shoot in Nairobi, Aug–Sep 2026.', time: '12m ago' },
  { id: 'c2', type: 'team',    fromName: 'Nairobi Film Collective', fromRole: 'Production Team', fromAvatar: '🏛️', title: 'Join our Production Team', body: 'We are building a 5-member team for a documentary series on Kenyan youth culture.', time: '2h ago' },
  { id: 'c3', type: 'community', fromName: 'East African Cinematographers', fromRole: 'Community', fromAvatar: '📷', title: 'Community Invitation', body: 'Join 240+ cinematographers sharing work, resources, and opportunities across East Africa.', time: '3d ago' },
  { id: 'c4', type: 'mentor',  fromName: 'Dr. Funmilayo Adichie', fromRole: 'Senior Producer', fromAvatar: '🎓', title: 'Mentorship Request Accepted', body: 'Your mentor session request was accepted. First session: 15 Aug, 3 PM EAT via video call.', time: '1d ago' },
  { id: 'c5', type: 'partnership', fromName: 'Savannah Media House', fromRole: 'Organization', fromAvatar: '🏢', title: 'Partnership Proposal', body: 'Savannah Media wants to co-produce content with independent creators on the platform.', time: '5d ago' },
]

export const DOWNLOADS: Download[] = [
  { id: 'd1', title: 'Mama Afrika — S2E3', type: 'Episode', size: '847 MB', progress: 67, status: 'active', icon: '🎥' },
  { id: 'd2', title: 'Film Editing Masterclass', type: 'Course Module', size: '312 MB', progress: 100, status: 'done', icon: '📚' },
  { id: 'd3', title: 'Kilimanjaro (4K)', type: 'Movie', size: '4.2 GB', progress: 23, status: 'paused', icon: '🏔️' },
  { id: 'd4', title: 'Swahili Beats Collection', type: 'Music Pack', size: '189 MB', progress: 0, status: 'failed', icon: '🎵' },
  { id: 'd5', title: 'Savannah Sunrise', type: 'Short Film', size: '621 MB', progress: 100, status: 'done', icon: '🌅' },
]

export const TIMELINE: TimelineEvent[] = [
  { id: 'tl1', icon: '💸', title: 'KES 500 received', body: 'Tip from Fatima Hassan for "Nairobi Nights"', time: '5m ago', module: 'wallet', color: '#1abc9c' },
  { id: 'tl2', icon: '🤝', title: 'Connection request', body: 'Amara Osei-Wusu sent a connection request', time: '12m ago', module: 'connect', color: '#2980b9' },
  { id: 'tl3', icon: '🎬', title: 'Draft published', body: '"Swahili Coast" is now live and streaming', time: '1h ago', module: 'studio', color: '#9b59b6' },
  { id: 'tl4', icon: '🏆', title: 'Achievement unlocked', body: 'Earned "Rising Creator" badge on Passport', time: '3h ago', module: 'passport', color: '#f39c12' },
  { id: 'tl5', icon: '📚', title: 'Lesson completed', body: 'Film Lighting Essentials — Module 3 finished', time: '5h ago', module: 'learn', color: '#e67e22' },
  { id: 'tl6', icon: '💬', title: 'New comment', body: 'Kofi Mensah commented on "Nairobi Nights": "Brilliant work!"', time: '7h ago', module: 'play', color: '#16a085' },
  { id: 'tl7', icon: '👥', title: 'New follower', body: 'Savannah Media House started following you', time: 'Yesterday', module: 'connect', color: '#2980b9' },
  { id: 'tl8', icon: '🪙', title: 'Coins earned', body: '200 Pwani Coins — Upload 3 Short Films challenge', time: 'Yesterday', module: 'wallet', color: '#f8c471' },
  { id: 'tl9', icon: '🎥', title: '350 new views', body: '"Nairobi Nights" reached 1,000 total views', time: '2d ago', module: 'play', color: '#e74c3c' },
  { id: 'tl10', icon: '🤖', title: 'AI insight', body: 'Weekly portfolio analysis ready — 3 suggestions', time: '2d ago', module: 'ai', color: '#5dade2' },
]

export const MODULE_META: Record<NotifModule, { label: string; icon: string; color: string }> = {
  play:     { label: 'Pwani Play',    icon: '🎬', color: '#e74c3c' },
  studio:   { label: 'Studio',        icon: '🎥', color: '#9b59b6' },
  passport: { label: 'Passport',      icon: '🪪', color: '#f39c12' },
  wallet:   { label: 'Wallet',        icon: '💳', color: '#1abc9c' },
  connect:  { label: 'Connect',       icon: '🤝', color: '#2980b9' },
  learn:    { label: 'Learn',         icon: '📚', color: '#e67e22' },
  hub:      { label: 'Hub',           icon: '🛒', color: '#8e44ad' },
  ai:       { label: 'Pwani AI',      icon: '🤖', color: '#5dade2' },
  system:   { label: 'System',        icon: '📣', color: '#7f8c8d' },
  security: { label: 'Security',      icon: '🔐', color: '#e74c3c' },
}

export const CAT_META: Record<NotifCategory, { label: string; icon: string }> = {
  content:   { label: 'Content',   icon: '🎥' },
  learning:  { label: 'Learning',  icon: '📚' },
  payments:  { label: 'Payments',  icon: '💳' },
  community: { label: 'Community', icon: '🤝' },
  jobs:      { label: 'Jobs',      icon: '🎯' },
  studio:    { label: 'Studio',    icon: '🎬' },
  passport:  { label: 'Passport',  icon: '🪪' },
  ai:        { label: 'AI',        icon: '🤖' },
  system:    { label: 'System',    icon: '📣' },
  security:  { label: 'Security',  icon: '🔐' },
}

export const PRIORITY_COLOR: Record<NotifPriority, string> = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: 'rgba(255,255,255,0.3)',
}

export const AI_SUGGESTIONS = [
  { icon: '🪪', title: 'Improve your Passport', body: 'Adding 2 portfolio projects could raise your score by 18 points and unlock casting opportunities.', reason: 'Based on your current Passport level' },
  { icon: '📚', title: 'Finish Film Editing course', body: 'You are 75% done. Completing it adds a verified skill to your Passport.', reason: 'You paused Module 4 three days ago' },
  { icon: '📝', title: 'Publish your draft', body: '"Swahili Coast" is processed and waiting. Publishing now catches peak evening traffic.', reason: 'Optimal upload time analysis' },
  { icon: '🏆', title: 'Apply for matching grants', body: 'Kenya Film Commission Grant matches your profile — KES 250,000 available. Deadline: 1 Sep.', reason: 'Profile match: 91%' },
  { icon: '🤝', title: 'Contact suggested collaborators', body: '3 creators with complementary skills are looking for projects like yours.', reason: 'Based on your recent uploads' },
  { icon: '🖼️', title: 'Upload your latest project', body: 'Your portfolio was last updated 3 weeks ago. Regular updates improve discovery.', reason: 'Portfolio activity signal' },
]

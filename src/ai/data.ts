export type AITool =
  | 'chat' | 'script' | 'translation' | 'portfolio' | 'marketing'
  | 'production' | 'analytics' | 'learning' | 'opportunity' | 'music'

export type ChatMessage = {
  id: string
  role: 'user' | 'ai'
  content: string
  time: string
  tool?: AITool
}

export type AISession = {
  id: string
  title: string
  tool: AITool
  preview: string
  time: string
  messages: number
}

export type AIToolMeta = {
  key: AITool
  label: string
  icon: string
  color: string
  desc: string
  prompts: string[]
}

// ─── Tool Registry ─────────────────────────────────────────────────────────────

export const AI_TOOLS: AIToolMeta[] = [
  {
    key: 'script', label: 'Script Assistant', icon: '📝', color: '#9b59b6',
    desc: 'Write, develop, and refine screenplays, dialogues, and story structures for any format.',
    prompts: ['Write a short film opening scene', 'Develop my story idea into a 3-act structure', 'Give feedback on my dialogue', 'Suggest a plot twist for my script'],
  },
  {
    key: 'translation', label: 'Translation & L10n', icon: '🌍', color: '#27ae60',
    desc: 'Translate content across African languages including Swahili, Yoruba, Amharic, Hausa, and Zulu.',
    prompts: ['Translate this scene to Swahili', 'Add subtitles for Yoruba audience', 'Localize my script for West Africa', 'Check cultural accuracy of my translation'],
  },
  {
    key: 'portfolio', label: 'Portfolio Advisor', icon: '🖼️', color: '#f39c12',
    desc: 'Analyse your portfolio and get AI-powered suggestions to improve your Passport score and visibility.',
    prompts: ['Review my portfolio strengths', 'What should I add to my portfolio?', 'How can I improve my Passport score?', 'Compare my profile to top creators'],
  },
  {
    key: 'marketing', label: 'Marketing Assistant', icon: '📣', color: '#e74c3c',
    desc: 'Generate captions, press releases, pitch decks, social media plans, and promotional copy.',
    prompts: ['Write a press release for my film', 'Generate social media captions', 'Create a pitch for investors', 'Suggest a marketing plan for my short film'],
  },
  {
    key: 'production', label: 'Production Assistant', icon: '🎬', color: '#2980b9',
    desc: 'Plan shoot schedules, manage call sheets, create shot lists, and track production budgets.',
    prompts: ['Create a shoot schedule for 5 days', 'Generate a call sheet template', 'Build a shot list for this scene', 'Help me plan my production budget'],
  },
  {
    key: 'analytics', label: 'Analytics Assistant', icon: '📊', color: '#1abc9c',
    desc: 'Interpret your content performance data and get actionable insights to grow your audience.',
    prompts: ['Analyse my content performance', 'When should I upload for best reach?', 'What content type performs best?', 'Show trends in my audience engagement'],
  },
  {
    key: 'learning', label: 'Learning Coach', icon: '🎓', color: '#e67e22',
    desc: 'Get personalised study plans, course recommendations, and skill-building roadmaps.',
    prompts: ['Build me a cinematography study plan', 'What courses should I take next?', 'Quiz me on film editing fundamentals', 'Help me prepare for the upcoming workshop'],
  },
  {
    key: 'opportunity', label: 'Opportunity Matcher', icon: '🎯', color: '#8e44ad',
    desc: 'AI scans grants, jobs, casting calls, and festivals to find the best matches for your profile.',
    prompts: ['Find grants that match my profile', 'What casting calls fit my skills?', 'Suggest festivals for my short film', 'Show me the best jobs this week'],
  },
  {
    key: 'music', label: 'Music Studio', icon: '🎵', color: '#e91e63',
    desc: 'Develop original songwriting ideas — themes, hooks, verse structure, and arrangement guidance.',
    prompts: ['Help me write a song about home', 'Suggest a hook for my chorus', 'Structure a verse-chorus-verse song', 'Give me arrangement ideas for an Afrobeat track'],
  },
]

export const TOOL_META: Record<AITool, AIToolMeta> = Object.fromEntries(AI_TOOLS.map(t => [t.key, t])) as Record<AITool, AIToolMeta>

// ─── Context awareness ───────────────────────────────────────────────────────
// What each tool draws on, shown as a small transparency chip in chat so the
// user always knows what data is informing a response.
export const TOOL_CONTEXT: Record<AITool, string> = {
  chat: 'General Pwani Play context',
  script: 'Your Studio drafts',
  translation: 'Your project scripts and metadata',
  portfolio: 'Your Passport profile',
  marketing: 'Your Studio projects',
  production: 'Your Studio project plan',
  analytics: 'Your Studio audience analytics',
  learning: 'Your Passport skills & Pwani Learn progress',
  opportunity: 'Your Passport profile + open opportunities',
  music: 'Your Studio music projects',
}

// ─── Mock Sessions ─────────────────────────────────────────────────────────────

export const AI_SESSIONS: AISession[] = [
  { id: 's1', title: 'Script: Swahili Sunrise Opening', tool: 'script', preview: 'EXT. MOMBASA COAST — DAWN. The Indian Ocean stretches to the horizon…', time: '2h ago', messages: 12 },
  { id: 's2', title: 'Marketing Plan — Nairobi Nights', tool: 'marketing', preview: 'Here is a 4-week social media rollout plan for your short film launch…', time: 'Yesterday', messages: 8 },
  { id: 's3', title: 'Portfolio Review', tool: 'portfolio', preview: 'Your portfolio shows strong cinematography work. Adding 2 more projects…', time: '3d ago', messages: 6 },
  { id: 's4', title: 'Shoot Schedule — Lagos Dreams', tool: 'production', preview: 'Day 1: Location scout, equipment check, cast rehearsal…', time: '1w ago', messages: 15 },
  { id: 's5', title: 'Translation: English → Swahili', tool: 'translation', preview: 'EXT. PWANI YA MOMBASA — ALFAJIRI. Bahari ya Hindi inaenea…', time: '1w ago', messages: 10 },
]

// ─── Pre-seeded chat responses ─────────────────────────────────────────────────

export const AI_RESPONSES: Record<string, string> = {
  'Write a short film opening scene': `Here is an opening scene for your short film:

**INT. NAIROBI APARTMENT — EARLY MORNING**

*A small, cluttered room. Afternoon light filters through torn curtains. AMANI (24), still in yesterday\'s clothes, stares at a cracked phone screen.*

*PHONE SCREEN: "Application Rejected"*

*She sets the phone face-down. Picks it up again. Sets it down.*

**AMANI (V.O.)**
They say Nairobi is a city of opportunity. I have been waiting for mine for three years.

*She stands. Moves to the window. Below, matatus weave through traffic, vendors call out, a city alive and indifferent.*

*This is where her story begins.*

Would you like me to develop this further — add dialogue, describe the next scene, or adjust the tone?`,

  'Find grants that match my profile': `Based on your Passport profile, here are your top 4 grant matches:

🏆 **Kenya Film Commission Grant 2026** — 91% match
• Up to KES 250,000 for original short films
• Deadline: 1 Sep 2026
• Your eligibility: Strong ✓

🌍 **Goethe-Institut African Film Fund** — 84% match
• EUR 10,000 for Africa-Europe co-productions
• Deadline: 15 Oct 2026
• Your eligibility: Meets most criteria ✓

🎬 **Sundance Africa Initiative** — 78% match
• USD 20,000 development grant
• Deadline: 30 Sep 2026
• Your eligibility: Apply recommended ✓

📚 **AFAC Creative Grant** — 72% match
• USD 5,000 for emerging Arab-African voices
• Deadline: 1 Nov 2026
• Note: Requires co-director from Arab world

Shall I help you start the application for KFC Grant 2026?`,

  'Review my portfolio strengths': `Here is your portfolio analysis:

**Strengths** ✓
- Consistent visual style across 6 projects
- Strong cinematography — natural light work is exceptional
- "Nairobi Nights" has 1,000+ views, showing audience traction
- Cross-format range: short film, documentary, music video

**Areas to Improve** →
- No feature-length credit yet (affects casting calls)
- Portfolio has a 3-week gap since last upload
- Missing "behind-the-scenes" content (boosts Passport score)
- No writing credit — add Script Assistant work to profile

**Passport Score Impact**
Adding 2 projects this month → +18 points (Level 3→4)
Verifying your identity → +12 points immediately

Would you like me to suggest which type of project to add next?`,

  'Analyse my content performance': `Here is your content performance for the last 30 days:

📊 **Top Performer**
"Nairobi Nights" — 1,247 views, 89% completion rate

📈 **Trend**
Uploads on Tuesday 7–9 PM EAT get 3× more views than other days

🎯 **Audience**
68% Kenya · 14% Nigeria · 9% South Africa · 9% Other

💡 **Key Insights**
1. Short films under 8 minutes retain 40% more viewers
2. Your documentary content has 2× the share rate of drama
3. "Swahili Sunrise" (unpublished) could outperform based on topic match

**Recommended Action**
Publish "Swahili Sunrise" this Tuesday evening to capture peak traffic.`,

  'default': `I am Pwani AI — your creative intelligence for African storytelling. I can help you write scripts, translate content, build your portfolio, plan productions, and find opportunities.\n\nWhat would you like to work on today?`,

  'Show me the best jobs this week': `Here's your Ecosystem Insight for this week — connecting Studio, Wallet, and Opportunities:

**What I'm seeing across your account:**
📅 Your "Lagos Dreams" production has a deadline in 6 days (Studio)
💰 An invoice payment of KES 18,400 is due to clear in 3 days (Wallet)
🎯 3 new job matches opened this week that fit your DP + colour-grading skills (Passport)

**Priority order:**
1. Lock the "Lagos Dreams" schedule — it's the closest deadline
2. The invoice will clear on its own, no action needed, just noting it
3. Apply to the top job match before Friday — it closes fastest

**Top match:** Freelance Colourist, Nairobi Film Collective — 88% skill match, KES 45,000, application closes in 4 days.

Want me to help you apply to that job, or look at the production schedule first?`,

  'What casting calls fit my skills?': `Here are casting calls matched to your Passport profile:

🎬 **"Coastal Winds" — Supporting Role** — 82% match
• Seeking: actor with coastal Kenya dialect experience
• Mombasa, self-tape by 25 Aug 2026

🎭 **Nairobi Theatre Collective — Ensemble Cast** — 74% match
• Ongoing production, flexible rehearsal schedule
• In-person audition, rolling admission

📺 **"Pwani Nights" Series — Recurring Role** — 69% match
• Requires prior on-camera credit (you have 2 ✓)
• Nairobi, in-person callback

Matches are based on your listed skills, location, and portfolio credits. Want me to help you prep a self-tape for "Coastal Winds"?`,

  'Help me write a song about home': `Here's a starting point — theme, hook, and structure:

**Theme:** Longing and belonging — the pull between where you're from and where you're going.

**Working Title:** "Bahari Yangu" ("My Ocean")

**Hook idea:**
"No matter how far these feet have gone / this shore still calls me home"

**Structure:**
- Verse 1: Leaving — the reasons, the goodbye
- Pre-chorus: The pull back
- Chorus: The hook — home as constant
- Verse 2: What's changed since leaving
- Bridge: The realization — home is a person, not just a place
- Final chorus: Resolved, warmer arrangement

This is an original starting point, not modeled on any specific artist. Want me to draft full verse lyrics, or explore a different theme?`,

  'Create a pitch for investors': `Here's a pitch structure for your project:

**1. Hook (15 sec)** — One sentence that makes them lean in. What's the emotional core?

**2. The World** — Where and when. What makes this setting cinematic and specific?

**3. The Story** — Protagonist, want, obstacle, stakes. Keep it to 3 sentences.

**4. Why Now / Why You** — Market context, and your unique access or perspective as the creator.

**5. Traction** — Portfolio highlights, audience numbers, any prior recognition (I can pull these from your Passport).

**6. The Ask** — Budget range, use of funds, and what you need from this investor specifically.

**7. Close** — Return to the emotional hook from step 1.

Want me to draft full pitch copy for any of these sections using your actual project details?`,

  'Check cultural accuracy of my translation': `Here's how I'd review a translation for cultural accuracy:

**What I check:**
- Idioms translated for meaning, not word-for-word (literal translation often breaks the emotional beat)
- Honorifics and forms of address appropriate to the region and relationship
- Regional dialect consistency — Swahili varies between Coastal Kenya, Tanzania, and inland dialects
- References (food, places, customs) that make sense to the target audience
- Tone preservation — formal, comedic, or dramatic register carried through

**To review your actual translation**, paste the original and translated text here and I'll flag anything that needs adjustment, with the reasoning for each suggestion.

Want to paste a scene now, or should I walk through an example first?`,
}

// ─── Tool-aware fallback templates ──────────────────────────────────────────
// Used whenever a prompt doesn't have a hand-written response above, so every
// tool still answers in character instead of falling back to one generic reply.
const TOOL_FALLBACK_OPENERS: Record<AITool, (q: string) => string> = {
  chat: q => `Here's a starting point on "${q}":`,
  script: q => `Let's develop that. On "${q}", here's a first pass:`,
  translation: q => `Working on it — translating and checking cultural fit for "${q}":`,
  portfolio: q => `Pulling from your Passport data to answer "${q}":`,
  marketing: q => `Here's a draft angle for "${q}":`,
  production: q => `Here's a working plan for "${q}":`,
  analytics: q => `Reading your performance data for "${q}":`,
  learning: q => `Here's a learning path for "${q}":`,
  opportunity: q => `Scanning open opportunities for "${q}":`,
  music: q => `Let's shape that idea. On "${q}", here's a starting point:`,
}

const TOOL_FALLBACK_STEPS: Record<AITool, string[]> = {
  chat: ['Tell me more about what you\'re trying to achieve', 'I can pull in context from your Passport, Studio projects, or Wallet if it helps', 'Ask a follow-up any time — I\'ll keep the thread'],
  script: ['A rough structure or opening beat', 'Suggested tone and pacing', 'Where I\'d expand next — dialogue, stakes, or setting'],
  translation: ['A first-pass translation preserving tone', 'A note on any idioms that don\'t translate directly', 'A cultural-accuracy check for your target region'],
  portfolio: ['What\'s already working in your profile', 'One or two concrete gaps affecting discoverability', 'The fastest way to close them this week'],
  marketing: ['A short-form draft you can edit directly', 'Suggested posting cadence', 'A hook variant if you want to A/B test'],
  production: ['A day-by-day outline', 'Key risks to plan around', 'What to lock in first vs. what can flex'],
  analytics: ['The headline number that matters most', 'One trend worth acting on', 'A concrete next step, not just a chart'],
  learning: ['A suggested sequence of topics', 'A realistic weekly time budget', 'A way to check you\'ve actually learned it'],
  opportunity: ['Matches ranked by fit, with why they matched', 'Deadlines worth prioritising', 'What would strengthen a weak match'],
  music: ['A theme or concept to build around', 'A few hook or title options', 'A suggested verse-chorus-bridge structure — I won\'t imitate any specific artist\'s style'],
}

export function generateAIResponse(tool: AITool, prompt: string): string {
  const exact = AI_RESPONSES[prompt]
  if (exact) return exact
  const opener = TOOL_FALLBACK_OPENERS[tool](prompt)
  const steps = TOOL_FALLBACK_STEPS[tool]
  return `${opener}\n\n${steps.map(s => `• ${s}`).join('\n')}\n\nWant me to go deeper on any of these, or start over with more detail?`
}

// ─── Prompt Library ──────────────────────────────────────────────────────────

export type PromptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type LibraryPrompt = {
  id: string
  title: string
  description: string
  category: string
  tool: AITool
  difficulty: PromptDifficulty
  estMinutes: number
  prompt: string
}

export const PROMPT_CATEGORIES = [
  'Screenwriting', 'Story Development', 'Directing', 'Producing', 'Budgeting',
  'Marketing', 'Film Distribution', 'Social Media', 'Photography', 'Music',
  'Podcasting', 'Creative Business', 'Education', 'Grant Writing', 'Career Advice',
] as const

export const PROMPT_LIBRARY: LibraryPrompt[] = [
  { id: 'p1', title: 'Write an opening scene', description: 'Draft a strong opening scene from a one-line idea.', category: 'Screenwriting', tool: 'script', difficulty: 'Beginner', estMinutes: 5, prompt: 'Write a short film opening scene' },
  { id: 'p2', title: 'Build a 3-act structure', description: 'Turn a loose story idea into a structured outline.', category: 'Story Development', tool: 'script', difficulty: 'Intermediate', estMinutes: 10, prompt: 'Develop my story idea into a 3-act structure' },
  { id: 'p3', title: 'Plan a 5-day shoot', description: 'Generate a day-by-day shooting schedule.', category: 'Producing', tool: 'production', difficulty: 'Intermediate', estMinutes: 8, prompt: 'Create a shoot schedule for 5 days' },
  { id: 'p4', title: 'Draft a production budget', description: 'Get a starting budget breakdown for a short film.', category: 'Budgeting', tool: 'production', difficulty: 'Advanced', estMinutes: 12, prompt: 'Help me plan my production budget' },
  { id: 'p5', title: 'Write a press release', description: 'Announce your film or project to press contacts.', category: 'Marketing', tool: 'marketing', difficulty: 'Beginner', estMinutes: 6, prompt: 'Write a press release for my film' },
  { id: 'p6', title: 'Plan a distribution rollout', description: 'Map platforms and timing for releasing your work.', category: 'Film Distribution', tool: 'marketing', difficulty: 'Advanced', estMinutes: 10, prompt: 'Suggest a marketing plan for my short film' },
  { id: 'p7', title: 'Generate social captions', description: 'A week of captions across platforms in your voice.', category: 'Social Media', tool: 'marketing', difficulty: 'Beginner', estMinutes: 4, prompt: 'Generate social media captions' },
  { id: 'p8', title: 'Review a photo series', description: 'Get feedback on composition and sequencing.', category: 'Photography', tool: 'portfolio', difficulty: 'Intermediate', estMinutes: 7, prompt: 'Review my portfolio strengths' },
  { id: 'p9', title: 'Translate a scene', description: 'Translate dialogue while preserving tone and rhythm.', category: 'Screenwriting', tool: 'translation', difficulty: 'Intermediate', estMinutes: 8, prompt: 'Translate this scene to Swahili' },
  { id: 'p10', title: 'Build a study plan', description: 'A personalised path to learn a new craft skill.', category: 'Education', tool: 'learning', difficulty: 'Beginner', estMinutes: 5, prompt: 'Build me a cinematography study plan' },
  { id: 'p11', title: 'Find matching grants', description: 'Surface grants ranked by fit to your profile.', category: 'Grant Writing', tool: 'opportunity', difficulty: 'Intermediate', estMinutes: 6, prompt: 'Find grants that match my profile' },
  { id: 'p12', title: 'Plan your next career move', description: 'Get guidance based on your Passport and goals.', category: 'Career Advice', tool: 'opportunity', difficulty: 'Advanced', estMinutes: 10, prompt: 'Show me the best jobs this week' },
  { id: 'p13', title: 'Analyse audience performance', description: 'Understand what\'s working and what to publish next.', category: 'Creative Business', tool: 'analytics', difficulty: 'Intermediate', estMinutes: 7, prompt: 'Analyse my content performance' },
  { id: 'p14', title: 'Outline a podcast episode', description: 'Structure segments, questions, and pacing.', category: 'Podcasting', tool: 'script', difficulty: 'Beginner', estMinutes: 6, prompt: 'Give feedback on my dialogue' },
  { id: 'p15', title: 'Plan a music release', description: 'Timeline for releasing a single or EP.', category: 'Music', tool: 'marketing', difficulty: 'Intermediate', estMinutes: 8, prompt: 'Suggest a marketing plan for my short film' },
  { id: 'p16', title: 'Write a song concept', description: 'Develop a theme, hook, and structure for a new song.', category: 'Music', tool: 'music', difficulty: 'Beginner', estMinutes: 6, prompt: 'Help me write a song about home' },
  { id: 'p17', title: 'Build an investor pitch', description: 'Structure a pitch deck for funding your project.', category: 'Creative Business', tool: 'marketing', difficulty: 'Advanced', estMinutes: 10, prompt: 'Create a pitch for investors' },
]

// ─── Cross-module ecosystem insights ─────────────────────────────────────────
// "Pwani Ecosystem Insights" — surfaces connections across Studio, Wallet,
// Passport, etc. rather than each module reporting in isolation. Each item
// follows Evidence → Priority → Suggested Action, same shape the AI uses in
// its own chat responses when reasoning across modules.

export type EcosystemInsight = {
  id: string
  icon: string
  title: string
  evidence: string
  priority: 'Critical' | 'Important' | 'Useful'
  tool: AITool
  prompt: string
}

export const ECOSYSTEM_DIGEST: EcosystemInsight[] = [
  { id: 'e1', icon: '🎬', title: 'Production deadline approaching', evidence: '"Lagos Dreams" shoot schedule closes in 6 days with 2 unconfirmed crew slots', priority: 'Critical', tool: 'production', prompt: 'Create a shoot schedule for 5 days' },
  { id: 'e2', icon: '🎯', title: '3 new job matches this week', evidence: 'Opportunities matching your DP + colour-grading skills opened in the last 7 days', priority: 'Important', tool: 'opportunity', prompt: 'Show me the best jobs this week' },
  { id: 'e3', icon: '💰', title: 'Invoice clearing soon', evidence: 'KES 18,400 payment expected to clear into your Wallet in 3 days — no action needed', priority: 'Useful', tool: 'analytics', prompt: 'Analyse my content performance' },
]

// ─── AI Memory ────────────────────────────────────────────────────────────────
// What Pwani AI remembers about the user, and why — each entry is inspectable
// and deletable, rather than "memory" being an opaque on/off switch.

export type MemoryCategory = 'Personal Preferences' | 'Creative Preferences' | 'Projects' | 'Work Preferences' | 'Learning Preferences' | 'Saved Instructions' | 'Approved Facts'

export type MemoryItem = {
  id: string
  category: MemoryCategory
  fact: string
  reason: string
  source: string
  date: string
}

export const AI_MEMORY: MemoryItem[] = [
  { id: 'm1', category: 'Creative Preferences', fact: 'Prefers documentary and coastal-Kenya settings over studio drama', reason: 'Inferred from Studio project uploads and script prompts', source: 'Studio activity', date: '2 weeks ago' },
  { id: 'm2', category: 'Work Preferences', fact: 'Usually asks for shoot schedules in 5-day blocks', reason: 'Pattern across 3 previous Production Assistant sessions', source: 'AI Chat history', date: '10 days ago' },
  { id: 'm3', category: 'Personal Preferences', fact: 'Prefers Kiswahili greetings, English for technical detail', reason: 'Language mix used consistently across conversations', source: 'AI Chat history', date: '1 week ago' },
  { id: 'm4', category: 'Projects', fact: '"Lagos Dreams" is an active production with a near-term deadline', reason: 'Linked from your Studio project list', source: 'Pwani Studio', date: '3 days ago' },
  { id: 'm5', category: 'Saved Instructions', fact: 'Keep script feedback constructive — lead with what\'s working first', reason: 'You asked the AI to remember this during a Script Assistant session', source: 'Explicit request', date: '5 days ago' },
  { id: 'm6', category: 'Approved Facts', fact: 'Skilled in cinematography and colour grading', reason: 'Confirmed from your Passport profile', source: 'Pwani Passport', date: '3 weeks ago' },
]

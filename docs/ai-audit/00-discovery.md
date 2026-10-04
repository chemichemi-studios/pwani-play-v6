# Phase 0: Discovery

## Stack summary

- Framework/language: React 19 + TypeScript 5.9 (package range `^5.7.0`).
- Routing: no URL router; `src/App.tsx` switches a single `Screen` state union. AI is the `ai` screen.
- State: local component state with React hooks; `src/platform/store.ts` provides a small external store through React context and persists its prototype state to browser `localStorage`.
- Styling: Tailwind CSS v4 is installed and imported globally, but most AI/UI styling is inline React styles. Existing Pwani Play design conventions are shared; no component library is installed.
- Build: Vite 8 with React and Tailwind plugins.
- Package manager: pnpm 12.8.1 through Corepack; `pnpm-lock.yaml` is present. `package-lock.json` is also present.
- Test/lint tools: no test or lint dependencies/scripts are configured. `package.json` exposes `dev`, `build`, `preview`, and `format` only.
- Run: `pnpm dev`; `pnpm build`; `pnpm preview`; `pnpm format`.
- Typecheck: `pnpm exec tsc --noEmit` (works, though there is no package script).

## Pwani AI inventory

| Surface | Files | Current responsibility |
|---|---|---|
| Main AI experience | `src/ai/AIShell.tsx` | Home, chat, tools, history, settings, memory, command palette, mock voice sheet; all navigation is local component state. |
| AI fixtures and behavior | `src/ai/data.ts` | Tool registry, hard-coded response strings, mock sessions, demo ecosystem digest and pre-populated memory, prompt library, fallback generator. |
| App entry | `src/App.tsx` | Adds `ai` to the `Screen` union; passes `onExit` to `AIShell`. |
| Streaming recommendations | `src/streaming/AIRecommendations.tsx` | Separate recommendation UI using local constants; not connected to the Pwani AI data/action/context layer. |
| Connect assistant | `src/connect/AIAssistant.tsx` | Separate local assistant and hard-coded responses; not connected to Pwani AI. |
| Wallet intelligence | `src/wallet/FinancialAI.tsx`, `src/wallet/FinancialInsights.tsx`, `src/wallet/data.ts` | Finance-specific UI/insights and local fixture data; no shared AI permission/source/action service. |
| Notifications | `src/notifications/data.ts`, `src/notifications/NotificationsShell.tsx` | Contains AI suggestion/notification fixtures, not an AI runtime. |
| Platform state | `src/platform/store.ts` | Demo app state and a few module mutation methods persisted to local storage; no user/role authorization API or AI access check. |
| Prompt/spec text | `17A-core-assistant.md`, `17B-creative-intelligence.md`, `17C-business-ecosystem.md`, `17D-memory-trust-governance.md`, `src/imports/pasted_text/*` | Product/spec source text, not executable prompt templates or model system prompts. |

Search terms included AI, assistant, chat, copilot, prompt, LLM/provider names, embedding, memory, context, orchestration, workflow, automation, voice, speech and composer. No API route, model client, server-side AI service, system prompt file or dedicated AI adapter was found. The prototype has no backend project in this workspace.

## Integration map

| Pwani Play domain | AI integration observed | Audit assessment |
|---|---|---|
| Home | Home button opens the AI shell. AI home separately shows hard-coded cross-module digest items. | Entry exists; digest is not sourced from modules. |
| Profile / Passport | AI copy claims it reads Passport; no profile/context builder import in `src/ai`. | Not connected; claims are unsupported. |
| Creator Studio / Projects / Productions | AI tool context labels and outputs refer to Studio projects/productions; no Studio service imports or record identifiers/deep links. | Mock claims only. |
| Content / Film / Music | Streaming has a separate AI recommendations screen; AI includes writing/music mock responses. | Disconnected mock surfaces. |
| Finance / Wallet | `src/wallet/FinancialAI.tsx` and insights read wallet fixtures, separately from Pwani AI; AI digest itself contains fabricated invoice/balance-related claims. | Local demo data; no shared access control or source links. |
| Marketplace / Jobs / Opportunities | Opportunity prompt has hard-coded grant/job results; no authorized marketplace query. | Fabricated demo claims, no source links. |
| Learning | Learning tool is a prompt/response template; no course or progress context is passed. | Not connected. |
| Community / Events / Organizations | No Pwani AI integration found. | Missing. |
| Messaging / Notifications | No shared AI entry/context; notifications include local AI suggestions. | Disconnected fixtures. |

## Entry points

- Home screen exposes `onOpenAI`, which navigates to `screen === 'ai'` in `src/App.tsx`.
- Within the AI shell: five bottom tabs (Home, Chat, Tools, History, Settings), command palette button, prompt library and mock voice button.
- No app-wide global command bar, keyboard shortcut handler, contextual project/production/finance/order/course/org links, or origin-context preservation was found.

## Permission model

`src/App.tsx` has a prototype role selection (`viewer`, `creator`, `organization`, `student`, `educator`) and local onboarding/role state. This is not an authenticated authorization model. `src/platform/store.ts` models demo account state and mutations but no roles, permissions, ownership checks, or access-denied result. AI code does not import either role state or platform store. No server/data-layer authorization boundary exists in this prototype. Therefore permission inheritance and context isolation are unimplemented, not merely hidden in UI.

## Data and persistence

- AI conversations/history are hard-coded entries in `AI_SESSIONS`; active chat messages, pinned state, versions and settings use component state and disappear when the component is discarded.
- AI memory is a fixed `AI_MEMORY` fixture; deletion changes only the current `MemoryScreen` state and is not persisted. The fixture is displayed as though it describes the current user.
- Prompt favorites, settings, voice transcript phases and automation selection are local transient state.
- Privacy actions display success toasts without exporting, deleting or resetting any data.
- The general platform store persists some prototype state in `localStorage`; it has no AI conversations, memory, audit log or action records.
- No AI drafts store, action receipt, audit service or backend persistence was found.

## Baseline health (before source changes)

- Install: `corepack enable && pnpm install --frozen-lockfile` passed; Corepack downloaded pnpm 12.8.1 after interactive confirmation; 43 packages installed.
- Build: `pnpm build` passed. Vite emitted an existing bundle-size warning for the 1.379 MB minified JS bundle (suggested chunk size threshold: 500 kB).
- Typecheck: `pnpm exec tsc --noEmit` passed with no diagnostics (chained after build).
- Lint: unavailable; no lint script/dependency is configured.
- Tests: unavailable; no test script/framework is configured.
- Package scripts: `dev`, `build`, `preview`, `format` only.
- Runtime journeys/screenshots: not run in Phase 0; report as UNVERIFIED.

## Spec section-count confirmation

All four files were read in full. Count is based on numbered level-2 headings (`## N.`):

| Spec | Numbered sections found | Expected |
|---|---:|---:|
| 17A Core Assistant | 100 | ~100 |
| 17B Creative Intelligence | 95 | ~95 |
| 17C Business Ecosystem | 100 | ~100 |
| 17D Memory, Trust, Governance | 148 | ~148 |

Note: 17D has a numbered §31 title in prose but no `## 31.` heading; its numbered heading sequence jumps from §30 to §32. This is why heading count is 148 while the document's final section number is 150.

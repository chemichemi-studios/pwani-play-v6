# Canonical Pwani AI Screen Map

The four specifications enumerate roughly 654 screen concepts before overlap and include states as screens. The inventory below deduplicates shared concepts into canonical destinations. `Existing` means an identifiable UI/component exists, not that the capability is complete or production-connected. There is no URL router; all AI subviews are local to the `ai` shell in `src/App.tsx` and `src/ai/AIShell.tsx`.

| Canonical route/screen | Spec coverage | Current route/component | Status |
|---|---|---|---|
| AI Home / Command Center | A1, D1, A97-98, D148 | `ai` / `HomeTab` in `src/ai/AIShell.tsx` | PARTIAL: existing home; command-center data is fixture-only. |
| Conversation / New Chat | A2, A34, D3 | `ai` / `ChatInterface` | PARTIAL: text-only mock chat. |
| Conversation History / Search / Detail | A8, D3 | `ai` / `HistoryTab`, session subview | PARTIAL: seeded sample sessions, not restored conversations. |
| Context Selector / Confirmation / Restricted Context | A3, D1, D7, D9 | None | MISSING. |
| Structured Response / Sources / Source Detail / Confidence / Conflict | A4-5, D7 | Plain text renderer only | MISSING: no structured response or source deep link. |
| Composer / Attachment Preview / Upload / File, Image, Audio, Video Analysis | A6, D5 | Text input in `ChatInterface`; simulated `VoiceSheet` | MISSING except text and demo voice UI. |
| AI Modes / Workspaces | A8, B1 | Tool selection (`ToolsTab`) | PARTIAL: tools are not modes/workspaces. |
| Personal Assistant / Daily Briefing / Priorities / Task Creation | A9, D10 | Hard-coded cards in `HomeTab` | VIOLATION: unsupported user-specific claims; task workflow MISSING. |
| Global Command Palette / Contextual Entry / Return-to-Origin | A10, D1, D10 | Local `CommandPalette`; app entry from Home | PARTIAL: no app-wide shortcut/context/origin. |
| Project / Production / Finance Assistant | A11, C3, D10 | AI prompt tools; separate `src/wallet/FinancialAI.tsx` | PARTIAL/DISCONNECTED: no shared authorized context. |
| Marketplace / Learning / Career / Organization / Community / Events Assistants | A11, A13, C2, C4-5 | Opportunity and learning prompt templates only | MISSING as connected assistants; some opportunity outputs violate no-fabrication. |
| Memory Home / Detail / Approval / Scope / Delete | A12, D2 | `MemoryScreen` | PARTIAL UI, VIOLATION data; no consent, scoping or persistence. |
| Privacy / Trust / Permission Center / Request | A12, D7 | Settings placeholders | MISSING. |
| AI Settings / Personalization / Language / Notifications | A21, D6, D12 | `AISettingsTab` | PARTIAL: transient state/placeholders. |
| Prompt Library / Template / Favorites | A15, B13, D10 | `PromptLibraryScreen` | PARTIAL: favorites transient; no template authoring/sharing. |
| Creative Studio / Idea Lab / Story / Logline / Beats | B1-2 | Script/music/marketing tools | MISSING as workflows. |
| Character / World / Location / Canon / Continuity | B3, B11 | None; fictional fixture memory only | MISSING/VIOLATION for falsely represented project memory. |
| Creative Research / Documentary Facts / Sources | B4, B12 | Translation prompt template | MISSING. |
| Screenwriter / Script Editor / Rewrite / Diagnostics / Versions | B5, B13 | Script chat and ephemeral `versions` in `ChatInterface` | PARTIAL. |
| Series / Film / Treatment / Pitch / Visual Production | B6-7 | Prompt templates only | MISSING. |
| Music Studio / Songwriting / Arrangement / Release | B8 | `music` tool and canned song response | PARTIAL. |
| Content Studio / Calendar / Campaign / Post-production / Feedback Hub | B9-10 | Marketing tool and feedback buttons | MISSING as connected workflows. |
| Business Dashboard / Health / Forecast / Decisions | C1 | None | MISSING. |
| Marketplace Search / Buyer / Seller / Listing / Order / Dispute | C2 | Opportunity tool only | MISSING; hard-coded grant/job data is a P0 violation. |
| Production Command Center / Schedule / Crew / Budget / Delivery | C3 | Production tool only | MISSING as sourced workflow. |
| Learning Plan / Tutor / Skills / Career / Applications | C4 | Learning and opportunity tools | PARTIAL prompt surfaces only; job fixtures violate N4. |
| Organization / Community / Events / Creator Economy | C5-6 | None in Pwani AI | MISSING. |
| Ecosystem Insights / Opportunity Feed / Search / Action Center / Approval Center | C7-8 | `HomeTab` digest and internal palette | VIOLATION for fabricated digest; search/action/approval screens MISSING. |
| Orchestrator / Task Breakdown / Workflow Builder / Human Approval / Automation Center | D4 | Automation-level choice in settings only | MISSING; selector is not an automation system. |
| Voice Home / Transcript / Confirmation / Session | A7, D5 | `VoiceSheet` | PARTIAL simulated fixed transcript; no actual speech service. |
| Document Q&A / Extraction / Comparison | A6, D5 | None | MISSING. |
| Feedback / Correction / Quality / Error / Recovery / Offline | A19-20, D8 | Thumbs buttons and regeneration | MISSING as accountable flows. |
| Governance / Policy / Incident / Admin / Usage / Audit | D9, D12 | None | MISSING. |
| Planner / Calendar / Meeting / Collaboration | A18, B10, D10 | None | MISSING. |
| Accessibility / Responsive states / Onboarding / Help | A19-20, D12 | General app onboarding only | MISSING as AI-specific end-to-end screens; runtime accessibility not verified. |

## Screen inventory reconciliation

- Existing Pwani AI components: Home, chat, tools, history/search, settings, memory, prompt library, local command palette, simulated voice sheet, transient draft versions and response feedback.
- Existing elsewhere but not connected to Pwani AI: wallet-specific financial insights, streaming recommendations, Connect assistant, platform modules and their local fixture data.
- Missing from the Pwani AI route tree: all source/context/permission/action-receipt/trust/governance/orchestration/multimodal/creative-workspace/business/marketplace/learning/organization/community/events/journey destinations identified above.
- Named spec screen inventories for mobile, desktop and tablet are presentation variants, not separate routes here; responsive behavior for the app's fixed 430px shell is not validated as a working full desktop experience.
- No route or control was exercised in a running browser during this phase; click paths are source-inspected only. A full journey walk remains UNVERIFIED.

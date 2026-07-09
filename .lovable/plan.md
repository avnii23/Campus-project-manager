# CampusPM Build Plan

Building a production-grade SaaS with landing, auth, dashboard, project workspace, kanban, repository, meetings, AI features, analytics, and settings. Given the scope, I'll ship in tight phases, each fully functional and polished before moving on.

## Design System (Phase 0)

Dark-first premium SaaS. Locked palette:

- Background `#09090B`, cards `#18181B`, borders subtle `zinc-800`
- Primary `#F59E0B` (amber-500), accent `#FBBF24` (amber-400)
- Font: Geist / Inter via @fontsource
- Glassmorphism panels (`backdrop-blur` + `bg-white/[0.02]` + border)
- Framer Motion for reveals, hover, counters, page transitions
- Radius `1rem` default, generous spacing, large display type
- All colors go into `src/styles.css` as oklch tokens; no ad-hoc hex in components.

Reusable primitives: `GlassCard`, `GradientButton`, `Stat`, `SectionHeading`, `EmptyState`, `LoadingState`, `PageHeader`, `SidebarNav`, `TopBar`.

## Phase 1 — Foundation & Landing (this turn)

1. Enable Lovable Cloud (Supabase) so email/password + Google auth work.
2. Rebuild `src/styles.css` with the CampusPM design tokens, fonts, gradients, shadows, glass utilities.
3. Root layout: real head metadata, font loading, framer-motion page transition wrapper.
4. Landing page (`/`) — full sections:
   - Sticky glass navbar
   - Hero with gradient headline + product mockup (real UI, not illustration)
   - Live dashboard preview (mini kanban + stat cards)
   - Features grid (8 cards)
   - How it Works timeline
   - Animated stats counters
   - Testimonials carousel
   - Pricing (Student / Team / Campus)
   - FAQ accordion
   - Footer
5. Sitemap.xml + robots.txt.

## Phase 2 — Auth

- `/auth` (login + signup toggle, Google button)
- `/auth/forgot`, `/reset-password`, `/auth/verify`
- `profiles` table + trigger, `user_roles` table + `has_role` fn
- Managed `_authenticated` layout gate (integration-owned)
- Root `onAuthStateChange` → `router.invalidate()`
- Session-aware nav CTA on landing

## Phase 3 — App Shell + Dashboard

- `_authenticated` layout with collapsible sidebar (Dashboard, Projects, Meetings, Repository, Analytics, AI, Settings) + top bar (search, notifications, avatar)
- Dashboard `/app`: overview stat cards, project health rings, today's tasks, upcoming meetings, mini calendar, activity feed, notifications panel, quick actions, AI assistant widget
- Mock data via typed fixtures in `src/lib/mock/*`

## Phase 4 — Projects & Project Workspace

- `/app/projects` list with filters + create dialog (persisted to `projects` table)
- `/app/projects/$projectId` tabbed workspace: Overview, Board, Timeline, Repository, Files, Team, Meetings, Reports, Presentation, Analytics, Settings

## Phase 5 — Kanban Board

- 5 columns, dnd via `@dnd-kit/core`
- Task card with priority pill, due date, assignee avatar, labels, comment/attachment counts
- Task detail sheet (comments, attachments, activity)
- Persist tasks to `tasks` table

## Phase 6 — Repository

- Folder tree + file list (GitHub-style breadcrumbs)
- Upload to Lovable Storage bucket `project-files` (private, RLS by project membership)
- File preview (image/text/pdf), download, recent changes feed, mock version history

## Phase 7 — Meetings

- Upcoming / History / Notes tabs
- Schedule meeting dialog
- Meeting detail: notes, action items, AI summary panel (calls Lovable AI Gemini)

## Phase 8 — AI Features

Dedicated pages, each with form → progress → result preview using `google/gemini-3-flash-preview` through a shared `ai.functions.ts`:

- PPT Generator (outline → slides preview)
- Report Generator (markdown result)
- Meeting Summary (paste transcript → summary + action items)
- Viva Assistant (Q&A from project context)
- Task Generator (project brief → task list, one-click add to board)
- Project Health Score (computed + explanation)
- Contribution Score (per member)
- Smart Submission Checklist

## Phase 9 — Analytics

Recharts dashboards: task completion, project health trend, contribution scores, meeting attendance, weekly activity heatmap, progress timeline. Real queries where data exists, mock for the rest.

## Phase 10 — Settings

Profile, account, notifications, appearance, workspace/project settings, danger zone.

## Technical section

- **Routing:** file-based under `src/routes/`. Public: `/`, `/auth/*`, `/pricing`, `/features`. Protected: `src/routes/_authenticated/app/...` gated by the integration-managed `_authenticated/route.tsx`.
- **Data:** TanStack Query default (`ensureQueryData` in loaders under `_authenticated/`, `useSuspenseQuery` in components). All Supabase reads/writes via `createServerFn` with `requireSupabaseAuth`.
- **Schema (Cloud):** `profiles`, `user_roles` (+ `has_role`), `projects`, `project_members`, `tasks`, `task_comments`, `meetings`, `meeting_notes`, `files` (metadata), `activity`, `notifications`. RLS: members-of-project reads/writes; every public-schema table gets explicit GRANTs.
- **Storage:** private bucket `project-files` with membership-scoped RLS on `storage.objects`.
- **AI:** shared `createLovableAiGatewayProvider` in `src/lib/ai-gateway.server.ts`; server fns in `src/lib/ai.functions.ts`; `useChat` for chat surfaces via `/api/chat`.
- **State:** Zustand for UI-only state (sidebar collapse, command palette). TanStack Query for server state.
- **Forms:** React Hook Form + Zod.
- **DnD:** `@dnd-kit/core` + `@dnd-kit/sortable`.
- **Charts:** Recharts.
- **Animation:** `motion/react` (Framer Motion v11).
- **Folder layout:**
  ```
  src/
    routes/                # file-based routes
    components/
      ui/                  # shadcn primitives
      landing/             # landing sections
      app/                 # shell, sidebar, topbar
      kanban/ meetings/ repo/ ai/ analytics/
    lib/
      mock/                # typed fixtures
      ai.functions.ts      # AI server fns
      ai-gateway.server.ts
      *.functions.ts       # domain server fns
    hooks/  stores/  styles.css
  ```

## Delivery cadence

Each phase ships as one turn (or two for the heaviest — Kanban, AI, Analytics). After Phase 1 I'll pause briefly so you can confirm the visual direction on the landing page before I build every downstream screen on top of it.

Approve to start Phase 0+1 (design system + landing + Cloud enablement).

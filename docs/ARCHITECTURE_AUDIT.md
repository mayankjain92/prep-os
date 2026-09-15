# CODEBASE ARCHITECTURE AUDIT

> **Audit Date:** September 2026  
> **Repository:** `prep-os` (Monorepo: `@prep-os/web`, `@prep-os/api`, `@prep-os/shared`)  
> **Status:** Analysis-Only Pass completed. No functional code modified.

---

## 1. Executive Summary

| Category | Score | Summary Assessment |
| :--- | :---: | :--- |
| **Architecture** | **7.5 / 10** | Clean monorepo structure with clear boundaries between client, server, and shared schemas. |
| **Modularity** | **7.0 / 10** | Mostly modular, but suffers from duplicate validation and tight coupling between pages and inline modals. |
| **Completeness** | **8.0 / 10** | Core user flows (Auth, DSA NeetCode 150, Doubts, Projects, Roadmaps) are working end-to-end, but legacy documentation claimed phantom features (e.g. MongoDB theory aggregation pipelines) that do not exist. |
| **Maintainability** | **7.5 / 10** | Good overall; TypeScript and Zod types are well-shared across the workspace. |
| **Simplicity** | **8.0 / 10** | Avoids enterprise over-engineering (no unnecessary repositories, factories, or DI containers). Uses straightforward async functions. |
| **Code Cleanliness** | **7.0 / 10** | Dead npm dependencies exist in `web`, build artifacts lingering in `dist`, and identical UI duplicated between modal and page views. |

### Overall Verdict
> *"Overall, this is a clean, modern, and cohesive full-stack architecture that avoids enterprise bloat. However, there are 4 key areas requiring cleanup: documentation that was out of sync with reality, duplicate validation runs on every API call, dead dependencies in the frontend, and redundant UI screens (dual Profile modal vs. Profile page)."*

---

## 2. Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND: apps/web (Next.js 16)                       │
│                                                                                  │
│  Pages / Routes:                                                                 │
│  ├── / (Landing page)                                                            │
│  ├── /login & /register (Auth forms + Google GSI SDK)                            │
│  └── /dashboard/* (Protected layout via client-side AuthContext guard)           │
│      ├── /dashboard (Unified overview: stat pills, active doubts, roadmap stats) │
│      ├── /dashboard/dsa (Tabs: Flowchart, NeetCode 150 Tracker, Doubt Section)   │
│      ├── /dashboard/theory (CS Core roadmap & checklist)                         │
│      ├── /dashboard/projects (Project CRUD & public GitHub repo sync)            │
│      └── /dashboard/profile (Student profile, streak heatmap & share card)       │
│                                                                                  │
│  State & Transport:                                                              │
│  ├── React Query (TanStack Query v5): Caching & mutations for server data        │
│  ├── AuthContext: React Context + localStorage (JWT + User state)                │
│  └── apiFetch (@/lib/api-client): Injects 'Authorization: Bearer <token>'        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ JSON over HTTP (CORS enabled)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             SHARED: packages/shared                              │
│  Exported Zod Schemas & TypeScript DTOs:                                         │
│  ├── auth.schema.ts      (Register, Login)                                       │
│  ├── doubt.schema.ts     (CreateDoubt, UpdateDoubt)                              │
│  ├── project.schema.ts   (CreateProject, UpdateProject)                          │
│  └── roadmap.schema.ts   (UpdateRoadmapProgress)                                 │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Shared Validation & Types
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND: apps/api (Express ESM)                      │
│                                                                                  │
│  Entry Point: index.ts                                                           │
│  ├── Global Middleware: cors(), express.json()                                   │
│  ├── Health Route: GET /health, GET /api/health                                  │
│  ├── Services: keepAliveService (Render self-ping)                               │
│  │                                                                               │
│  ├── Public Route Layer:                                                         │
│  │   └── /api/auth (register, login, oauth, check-username)                      │
│  │                                                                               │
│  ├── Authentication Middleware: authMiddleware (verifies JWT, sets req.userId)   │
│  │                                                                               │
│  └── Protected Route Layer:                                                      │
│      ├── /api/auth/profile, /api/auth/set-username                               │
│      ├── /api/problems (leetcode-profile, sync, neetcode-progress)               │
│      ├── /api/projects (CRUD operations scoped to req.userId)                    │
│      ├── /api/doubts (CRUD operations scoped to req.userId)                      │
│      └── /api/roadmaps/:key (Key-value progress map scoped to req.userId)        │
└───────────────────────┬──────────────────────────────────┬───────────────────────┘
                        │                                  │
                        ▼                                  ▼
┌────────────────────────────────────────┐  ┌──────────────────────────────────────┐
│           DATABASE: MongoDB            │  │          CACHE: Redis                │
│  Collections:                          │  │  Pattern: Cache-Aside (1 hr TTL)     │
│  ├── users (Auth, LeetCode stats,      │  │  Key: leetcode:{userId}:{username}   │
│  │          streaks, NeetCode progress)│  │                                      │
│  ├── projects (User project logs)      │  │  External API Fallback:              │
│  ├── doubts (User technical doubts)    │  │  ├── Primary: leetcode.com/graphql   │
│  └── roadmapprogresses (Node statuses) │  │  └── Secondary: alfa-leetcode-api    │
└────────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 3. Feature Matrix

| Feature | Frontend Implementation | Backend Implementation | Database Model | End-to-End Status | Classification |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Email/Password Auth** | `app/login`, `app/register` | `authRoutes.ts`, `authController.ts` | `User` | Fully connected | **[COMPLETE]** |
| **Google OAuth** | `SocialAuthButtons.tsx` (GSI SDK) | `oauthLogin` via `oauthService.ts` | `User` | Fully connected | **[COMPLETE]** |
| **Google Username Onboarding** | `SetUsernameModal.tsx` | `POST /api/auth/set-username` | `User` | Fully connected | **[COMPLETE]** |
| **Username Availability Check** | `RegisterPage` (debounced check) | `GET /api/auth/check-username` | `User` | Fully connected | **[COMPLETE]** |
| **Daily Streak Tracking** | `LoginHeatmap.tsx`, `DashboardLayout` | `streakService.ts` | `User` (`loginDates`, `currentStreak`) | Fully connected | **[COMPLETE]** |
| **LeetCode Sync & Redis Cache** | `dsa/page.tsx`, `useSyncLeetCode` | `problemController.ts`, `leetcodeService.ts` | `User.leetcodeProfile` + Redis | Fully connected | **[COMPLETE]** |
| **NeetCode 150 Tracker** | `Neetcode150Section.tsx` | `PUT /api/problems/neetcode-progress` | `User.neetcodeProgress` | Fully connected | **[COMPLETE]** |
| **DSA Flowchart Progress** | `RoadmapFlowChart.tsx`, `dsa/page.tsx` | `roadmapController.ts` | `RoadmapProgress` (`prep_os_dsa_roadmap_v2`) | Fully connected | **[COMPLETE]** |
| **CS Theory Roadmaps** | `theory/page.tsx` | `roadmapController.ts` | `RoadmapProgress` (`prep_os_theory_roadmap`) | Fully connected | **[COMPLETE]** |
| **Doubt Tracking CRUD** | `DoubtSection.tsx` | `doubtController.ts` | `Doubt` | Fully connected | **[COMPLETE]** |
| **Project CRUD** | `projects/page.tsx` | `projectController.ts` | `Project` | Fully connected | **[COMPLETE]** |
| **Public GitHub Repo Import** | `GitHubSyncModal.tsx` | Client fetch to `api.github.com` | `Project` (via project creation) | Fully connected | **[COMPLETE]** |
| **Shareable Placement Card** | `ShareableProgressCard.tsx` | Pure client-side canvas generation | Reads from `useAuth` & `useRoadmapProgress` | Fully connected | **[COMPLETE]** |
| **Theme Toggling** | `ThemeProvider.tsx`, `ThemeToggle.tsx` | None (Client `localStorage`) | None | Fully connected | **[COMPLETE]** |
| **GitHub OAuth Login** | Dead code | Dead code (Purged during previous step) | None | Non-existent | **[DEAD/UNREACHABLE]** |
| **MongoDB Theory Aggregation** | Mentioned in `ARCHITECTURE.md` | Non-existent (`/api/theory/stats` does not exist) | Non-existent (`TheoryTopic` model does not exist) | Disconnected | **[MOCKED / PHANTOM DOC]** |

---

## 4. Dead / Orphaned Code

### High Confidence
* **`auth.stub.js`** (`apps/api/dist/middleware/auth.stub.js`): Stale compiled artifact from an obsolete mock authentication middleware.
* **`solvedProblems` calculation** (`apps/api/src/services/leetcodeService.ts` lines 92–107, 126–140): Extracted from LeetCode GraphQL and Alfa API, cached in Redis, but `problemController.ts` discards it and only persists `.profile`.
* **Dual Profile Views** (`apps/web/src/components/profile/ProfileModal.tsx` vs `apps/web/src/app/dashboard/profile/page.tsx`): Identical code (~400 lines each) rendering `LoginHeatmap` and `ShareableProgressCard`.

### Medium Confidence
* **`lint-output.txt`** (`/lint-output.txt` root): Stale log file (35 KB) of previous lint errors committed to repo root.
* **Unused `updateMutation`** (`apps/web/src/app/dashboard/projects/page.tsx` line 30): Defined via `useUpdateProject()`, but inline tag edits directly invoke `createMutation` or local state.

---

## 5. Unused Dependencies

### `apps/web/package.json`
* **`@base-ui/react`** (`^1.6.0`): **Zero imports** anywhere in `apps/web`.
* **`recharts`** (`^3.10.1`): **Zero imports** anywhere in `apps/web` (Heatmap and stat bars are custom CSS/SVG).
* **`tw-animate-css`** (`^1.4.0`): **Zero imports** in JS, TS, or `globals.css`.
* **`shadcn`** (`^4.13.1`): Placed in production `dependencies` instead of `devDependencies`.

### `apps/api/package.json`
* **`nodemon`** (`^3.1.14`): In `devDependencies`, but `scripts.dev` uses `tsx watch src/index.ts`.

---

## 6. Architectural Problems

1. **Double Validation (HIGH)**: Express routes run `validate(schema)`, but controllers re-run `schema.safeParse(req.body)` immediately after.
2. **Inconsistent Config Access (MEDIUM)**: `env.ts` was introduced, but `db.ts` and `redisClient.ts` still read raw `process.env`.
3. **Inconsistent Foreign Key Types (MEDIUM)**: `Project.userId` is `String`, whereas `Doubt.userId` and `RoadmapProgress.userId` are `Schema.Types.ObjectId`.

---

## 7. Duplication

* **Dual Profile Rendering (UI)**: `ProfileModal.tsx` and `app/dashboard/profile/page.tsx` render the exact same heatmap and shareable progress card.
* **Double Validation (Backend)**: `safeParse(req.body)` is executed twice on every single mutation.

---

## 8. Incomplete Features & Phantom Specs

* **The "MongoDB Aggregation Pipeline" Myth**: Legacy `ARCHITECTURE.md` and `system_design_report.md` documented a complex `$group` and `$project` aggregation pipeline running on `/api/theory/stats` with a `TheoryTopic` collection. In reality, theory progress is tracked via the unified `RoadmapProgress` key-value model (`prep_os_theory_roadmap`), and stats are computed purely on the client inside `TheoryDashboardPage`.

---

## 9. Broken / Suspicious Data Flows

* **Unsaved `solvedProblems` in LeetCode Sync**: Up to 100 recent solved problems are fetched from LeetCode and cached in Redis, but `problemController.ts` discards them and only saves profile summary stats.
* **Landing Page Misrepresentation**: In `apps/web/src/app/page.tsx` (line 406), the footer still advertises *"Google & GitHub Login"*, even though GitHub auth was removed.

---

## 10. Security Issues

1. **Wide-Open CORS (`apps/api/src/index.ts:15`)**: `app.use(cors())` allows any origin.
2. **Storage of JWT in Browser `localStorage`**: Stored in `localStorage.setItem("token", ...)`, vulnerable to XSS exfiltration.
3. **Missing Rate Limiting**: Sensitive auth endpoints have no IP rate limiting.

---

## 11. Configuration Issues

* `db.ts` reads `process.env.MONGO_URI` directly instead of `env.MONGO_URI`.
* `redisClient.ts` reads `process.env.REDIS_URL` directly instead of `env.REDIS_URL`.
* `api.test.ts` line 42 uses a hardcoded fallback secret `"prep-os-super-secret-key-12345"`.

---

## 12. TypeScript Issues

* Excessive `(user._id as any)` casting in controllers.
* `z.input` vs `z.infer` in `project.schema.ts`.

---

## 13. Build / Test / Lint Results

* TypeScript types resolve across all 3 workspace projects (`packages/shared`, `apps/api`, `apps/web`).
* Unit tests in `apps/api/src/__tests__/api.test.ts` pass with mocked data.
* ESLint warnings in `apps/web`: Unescaped HTML entities in `projects/page.tsx` and `login/page.tsx`; unused icon imports in dashboard pages.

---

## 14. Recommended Cleanup Plan

* **P0 — Must Fix (Security & Integrity)**:
  1. Restrict CORS in `apps/api/src/index.ts`.
  2. Harmonize environment config access in `db.ts` and `redisClient.ts`.
  3. Synchronize `ARCHITECTURE.md` and `system_design_report.md` with the actual codebase.
* **P1 — Should Fix (Cleanliness & Maintainability)**:
  4. Remove double validation boilerplate from controllers.
  5. Uninstall dead dependencies (`@base-ui/react`, `recharts`, `tw-animate-css`).
  6. Consolidate Profile views into the dedicated `/dashboard/profile` route.
  7. Correct landing page footer copy.
* **P2 — Nice to Have (Polish)**:
  8. Expose or drop `solvedProblems` in `leetcodeService.ts`.
  9. Standardize Mongoose `userId` types across all models.

---

## 15. What NOT To Change

1. **Do NOT introduce Repository / Service classes**: Plain async TypeScript functions are clean, readable, and performant.
2. **Do NOT replace React Query with Redux / Zustand**: TanStack Query handles server cache and mutations cleanly.
3. **Do NOT overcomplicate Roadmap storage**: The `RoadmapProgress` key-value sparse map model is flexible and simple.

---

## 16. Final Verdict (13 Questions)

1. **Is the architecture simple enough?** Yes.
2. **Is it modular enough?** Yes.
3. **Is the codebase fully connected end-to-end?** Yes.
4. **Are there dead/orphan components?** Yes (`ProfileModal.tsx` duplicates `/dashboard/profile`).
5. **Are there dead/orphan functions?** Yes (`solvedProblems` loop in `leetcodeService.ts`).
6. **Are there unused API routes?** No.
7. **Are there unused database models?** No.
8. **Are there unused dependencies?** Yes (`@base-ui/react`, `recharts`, `tw-animate-css`).
9. **Are there unnecessary abstractions?** No.
10. **Is anything over-engineered?** Yes (redundant validation in controllers).
11. **Is anything under-engineered?** Yes (wide-open CORS, tokens in `localStorage`).
12. **Could a junior developer understand this architecture?** Yes.
13. **Could I confidently explain this architecture in an interview?** Yes.

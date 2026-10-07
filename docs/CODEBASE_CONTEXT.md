# Prep OS — Codebase Architecture & Context Guide

> **Instant Context Document**  
> *Purpose:* Provides a dense, token-efficient reference for the entire Prep OS monorepo. Use this guide to understand data flows, component relationships, and key architectural decisions for interviews and refactoring.

---

## 1. Monorepo Overview

The workspace uses `pnpm` workspaces with three core packages:

```text
prep-os/
├── apps/
│   ├── api/          # Express 5 ESM backend (Node.js + TypeScript)
│   └── web/          # Next.js 16 App Router frontend (React 19 + Tailwind v4)
├── packages/
│   └── shared/       # Shared TypeScript types, Zod schemas, roadmap constants
```

### Dependency Flow
```text
[apps/web]  ───┐
               ├─► [@prep-os/shared] (Contracts, Types, Zod Schemas)
[apps/api]  ───┘
```

---

## 2. Shared Workspace (`packages/shared`)

Central contract repository. Eliminates API contract drift between frontend and backend.

* **Validation Schemas (`src/schemas/`)**:
  * `auth.schema.ts`: `registerSchema`, `loginSchema`
  * `project.schema.ts`: `createProjectSchema`, `updateProjectSchema`
  * `doubt.schema.ts`: `createDoubtSchema`, `updateDoubtSchema`
  * `roadmap.schema.ts`: `updateRoadmapProgressSchema`

---

## 3. Backend Architecture (`apps/api`)

### Tech Stack
* **Runtime**: Node.js (ESM `"type": "module"`)
* **Framework**: Express 5
* **Language**: TypeScript 5
* **Database**: MongoDB via Mongoose 9
* **Caching**: Redis (via `ioredis`) for LeetCode profile caching
* **Auth**: HttpOnly cookie-based session with JWT (7-day expiry), bcryptjs, Google OAuth (`google-auth-library`), lightweight CSRF defense

### Configuration & Infrastructure (`src/config/`)
* `env.ts`: Central Zod-validated environment schema (`MONGO_URI`, `REDIS_URL`, `JWT_SECRET`, `FRONTEND_URL`, etc.).
* `db.ts`: Mongoose database connection manager with idempotent state handling.
* `redisClient.ts`: `ioredis` client singleton with retry backoff and error listeners.

### Layered Structure
```text
Request ──► Middleware (CORS, CookieParser, CSRF, Auth, Validation) ──► Controller ──► Service / Model ──► MongoDB / Redis
```

### Models (`src/models/`)
| Model | Key Fields | Purpose |
|---|---|---|
| `User` | `email`, `username`, `passwordHash`, `authProvider`, `providerId`, `leetcodeProfile`, `neetcodeProgress`, `loginDates`, `currentStreak` | User account, streaks, credentials |
| `Project` | `userId`, `name`, `techStack`, `customTags`, `status`, `repoUrl`, `notes` | Portfolio project planner |
| `Doubt` | `userId`, `title`, `type`, `topic`, `url`, `priority`, `notes`, `resolved` | Doubt & blocker tracking |
| `RoadmapProgress`| `userId`, `roadmapKey`, `nodeStatuses` (Map<nodeId, status>) | Visual roadmap node completion |

### Route & Controller Registry
| Endpoint | Method | Auth? | Controller | Description |
|---|---|:---:|---|---|
| `/api/auth/register` | POST | ❌ | `register` | User signup, sets HttpOnly cookie |
| `/api/auth/login` | POST | ❌ | `login` | User login (email or username), sets HttpOnly cookie |
| `/api/auth/oauth` | POST | ❌ | `oauthLogin` | Verified Google OAuth login, sets HttpOnly cookie |
| `/api/auth/logout` | POST | ❌ | `logout` | Clears HttpOnly cookie |
| `/api/auth/check-username` | GET | ❌ | `checkUsername` | Real-time handle availability check |
| `/api/auth/set-username` | POST | 🔒 | `setUsername` | Set handle for OAuth users |
| `/api/auth/profile` | GET | 🔒 | `getProfile` | User profile, streaks & overview stats |
| `/api/problems/leetcode-profile` | GET | 🔒 | `getLeetCodeProfile` | Cached LeetCode profile stats |
| `/api/problems/sync` | POST | 🔒 | `syncLeetCodeProblems` | Sync LeetCode user profile data |
| `/api/problems/neetcode-progress` | PUT | 🔒 | `updateNeetcodeProgress` | NeetCode 150 checklist state |
| `/api/projects` | GET/POST | 🔒 | `listProjects`, `createProject` | Project tracking |
| `/api/projects/:id` | PATCH/DELETE | 🔒 | `updateProject`, `deleteProject` | Single project mutation |
| `/api/doubts` | GET/POST | 🔒 | `getDoubts`, `createDoubt` | Doubt tracking |
| `/api/doubts/:id` | PATCH/DELETE | 🔒 | `updateDoubt`, `deleteDoubt` | Single doubt mutation |
| `/api/roadmaps/:key` | GET/PUT | 🔒 | `getRoadmapProgress`, `updateRoadmapProgress` | Flowchart roadmap progress |
| `/api/agent/chat` | POST | 🔒 | `chatWithAgent` | Multi-turn ReAct agent conversation with tool execution |

### Agent Services (`src/services/agent/`)
* `agentService.ts`: Core ReAct loop powered by `@google/genai` (Gemini 2.5 Flash Lite) with multi-turn loop (`MAX_TURNS = 5`), dynamic tool routing, and gap-analysis system prompt.
* `tools.ts`: Grounded tool declarations and executors:
  * `getUserProgress`: Audits streaks, live LeetCode stats, NeetCode solved IDs, completed roadmap topics, and active doubts (auto-triggers live sync).
  * `getLeetCodeStats`: On-demand problem counts and global ranking with live sync.
  * `syncLeetCode`: Dedicated on-demand platform sync tool.
  * `createDoubt`: State mutation tool logging doubts directly to MongoDB.

---

## 4. Frontend Architecture (`apps/web`)

### Tech Stack
* **Framework**: Next.js 16 (App Router)
* **Library**: React 19
* **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
* **Data Fetching**: `@tanstack/react-query`
* **Components**: Radix UI / Base UI / shadcn style primitives
* **Charts**: Recharts

### Key App Routes (`src/app/`)
* `/`: Marketing / Landing page
* `/login` & `/register`: Authentication flows
* `/dashboard`: Overview metrics (DSA count, Theory percentage, Active doubts)
* `/dashboard/dsa`: Interactive DSA checklist, NeetCode 150 table & LeetCode sync
* `/dashboard/doubts`: Dedicated revision target queue with blurred backdrop logging modal
* `/dashboard/theory`: 5-subject CS theory progress cards & visual flowcharts (OS, DBMS, CN, OOP, Aptitude)
* `/dashboard/projects`: Project ideation, portfolio tracker & GitHub sync modal
* `/dashboard/profile`: Heatmap streak calendar, handle claiming, shareable card generator

### Feature-Sliced Structure (`src/features/`)
* `features/agent/`: AI Copilot API client (`api.ts`) & Expandable IDE reader drawer (`components/AgentCopilot.tsx`).
* `features/doubts/`: Doubts data layer (`api.ts`, `useDoubts.ts`) & full revision UI (`components/DoubtSection.tsx`).
* `features/dsa/`: Problems API (`api.ts`, `useProblems.ts`) & NeetCode 150 component (`components/Neetcode150Section.tsx`).
* `features/profile/`: Profile UI slices (`components/ProfileDropdown.tsx`, `components/SetUsernameModal.tsx`, `components/LoginHeatmap.tsx`, `components/ShareableProgressCard.tsx`).
* `features/projects/`: Project planner API & GitHub sync modal (`components/GitHubSyncModal.tsx`).
* `features/roadmap/`: FlowChart & Tree components, hooks, and decoupled types (`types.ts`).
* `features/auth/`: Global auth context & token management (`AuthContext.tsx`).

---

## 5. Major "AI Code Smells" & Improvement Backlog

### Backend (`apps/api`)
1. **Database Writes on `GET` Requests (Critical Anti-Pattern)**:
   * `listTheoryTopics` and `listProblems` auto-insert standard roadmap documents on simple `GET` requests. In REST, `GET` requests must be strictly read-only and idempotent.
2. **Inconsistent Validation Strategy**:
   * Zod schemas exist in `@prep-os/shared`, but controllers either do manual `safeParse` boilerplate or bypass validation completely (`req.body` directly passed to `Model.create()`). The clean `validate.ts` middleware is neglected.
3. **TypeScript Escapes (`userId as any`)**:
   * In `problemControllers.ts`, `userId as any` is used because Mongoose types `userId: Types.ObjectId` while `req.userId` is `string`.
4. **Naming Inconsistencies**:
   * `ProblemRoutes.ts` (PascalCase) vs `authRoutes.ts` (camelCase).
   * `problemControllers.ts` (plural) vs `doubtController.ts` (singular).
5. **Dead Code**:
   * `apps/api/src/middleware/auth.stub.ts` is abandoned and unused.
6. **Hardcoded Secrets**:
   * Fallback JWT secret `"prep-os-super-secret-key-12345"` duplicated across files instead of a central configuration module.

### Frontend (`apps/web`)
1. **React 19 / Hooks Violations**:
   * **Synchronous `setState` in `useEffect`**: In `ThemeProvider.tsx`, `AuthContext.tsx`, and `register/page.tsx`, causing cascading re-renders.
   * **Render Impurity**: In `dashboard/page.tsx`, `totalDsaNodes += tot` mutates a local variable across render loops.
2. **Performance (LCP / Core Web Vitals)**:
   * Raw `<img>` elements used in 12+ components instead of Next.js `<Image />`.
3. **Bundle Optimization**:
   * Over 20 unused icon imports from `lucide-react`.

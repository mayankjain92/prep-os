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
* **Auth**: JWT (7-day expiry), bcryptjs, Google OAuth (`google-auth-library`)

### Layered Structure
```text
Request ──► Middleware (Auth, Validation) ──► Controller ──► Service / Model ──► MongoDB / Redis
```

### Models (`src/models/`)
| Model | Key Fields | Purpose |
|---|---|---|
| `User` | `email`, `username`, `passwordHash`, `leetcodeProfile`, `googleId`, `githubId` | User account & auth credentials |
| `TheoryTopic`| `userId`, `subject` (OS/DBMS/CN/Aptitude), `topicName`, `status`, `notes` | Computer science core topics |
| `Project` | `userId`, `title`, `description`, `techStack`, `githubUrl`, `liveUrl`, `status` | Portfolio project planner |
| `Doubt` | `userId`, `title`, `type`, `topic`, `priority`, `resolved` | Doubt & blocker tracking |
| `RoadmapProgress`| `userId`, `roadmapKey`, `nodeStatuses` (Map<nodeId, status>) | Visual roadmap node completion |

### Route & Controller Registry
| Endpoint | Method | Auth? | Controller | Description |
|---|---|:---:|---|---|
| `/api/auth/register` | POST | ❌ | `register` | User signup |
| `/api/auth/login` | POST | ❌ | `login` | User login |
| `/api/auth/oauth` | POST | ❌ | `oauthLogin` | Google / GitHub OAuth |
| `/api/auth/profile` | GET |  | `getProfile` | Current user profile |
| `/api/problems/leetcode-profile` | GET |  | `getLeetCodeProfile` | Cached LeetCode profile stats |
| `/api/problems/sync` | POST |  | `syncLeetCodeProblems` | Sync LeetCode user profile data |
| `/api/problems/neetcode-progress` | PUT |  | `updateNeetcodeProgress` | NeetCode 150 checklist state |
| `/api/projects` | GET/POST |  | `listProjects`, `createProject` | Project idea tracking |
| `/api/projects/:id` | PATCH/DELETE |  | `updateProject`, `deleteProject` | Single project mutation |
| `/api/doubts` | GET/POST |  | `getDoubts`, `createDoubt` | Doubt tracking |
| `/api/doubts/:id` | PATCH/DELETE |  | `updateDoubt`, `deleteDoubt` | Single doubt mutation |
| `/api/roadmaps/:key` | GET/PUT |  | `getRoadmapProgress`, `updateRoadmapProgress` | Flowchart roadmap progress |

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
* `/dashboard/dsa`: Interactive DSA table with difficulty filters & LeetCode sync
* `/dashboard/theory`: 4-subject CS theory progress cards & checklists
* `/dashboard/projects`: Project ideation & portfolio tracker
* `/dashboard/profile`: Heatmap streak calendar, shareable card generator

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

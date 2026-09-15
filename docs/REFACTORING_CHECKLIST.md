# Prep OS — Master Refactoring & Code Quality Checklist

> **Purpose:** A structured, token-efficient roadmap for cleaning, optimizing, and securing the Prep OS monorepo. Every issue is documented with its exact context, root cause, and recommended solution.

---

## Progress Overview

- [x] **Phase 1: Backend Foundation & Server Lifecycle**
- [x] **Phase 2: Critical Bug Fixes & Schema Integrity**
- [x] **Phase 3: Route, Controller & Validation Refactoring**
- [x] **Phase 4: Frontend React 19 & Next.js Performance Cleanliness**
- [x] **Phase 5: Architecture Audit Fixes & Codebase Hardening** (100% Complete: P0, P1, P2)

---

## Phase 1: Backend Foundation & Server Lifecycle

### [x] BE-01: Modularize Database Connection (`db.ts`)
- **File:** `apps/api/src/config/db.ts`
- **Context:** Previously contained redundant `dotenv.config()` and called `process.exit(1)` inside `catch`, causing dead code in caller.
- **Resolution:** Made `connectDB` idempotent (`readyState === 1` guard), removed side effects, and let errors bubble up.

### [x] BE-02: Express Server Bootstrap & Error Handling (`index.ts`)
- **File:** `apps/api/src/index.ts`, `apps/api/src/middleware/error.middleware.ts`
- **Context:** Inline error handler used `err: any`. Server bootstrap used `.then().catch()`. No 404 handler for unmatched routes.
- **Resolution:** Extracted typed `errorHandler` into `error.middleware.ts`, added 404 JSON catch-all, and refactored startup into `async function startServer()`.

### [x] BE-03: Dead Middleware Deletion (`auth.stub.ts`)
- **File:** `apps/api/src/middleware/auth.stub.ts`
- **Context:** Temporary hardcoded mock auth middleware left over from early prototyping.
- **Resolution:** Deleted.

### [x] BE-04: Centralized Environment & Secret Management
- **File:** `apps/api/src/config/env.ts`, `apps/api/src/middleware/authMiddleware.ts`, `apps/api/src/controllers/authController.ts`
- **Context:** Fallback secret `"prep-os-super-secret-key-12345"` duplicated across files.
- **Resolution:** Centralized configuration in `src/config/env.ts` and updated consumers.

---

## Phase 2: Critical Bug Fixes & Schema Integrity

### [x] BE-05: Fix Theory Completion Count in User Profile
- **File:** `apps/api/src/controllers/authController.ts`
- **Context:** Previously queried a legacy `TopicStatus` model returning 0.
- **Resolution:** Switched query to iterate `RoadmapProgress` where `roadmapKey === "prep_os_theory_roadmap"`.

### [x] BE-06: Delete Obsolete `TopicStatus.ts` Model
- **File:** `apps/api/src/models/TopicStatus.ts`
- **Context:** Ghost model replaced by `RoadmapProgress` and `TheoryTopic`.
- **Resolution:** Deleted.

### [x] BE-07: Eliminate `userId as any` TypeScript Bypasses
- **File:** `apps/api/src/models/Problem.ts`, `apps/api/src/models/Doubt.ts`, `apps/api/src/controllers/problemControllers.ts`
- **Context:** `userId as any` was used due to mismatch between string JWT ID and Mongoose ObjectId.
- **Resolution:** Added union type `userId: Types.ObjectId | string` in interfaces and removed `as any` from controllers.

---

## Phase 3: Route, Controller & Validation Refactoring

### [x] BE-08: Standardize Route & Controller Naming Conventions
- **Files:**
  - `apps/api/src/routes/ProblemRoutes.ts` $\to$ `problemRoutes.ts`
  - `apps/api/src/controllers/problemControllers.ts` $\to$ `problemController.ts`
  - `apps/api/src/controllers/projectControllers.ts` $\to$ `projectController.ts`
- **Context:** Inconsistent pluralization (`projectControllers` vs `authController`) and casing (`ProblemRoutes.ts` vs `authRoutes.ts`). Linux Docker/cloud deployments crash on case mismatches.
- **Resolution:** Standardized all controllers to singular `[name]Controller.ts` and routes to camelCase `[name]Routes.ts`.

### [x] BE-09: Prune Dead Endpoints & Orphaned Client Components
- **Files:**
  - `apps/api/src/routes/problemRoutes.ts`, `apps/api/src/controllers/problemController.ts`
  - `apps/api/src/routes/projectRoutes.ts`, `apps/api/src/controllers/projectController.ts`
  - `apps/web/src/features/theory/*`
  - `apps/web/src/features/dsa/components/ProblemTable.tsx`, `ProblemFormDialog.tsx`
  - `apps/web/src/features/dsa/useProblems.ts`, `apps/web/src/features/dsa/api.ts`
- **Context:** `getProblem` and `getProject` (`GET /:id`) were never called by frontend clients (all collections are loaded into React Query cache). In addition, legacy problem CRUD components and the obsolete `features/theory` directory (superseded by `RoadmapFlowChart` + `RoadmapProgress`) were lingering as dead bundle clutter.
- **Resolution:** Removed unused `getProblem` and `getProject` routes/handlers, deleted obsolete client components, and cleaned unused mutation hooks while preserving active LeetCode sync, doubts, and roadmap functionality.

### [x] BE-10: End-to-End Request Validation Middleware
- **Files:** `apps/api/src/routes/*.ts`, `apps/api/src/controllers/*.ts`
- **Context:** Shared schemas (`createProjectSchema`, `updateProjectSchema`, `createDoubtSchema`, `updateDoubtSchema`, `updateRoadmapProgressSchema`, `registerSchema`, `loginSchema`) exist in `@prep-os/shared`, but routes previously did not use `validate.ts`.
- **Resolution:** Attached `validate(schema)` middleware directly to `authRoutes.ts`, `doubtRoutes.ts`, `projectRoutes.ts`, and `roadmapRoutes.ts`; removed manual parsing boilerplate from controllers.

### [x] BE-11: Decouple Auto-Seeding / Prune Problem Collection & Endpoint
- **Files:** `apps/api/src/controllers/problemController.ts`, `apps/api/src/models/Problem.ts`, `apps/api/src/routes/problemRoutes.ts`
- **Context:** `listProblems` and manual problem CRUD were legacy write-only artifacts from an old spreadsheet-style problem table. `syncLeetCodeProblems` was running an unnecessary 100-iteration MongoDB write loop into this unused `Problem` collection.
- **Resolution:** Pruned `listProblems` and manual problem CRUD. Deleted the `Problem.ts` model. Streamlined `syncLeetCodeProblems` to directly update `User.leetcodeProfile` with Redis cache-aside, preserving 100% of real-time user stats and NeetCode 150 checklist functionality without database bloat.

---

## Phase 4: Frontend (Next.js 16 & React 19) Cleanliness

### [x] FE-01: Fix Cascading Renders (`setState` in `useEffect`)
- **Files:**
  - `apps/web/src/components/ThemeProvider.tsx`
  - `apps/web/src/features/auth/AuthContext.tsx`
  - `apps/web/src/app/register/page.tsx`
  - `apps/web/src/app/dashboard/dsa/page.tsx`
- **Context:** Synchronously calling `setState` inside an effect causes immediate re-renders, violating React 19 compilation rules and hurting responsiveness.
- **Resolution:** Replaced effect `setState` calls with lazy state initializers `useState(() => ...)`, derived client validation synchronously with `useMemo`, and removed unnecessary effects.

### [x] FE-02: Fix Render-Phase Mutation Anti-Pattern
- **Files:** `apps/web/src/app/dashboard/page.tsx`, `apps/web/src/app/dashboard/dsa/page.tsx`
- **Context:** `totalDsaNodes += tot` and `totalAll += tot` mutated local variables during component rendering, causing inconsistent state calculations.
- **Resolution:** Calculated totals using `useMemo` with pure functional reductions (`array.reduce`).

### [x] FE-03: Image Optimization & Performance (LCP)
- **Files:** `apps/web/src/components/shared/Logo.tsx`, `apps/web/src/app/dashboard/layout.tsx`, `loading.tsx`, `profile/page.tsx`, `ProfileDropdown.tsx`, `dsa/page.tsx`, `next.config.ts`
- **Context:** Raw HTML `<img>` elements without explicit dimensions degraded Largest Contentful Paint (LCP) and triggered ESLint warnings.
- **Resolution:** Migrated all logo and avatar references to Next.js `<Image />` with explicit dimensions and priority loading; added `remotePatterns` for external avatars in `next.config.ts`.

### [x] FE-04: Bundle Clutter & Unused Lucide Icons
- **Files:** `apps/web/src/app/page.tsx`, `apps/web/src/app/dashboard/page.tsx`, `apps/web/src/app/dashboard/dsa/page.tsx`, `projects/page.tsx`
- **Context:** Unused imports and lingering unused icons cluttered the client bundle.
- **Resolution:** Cleaned up unused imports and variables across all frontend pages; verified with `eslint` passing with 0 warnings.

### [x] FE-05: Eliminate `any` Types in Frontend Forms
- **Files:** `apps/web/src/app/login/page.tsx`, `apps/web/src/components/shared/SocialAuthButtons.tsx`, `apps/web/src/features/auth/AuthContext.tsx`, `apps/web/src/app/dashboard/projects/page.tsx`
- **Context:** Catch errors and form/event payloads were typed as `any`.
- **Resolution:** Typed `OAuthInput` with `{ credential: string; provider?: "google" }`, removed `as any` in `SocialAuthButtons.tsx`, typed `proj: ProjectItem` in `projects/page.tsx`, and safely narrowed errors with `err instanceof Error`.

---

## Phase 5: Architecture Audit Fixes & Codebase Hardening

### Priority 0 — Security & System Correctness (Must Fix)

- [x] **AUDIT-P0-01: Restrict CORS in `apps/api/src/index.ts`**
  - **Context:** `app.use(cors())` was previously unconstrained.
  - **Fix:** Restricted origin via `cors({ origin: env.FRONTEND_URL, credentials: true })`.

- [x] **AUDIT-P0-02: Harmonize Environment Variable Access**
  - **Files:** `apps/api/src/config/db.ts`, `apps/api/src/lib/redisClient.ts`
  - **Context:** `db.ts` and `redisClient.ts` directly inspected `process.env` rather than using `env.ts`.
  - **Fix:** Refactored both to import and use `{ env }` from `env.js` directly with full ESM support.

- [x] **AUDIT-P0-03: Reconcile Architecture Documentation with Real Implementation**
  - **Files:** `ARCHITECTURE.md`, `system_design_report.md`
  - **Context:** Legacy docs claimed a non-existent `/api/theory/stats` endpoint and `TheoryTopic` aggregation model.
  - **Fix:** Updated documentation to describe the actual unified `RoadmapProgress` key-value model.

### Priority 1 — Cleanliness & Maintenance (Should Fix)

- [x] **AUDIT-P1-01: Remove Redundant Controller Validation Boilerplate**
  - **Files:** `apps/api/src/controllers/authController.ts`, `doubtController.ts`, `roadmapController.ts`
  - **Context:** Routes already run `validate(schema)` middleware. Controllers previously had redundant (and broken) `safeParse` / `parseResult.success` checks.
  - **Fix:** Removed redundant checks and unused schema imports. Controllers now safely access validated `req.body` directly.

- [x] **AUDIT-P1-02: Uninstall Dead Web Dependencies**
  - **File:** `apps/web/package.json`
  - **Context:** `@base-ui/react`, `recharts`, and `tw-animate-css` were installed in `dependencies` with zero imports in code.
  - **Fix:** Completely uninstalled and cleaned from `package.json` and lockfile.

- [x] **AUDIT-P1-03: Consolidate Duplicate Profile Views**
  - **Files:** `apps/web/src/components/profile/ProfileModal.tsx`, `apps/web/src/app/dashboard/profile/page.tsx`, `ProfileDropdown.tsx`
  - **Context:** `ProfileModal` and `/dashboard/profile` duplicated ~400 lines of identical heatmap and share card UI.
  - **Fix:** Retired and removed `ProfileModal.tsx`. Refactored `ProfileDropdown` and `layout.tsx` to navigate directly to `/dashboard/profile`.

- [x] **AUDIT-P1-04: Correct Landing Page Copy**
  - **File:** `apps/web/src/app/page.tsx`
  - **Context:** Architecture feature pill mentioned "Google & GitHub Login" when GitHub authentication was removed.
  - **Fix:** Updated copy to "Google & Email Login".

### Priority 2 — Optimization & Polish (Nice to Have)

- [x] **AUDIT-P2-01: Expose or Prune `solvedProblems` in `leetcodeService.ts`**
  - **File:** `apps/api/src/services/leetcodeService.ts`
  - **Context:** Dead parsing loops populated an undeclared `solvedProblems` array from LeetCode GraphQL and Alfa fallback, which `problemController.ts` never stored.
  - **Fix:** Pruned dead submission parsing loops, deleted unused `LeetCodeSolvedProblem` interface, and simplified return to `{ profile: profileStats }`.

- [x] **AUDIT-P2-02: Standardize Foreign Key Types Across Mongoose Models**
  - **Files:** `apps/api/src/models/Project.ts`, `Doubt.ts`, `RoadmapProgress.ts`
  - **Context:** `Project.userId` was previously typed as `String`, while `Doubt` and `RoadmapProgress` used `Schema.Types.ObjectId`.
  - **Fix:** Standardized `userId` in `Project.ts` to `Schema.Types.ObjectId` with `Types.ObjectId | string` union interface for full compatibility across JWTs and DB operations.

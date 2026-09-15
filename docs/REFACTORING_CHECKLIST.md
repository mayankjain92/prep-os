# Prep OS — Master Refactoring & Code Quality Checklist

> **Purpose:** A structured, token-efficient roadmap for cleaning, optimizing, and securing the Prep OS monorepo. Every issue is documented with its exact context, root cause, and recommended solution.

---

## Progress Overview

- [x] **Phase 1: Backend Foundation & Server Lifecycle** (In Progress)
- [ ] **Phase 2: Critical Bug Fixes & Schema Integrity**
- [ ] **Phase 3: Route, Controller & Validation Refactoring**
- [ ] **Phase 4: Frontend React 19 & Next.js Performance Cleanliness**

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

### [x] BE-05: Fix Theory Completion Count Bug in User Profile
- **File:** `apps/api/src/controllers/authController.ts`
- **Context:** `getProfile` queried the dead `TopicStatus` model with status `"done"`, returning 0 count.
- **Resolution:** Switched query to `TheoryTopic.countDocuments({ userId, status: "completed" })`.

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

### [ ] FE-01: Fix Cascading Renders (`setState` in `useEffect`)
- **Files:**
  - `apps/web/src/components/ThemeProvider.tsx` (Line 21)
  - `apps/web/src/features/auth/AuthContext.tsx` (Line 88)
  - `apps/web/src/app/register/page.tsx` (Line 28)
- **Context:** Synchronously calling `setState` inside an effect causes immediate re-renders, violating React 19 compilation rules and hurting responsiveness.
- **Fix:** Initialize state directly using lazy initializers `useState(() => ...)` or move state updates into user event callbacks.

### [ ] FE-02: Fix Render-Phase Mutation Anti-Pattern
- **File:** `apps/web/src/app/dashboard/page.tsx` (Line 148)
- **Context:** `totalDsaNodes += tot` mutates a local variable during component rendering, leading to incorrect calculations on re-renders.
- **Fix:** Calculate totals using `useMemo` with pure functional reductions (`array.reduce`).

### [ ] FE-03: Image Optimization & Performance (LCP)
- **Files:** 12+ components in `apps/web/src/`
- **Context:** Raw HTML `<img>` elements used for avatars and logos, triggering Next.js ESLint warnings and degrading Largest Contentful Paint (LCP).
- **Fix:** Migrate to Next.js `<Image />` with width/height attributes or configure standard SVG components.

### [ ] FE-04: Bundle Clutter & Unused Lucide Icons
- **Files:** `apps/web/src/app/page.tsx`, `apps/web/src/app/dashboard/page.tsx`, `apps/web/src/app/dashboard/projects/page.tsx`
- **Context:** Over 20 imported icons (`Sparkles`, `Share2`, `TrendingUp`, `MapPin`, etc.) defined but never referenced in JSX.
- **Fix:** Clean up unused imports across all frontend pages.

### [ ] FE-05: Eliminate `any` Types in Frontend Forms
- **Files:** `apps/web/src/app/login/page.tsx`, `apps/web/src/components/shared/SocialAuthButtons.tsx`
- **Context:** Catch errors and event handlers typed as `any`.
- **Fix:** Type errors safely with `error instanceof Error` and use proper event types.

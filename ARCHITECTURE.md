# ARCHITECTURE.md — Prep OS Architecture & Technical Rationale

This document outlines key technical decisions and architectural patterns implemented in Prep OS.

---

## 1. Monorepo & Shared Types
Prep OS is organized using `pnpm` workspaces:
- `apps/web`: Next.js 16 App Router application.
- `apps/api`: Express ESM backend application.
- `packages/shared`: Shared Zod validation schemas (`problem.schema.ts`, `auth.schema.ts`, `theory.schema.ts`, `project.schema.ts`) and TypeScript types used across both frontend and backend.

### Rationale
Exporting TypeScript definitions directly from `@prep-os/shared` eliminates API type drift between the client and server.

---

## 2. Redis Cache-Aside Pattern
For external integrations (e.g. LeetCode profile & problem sync):
- **Read path:** Queries check Redis key `leetcode:${userId}`. On hit, data is served directly. On miss, data is fetched from the external API, cached in Redis with a 1-hour TTL (`EX 3600`), and returned.
- **Write / Sync path:** Triggers `invalidateLeetCodeCache(userId)`, deleting the Redis key immediately so sub-sequent reads receive fresh data.
- **Resilience:** If Redis is down, the system gracefully degrades by logging a warning and fetching from the external service directly without throwing a 500 error.

---

## 3. MongoDB Aggregation Engine
Theory subject completion stats (`/api/theory/stats`) are computed using a single MongoDB aggregation pipeline:
```ts
[
  { $match: { userId } },
  {
    $group: {
      _id: "$subject",
      total: { $sum: 1 },
      completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
    }
  },
  {
    $project: {
      subject: "$_id",
      total: 1,
      completed: 1,
      percentage: { $round: [{ $multiply: [{ $divide: ["$completed", "$total"] }, 100] }, 1] }
    }
  }
]
```

### Rationale
Computing reductions directly on the database engine utilizes index structures, reduces network payload size, and avoids loading full document collections into Node.js application memory.

---

## 4. Multi-Tenant Data Isolation
Every data model (`Problem`, `TheoryTopic`, `Project`) contains a mandatory `userId` field backed by compound index structures (e.g. `{ userId: 1, subject: 1 }`). All controller operations enforce scoping to `req.userId` extracted from validated JWT headers.

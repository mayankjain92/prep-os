# Prep OS — Persistent Storage & MongoDB Architecture Guide

> **Document Purpose:** Complete architectural reference for how persistent data storage, schema design, indexing, and state synchronization are handled across MongoDB and Redis in Prep OS.

---

## 1. Core Storage Principles & Architecture

Prep OS adheres to four foundational data design principles:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Prep OS Storage Principles                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Multi-Tenant Isolation: Every collection is scoped to userId.       │
│ 2. Sparse State Pattern: Only store mutations; static content in code. │
│ 3. Hybrid Document Modeling: Embed frequent 1:1 reads; reference 1:N.  │
│ 4. Cache-Aside Resiliency: Fast external sync with graceful fallback.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Master Collection Registry

| Collection | Model File | Primary Purpose | Storage Pattern | Key Indexes |
|---|---|---|---|---|
| `users` | `User.ts` | Identity, login streaks, NeetCode ticks, LeetCode profile | **Embedded Profile** | `{ email: 1 }` (unique), `{ username: 1 }` (unique) |
| `roadmapprogresses` | `RoadmapProgress.ts` | Visual flowchart node completion (DSA & CS Theory) | **Sparse Key-Value Map** | `{ userId: 1, roadmapKey: 1 }` (unique) |
| `doubts` | `Doubt.ts` | Prioritized revision queue & stuck questions | **Normalized Entity** | `{ userId: 1, resolved: 1, createdAt: -1 }` |
| `projects` | `Project.ts` | Portfolio project ideation & progress | **Normalized Entity** | `{ userId: 1, createdAt: -1 }` |
| *Redis (In-Memory)* | `redisClient.ts` | 1-hour cache for external LeetCode API responses | **Cache-Aside Key-Value** | Key: `leetcode:${username}`, TTL: 3600s |

---

## 3. Feature-by-Feature Storage Deep-Dive

### Feature 1: User Identity, Streaks & Activity (`users` collection)
* **Model:** `apps/api/src/models/User.ts`
* **Access Controller:** `apps/api/src/controllers/authController.ts`

```text
User Document
├── Identity: username, email, passwordHash, authProvider, providerId
├── Streaks: currentStreak, longestStreak, lastLoginDate, loginDates (Array)
├── NeetCode Progress: { solved: string[], starred: string[] } (Embedded)
└── LeetCode Cache: { totalSolved, easy, medium, hard, ranking } (Embedded)
```

#### Storage Rationale: The Embedded Profile Pattern
Instead of splitting streaks and user settings into 3 different tables with expensive SQL-style joins, MongoDB allows us to embed lightweight sub-documents directly on the `User`. 
* When a user logs in, **a single query** (`User.findById(userId)`) returns their authentication state, streak calendar, NeetCode checklist, and LeetCode profile in **one network round-trip (< 5ms)**.

#### Streak Calculation Algorithm:
* `lastLoginDate`: Stores `YYYY-MM-DD`.
* When `getProfile` runs, it compares today's date against `lastLoginDate`:
  * If `difference === 1 day` $\to$ `currentStreak++`
  * If `difference > 1 day` $\to$ Reset `currentStreak = 1`
  * Updates `loginDates.push(today)` for the frontend GitHub-style heatmap.

---

### Feature 2: NeetCode 150 Checklist (`User.neetcodeProgress`)
* **Storage Location:** Embedded inside `User` document: `neetcodeProgress.solved` & `neetcodeProgress.starred`.
* **API Route:** `PUT /api/auth/neetcode-progress`
* **Payload:** `{ solved: ["two-sum", "3sum"], starred: ["trapping-rain-water"] }`

#### Storage Rationale:
The 150 problem titles, categories, and URLs live in a static frontend data file (`data/neetcode150.ts`). 
The database only needs to store **arrays of problem ID strings**:
```json
{
  "_id": "650f1a...",
  "username": "mayank",
  "neetcodeProgress": {
    "solved": ["two-sum", "valid-anagram", "group-anagrams"],
    "starred": ["trapping-rain-water"]
  }
}
```
* **Performance:** Saving an update uses MongoDB's atomic `$set`:
  ```ts
  User.findByIdAndUpdate(userId, {
    $set: {
      "neetcodeProgress.solved": solvedArray,
      "neetcodeProgress.starred": starredArray
    }
  });
  ```
  Fast, atomic, and zero chance of race conditions.

---

### Feature 3: Visual Flowchart Roadmaps (`roadmapprogresses` collection)
* **Model:** `apps/api/src/models/RoadmapProgress.ts`
* **Routes:** `GET /api/roadmaps/:key` & `PUT /api/roadmaps/:key`
* **Powers:**
  * **DSA Roadmap Flowchart** (`roadmapKey: "prep_os_dsa_roadmap_v2"`)
  * **CS Theory Flowchart** (`roadmapKey: "prep_os_theory_roadmap"`)

#### The Sparse State Pattern:
```text
Static Content (in apps/web/src/data/*.ts)
┌────────────────────────────────────────────────────────┐
│ 200+ Nodes: Titles, Subnodes, Descriptions, Arrows     │
└────────────────────────────────────────────────────────┘
                           +
Dynamic State (in MongoDB roadmapprogresses)
┌────────────────────────────────────────────────────────┐
│ Only mutated nodes: { "os-deadlocks": "done" }         │
└────────────────────────────────────────────────────────┘
                           ↓
Result in UI: Unclicked nodes automatically default to "pending"!
```

#### MongoDB Schema:
```ts
const roadmapProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  roadmapKey: { type: String, required: true, index: true },
  nodeStatuses: {
    type: Map,
    of: String, // "pending" | "in-progress" | "done"
    default: {},
  },
});

roadmapProgressSchema.index({ userId: 1, roadmapKey: 1 }, { unique: true });
```

#### Why MongoDB `Map` of String?
* Using Mongoose's `Map` type allows dynamic key lookups (`nodeStatuses.get("os-pcb")`) without defining hundreds of rigid schema properties.
* A user document takes under **300 bytes** in MongoDB.

---

### Feature 4: LeetCode Synchronization & Redis Cache-Aside
* **Controller:** `apps/api/src/controllers/problemController.ts`
* **Service:** `apps/api/src/services/leetcodeService.ts`
* **Endpoints:** `POST /api/problems/sync` & `GET /api/problems/leetcode-profile`

#### Cache-Aside Flow:
```text
Client requests LeetCode Sync
             ↓
Check Redis: `leetcode:${username}`
   ├── Hit (Cached within 1 hour) ──► Serve immediately (< 2ms)
   └── Miss / Expired / Force Sync
             ↓
   Query LeetCode Public GraphQL API
             ↓
   1. Cache in Redis: SETEX `leetcode:${username}` 3600 (1 hr)
   2. Persist to MongoDB: Update `User.leetcodeProfile`
             ↓
   Return fresh stats to user
```

#### Resilience & Graceful Degradation:
If Redis is down or offline:
* `redis.on("error")` catches connection issues and logs a warning.
* The system bypasses Redis and fetches directly from the LeetCode API without crashing or throwing a 500 error.

---

### Feature 5: Doubt & Targets Queue (`doubts` collection)
* **Model:** `apps/api/src/models/Doubt.ts`
* **Routes:** `GET /api/doubts`, `POST /api/doubts`, `PATCH /api/doubts/:id`, `DELETE /api/doubts/:id`

#### Schema:
```ts
{
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ["leetcode", "topic"], required: true },
  topic: { type: String, required: true },
  url: { type: String },
  priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  notes: { type: String },
  resolved: { type: Boolean, default: false },
}
```

#### Query Pattern:
Dashboard loads active doubts with:
```ts
Doubt.find({ userId: req.userId }).sort({ createdAt: -1 });
```
Optimized by compound index `{ userId: 1, createdAt: -1 }`.

---

### Feature 6: Portfolio Project Tracker (`projects` collection)
* **Model:** `apps/api/src/models/Project.ts`
* **Routes:** `GET /api/projects`, `POST /api/projects`, `PATCH /api/projects/:id`, `DELETE /api/projects/:id`

#### Schema:
```ts
{
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true, trim: true },
  techStack: [{ type: String }],
  status: { 
    type: String, 
    enum: ["planning", "in-progress", "completed", "archived"],
    default: "planning"
  },
  repoUrl: { type: String, default: "" },
  notes: { type: String, default: "" },
}
```

---

## 4. Multi-Tenancy & Indexing Strategy

In a multi-tenant SaaS application, preventing cross-tenant data leaks and keeping queries fast as data scales is paramount.

### Compound Indexing Rules in Prep OS:
1. **Always lead with `userId`**:
   * `{ userId: 1, createdAt: -1 }` (Projects, Doubts)
   * `{ userId: 1, roadmapKey: 1 }` (Roadmap Progress - Unique)
2. **Why leading `userId` matters:**
   MongoDB can use this compound index both to scope documents to the logged-in user and to sort by `createdAt` simultaneously in memory without an expensive in-RAM sort.

---

## 5. Architectural FAQ & Interview Guide 🌟

### Q1: *"Why not store the entire roadmap tree inside MongoDB?"*
> **Answer:** *"Storing static curriculum trees in the database creates schema rigidity, inflates database size, and forces database migrations whenever curriculum is edited. By using the **Sparse State** pattern, static content is bundled and served at the edge by Next.js, while MongoDB only stores small mutation overrides (`done`/`in-progress`). A brand new user takes 0 extra bytes."*

### Q2: *"Why embed NeetCode progress on the User document instead of a separate collection?"*
> **Answer:** *"The 1:1 relationship between a user and their personal NeetCode checklist is read on almost every authenticated session. Embedding `{ solved: [], starred: [] }` on the `User` avoids an additional database query join, ensuring profile loads complete in a single round-trip."*

### Q3: *"How do you handle Redis cache failures in production?"*
> **Answer:** *"We use the **Cache-Aside with Graceful Degradation** pattern. If Redis crashes or fails to connect, the application catches the event, logs a warning, and falls back to querying the external service directly. The user experience remains uninterrupted."*

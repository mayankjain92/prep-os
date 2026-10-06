# Prep OS — Technical Interview Master Guide

This guide compiles high-frequency, in-depth technical interview questions based directly on the architecture, engineering patterns, and technologies implemented in **Prep OS**. Use this for campus placements, FAANG / Tier-1 startup interviews, and system design rounds.

---

## Category 1: AI Engineering & Autonomous Agents

### Q1.1: How does the Prep OS AI Copilot work under the hood? Is it a chatbot or an autonomous agent?
**Answer:**  
The Prep OS AI Copilot is an **Autonomous ReAct (Reason + Act) Tool-Calling Agent**, not a passive text-in/text-out chatbot.
* **Orchestration Loop:** Implemented using `@google/genai` (Gemini 2.5 Flash Lite) with an iterative loop (`MAX_TURNS = 5`) in `apps/api/src/services/agent/agentService.ts`.
* **Execution Flow:**
  1. The user inputs a natural language prompt (e.g., *"Analyze my preparation and tell me what to practice next"*).
  2. The LLM reasons over the query and generates a structured function call (e.g., `getUserProgress`).
  3. The Node.js runtime intercepts the function call, executes the internal database queries, and injects the resulting JSON payload back into the model context.
  4. The LLM observes the data and decides whether further tools are required or if it can formulate the final grounded response.
* **Perception & Action:** It has read tools (`getUserProgress`, `getLeetCodeStats`) and write tools (`createDoubt`, `syncLeetCode`), giving it the ability to mutate database state (e.g., adding doubt items to the user's MongoDB queue).

---

### Q1.2: Why did you choose Tool Calling over RAG (Retrieval-Augmented Generation)?
**Answer:**  
RAG and Tool Calling solve two fundamentally different problems:
* **RAG:** Optimized for semantic similarity search across large volumes of **unstructured text** (e.g., searching 500 pages of PDF interview experiences). RAG cannot perform arithmetic counts or write mutations.
* **Tool Calling:** Optimized for **real-time, structured relational/document telemetry** and state mutations.
  * In Prep OS, student progress consists of live streaks, specific solved problem IDs (`nc-1`), and active doubts in MongoDB.
  * A vector database cannot accurately answer *"How many problems did the user solve?"* or insert a new document into MongoDB. Tool calling provides **100% deterministic data** with zero hallucinations.

---

### Q1.3: How does the agent ensure LeetCode statistics are never stale?
**Answer:**  
We implemented an **Auto-Sync Telemetry Pipeline**:
1. When `getUserProgress` or `getLeetCodeStats` executes, the backend automatically invokes `syncUserLeetCodeProfile(userId, username, force = true)`.
2. This service flushes the Redis cache key (`leetcode:${userId}:${username}`), triggers a fresh GraphQL fetch to LeetCode with an `AbortSignal.timeout(6000)` safeguard, and persists the new solve count and `syncedAt` timestamp to MongoDB.
3. If the user solved a problem on LeetCode two minutes ago, the agent immediately reflects the latest solve count in its gap analysis.

---

### Q1.4: How do you handle curriculum gap analysis on a sparse database without blowing LLM context limits on a free-tier API?
**Answer:**  
Prep OS uses a **Sparse Key-Value State Pattern** in MongoDB—only ticked nodes exist in the database.
* **The Naive Approach (Prompt Stuffing):** Passing all raw curriculum files (68 KB / ~20,000 tokens) to the prompt wastes tokens, causes latency, and exceeds Gemini free-tier rate limits.
* **Prep OS Approach (Server-Side Pre-Processing):**
  1. Node.js performs the set difference in memory ($O(N)$ lookup in < 0.1 ms).
  2. The tool returns a compact JSON summary (~150 tokens) indicating mastered categories, in-progress categories, and 0% untouched gaps.
  3. The LLM receives pure signal without UI layout noise (coordinates, URLs), keeping costs at zero and response times fast (~500ms).

---

## Category 2: Caching & Redis Architecture

### Q2.1: Explain the Cache-Aside pattern used for LeetCode profiles.
**Answer:**  
* **Read Path:** When `/api/problems/leetcode-profile` is requested, the server checks Redis key `leetcode:${userId}:${username}`. On a hit, cached JSON is returned in < 5ms. On a miss, external APIs are queried, data is cached in Redis with a 1-hour TTL (`EX 3600`), and returned to the client.
* **Write/Sync Path:** When the user clicks "Sync" or the AI agent triggers a refresh, `invalidateLeetCodeCache` immediately runs `redis.del(cacheKey)` (write-through invalidation), ensuring stale numbers are purged before the new fetch.
* **Fault Tolerance:** If Redis crashes, a `try/catch` block logs a warning and queries the external API directly, preventing any downtime or 500 errors for end users.

---

## Category 3: Database & Sparse Storage Design

### Q3.1: Why did you use a Sparse Key-Value pattern for Roadmap progress instead of embedding all nodes?
**Answer:**  
* **Problem:** Storing full static curriculum hierarchies (OS, DBMS, CN, OOP, Aptitude, DSA) with descriptions and URLs inside every user's document leads to massive data redundancy and difficult schema migrations.
* **Solution:** 
  * Static curriculum trees remain version-controlled in the codebase.
  * MongoDB only stores user mutations in `RoadmapProgress`:
    `nodeStatuses: Map { "os-pcb-states": "done", "os-threads": "in-progress" }`
* **Impact:** 
  * Reduces database storage overhead by **over 99%**.
  * Adding or rearranging roadmap nodes requires zero database migration scripts.
  * Queries use a compound unique index `{ userId: 1, roadmapKey: 1 }` for $O(1)$ lookups.

---

## Category 4: Security & Authentication

### Q4.1: Why use HttpOnly cookies instead of storing JWTs in localStorage?
**Answer:**  
Storing JWTs in `localStorage` leaves tokens vulnerable to **Cross-Site Scripting (XSS)** exfiltration—any injected third-party script can access `localStorage.getItem('token')`.
* Prep OS stores JWTs exclusively in **HttpOnly, Secure, SameSite** cookies (`token`), rendering tokens completely inaccessible to browser JavaScript.
* **Testing Fallback:** The backend middleware checks `req.cookies.token` first, with an explicit fallback to `Authorization: Bearer <token>` for automated CLI and Vitest test suites.
* **CSRF Defense:** State-mutating requests (`POST`, `PUT`, `DELETE`) require custom headers (`x-requested-with` or origin matching), preventing unauthorized cross-origin requests.

---

## Category 5: Monorepo Architecture

### Q5.1: What are the advantages of using `pnpm` workspaces with `@prep-os/shared`?
**Answer:**  
1. **Zero API Contract Drift:** Both `apps/web` (Next.js) and `apps/api` (Express) import Zod validation schemas (`doubt.schema.ts`, `roadmap.schema.ts`) and TypeScript types from `@prep-os/shared`. If an endpoint contract changes, TypeScript flags errors across the entire codebase at compile time.
2. **Disk Efficiency:** `pnpm` uses a global content-addressable store with hard links, preventing multiple copies of `react` or `zod` from consuming gigabytes of disk space.
3. **Independent Deployability:** `apps/web` can be deployed independently to Vercel/Cloudflare while `apps/api` runs on Docker/Render.

---

## Category 6: Frontend Engineering & UI/UX

### Q6.1: How is the macOS "Genie Lamp" minimize/expand animation implemented?
**Answer:**  
Implemented using **Framer Motion** (`motion.div` and `AnimatePresence`) in `AgentCopilot.tsx`:
* **Transform Origin Pinning:** The animation anchors its transformation origin to the bottom-right floating trigger button (`originX: 0.96`, `originY: 0.98`).
* **Scale & Opacity Interpolation:**
  * Expanding: `scale: 0.06 -> 1.0`, `opacity: 0 -> 1.0`, `y: 20 -> 0`.
  * Wrapping: `scale: 1.0 -> 0.06`, `opacity: 1.0 -> 0.0`.
* **Spring Dynamics:** Uses spring physics (`stiffness: 320`, `damping: 27`, `mass: 0.75`) to simulate natural momentum rather than rigid CSS cubic-bezier curves.

# Prep OS — Placement & DSA Tracker

Prep OS is an end-to-end, high-performance monorepo platform designed for placement preparation, problem tracking, CS theory mastery, and portfolio project management.

---

## 🚀 Key Features

- **DSA Problem Tracker:** Full tracking with difficulty, topics, status pipeline, and direct LeetCode integration.
- **LeetCode Integration & Redis Cache-Aside:** Fast cached synchronization with automatic fallbacks and invalidation on write.
- **Theory Aggregation Engine:** MongoDB aggregation pipelines computing progress percentages per core subject (OS, DBMS, CN, Aptitude).
- **JWT Authentication:** Secure user authentication with JWT tokens, bcrypt password hashing, and user-tenant isolation.
- **Unified Analytics Dashboard:** Modern Recharts-powered dashboard tracking problem trends and difficulty distribution.

---

## 🛠️ Stack & Architecture

- **Frontend:** Next.js (App Router, Turbopack, TailwindCSS, TanStack Query, Recharts, Lucide Icons).
- **Backend:** Node.js, Express (ESM), Mongoose (MongoDB), Redis (ioredis), Zod, bcryptjs, jsonwebtoken.
- **Monorepo & Tooling:** pnpm workspaces, Vitest, Docker, Docker Compose, GitHub Actions.

---

## 🚦 Quickstart

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose (optional for database & redis)

### Running Locally

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Start Services (MongoDB & Redis):**
   ```bash
   docker-compose up -d mongo redis
   ```

3. **Start Development Server:**
   ```bash
   pnpm dev
   ```
   - Web App: `http://localhost:3000`
   - API Server: `http://localhost:4000`

---

## 🧪 Testing & Build

```bash
# Run unit & integration tests
pnpm --filter @prep-os/api test

# Production build across workspace
pnpm build
```

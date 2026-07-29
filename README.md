<div align="center">
  <h1>🚀 Prep OS</h1>
  <p><strong>The Ultimate Placement & DSA Tracker Monorepo Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

---

**Prep OS** is an end-to-end, high-performance monorepo platform designed for computer science students and professionals. It provides a comprehensive suite to manage placement preparation, track DSA (Data Structures and Algorithms) problems, master CS theory, and organize portfolio projects.

## ✨ Key Features

- 🧠 **DSA Problem Tracker:** Full lifecycle tracking with difficulty, topics, status pipelines, and direct LeetCode integration.
- ⚡ **High-Performance Architecture:** Implements a Redis Cache-Aside pattern for LeetCode synchronization with automatic fallbacks and immediate invalidation on write.
- 📊 **Theory Aggregation Engine:** Leverages powerful MongoDB aggregation pipelines to dynamically compute progress percentages per core subject (OS, DBMS, CN, Aptitude).
- 🔒 **Secure Authentication:** JWT-based secure user authentication with bcrypt password hashing and strict user-tenant data isolation.
- 📈 **Unified Analytics Dashboard:** Modern, responsive dashboard powered by Recharts to visualize problem-solving trends and difficulty distribution.
- 🏗️ **Monorepo Structure:** Built with `pnpm` workspaces for a seamless developer experience, featuring shared types across the frontend and backend to eliminate API type drift.

---

## 🛠️ Tech Stack & Architecture

### Frontend (`apps/web`)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query
- **Visualization:** Recharts
- **Icons:** Lucide React

### Backend (`apps/api`)
- **Framework:** Node.js, Express (ESM)
- **Database:** MongoDB (Mongoose)
- **Caching:** Redis (ioredis)
- **Validation:** Zod
- **Auth:** bcryptjs, jsonwebtoken

### Tooling & DevOps
- **Monorepo:** pnpm workspaces
- **Testing:** Vitest
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions (ready)

> 📖 **Read more about architectural decisions in [ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) >= 20.x
- [pnpm](https://pnpm.io/) >= 9.x
- [Docker & Docker Compose](https://www.docker.com/) (Required for local DB & Redis)

### Quickstart

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd prep-os
   ```

2. **Install Dependencies:**
   Install workspace dependencies at the root.
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Ensure you create the necessary `.env` files in `apps/api` and `apps/web`. *(See `.env.example` in respective directories if available).*

4. **Start Infrastructure Services:**
   Spin up MongoDB and Redis using Docker.
   ```bash
   docker-compose up -d mongo redis
   ```

5. **Start Development Servers:**
   Run both frontend and backend concurrently.
   ```bash
   pnpm dev
   ```
   - **Frontend App:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## 📂 Project Structure

```text
prep-os/
├── apps/
│   ├── api/            # Express backend service
│   └── web/            # Next.js frontend application
├── packages/
│   └── shared/         # Zod schemas & TS types shared across apps
├── docs/               # Additional documentation
├── ARCHITECTURE.md     # In-depth technical rationale
├── docker-compose.yml  # Local infrastructure definition
└── pnpm-workspace.yaml # Monorepo workspace configuration
```

---

## 🧪 Scripts & Commands

Available commands at the workspace root:

| Command | Description |
|---|---|
| `pnpm dev` | Starts all applications in parallel development mode |
| `pnpm build` | Builds all applications for production |
| `pnpm dev:web` | Starts only the Next.js frontend application |
| `pnpm dev:api` | Starts only the Express backend application |
| `pnpm start:api` | Starts the built Express API server |
| `pnpm --filter @prep-os/api test` | Runs unit & integration tests for the API |

---

## 🤝 Contributing

Contributions are welcome! Please ensure you test your changes and verify that you haven't introduced any type drift by utilizing the `@prep-os/shared` package appropriately.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

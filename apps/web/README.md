# @prep-os/web

The frontend web application for **Prep OS**, built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, and TanStack Query v5.

---

## 🏛️ Architecture: Feature-Sliced Design (Vertical Slices)

The codebase strictly follows a **Feature-Sliced Architecture** pattern. Feature code (components, hooks, APIs, types) is colocated within domain-specific slices, keeping `src/components/` reserved solely for domain-agnostic UI primitives and providers.

```text
apps/web/src/
├── app/                          # Next.js App Router (pages & layouts only)
│   ├── dashboard/
│   │   ├── doubts/page.tsx       # Dedicated revision & blocker target queue
│   │   ├── dsa/page.tsx          # NeetCode 150 & topic roadmaps
│   │   ├── profile/page.tsx      # Heatmap calendar & shareable card generator
│   │   ├── projects/page.tsx     # Portfolio planner & GitHub repository sync
│   │   └── theory/page.tsx       # CS Theory roadmaps (OS, DBMS, CN, OOP, Aptitude)
│   └── layout.tsx                # App shell (QueryProvider, ThemeProvider, AuthProvider)
│
├── features/                     # Self-contained domain modules
│   ├── agent/                    # AI Copilot API & expandable IDE reader
│   │   ├── api.ts
│   │   └── components/AgentCopilot.tsx
│   ├── auth/                     # Authentication context & session state
│   │   └── AuthContext.tsx
│   ├── doubts/                   # Doubts queue, target revision & logging popup
│   │   ├── api.ts
│   │   ├── useDoubts.ts
│   │   └── components/DoubtSection.tsx
│   ├── dsa/                      # NeetCode 150 & LeetCode profile integration
│   │   ├── api.ts
│   │   ├── useProblems.ts
│   │   └── components/Neetcode150Section.tsx
│   ├── profile/                  # Profile dropdown, handle claim, heatmap & cards
│   │   └── components/
│   │       ├── ProfileDropdown.tsx
│   │       ├── SetUsernameModal.tsx
│   │       ├── LoginHeatmap.tsx
│   │       └── ShareableProgressCard.tsx
│   ├── projects/                 # Portfolio projects & GitHub sync modal
│   │   ├── api.ts
│   │   ├── useProjects.ts
│   │   └── components/GitHubSyncModal.tsx
│   └── roadmap/                  # Visual roadmap flowcharts & decoupled types
│       ├── api.ts
│       ├── types.ts              # Domain types (RoadmapNodeItem, RoadmapSection)
│       ├── useRoadmap.ts
│       └── components/
│           ├── RoadmapFlowChart.tsx
│           └── RoadmapTreePreview.tsx
│
├── components/                   # Domain-agnostic UI only
│   ├── ui/                       # Design system primitives (Button, Input, Badge)
│   ├── providers/                # ThemeProvider, QueryProvider
│   └── shared/                   # Logo, ThemeToggle, AnimatedEmblem, PageTransition
│
├── data/                         # Static curriculum datasets (neetcode150, dsa-roadmap, theory-roadmap)
└── lib/                          # HTTP client (api-client) and styling utils
```

---

## ✨ Key Features & Capabilities

- **Overview Dashboard:** Centralized preparation hub aggregating DSA counts, CS Theory percentages, active doubts, and portfolio projects.
- **DSA Roadmap & NeetCode 150:** Interactive 150-problem checklist, category filters, and live LeetCode stats sync (Easy/Medium/Hard breakdown).
- **Dedicated Doubts Queue:** Full revision planner with blurred backdrop popups, priority badges, and direct resolution tracking.
- **CS Theory Roadmaps:** Interactive visual flowcharts for Operating Systems, DBMS, Computer Networks, OOP, and Aptitude with persistent sparse key-value state.
- **Autonomous AI Copilot:** Floating action trigger with orbital rotation, macOS Genie Lamp animation, expandable IDE reading view (up to 780px), one-click code copy, and LaTeX math formatting ($O(n)$ chips).
- **Profile & Heatmap:** 6-month login activity heatmap, handle availability check, and shareable progress card image generator (`html-to-image`).
- **Dark/Light Theme:** Native system-aware theme toggle with WCAG AA compliance.

---

## 🚀 Development Setup

Run from workspace root:
```bash
pnpm dev:web
```

Or run directly inside `apps/web`:
```bash
pnpm dev
```

App runs on [http://localhost:3000](http://localhost:3000).


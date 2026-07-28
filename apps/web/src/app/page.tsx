import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/shared/Logo";
import {
  Code2,
  Zap,
  Database,
  ArrowRight,
  BookOpen,
  FolderKanban,
  Flame,
  Star,
  CheckCircle2,
  Compass,
  Shield,
  Cpu,
  Globe
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Compass,
      badge: "Placement Pathways",
      title: "Interactive Prep Roadmaps",
      description:
        "Structured step-by-step career and interview pathways for DSA Masterclass, SDE Placement Track, CS Theory Core, and System Design Architecture with milestone tracking.",
      gradient: "from-blue-500/10 via-xblue/10 to-cyan-500/10",
      accent: "text-xblue",
      highlights: ["DSA 150 Master Path", "SDE Placement Roadmap", "System Design Track", "Milestone Tracking"],
    },
    {
      icon: Code2,
      badge: "NeetCode 150 Engine",
      title: "Persistent NeetCode 150 Tracker",
      description:
        "Master the top 150 interview problems grouped topic-wise with live progress bars, compact 2-column problem layouts, star revision bookmarks, and direct MongoDB profile persistence.",
      gradient: "from-cyan-500/10 via-xblue/10 to-blue-600/10",
      accent: "text-cyan-400",
      highlights: ["Topic Progress Bars", "Star Revision Marks", "Cloud MongoDB Persistence", "Compact Layout"],
    },
    {
      icon: Zap,
      badge: "Performance Sync",
      title: "Cached LeetCode Analytics",
      description:
        "Sync external LeetCode statistics and track your problem-solving status pipelines (Solved, Revision Needed, Wishlist) powered by a high-speed Redis cache-aside architecture.",
      gradient: "from-amber-500/10 via-orange-500/10 to-amber-600/10",
      accent: "text-amber-400",
      highlights: ["Redis Cache-Aside Speed", "Difficulty Breakdown", "Status Pipelines", "Submission Sync"],
    },
    {
      icon: BookOpen,
      badge: "CS Core Subjects",
      title: "CS Theory Checklists",
      description:
        "Comprehensive interactive revision checklists for Operating Systems, DBMS, Computer Networks, and System Design powered by MongoDB aggregation pipelines.",
      gradient: "from-emerald-500/10 via-teal-500/10 to-emerald-600/10",
      accent: "text-emerald-400",
      highlights: ["Operating Systems", "DBMS & SQL", "Computer Networks", "System Design Basics"],
    },
    {
      icon: FolderKanban,
      badge: "Engineering Portfolio",
      title: "Software Project Portfolio",
      description:
        "Log full-stack software development projects, technical stack tags (Next.js, Node.js, Express, Redis, MongoDB), live demo links, repository URLs, and architecture decisions.",
      gradient: "from-purple-500/10 via-indigo-500/10 to-purple-600/10",
      accent: "text-purple-400",
      highlights: ["Tech Stack Tags", "Architecture Logs", "GitHub Repo Links", "Live Demo Tracking"],
    },
    {
      icon: Flame,
      badge: "Consistency Engine",
      title: "Activity Heatmap & Streaks",
      description:
        "Build interview preparation discipline with GitHub-style daily activity heatmap calendars, active login streak counters, and preparation milestone tracking.",
      gradient: "from-rose-500/10 via-red-500/10 to-orange-500/10",
      accent: "text-rose-400",
      highlights: ["GitHub-Style Heatmap", "Login Streak Counter", "Longest Streak Records", "Daily Milestones"],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-300 overflow-x-hidden selection:bg-xblue selection:text-white">
      {/* Top Glassmorphism Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Logo href="/" size="md" />

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-muted-foreground">
            <a href="#roadmaps" className="hover:text-foreground transition-colors">
              Roadmaps
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#neetcode" className="hover:text-foreground transition-colors">
              NeetCode 150
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-full border-border text-xs font-bold px-4">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full bg-xblue hover:bg-xhover text-white font-extrabold text-xs px-5 shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 space-y-24 py-12 sm:py-20">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-6 text-center space-y-8 relative">
          {/* Background Ambient Glow Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-xblue/20 via-cyan-400/10 to-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
            The High-Performance Placement Prep{" "}
            <span className="bg-gradient-to-r from-xblue via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Operating System.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
            PrepOS streamlines your software engineering interview preparation with structured career roadmaps, NeetCode 150 MongoDB persistence, LeetCode analytics, CS Theory checklists, and portfolio project logs.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full bg-xblue hover:bg-xhover text-white font-extrabold px-8 h-12 gap-2 text-sm shadow-md transition-all hover:scale-105">
                Launch Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="rounded-full border-border text-foreground hover:bg-card px-8 h-12 text-sm font-bold transition-all">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Metric Stats Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
              <div className="text-2xl font-black text-xblue">Roadmaps</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">Structured Pathways</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
              <div className="text-2xl font-black text-cyan-400">150</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">NeetCode DSA Track</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
              <div className="text-2xl font-black text-amber-400">100%</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">MongoDB Cloud Sync</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
              <div className="text-2xl font-black text-emerald-400">4 CS</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">Core Subject Modules</div>
            </div>
          </div>
        </section>

        {/* Dedicated Section: Curated Preparation Roadmaps */}
        <section id="roadmaps" className="mx-auto max-w-7xl px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-xblue/10 via-card to-cyan-500/10 border border-xblue/30 space-y-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-xblue/20 text-xblue border border-xblue/40">
                  <Compass className="h-3.5 w-3.5" /> Structured Learning Pathways
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  Guided Interview Roadmaps & Milestones
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Never wonder what to study next. PrepOS provides clear, structured roadmaps designed for top tech placement tracks.
                </p>
              </div>

              <Link href="/dashboard">
                <Button className="rounded-full bg-xblue hover:bg-xhover text-white font-extrabold text-xs px-6 h-10 gap-2 shrink-0">
                  Explore All Roadmaps <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-background/80 border border-border space-y-4 shadow-sm hover:border-xblue/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-black">
                    DSA Track
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">150 Milestones</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-foreground">NeetCode 150 Path</h3>
                  <p className="text-xs text-muted-foreground">Arrays, Pointers, Trees, Graphs, DP, and Advanced Data Structures.</p>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-cyan-400 rounded-full" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background/80 border border-border space-y-4 shadow-sm hover:border-emerald-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black">
                    Theory Track
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">4 Core Subjects</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-foreground">CS Fundamentals Roadmap</h3>
                  <p className="text-xs text-muted-foreground">OS, Database Management, Computer Networks, and System Architecture.</p>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background/80 border border-border space-y-4 shadow-sm hover:border-purple-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black">
                    Projects Track
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">Portfolio Driven</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-foreground">Full-Stack SDE Portfolio</h3>
                  <p className="text-xs text-muted-foreground">Build production apps with Next.js, Express, MongoDB, and Redis.</p>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-purple-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Everything You Need to Crack Tech Interviews
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Engineered with modern full-stack architecture to ensure zero data loss, instant updates, and intuitive preparation workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className={`group rounded-3xl border border-border bg-card p-7 space-y-5 transition-all duration-300 hover:border-xblue/50 hover:shadow-lg relative overflow-hidden bg-gradient-to-b ${item.gradient}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-background/80 border border-border ${item.accent} shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-background/80 border border-border text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground group-hover:text-xblue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-[11px] font-bold text-foreground/80">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-xblue shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Highlight Spotlight: NeetCode 150 */}
        <section id="neetcode" className="mx-auto max-w-7xl px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-card via-background to-card border border-border relative overflow-hidden shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Star className="h-3.5 w-3.5 fill-cyan-400" /> Persistent Roadmap Engine
                </div>

                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  NeetCode 150 Built for Cross-Device Persistence
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  No more losing your solved progress when switching laptops or clearing browser cookies. PrepOS stores your solved states and starred revision marks directly inside your authenticated MongoDB user document.
                </p>

                <ul className="space-y-3 text-xs font-bold text-foreground">
                  <li className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-xblue/20 text-xblue flex items-center justify-center">✓</div>
                    Topic-wise progression bars (Arrays, Two Pointers, Trees, Graphs, DP)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-xblue/20 text-xblue flex items-center justify-center">✓</div>
                    Star button for instant revision flagging
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-xblue/20 text-xblue flex items-center justify-center">✓</div>
                    Optimistic UI updates with automatic background cloud sync
                  </li>
                </ul>
              </div>

              {/* Mock UI Showcase */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-md space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-xblue" />
                    <span className="font-extrabold text-sm text-foreground">NeetCode 150 Roadmap</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                    24 / 150 Solved
                  </span>
                </div>

                {/* Sample Topic Block */}
                <div className="p-3.5 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span>Arrays & Hashing</span>
                    <span className="text-xblue">7 / 9 Solved</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-xblue to-cyan-400 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-card border border-border/60 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-emerald-400">✓ Two Sum</span>
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="p-2 rounded-lg bg-card border border-border/60 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-emerald-400">✓ Valid Anagram</span>
                      <Star className="h-3 w-3 text-muted-foreground/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack & Architecture Grid */}
        <section id="architecture" className="mx-auto max-w-7xl px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Production-Grade Full-Stack Architecture
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Powered by industry-standard open source technology stack
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-2">
              <Globe className="h-6 w-6 text-xblue mx-auto" />
              <div className="font-extrabold text-sm">Next.js 16 App Router</div>
              <div className="text-[11px] text-muted-foreground">React Server Components</div>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-2">
              <Database className="h-6 w-6 text-emerald-400 mx-auto" />
              <div className="font-extrabold text-sm">MongoDB & Mongoose</div>
              <div className="text-[11px] text-muted-foreground">User-Scoped State Sync</div>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-2">
              <Cpu className="h-6 w-6 text-rose-400 mx-auto" />
              <div className="font-extrabold text-sm">Redis Caching</div>
              <div className="text-[11px] text-muted-foreground">Fast Cache-Aside Layer</div>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border text-center space-y-2">
              <Shield className="h-6 w-6 text-amber-400 mx-auto" />
              <div className="font-extrabold text-sm">OAuth 2.0 & JWT</div>
              <div className="text-[11px] text-muted-foreground">Google & GitHub Login</div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="mx-auto max-w-5xl px-6">
          <div className="p-10 rounded-3xl bg-gradient-to-r from-xblue/20 via-card to-cyan-500/20 border border-xblue/30 text-center space-y-6 shadow-md relative overflow-hidden">
            <Logo size="lg" className="mx-auto" />

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Ready to Accelerate Your Placement Preparation?
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Join software engineers tracking their NeetCode 150 progress, CS theory, and portfolio projects in one unified operating system.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-xblue hover:bg-xhover text-white font-extrabold px-8 h-12 gap-2 text-sm shadow-md">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-full border-border text-foreground hover:bg-card px-8 h-12 text-sm font-bold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Brand Footer */}
      <footer className="border-t border-border bg-background/90 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-xs text-muted-foreground font-semibold">
            PrepOS — Placement Preparation Operating System © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

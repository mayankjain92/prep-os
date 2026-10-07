"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Logo } from "@/components/shared/Logo";
import { AnimatedEmblem } from "@/components/shared/AnimatedEmblem";
import { RoadmapTreePreview } from "@/features/roadmap/components/RoadmapTreePreview";
import {
  Code2,
  Zap,
  ArrowRight,
  BookOpen,
  FolderKanban,
  Flame,
  Compass,
  Sparkles,
  Bot,
  ChevronRight,
  GitBranch,
  Share2,
  Target,
} from "lucide-react";

export default function Home() {
  const studentMetrics = [
    {
      value: "150",
      label: "DSA Interview Problems",
      detail: "Curated NeetCode master pathway",
      color: "text-sky-500 dark:text-sky-400",
    },
    {
      value: "4",
      label: "Core CS Subjects",
      detail: "OS, DBMS, Networks & System Design",
      color: "text-indigo-500 dark:text-indigo-400",
    },
    {
      value: "1-Click",
      label: "Automated LeetCode Sync",
      detail: "Direct live profile tracking",
      color: "text-amber-500 dark:text-amber-400",
    },
    {
      value: "24/7",
      label: "AI Placement Mentor",
      detail: "Instant prep diagnostics & guidance",
      color: "text-emerald-500 dark:text-emerald-400",
    },
  ];

  const minimalFeatures = [
    {
      icon: Code2,
      title: "Targeted DSA Roadmap",
      description:
        "Master the 150 most frequently asked interview problems grouped by pattern, from Arrays and Two Pointers to Dynamic Programming.",
      tag: "DSA 150",
    },
    {
      icon: BookOpen,
      title: "Core CS Fundamentals",
      description:
        "Ace technical interview rounds with structured checklists covering Operating Systems, DBMS, Computer Networks, and System Design.",
      tag: "CS Theory",
    },
    {
      icon: FolderKanban,
      title: "Project Portfolio Hub",
      description:
        "Showcase your full-stack projects, architecture decisions, live demos, and GitHub repositories in an interview-ready format.",
      tag: "Portfolio",
    },
    {
      icon: Share2,
      title: "Shareable Proof of Work",
      description:
        "Export high-resolution placement milestone cards to celebrate your preparation consistency and solved count on LinkedIn and X.",
      tag: "Milestone Cards",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-300 transition-colors duration-200 relative overflow-x-hidden font-sans">
      {/* Background Grid Pattern & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-radial from-transparent to-slate-50 dark:to-[#0A0A0A]" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-cyan-400/15 blur-[140px] rounded-full" />
        <div className="absolute top-[900px] left-1/3 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Stitch Navbar with Original PrepOS Logo */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0A0A0A]/85 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          <div className="flex items-center shrink-0">
            <Logo href="/" size="md" />
          </div>

          <nav
            aria-label="Global Navigation"
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400"
          >
            <a
              href="#overview"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all"
            >
              Overview
            </a>
            <a
              href="#roadmaps"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all"
            >
              Roadmaps
            </a>
            <a
              href="#features"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all"
            >
              Features
            </a>
            <a
              href="#mentor"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI Mentor</span>
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-4 shadow-sm shadow-sky-500/20 transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 space-y-24 py-12 sm:py-20">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-8 relative">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-[#EDEDED] leading-[1.08]">
            Crack Your Tech Placements{" "}
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Without the Chaos.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-normal">
            Stop juggling scattered spreadsheets, Notion templates, and lost
            bookmarks. PrepOS brings your DSA roadmap, core CS theory revision,
            engineering projects, and daily study consistency into a single
            focused dashboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold px-7 h-11 gap-2 text-sm shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02]"
              >
                Start Your Prep Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] text-slate-700 dark:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-white/[0.04] px-7 h-11 text-sm font-semibold transition-all"
              >
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/dsa">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-xl text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] px-5 h-11 text-sm font-medium transition-all"
              >
                Explore 150 Roadmaps <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Student Metric Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left">
            {studentMetrics.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/70 dark:bg-[#121212]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md shadow-xs hover:border-slate-300 dark:hover:border-white/[0.16] transition-all"
              >
                <div
                  className={`text-2xl font-black ${stat.color} tracking-tight`}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-[#EDEDED] mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#A1A1AA] mt-0.5 leading-snug">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: UNIFIED DASHBOARD PREVIEW */}
        <section
          id="overview"
          className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                <Target className="w-3.5 h-3.5" /> Unified Student Platform
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-[#EDEDED] mt-1">
                Everything You Need to Track in One Place
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A1A1AA] max-w-md">
              Designed around how software engineering students actually study
              for on-campus placements and off-campus tech drives.
            </p>
          </div>

          {/* Feature Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* CARD 1: DSA Dependency Roadmap (Span 2) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#121212]/90 p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-[#EDEDED]">
                      Interactive DSA Roadmap Engine
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
                      Structured step-by-step topic milestones with revision
                      bookmarks
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  150 Problems
                </span>
              </div>

              {/* Roadmap Mini Progress Visual */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A]/60 border border-slate-200/60 dark:border-white/[0.04] space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-sky-500" /> Topic
                    Progression
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold">
                    42 Solved • In Progress
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/[0.08] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 rounded-full w-[35%]" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/[0.08] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Arrays & Hashing</span>
                      <span>✓ Mastered</span>
                    </div>
                    <div className="h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/[0.08] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Two Pointers</span>
                      <span>✓ Mastered</span>
                    </div>
                    <div className="h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#121212] border border-sky-500/30 text-xs space-y-1 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                      <span>Sliding Window</span>
                      <span>Current Focus</span>
                    </div>
                    <div className="h-1 bg-sky-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 w-2/3" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/[0.08] text-xs space-y-1 opacity-70">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                      <span>Binary Trees</span>
                      <span>Up Next</span>
                    </div>
                    <div className="h-1 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-neutral-400 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                  • Grouped by Interview Topics
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                  • Star Markings for Revision
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                  • Solution Notes & Video Guides
                </span>
              </div>
            </div>

            {/* CARD 2: Live LeetCode Sync (Span 1) */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#121212]/90 p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-[#EDEDED]">
                        Live LeetCode Sync
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA]">
                        Zero manual spreadsheet data entry
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Auto Pull
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A]/60 border border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Easy Problems
                      </div>
                      <div className="text-lg font-black text-slate-900 dark:text-[#EDEDED]">
                        68{" "}
                        <span className="text-xs font-normal text-slate-500 dark:text-neutral-400">
                          Solved
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-emerald-500">
                      Foundation
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A]/60 border border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        Medium Problems
                      </div>
                      <div className="text-lg font-black text-slate-900 dark:text-[#EDEDED]">
                        94{" "}
                        <span className="text-xs font-normal text-slate-500 dark:text-neutral-400">
                          Solved
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-amber-500">
                      Core Focus
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A]/60 border border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        Hard Problems
                      </div>
                      <div className="text-lg font-black text-slate-900 dark:text-[#EDEDED]">
                        18{" "}
                        <span className="text-xs font-normal text-slate-500 dark:text-neutral-400">
                          Solved
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-rose-500">
                      Advanced
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 font-medium">
                <span>Total: 180 Solved</span>
                <span className="text-sky-500 dark:text-sky-400 font-semibold">
                  Synced in Seconds
                </span>
              </div>
            </div>

            {/* CARD 3: Daily Consistency & Heatmap (Span 1) */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#121212]/90 p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-[#EDEDED]">
                        Consistency Tracker
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA]">
                        Build placement preparation discipline
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-rose-500" /> 14-Day Streak
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A]/60 border border-slate-200/60 dark:border-white/[0.04] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    <span>Study Activity</span>
                    <span className="text-rose-500 font-bold">
                      Peak Streak: 38 Days
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-1.5 pt-1">
                    {Array.from({ length: 48 }).map((_, idx) => {
                      const active = idx % 4 === 0 || idx % 6 === 0 || idx > 34;
                      const highlyActive = idx % 8 === 0 || idx > 40;
                      return (
                        <div
                          key={idx}
                          className={`aspect-square rounded-xs transition-colors ${
                            highlyActive
                              ? "bg-rose-500 dark:bg-rose-400 shadow-xs shadow-rose-500/40"
                              : active
                                ? "bg-rose-400/60 dark:bg-rose-500/50"
                                : "bg-slate-200 dark:bg-white/[0.06]"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                    <div className="text-[10px] text-slate-500 dark:text-[#A1A1AA]">
                      Active Study Days
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-[#EDEDED]">
                      84 Days
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                    <div className="text-[10px] text-slate-500 dark:text-[#A1A1AA]">
                      Momentum
                    </div>
                    <div className="text-sm font-extrabold text-emerald-500">
                      Consistent 🔥
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-neutral-400">
                Daily problem solves keep your placement flame burning.
              </div>
            </div>

            {/* CARD 4: AI Placement Mentor (Span 2) */}
            <div
              id="mentor"
              className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#121212]/90 p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-[#EDEDED]">
                      24/7 AI Placement Mentor
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
                      Analyzes your actual progress to find blind spots and
                      suggest what to study next
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedEmblem size={20} />
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Context-Aware
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A]/60 border border-slate-200/60 dark:border-white/[0.04] space-y-3 font-sans text-xs">
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-3.5 py-2 rounded-xl bg-sky-500 text-white font-medium shadow-xs">
                    What should I focus on before my upcoming technical
                    interview round?
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-neutral-400 bg-white dark:bg-[#121212] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] w-fit shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span>
                    Auditing your solved topics & doubts across PrepOS...
                  </span>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[92%] px-3.5 py-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/[0.08] text-slate-800 dark:text-neutral-200 space-y-2 shadow-xs">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                      Your Placement Diagnostic:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-neutral-400">
                      <div>
                        ✅ <strong>Strengths:</strong> Arrays & Two Pointers
                        solved
                      </div>
                      <div>
                        ⚠️ <strong>Blind Spot:</strong> Sliding Window (needs
                        practice)
                      </div>
                      <div>
                        📚 <strong>CS Theory:</strong> DBMS ACID & Indexing
                        untouched
                      </div>
                      <div>
                        🔥 <strong>Streak:</strong> 14 Days Active (Good
                        discipline)
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                      💡 <em>Action Plan:</em> Focus on{" "}
                      <strong>
                        Longest Substring Without Repeating Characters
                      </strong>{" "}
                      and review <strong>B+ Trees vs Hash Indexing</strong>.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-500 dark:text-neutral-400">
                  Grounded in your real roadmap progress, not generic ChatGPT
                  responses.
                </div>
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4"
                  >
                    Open Mentor in Dashboard{" "}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PLACEMENT ROADMAP PATHWAYS */}
        <section id="roadmaps" className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/5 via-white dark:via-[#121212] to-indigo-500/5 border border-slate-200/80 dark:border-white/[0.08] space-y-8 relative overflow-hidden shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Compass className="h-3.5 w-3.5" /> Structured Learning
                  Pathways
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-[#EDEDED]">
                  Clear, Structured Pathways for Top Companies
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                  Eliminate decision fatigue. Know exactly what problem to solve
                  or topic to revise each day until placement day.
                </p>
              </div>

              <Link href="/dashboard">
                <Button className="rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-6 h-10 gap-2 shrink-0 shadow-sm shadow-sky-500/20">
                  Explore All Roadmaps <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A]/90 border border-slate-200/80 dark:border-white/[0.08] space-y-4 shadow-xs hover:border-sky-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-black">
                    DSA Track
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                    150 Milestones
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-[#EDEDED]">
                    DSA Masterclass
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                    Arrays, Two Pointers, Sliding Window, Trees, Graphs, and
                    Dynamic Programming.
                  </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-sky-500 rounded-full" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A]/90 border border-slate-200/80 dark:border-white/[0.08] space-y-4 shadow-xs hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black">
                    Theory Track
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                    4 Core Subjects
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-[#EDEDED]">
                    CS Theory Revision
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                    Operating Systems, DBMS & SQL, Computer Networks, and System
                    Architecture.
                  </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A]/90 border border-slate-200/80 dark:border-white/[0.08] space-y-4 shadow-xs hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-black">
                    Portfolio Track
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                    Resume Ready
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-[#EDEDED]">
                    Engineering Projects
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                    Highlight full-stack projects, architecture decisions, and
                    live GitHub repositories.
                  </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-indigo-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Interactive Visual Roadmap Tree Graph */}
            <div className="pt-6">
              <RoadmapTreePreview />
            </div>
          </div>
        </section>

        {/* SECTION: MINIMAL FEATURE PILLARS */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8"
        >
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-[#EDEDED]">
              Built Exclusively for Campus & Off-Campus Prep
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA]">
              Four focused pillars designed to keep your preparation simple,
              structured, and consistent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {minimalFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#121212]/90 p-5 space-y-3.5 shadow-xs hover:border-sky-500/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-[#EDEDED]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: FINAL CALL TO ACTION BANNER */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/[0.08] text-center space-y-6 shadow-xs relative overflow-hidden">
            <div className="flex justify-center">
              <AnimatedEmblem size={56} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-[#EDEDED]">
                Start Cracking Your Placement Journey Today
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] max-w-xl mx-auto">
                Join ambitious students building daily problem-solving
                discipline and landing top tech offers.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 h-11 gap-2 text-sm shadow-md shadow-sky-500/25 transition-all"
                >
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] text-slate-700 dark:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-white/[0.04] px-8 h-11 text-sm font-semibold transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Stitch Minimal Footer with Original Logo */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0A0A0A]/90 py-8 transition-colors duration-200">
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-xs text-slate-500 dark:text-[#A1A1AA] font-medium text-center sm:text-right">
            PrepOS — Placement Preparation Operating System © 2026. Empowering
            student developers.
          </div>
        </div>
      </footer>
    </div>
  );
}

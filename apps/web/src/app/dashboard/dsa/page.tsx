"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useSyncLeetCode,
  useLeetCodeProfile,
} from "@/features/dsa/useProblems";
import { RoadmapFlowChart } from "@/features/roadmap/components/RoadmapFlowChart";
import type { RoadmapNodeItem } from "@/features/roadmap/types";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { Neetcode150Section } from "@/features/dsa/components/Neetcode150Section";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import {
  AlertCircle,
  GitBranch,
  HelpCircle,
  RotateCw,
  Trophy,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import posthog from "posthog-js";

export default function DsaDashboardPage() {
  const { data: dbLeetcodeProfile } = useLeetCodeProfile();
  const { data: dsaFlowchartStatus = {} } = useRoadmapProgress(
    "prep_os_dsa_roadmap_v2",
  );
  const syncMutation = useSyncLeetCode();
  const leetcodeUsername = dbLeetcodeProfile?.username ?? "";
  const [activeTab, setActiveTab] = useState<"flowchart" | "neetcode">("flowchart");
  const [activeSectionId, setActiveSectionId] = useState<string>(
    DSA_ROADMAP_SECTIONS[0].mainId,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "neetcode" || tabParam === "practice") {
        setActiveTab("neetcode");
      }
    }
  }, []);

  const handleTabSwitch = (tab: "flowchart" | "neetcode") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "neetcode") {
        url.searchParams.set("tab", "neetcode");
      } else {
        url.searchParams.delete("tab");
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  const activeProfile = syncMutation.data?.profile || dbLeetcodeProfile;

  const triggerSync = (force = false) => {
    const handle = leetcodeUsername.trim();
    if (!handle) return;
    syncMutation.mutate(
      { username: handle, force },
      {
        onSuccess: (data) => {
          posthog.capture("leetcode_profile_synced", {
            total_solved: data.profile?.totalSolved,
            synced_count: data.synced,
            forced: force,
          });
        },
      },
    );
  };

  const totalSolved = activeProfile?.totalSolved ?? 0;
  const easySolved = activeProfile?.easySolved ?? 0;
  const mediumSolved = activeProfile?.mediumSolved ?? 0;
  const hardSolved = activeProfile?.hardSolved ?? 0;

  const { categoryProgress, overallStats } = useMemo(() => {
    const gatherNodeStats = (nodes?: RoadmapNodeItem[]) => {
      if (!nodes) return { total: 0, completed: 0, learning: 0 };
      let t = 0,
        c = 0,
        l = 0;
      const traverse = (list: RoadmapNodeItem[]) => {
        list.forEach((n) => {
          t++;
          const st = dsaFlowchartStatus[n.id];
          if (st === "done") c++;
          else if (st === "in-progress") l++;
          if (n.subNodes) traverse(n.subNodes);
        });
      };
      traverse(nodes);
      return { total: t, completed: c, learning: l };
    };

    const categories = DSA_ROADMAP_SECTIONS.map((sec) => {
      const name = sec.mainTitle.replace(/^\d+\.\s*/, "");
      const left = gatherNodeStats(sec.leftNodes);
      const right = gatherNodeStats(sec.rightNodes);
      const tot = left.total + right.total;
      const com = left.completed + right.completed;
      const lrn = left.learning + right.learning;

      return {
        mainId: sec.mainId,
        title: name,
        total: tot,
        completed: com,
        learning: lrn,
        pct: tot > 0 ? Math.round((com / tot) * 100) : 0,
      };
    });

    const totalAll = categories.reduce((acc, c) => acc + c.total, 0);
    const doneAll = categories.reduce((acc, c) => acc + c.completed, 0);
    const learningAll = categories.reduce((acc, c) => acc + c.learning, 0);
    const pendingAll = totalAll - doneAll - learningAll;
    const overallPct =
      totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

    return {
      categoryProgress: categories,
      overallStats: {
        total: totalAll,
        done: doneAll,
        learning: learningAll,
        pending: pendingAll,
        pct: overallPct,
      },
    };
  }, [dsaFlowchartStatus]);

  const activeSection = DSA_ROADMAP_SECTIONS.find(
    (s) => s.mainId === activeSectionId,
  );
  const activeLabel =
    activeSection?.mainTitle.replace(/^\d+\.\s*/, "") || "Data Structures";

  const initials = leetcodeUsername
    ? leetcodeUsername.slice(0, 2).toUpperCase()
    : "MJ";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 pb-28 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        {/* BEGIN: PageHeader */}
        <section className="space-y-1" data-purpose="header-section">
          <span className="text-[11px] font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
            PROBLEM SOLVING
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Structures & Algorithms
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-3xl">
            Interactive curriculum roadmaps and NeetCode 150 practice with live LeetCode synchronization.
          </p>
        </section>
        {/* END: PageHeader */}

        {/* BEGIN: Primary View Switcher */}
        <section
          aria-label="DSA Modes Switcher"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4"
        >
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-white/[0.06] rounded-xl overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => handleTabSwitch("flowchart")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "flowchart"
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Interactive Roadmap</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("neetcode")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "neetcode"
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>NeetCode 150 Practice</span>
            </button>
          </div>

          <Link
            href="/dashboard/doubts"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 dark:text-neutral-400 dark:hover:text-sky-400 font-medium transition-colors self-start sm:self-auto px-3 py-2 rounded-xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:border-sky-500/30"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Open Doubts Queue</span>
            <ArrowRight className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
          </Link>
        </section>
        {/* END: Primary View Switcher */}

        {/* VIEW 1: INTERACTIVE ROADMAP (Curriculum & Concepts) */}
        {activeTab === "flowchart" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Roadmap Progress Summary */}
            <section
              className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-5 space-y-3 shadow-xs dark:shadow-none"
              data-purpose="overall-progress"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Curriculum Node Progress
                  </span>
                  <span className="text-xs text-slate-400 dark:text-neutral-500">
                    ({overallStats.total} total nodes across all modules)
                  </span>
                </div>

                {/* Counts Badges */}
                <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Done: <AnimatedNumber value={overallStats.done} />
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    Learning: <AnimatedNumber value={overallStats.learning} />
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-white/[0.06]">
                    Pending: <AnimatedNumber value={overallStats.pending} />
                  </span>
                  <div className="flex items-baseline gap-1 ml-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                      <AnimatedNumber value={overallStats.pct} />%
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase">
                      Total
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-1">
                <AnimatedProgressBar
                  pct={overallStats.pct}
                  color="bg-sky-500 dark:bg-sky-400"
                  className="w-full bg-slate-100 dark:bg-[#0e0e0e] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.06]"
                />
              </div>
            </section>

            {/* Modules Sidebar + Interactive Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Curated Roadmap Modules Sidebar (4 cols) */}
              <aside className="lg:col-span-4 flex flex-col space-y-3 lg:sticky lg:top-20">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-neutral-400">
                      CURATED ROADMAP MODULES
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-neutral-400 font-medium">
                      {categoryProgress.length} Modules
                    </span>
                  </div>
                </div>

                {/* Vertical Module Selection List */}
                <div className="space-y-2.5" role="tablist">
                  {categoryProgress.map((cat) => {
                    const isActive = activeSectionId === cat.mainId;
                    return (
                      <button
                        type="button"
                        key={cat.mainId}
                        onClick={() => setActiveSectionId(cat.mainId)}
                        role="tab"
                        aria-selected={isActive}
                        className={`w-full text-left cursor-pointer group relative rounded-xl p-3.5 transition-all select-none overflow-hidden bg-white dark:bg-[#121212] ${
                          isActive
                            ? "border border-sky-500/60 dark:border-sky-400/60 shadow-xs ring-1 ring-sky-500/20"
                            : "border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] shadow-xs"
                        }`}
                      >
                        {/* Active Left Indicator Bar */}
                        {isActive && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-sky-500 dark:bg-sky-400 rounded-r" />
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <div className={isActive ? "pl-2" : "pl-0"}>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm font-semibold transition-colors ${
                                  isActive
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-700 dark:text-neutral-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                }`}
                              >
                                {cat.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                              <AnimatedNumber value={cat.completed} /> of <AnimatedNumber value={cat.total} /> done
                            </p>
                          </div>

                          <span
                            className={`text-xs font-semibold shrink-0 font-mono ${
                              isActive
                                ? "text-sky-600 dark:text-sky-400 font-bold"
                                : "text-slate-500 dark:text-neutral-400"
                            }`}
                          >
                            <AnimatedNumber value={cat.pct} />%
                          </span>
                        </div>

                        {/* Module Progress Bar */}
                        <div className={`mt-3 ${isActive ? "pl-2" : "pl-0"}`}>
                          <AnimatedProgressBar
                            pct={cat.pct}
                            color={isActive ? "bg-sky-500 dark:bg-sky-400" : "bg-slate-400 dark:bg-neutral-600"}
                            className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* RIGHT COLUMN: Interactive Roadmap Canvas (8 cols) */}
              <section className="lg:col-span-8 w-full min-w-0" data-purpose="roadmap-canvas">
                <RoadmapFlowChart
                  title={`${activeLabel} Roadmap`}
                  sections={activeSection ? [activeSection] : []}
                  storageKey="prep_os_dsa_roadmap_v2"
                />
              </section>
            </div>
          </div>
        )}

        {/* VIEW 2: NEETCODE 150 PRACTICE (Problems & LeetCode Sync) */}
        {activeTab === "neetcode" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* BEGIN: Compact LeetCode Stats & 1-Click Sync Bar */}
            <section
              className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs dark:shadow-none"
              data-purpose="compact-leetcode-stats-bar"
            >
              {/* Left: User identity & rank */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-neutral-900 p-0.5 relative overflow-hidden flex items-center justify-center shrink-0">
                  {activeProfile?.userAvatar ? (
                    <Image
                      src={activeProfile.userAvatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="w-full h-full rounded-[6px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[6px] bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-400">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    @{activeProfile?.username || leetcodeUsername || "Not linked"}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    LeetCode Synced
                  </span>
                  {activeProfile?.ranking && (
                    <>
                      <span className="text-slate-300 dark:text-neutral-700 hidden sm:inline">•</span>
                      <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono hidden sm:inline">
                        Rank #{activeProfile.ranking.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Breakdown Pill, 1-Click Sync, and Settings Link */}
              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-lg px-2.5 py-1 text-xs font-mono">
                  <span className="text-sky-600 dark:text-sky-400 font-bold">
                    <AnimatedNumber value={totalSolved} /> Solved
                  </span>
                  <span className="text-slate-300 dark:text-neutral-700">|</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    <AnimatedNumber value={easySolved} /> E |
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    <AnimatedNumber value={mediumSolved} /> M |
                  </span>
                  <span className="text-rose-600 dark:text-rose-500 font-medium">
                    <AnimatedNumber value={hardSolved} /> H 
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => triggerSync(false)}
                  disabled={syncMutation.isPending}
                  title="Quick Sync with LeetCode"
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0e0e0e] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-medium text-slate-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${
                      syncMutation.isPending ? "animate-spin text-sky-500" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {syncMutation.isPending ? "Syncing..." : "Sync"}
                  </span>
                </button>

                <Link
                  href="/dashboard/profile#integrations"
                  title="Configure Handle in Profile Settings"
                  className="text-xs text-slate-400 hover:text-sky-500 dark:text-neutral-500 dark:hover:text-sky-400 transition-colors flex items-center gap-1 px-1.5 py-1"
                >
                  <span>Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </section>
            {/* END: Compact LeetCode Stats Bar */}

            {/* Sync Feedback Alerts */}
            {syncMutation.isError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Failed to sync LeetCode profile. Please check the handle and try again.
                </span>
              </div>
            )}
            {syncMutation.isSuccess && syncMutation.data && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>{syncMutation.data.message}</span>
              </div>
            )}

            {/* NeetCode 150 Problems Section */}
            <Neetcode150Section />
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useLeetCodeProfile } from "@/features/dsa/useProblems";
import { useProjects } from "@/features/projects/useProjects";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import { useDoubts } from "@/features/doubts/useDoubts";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import type { RoadmapNodeItem } from "@/features/roadmap/types";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import {
  RotateCw,
  Plus,
  ArrowUpRight,
  FolderKanban,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function UnifiedDashboardPage() {
  const { data: projects = [] } = useProjects();
  const { data: dsaFlowchartStatus = {} } = useRoadmapProgress("prep_os_dsa_roadmap_v2");
  const { data: theoryFlowchartStatus = {} } = useRoadmapProgress("prep_os_theory_roadmap");
  const { data: doubts = [] } = useDoubts();

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setIsRefreshing(false);
  };

  // ── DSA Progress ─────────────────────────────────────────────────────────
  const { totalDsaNodes, doneDsaNodes, inProgressDsaNodes } = useMemo(() => {
    const inProgressDsaNodes: { title: string; section: string }[] = [];

    const gatherNodeStats = (nodes?: RoadmapNodeItem[], sectionName = "") => {
      if (!nodes) return { total: 0, completed: 0 };
      let t = 0, c = 0;
      const traverse = (list: RoadmapNodeItem[]) => {
        list.forEach((n) => {
          t++;
          const st = dsaFlowchartStatus[n.id];
          if (st === "done") c++;
          if (st === "in-progress") inProgressDsaNodes.push({ title: n.title, section: sectionName });
          if (n.subNodes) traverse(n.subNodes);
        });
      };
      traverse(nodes);
      return { total: t, completed: c };
    };

    const categoryProgress = DSA_ROADMAP_SECTIONS.map((sec) => {
      const name = sec.mainTitle.replace(/^\d+\.\s*/, "");
      const l = gatherNodeStats(sec.leftNodes, name);
      const r = gatherNodeStats(sec.rightNodes, name);
      const tot = l.total + r.total;
      const com = l.completed + r.completed;
      return {
        title: name,
        total: tot,
        completed: com,
      };
    });

    const totalDsaNodes = categoryProgress.reduce((acc, curr) => acc + curr.total, 0);
    const doneDsaNodes = categoryProgress.reduce((acc, curr) => acc + curr.completed, 0);

    return { totalDsaNodes, doneDsaNodes, inProgressDsaNodes };
  }, [dsaFlowchartStatus]);

  const dsaPct = totalDsaNodes > 0 ? Math.round((doneDsaNodes / totalDsaNodes) * 100) : 0;

  // ── Theory Progress ──────────────────────────────────────────────────────
  const { totalTheory, doneTheory, inProgressTheory } = useMemo(() => {
    const inProgressTheory: { title: string; subject: string }[] = [];

    const SUBJECT_MAP: Record<string, string> = {
      "theory-os": "Operating Systems",
      "theory-dbms": "DBMS",
      "theory-cn": "Computer Networks",
      "theory-oop": "OOP",
      "theory-aptitude": "Aptitude",
    };

    const theorySubjectStats = THEORY_ROADMAP_SECTIONS.map((sec) => {
      const subjectName = SUBJECT_MAP[sec.mainId] || sec.mainTitle;
      let sTotal = 0;
      let sCompleted = 0;

      const traverse = (nodes?: RoadmapNodeItem[]) => {
        nodes?.forEach((n) => {
          sTotal++;
          const st = theoryFlowchartStatus[n.id];
          if (st === "done") sCompleted++;
          if (st === "in-progress") inProgressTheory.push({ title: n.title, subject: subjectName });
          if (n.subNodes) traverse(n.subNodes);
        });
      };

      traverse(sec.leftNodes);
      traverse(sec.rightNodes);

      return {
        subject: subjectName,
        total: sTotal,
        completed: sCompleted,
      };
    });

    const totalTheory = theorySubjectStats.reduce((acc, curr) => acc + curr.total, 0);
    const doneTheory = theorySubjectStats.reduce((acc, curr) => acc + curr.completed, 0);

    return { totalTheory, doneTheory, inProgressTheory };
  }, [theoryFlowchartStatus]);

  const theoryPct = totalTheory > 0 ? Math.round((doneTheory / totalTheory) * 100) : 0;

  // ── Projects ─────────────────────────────────────────────────────────────
  const inProgressProjects = projects.filter((p) => p.status === "in-progress");
  const doneProjects = projects.filter((p) => p.status === "completed").length;

  // ── LeetCode Stats ───────────────────────────────────────────────────────
  const { data: dbLeetcodeProfile } = useLeetCodeProfile();
  const totalSolved = dbLeetcodeProfile?.totalSolved ?? 0;
  const easy = dbLeetcodeProfile?.easySolved ?? 0;
  const medium = dbLeetcodeProfile?.mediumSolved ?? 0;
  const hard = dbLeetcodeProfile?.hardSolved ?? 0;

  // ── Doubts ───────────────────────────────────────────────────────────────
  const unresolvedDoubts = doubts.filter((d) => !d.resolved);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-[#EDEDED] flex flex-col antialiased transition-colors duration-200">
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Header Section with Title, Subtitle, and Primary Actions */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Placement preparation overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Unified tracking for data structures, theory topics, and active engineering work.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-xs dark:shadow-none"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-sky-500 dark:text-sky-400" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            
            <Link href="/dashboard/doubts">
              <button
                type="button"
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-lg transition-colors shadow-sm shadow-sky-500/20 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log doubt</span>
              </button>
            </Link>
          </div>
        </section>

        {/* Key Performance Indicators (KPIs) */}
        <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric Card 1: Problems Solved */}
          <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
            <div className="text-sm font-bold text-slate-800 dark:text-neutral-200">Problems solved</div>
            <div className="my-3">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                <AnimatedNumber value={totalSolved} />
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400 flex items-center space-x-1.5">
              <span className="font-medium text-emerald-500 dark:text-emerald-400">
                <AnimatedNumber value={easy} /> easy
              </span>
              <span className="text-slate-300 dark:text-neutral-600">·</span>
              <span className="font-medium text-amber-500 dark:text-amber-400">
                <AnimatedNumber value={medium} /> med
              </span>
              <span className="text-slate-300 dark:text-neutral-600">·</span>
              <span className="font-medium text-rose-500 dark:text-rose-400">
                <AnimatedNumber value={hard} /> hard
              </span>
            </div>
          </div>

          {/* Metric Card 2: DSA Roadmap Progress */}
          <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
            <div className="text-sm font-bold text-slate-800 dark:text-neutral-200">DSA roadmap progress</div>
            <div className="my-3">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                <AnimatedNumber value={dsaPct} />%
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">
              <AnimatedNumber value={doneDsaNodes} /> of <AnimatedNumber value={totalDsaNodes} /> nodes
            </div>
          </div>

          {/* Metric Card 3: CS Theory Topics */}
          <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
            <div className="text-sm font-bold text-slate-800 dark:text-neutral-200">CS theory completed</div>
            <div className="my-3">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                <AnimatedNumber value={theoryPct} />%
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">
              <AnimatedNumber value={doneTheory} /> of <AnimatedNumber value={totalTheory} /> topics
            </div>
          </div>

          {/* Metric Card 4: Projects Completed */}
          <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
            <div className="text-sm font-bold text-slate-800 dark:text-neutral-200">Projects completed</div>
            <div className="my-3">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                <AnimatedNumber value={doneProjects} />
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-neutral-400">
              {doneProjects === projects.length && projects.length > 0 ? (
                "All milestones cleared"
              ) : (
                <>
                  <AnimatedNumber value={projects.length} /> total projects
                </>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Content Columns */}
        <div className="space-y-6">
          {/* Row 1: In Progress DSA & CS Theory */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Column A: DSA Topics In Progress */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">DSA topics in progress</h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Active roadmap milestones and learning path</p>
                </div>
                <Link
                  href="/dashboard/dsa"
                  className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 inline-flex items-center space-x-1 transition-colors"
                >
                  <span>Open</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-neutral-200 font-medium">Overall roadmap completion</span>
                  <span className="text-slate-500 dark:text-neutral-400 font-medium">
                    <AnimatedNumber value={dsaPct} />% <span className="text-slate-300 dark:text-neutral-600">·</span> <AnimatedNumber value={doneDsaNodes} /> / <AnimatedNumber value={totalDsaNodes} /> nodes
                  </span>
                </div>
                <AnimatedProgressBar
                  pct={dsaPct}
                  color="bg-sky-500 dark:bg-sky-400"
                  className="w-full bg-slate-100 dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden"
                />
              </div>

              <div className="pt-3.5 border-t border-slate-100 dark:border-white/[0.08] space-y-2.5">
                {inProgressDsaNodes.length === 0 ? (
                  <div className="text-xs text-slate-400 dark:text-neutral-500 py-2">
                    No active DSA topics in progress. Mark topics on the roadmap to track here.
                  </div>
                ) : (
                  inProgressDsaNodes.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse shrink-0" />
                          <span className="text-sm font-medium text-slate-800 dark:text-neutral-200 truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 pl-4 truncate">{item.section}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 shrink-0">
                        Learning
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column B: CS Theory Topics In Progress */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">CS theory topics in progress</h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Core syllabus fundamentals and concepts</p>
                </div>
                <Link
                  href="/dashboard/theory"
                  className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 inline-flex items-center space-x-1 transition-colors"
                >
                  <span>Open</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-neutral-200 font-medium">Core syllabus coverage</span>
                  <span className="text-slate-500 dark:text-neutral-400 font-medium">
                    <AnimatedNumber value={theoryPct} />% <span className="text-slate-300 dark:text-neutral-600">·</span> <AnimatedNumber value={doneTheory} /> / <AnimatedNumber value={totalTheory} /> topics
                  </span>
                </div>
                <AnimatedProgressBar
                  pct={theoryPct}
                  color="bg-sky-500 dark:bg-sky-400"
                  className="w-full bg-slate-100 dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden"
                />
              </div>

              <div className="pt-3.5 border-t border-slate-100 dark:border-white/[0.08] space-y-2.5">
                {inProgressTheory.length === 0 ? (
                  <div className="text-xs text-slate-400 dark:text-neutral-500 py-2">
                    No CS theory topics currently in progress. Mark topics on the theory roadmap to track here.
                  </div>
                ) : (
                  inProgressTheory.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse shrink-0" />
                          <span className="text-sm font-medium text-slate-800 dark:text-neutral-200 truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 pl-4 truncate">{item.subject}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 shrink-0">
                        Learning
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </section>

          {/* Row 2: Doubt Queue & Active Projects */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Column C: Doubt Queue */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Doubt queue</h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Flagged questions pending second pass review</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.08]">
                    <AnimatedNumber value={unresolvedDoubts.length} /> {unresolvedDoubts.length === 1 ? "item" : "items"}
                  </span>
                  <Link
                    href="/dashboard/doubts"
                    className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 inline-flex items-center space-x-1 transition-colors"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.06] flex-1">
                {unresolvedDoubts.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400/80" />
                    <p className="text-sm font-medium text-slate-800 dark:text-neutral-300">All doubts resolved</p>
                    <p className="text-xs text-slate-400 dark:text-neutral-500">Log new doubts directly from problem roadmaps</p>
                  </div>
                ) : (
                  unresolvedDoubts.slice(0, 3).map((doubt) => (
                    <article key={doubt.id} className="py-3 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                      <div className="min-w-0 pr-4">
                        <Link href="/dashboard/doubts" className="text-sm font-medium text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white truncate block">
                          {doubt.title}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-neutral-400">{doubt.topic}</span>
                          <span className="text-slate-300 dark:text-neutral-600 text-xs">·</span>
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                            doubt.priority === "high"
                              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                              : doubt.priority === "medium"
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                              : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/[0.08]"
                          }`}>
                            {doubt.priority === "high" ? "High" : doubt.priority === "medium" ? "Medium" : "Low"}
                          </span>
                        </div>
                      </div>

                      {doubt.url ? (
                        <a
                          href={doubt.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${doubt.title}`}
                          className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 flex items-center space-x-1 p-1 transition-colors shrink-0"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          href="/dashboard/doubts"
                          className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 flex items-center space-x-1 p-1 transition-colors shrink-0"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Column D: Active Projects */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors shadow-xs dark:shadow-none">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active projects</h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Development tracking and repository sync</p>
                </div>
                <Link
                  href="/dashboard/projects"
                  className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 inline-flex items-center space-x-1 transition-colors"
                >
                  <span>Open</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 3 Stats Overview */}
              <div className="grid grid-cols-3 gap-2.5 py-4 border-b border-slate-100 dark:border-white/[0.08]">
                <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-lg text-center">
                  <div className="text-lg font-semibold text-slate-800 dark:text-neutral-200 tracking-tight">
                    <AnimatedNumber value={projects.length} />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Total</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-lg text-center">
                  <div className="text-lg font-semibold text-sky-600 dark:text-sky-400 tracking-tight">
                    <AnimatedNumber value={inProgressProjects.length} />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Active</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-lg text-center">
                  <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    <AnimatedNumber value={doneProjects} />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Done</div>
                </div>
              </div>

              {/* Projects List or Empty State */}
              <div className="py-4 flex-1">
                {inProgressProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400 dark:text-neutral-400">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">No active projects yet</div>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Log a new project and set it as &quot;In progress&quot;</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {inProgressProjects.slice(0, 3).map((proj) => (
                      <div key={proj._id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                        <div className="min-w-0 pr-3">
                          <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 truncate">{proj.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 truncate">{proj.techStack?.join(", ")}</p>
                        </div>
                        {proj.repoUrl && (
                          <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
                <Link href="/dashboard/projects">
                  <button
                    type="button"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-lg transition-colors shadow-sm shadow-sky-500/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log project</span>
                  </button>
                </Link>

                <a
                  href="https://github.com/mayankjain92/prep-os"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.12] rounded-lg transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  <span>GitHub synced</span>
                </a>
              </div>
            </div>

          </section>
        </div>

      </main>
    </div>
  );
}

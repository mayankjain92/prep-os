"use client";

import { useState, useMemo } from "react";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import { RoadmapFlowChart } from "@/features/roadmap/components/RoadmapFlowChart";
import type { RoadmapNodeItem } from "@/features/roadmap/types";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import { TrendingUp } from "lucide-react";

const SUBJECTS = [
  { key: "OS", label: "Operating Systems", mainId: "theory-os" },
  { key: "DBMS", label: "Database Systems", mainId: "theory-dbms" },
  { key: "CN", label: "Computer Networks", mainId: "theory-cn" },
  { key: "OOP", label: "Object-Oriented Design", mainId: "theory-oop" },
  { key: "Aptitude", label: "Quantitative & Logic", mainId: "theory-aptitude" },
] as const;

export default function TheoryDashboardPage() {
  const { data: roadmapStatus = {} } = useRoadmapProgress("prep_os_theory_roadmap");
  const [activeSubjectId, setActiveSubjectId] = useState<string>(SUBJECTS[0].mainId);

  // Compute stats per section & overall stats
  const { subjectStats, overallStats } = useMemo(() => {
    const stats = SUBJECTS.map((sub) => {
      const section = THEORY_ROADMAP_SECTIONS.find((s) => s.mainId === sub.mainId);
      let total = 0;
      let completed = 0;
      let learning = 0;

      if (section) {
        const traverse = (nodes?: RoadmapNodeItem[]) => {
          nodes?.forEach((n) => {
            total++;
            const st = roadmapStatus[n.id];
            if (st === "done") completed++;
            else if (st === "in-progress") learning++;
            if (n.subNodes) traverse(n.subNodes);
          });
        };
        traverse(section.leftNodes);
        traverse(section.rightNodes);
      }

      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...sub, total, completed, learning, percentage };
    });

    const grandTotal = stats.reduce((acc, s) => acc + s.total, 0);
    const grandDone = stats.reduce((acc, s) => acc + s.completed, 0);
    const grandLearning = stats.reduce((acc, s) => acc + s.learning, 0);
    const grandPending = grandTotal - grandDone - grandLearning;
    const grandPct = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0;

    return {
      subjectStats: stats,
      overallStats: {
        total: grandTotal,
        done: grandDone,
        learning: grandLearning,
        pending: grandPending,
        pct: grandPct,
      },
    };
  }, [roadmapStatus]);

  const activeSection = THEORY_ROADMAP_SECTIONS.find((s) => s.mainId === activeSubjectId);
  const activeLabel = SUBJECTS.find((s) => s.mainId === activeSubjectId)?.label || "Roadmap";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 pb-28 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        {/* BEGIN: PageHeader */}
        <section className="space-y-1" data-purpose="header-section">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              PLACEMENT CURRICULUM
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
            <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
              B.Tech & Technical Interviews
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Computer Science Theory & Fundamentals
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 max-w-2xl">
                Interactive, node-by-node learning roadmaps designed for technical placement interviews and core engineering exams.
              </p>
            </div>
          </div>
        </section>
        {/* END: PageHeader */}

        {/* BEGIN: OverallProgressSummary */}
        <section
          className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-5 space-y-4 shadow-xs dark:shadow-none"
          data-purpose="overall-progress"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Core Engineering Curriculum Progress
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                OS, DBMS, Computer Networks, Object-Oriented Design, and Placement Aptitude
              </p>
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
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-base">
                  <AnimatedNumber value={overallStats.pct} />%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-wider font-semibold">TOTAL</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
              <div className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="font-medium text-xs text-slate-700 dark:text-neutral-300">CS Theory Overall Progress</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                {overallStats.total} total nodes across all theory subjects
              </span>
            </div>
            <AnimatedProgressBar
              pct={overallStats.pct}
              color="bg-sky-500 dark:bg-sky-400"
              className="w-full bg-slate-100 dark:bg-white/[0.06] h-1.5 rounded-full overflow-hidden"
            />
          </div>
        </section>
        {/* END: OverallProgressSummary */}

        {/* BEGIN: Split View Layout - Curated Modules Sidebar (4 cols) & Interactive Roadmap Canvas (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Curated Theory Modules Sidebar (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col space-y-3 lg:sticky lg:top-20">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-neutral-400">
                  CURATED THEORY MODULES
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-neutral-400 font-medium">
                  {subjectStats.length} Subjects
                </span>
              </div>
            </div>

            {/* Vertical Module Selection List */}
            <div className="space-y-2.5" role="tablist">
              {subjectStats.map((stat) => {
                const isActive = activeSubjectId === stat.mainId;
                return (
                  <button
                    type="button"
                    key={stat.key}
                    onClick={() => setActiveSubjectId(stat.mainId)}
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
                            {stat.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                          <AnimatedNumber value={stat.completed} /> of <AnimatedNumber value={stat.total} /> done
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold shrink-0 font-mono ${
                          isActive
                            ? "text-sky-600 dark:text-sky-400 font-bold"
                            : "text-slate-500 dark:text-neutral-400"
                        }`}
                      >
                        <AnimatedNumber value={stat.percentage} />%
                      </span>
                    </div>

                    {/* Module Progress Bar */}
                    <div className={`mt-3 ${isActive ? "pl-2" : "pl-0"}`}>
                      <AnimatedProgressBar
                        pct={stat.percentage}
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
              storageKey="prep_os_theory_roadmap"
            />
          </section>
        </div>
        {/* END: Split View Layout */}
      </main>
    </div>
  );
}

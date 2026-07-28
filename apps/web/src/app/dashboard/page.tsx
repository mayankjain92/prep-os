"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useProblems, useLeetCodeProfile } from "@/features/dsa/useProblems";
import { useProjects } from "@/features/projects/useProjects";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import type { RoadmapNodeItem } from "@/components/shared/RoadmapFlowChart";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard, AnimatedProgressBar } from "@/components/shared/PageTransition";
import {
  Code2,
  BookOpen,
  FolderKanban,
  Trophy,
  ExternalLink,
  Clock,
  Zap,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  sub,
  accent,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
  delay?: number;
}) {
  const numericVal = typeof value === "number" ? value : parseFloat(value.toString().replace("%", ""));
  const isPercent = typeof value === "string" && value.endsWith("%");

  return (
    <FadeInCard delay={delay} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-1.5 shadow-sm">
      <span className={`text-[10px] font-bold uppercase tracking-widest ${accent}`}>{label}</span>
      <span className="text-3xl font-black text-foreground leading-none">
        {!isNaN(numericVal) ? (
          <>
            <AnimatedNumber value={numericVal} duration={1200} />
            {isPercent && "%"}
          </>
        ) : (
          value
        )}
      </span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </FadeInCard>
  );
}

function SectionHeader({
  icon,
  title,
  href,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-base font-black text-foreground">{title}</h2>
      </div>
      <Link href={href}>
        <button className={`text-xs font-bold ${accent} hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5`}>
          Open <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </Link>
    </div>
  );
}

function EmptyState({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center">
      <p className="text-xs text-muted-foreground font-medium">{message}</p>
      <p className="text-[10px] text-muted-foreground/70 mt-1">{hint}</p>
    </div>
  );
}

// ─── page ──────────────────────────────────────────────────────────────────

export default function UnifiedDashboardPage() {
  const { data: problems = [] } = useProblems();
  const { data: projects = [] } = useProjects();
  const { data: dsaFlowchartStatus = {} } = useRoadmapProgress("prep_os_dsa_roadmap_v2");
  const { data: theoryFlowchartStatus = {} } = useRoadmapProgress("prep_os_theory_roadmap");

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setIsRefreshing(false);
  };

  // ── DSA ────────────────────────────────────────────────────────────────
  const { totalDsaNodes, doneDsaNodes, inProgressDsaNodes, categoryProgress } = useMemo(() => {
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
        pct: tot > 0 ? Math.round((com / tot) * 100) : 0,
      };
    });

    const totalDsaNodes = categoryProgress.reduce((acc, curr) => acc + curr.total, 0);
    const doneDsaNodes = categoryProgress.reduce((acc, curr) => acc + curr.completed, 0);

    return { totalDsaNodes, doneDsaNodes, inProgressDsaNodes, categoryProgress };
  }, [dsaFlowchartStatus]);

  const dsaPct = totalDsaNodes > 0 ? Math.round((doneDsaNodes / totalDsaNodes) * 100) : 0;

  // ── Theory ─────────────────────────────────────────────────────────────
  const { totalTheory, doneTheory, inProgressTheory, theorySubjectStats } = useMemo(() => {
    const inProgressTheory: { title: string; subject: string }[] = [];

    const SUBJECT_MAP: Record<string, string> = {
      "theory-os": "OS",
      "theory-dbms": "DBMS",
      "theory-cn": "CN",
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
          if (st === "done") {
            sCompleted++;
          }
          if (st === "in-progress") {
            inProgressTheory.push({ title: n.title, subject: subjectName });
          }
          if (n.subNodes) traverse(n.subNodes);
        });
      };

      traverse(sec.leftNodes);
      traverse(sec.rightNodes);

      return {
        subject: subjectName,
        total: sTotal,
        completed: sCompleted,
        percentage: sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0,
      };
    });

    const totalTheory = theorySubjectStats.reduce((acc, curr) => acc + curr.total, 0);
    const doneTheory = theorySubjectStats.reduce((acc, curr) => acc + curr.completed, 0);

    return { totalTheory, doneTheory, inProgressTheory, theorySubjectStats };
  }, [theoryFlowchartStatus]);

  const theoryPct = totalTheory > 0 ? Math.round((doneTheory / totalTheory) * 100) : 0;

  // ── Projects ───────────────────────────────────────────────────────────
  const inProgressProjects = projects.filter((p) => p.status === "in-progress");
  const doneProjects = projects.filter((p) => p.status === "completed").length;

  const { data: dbLeetcodeProfile } = useLeetCodeProfile();

  // ── LeetCode ───────────────────────────────────────────────────────────
  const solvedProblems = problems.filter((p) => p.status === "solved");
  const totalSolved = dbLeetcodeProfile?.totalSolved ?? solvedProblems.length;
  const easy = dbLeetcodeProfile?.easySolved ?? solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const medium = dbLeetcodeProfile?.mediumSolved ?? solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hard = dbLeetcodeProfile?.hardSolved ?? solvedProblems.filter((p) => p.difficulty === "Hard").length;

  return (
    <PageTransition className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 space-y-8">

        {/* ════════════════════════════════════ HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-xblue" />
              <span className="text-[11px] font-bold text-xblue uppercase tracking-widest">Prep-OS</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Progress Overview</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Your placement prep — all in one place.</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="rounded-full border-border text-foreground hover:bg-card text-xs font-bold gap-1.5 px-4 h-8 self-start sm:self-center transition-transform active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-xblue ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh All"}
          </Button>
        </div>

        {/* ════════════════════════════════════ STAT PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatPill label="LeetCode" value={totalSolved} sub="problems solved" accent="text-amber-500" delay={0.05} />
          <StatPill label="DSA Roadmap" value={`${dsaPct}%`} sub={`${doneDsaNodes} / ${totalDsaNodes} nodes`} accent="text-xblue" delay={0.1} />
          <StatPill label="CS Theory" value={`${theoryPct}%`} sub={`${doneTheory} / ${totalTheory} topics`} accent="text-purple-500" delay={0.15} />
          <StatPill label="Projects" value={projects.length} sub={`${doneProjects} completed`} accent="text-emerald-500" delay={0.2} />
        </div>

        {/* ════════════════════════════════════ MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Currently Learning: DSA ─────────────────── */}
          <FadeInCard delay={0.25} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
            <SectionHeader
              icon={<div className="h-7 w-7 rounded-xl bg-xblue/10 flex items-center justify-center"><Code2 className="h-4 w-4 text-xblue" /></div>}
              title="DSA Topics In Progress"
              href="/dashboard/dsa"
              accent="text-xblue"
            />

            {/* mini overall bar */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-background border border-border">
              <AnimatedProgressBar pct={dsaPct} color="bg-xblue" />
              <span className="text-xs font-black text-xblue shrink-0">
                <AnimatedNumber value={dsaPct} />%
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-60 pr-1">
              {inProgressDsaNodes.length === 0 ? (
                <EmptyState message="No DSA topics in progress yet." hint='Mark any node as "Learning" on the DSA Roadmap.' />
              ) : (
                inProgressDsaNodes.slice(0, 6).map((n, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-xblue/20 bg-xblue/5 px-3 py-2.5">
                    <Clock className="h-3.5 w-3.5 text-xblue shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                      <p className="text-[10px] text-muted-foreground">{n.section}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto border-xblue/30 text-xblue bg-xblue/10 text-[10px] font-bold rounded-full shrink-0 px-2">
                      Learning
                    </Badge>
                  </div>
                ))
              )}
            </div>
            {inProgressDsaNodes.length > 6 && (
              <p className="text-[10px] text-center text-muted-foreground mt-2">+{inProgressDsaNodes.length - 6} more topics in progress</p>
            )}
          </FadeInCard>

          {/* ── Currently Learning: Theory ──────────────── */}
          <FadeInCard delay={0.3} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
            <SectionHeader
              icon={<div className="h-7 w-7 rounded-xl bg-purple-500/10 flex items-center justify-center"><BookOpen className="h-4 w-4 text-purple-500" /></div>}
              title="CS Theory Topics In Progress"
              href="/dashboard/theory"
              accent="text-purple-500"
            />

            {/* mini overall bar */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-background border border-border">
              <AnimatedProgressBar pct={theoryPct} color="bg-purple-500" />
              <span className="text-xs font-black text-purple-500 shrink-0">
                <AnimatedNumber value={theoryPct} />%
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-60 pr-1">
              {inProgressTheory.length === 0 ? (
                <EmptyState message="No theory topics in progress yet." hint='Mark any node as "Learning" on the CS Theory Roadmap.' />
              ) : (
                inProgressTheory.slice(0, 6).map((t, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2.5">
                    <Clock className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground">{t.subject}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto border-purple-500/30 text-purple-500 bg-purple-500/10 text-[10px] font-bold rounded-full shrink-0 px-2">
                      Learning
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </FadeInCard>

          {/* ── Active Projects ─────────────────────────── */}
          <FadeInCard delay={0.35} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
            <SectionHeader
              icon={<div className="h-7 w-7 rounded-xl bg-amber-500/10 flex items-center justify-center"><FolderKanban className="h-4 w-4 text-amber-500" /></div>}
              title="Active Projects"
              href="/dashboard/projects"
              accent="text-amber-500"
            />

            {/* mini project stat row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Total", val: projects.length, color: "text-foreground" },
                { label: "Active", val: inProgressProjects.length, color: "text-amber-500" },
                { label: "Done", val: doneProjects, color: "text-emerald-500" },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-xl border border-border bg-background p-3 text-center">
                  <p className={`text-lg font-black ${color}`}>
                    <AnimatedNumber value={val} />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-48 pr-1">
              {inProgressProjects.length === 0 ? (
                <EmptyState message="No active projects yet." hint='Log a new project and set it as "In Progress".' />
              ) : (
                inProgressProjects.slice(0, 4).map((proj) => (
                  <div key={proj._id} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-foreground truncate">{proj.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{proj.techStack?.join(", ")}</p>
                    </div>
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer"
                        className="text-[10px] text-xblue hover:underline flex items-center gap-0.5 font-bold shrink-0">
                        Repo <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </FadeInCard>

          {/* ── LeetCode + DSA sections ─────────────────── */}
          <FadeInCard delay={0.4} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col gap-5">

            {/* LeetCode */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-sm font-black text-foreground">LeetCode Progress</span>
                <Badge variant="outline" className="ml-auto border-amber-500/30 text-amber-500 bg-amber-500/10 text-[10px] font-bold rounded-full">
                  <AnimatedNumber value={totalSolved} /> solved
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Easy", val: easy, color: "text-emerald-500", bg: "bg-emerald-500/5 border-emerald-500/20" },
                  { label: "Medium", val: medium, color: "text-amber-500", bg: "bg-amber-500/5 border-amber-500/20" },
                  { label: "Hard", val: hard, color: "text-rose-500", bg: "bg-rose-500/5 border-rose-500/20" },
                ].map(({ label, val, color, bg }) => (
                  <div key={label} className={`rounded-xl border ${bg} p-3`}>
                    <p className={`text-lg font-black ${color}`}>
                      <AnimatedNumber value={val} />
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* DSA categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-xblue" /> DSA Section Breakdown
                </span>
                <Link href="/dashboard/dsa">
                  <button className="text-[10px] font-bold text-xblue hover:underline flex items-center gap-0.5">
                    Full Roadmap <ChevronRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>

              {/* Theory subjects */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 mb-4">
                {theorySubjectStats.map((s) => (
                  <div key={s.subject} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-foreground">{s.subject}</span>
                      <span className="text-muted-foreground">
                        <AnimatedNumber value={s.completed} />/{s.total}
                      </span>
                    </div>
                    <AnimatedProgressBar pct={s.percentage} color="bg-purple-500/70" />
                  </div>
                ))}
              </div>

              {/* DSA categories scrollable */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categoryProgress.map((cat) => (
                  <div key={cat.title} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-medium text-foreground truncate max-w-[200px]">{cat.title}</span>
                      <span className="text-muted-foreground shrink-0">
                        <AnimatedNumber value={cat.completed} />/{cat.total} (<AnimatedNumber value={cat.pct} />%)
                      </span>
                    </div>
                    <AnimatedProgressBar pct={cat.pct} color="bg-xblue" />
                  </div>
                ))}
              </div>
            </div>

          </FadeInCard>

        </div>

      </div>
    </PageTransition>
  );
}

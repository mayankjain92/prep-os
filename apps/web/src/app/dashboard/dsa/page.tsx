/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useProblems, useSyncLeetCode, useLeetCodeProfile } from "@/features/dsa/useProblems";
import { RoadmapFlowChart, type RoadmapNodeItem } from "@/components/shared/RoadmapFlowChart";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { DoubtSection } from "@/features/dsa/components/DoubtSection";
import { Neetcode150Section } from "@/features/dsa/components/Neetcode150Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard, AnimatedProgressBar } from "@/components/shared/PageTransition";
import { AlertCircle, UserCheck, GitBranch, HelpCircle, Code2, RefreshCw, Trophy, TrendingUp } from "lucide-react";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";

export default function DsaDashboardPage() {
  const { data: problems = [] } = useProblems();
  const { data: dbLeetcodeProfile } = useLeetCodeProfile();
  const { data: dsaFlowchartStatus = {} } = useRoadmapProgress("prep_os_dsa_roadmap_v2");
  const syncMutation = useSyncLeetCode();
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [activeTab, setActiveTab] = useState<"flowchart" | "neetcode" | "doubts">("flowchart");
  const [activeSectionId, setActiveSectionId] = useState<string>(DSA_ROADMAP_SECTIONS[0].mainId);

  useEffect(() => {
    if (dbLeetcodeProfile?.username && !leetcodeUsername) {
      setLeetcodeUsername(dbLeetcodeProfile.username);
    }
  }, [dbLeetcodeProfile?.username, leetcodeUsername]);

  const activeProfile = syncMutation.data?.profile || dbLeetcodeProfile;

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    const handle = leetcodeUsername.trim();
    if (!handle) return;
    syncMutation.mutate(handle);
  };

  const solvedFromDb = problems.filter((p) => p.status === "solved");
  const totalSolved = activeProfile?.totalSolved ?? solvedFromDb.length;
  const easySolved = activeProfile?.easySolved ?? solvedFromDb.filter((p) => p.difficulty === "Easy").length;
  const mediumSolved = activeProfile?.mediumSolved ?? solvedFromDb.filter((p) => p.difficulty === "Medium").length;
  const hardSolved = activeProfile?.hardSolved ?? solvedFromDb.filter((p) => p.difficulty === "Hard").length;

  const { categoryProgress, overallStats } = useMemo(() => {
    let totalAll = 0;
    let doneAll = 0;
    let learningAll = 0;

    const gatherNodeStats = (nodes?: RoadmapNodeItem[]) => {
      if (!nodes) return { total: 0, completed: 0, learning: 0 };
      let t = 0, c = 0, l = 0;
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

      totalAll += tot;
      doneAll += com;
      learningAll += lrn;

      return {
        mainId: sec.mainId,
        title: name,
        total: tot,
        completed: com,
        pct: tot > 0 ? Math.round((com / tot) * 100) : 0,
      };
    });

    const pendingAll = totalAll - doneAll - learningAll;
    const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

    return {
      categoryProgress: categories,
      overallStats: { total: totalAll, done: doneAll, learning: learningAll, pending: pendingAll, pct: overallPct }
    };
  }, [dsaFlowchartStatus]);

  const activeSection = DSA_ROADMAP_SECTIONS.find(s => s.mainId === activeSectionId);
  const activeLabel = activeSection?.mainTitle.replace(/^\d+\.\s*/, "") || "Data Structures";

  return (
    <PageTransition className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold text-xblue uppercase tracking-widest">Problem Solving</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Code2 className="h-8 w-8 text-xblue" /> Data Structures & Algorithms
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Curated topic roadmaps, NeetCode 150 progress tracking, doubts queue, and live LeetCode stats synchronization.
            </p>
          </div>
        </div>

        {/* LeetCode Sync Bar */}
        <FadeInCard delay={0.05} className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="PrepOS Logo" className="h-6 w-6 object-contain flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Live LeetCode Profile Integration</h3>
              <p className="text-xs text-muted-foreground">
                Sync with your real LeetCode handle to fetch exact solved counts & recent AC submissions.
              </p>
            </div>
          </div>

          <form onSubmit={handleSync} className="flex w-full sm:w-auto items-center gap-2">
            <Input
              id="lc-search-handle"
              name="lc_search_handle"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="Enter LeetCode username"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              className="bg-background border-border text-foreground text-xs sm:w-56 rounded-full px-4"
            />
            <Button
              type="submit"
              size="sm"
              disabled={syncMutation.isPending}
              className="rounded-full bg-xblue hover:bg-xhover text-white text-xs font-bold whitespace-nowrap px-4 transition-transform active:scale-95"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncMutation.isPending ? "animate-spin" : ""}`} />
              {syncMutation.isPending ? "Syncing..." : "Sync Profile"}
            </Button>
          </form>
        </FadeInCard>

        {syncMutation.isError && (
          <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Failed to sync LeetCode profile. Please check the username and try again.</span>
          </div>
        )}
        {syncMutation.isSuccess && syncMutation.data && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-500 font-medium">
            <img src="/logo.svg" alt="PrepOS Logo" className="h-4 w-4 shrink-0 object-contain" />
            <span>{syncMutation.data.message} ({syncMutation.data.synced} problem records updated)</span>
          </div>
        )}

        {/* Live LeetCode Profile Hero Card */}
        <FadeInCard delay={0.1} className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-xblue/20 border border-xblue/40 flex items-center justify-center text-xblue">
              {activeProfile?.userAvatar ? (
                <img src={activeProfile.userAvatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                <UserCheck className="h-7 w-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">{activeProfile?.username || leetcodeUsername ? `@${activeProfile?.username || leetcodeUsername}` : "LeetCode Profile"}</h2>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 text-xs rounded-full">
                  Official LeetCode Synced
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeProfile?.ranking ? `Global Ranking: #${activeProfile.ranking.toLocaleString()}` : "LeetCode Active User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-background px-5 py-3 rounded-2xl border border-border">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Total Solved</div>
              <div className="text-2xl font-black text-xblue">
                <AnimatedNumber value={totalSolved} />
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Easy</div>
              <div className="text-lg font-bold text-emerald-500">
                <AnimatedNumber value={easySolved} />
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Medium</div>
              <div className="text-lg font-bold text-amber-500">
                <AnimatedNumber value={mediumSolved} />
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Hard</div>
              <div className="text-lg font-bold text-rose-500">
                <AnimatedNumber value={hardSolved} />
              </div>
            </div>
          </div>
        </FadeInCard>

        {/* Tab Switcher */}
        <div className="flex border border-border p-1.5 rounded-full bg-card gap-2 overflow-x-auto shadow-sm">
          <button
            onClick={() => setActiveTab("flowchart")}
            className={`border border-xblue px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "flowchart"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <GitBranch className="inline-block mr-1.5 h-3.5 w-3.5" />
            Interactive DSA Roadmap
          </button>

          <button
            onClick={() => setActiveTab("neetcode")}
            className={`border border-xblue px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "neetcode"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <Trophy className="inline-block mr-1.5 h-3.5 w-3.5 text-amber-400" />
            NeetCode 150 Tracker
          </button>

          <button
            onClick={() => setActiveTab("doubts")}
            className={`border border-xblue px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "doubts"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <HelpCircle className="inline-block mr-1.5 h-3.5 w-3.5" />
            Doubts & Future Targets Queue
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "flowchart" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Overall Progress Summary */}
            <FadeInCard delay={0.02} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-xblue" /> DSA Roadmap Overall Progress
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <AnimatedNumber value={overallStats.total} /> total nodes across all data structure & algorithm sections
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                    Done: {overallStats.done}
                  </Badge>
                  <Badge variant="outline" className="border-xblue/30 text-xblue bg-xblue/10 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                    Learning: {overallStats.learning}
                  </Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground bg-background rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                    Pending: {overallStats.pending}
                  </Badge>
                  <div className="text-xs font-black text-foreground ml-1">
                    <AnimatedNumber value={overallStats.pct} />%
                  </div>
                </div>
              </div>
              <AnimatedProgressBar 
                pct={overallStats.pct} 
                color="bg-xblue" 
                className="h-2 w-full overflow-hidden rounded-full bg-background border border-border" 
              />
            </FadeInCard>

            {/* Breakdown section acts as Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryProgress.map((cat, idx) => {
                const isActive = activeSectionId === cat.mainId;
                return (
                  <FadeInCard
                    key={cat.mainId}
                    delay={0.05 * idx}
                    onClick={() => setActiveSectionId(cat.mainId)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-2xl border p-4 transition-colors duration-200 shadow-sm flex flex-col justify-between ${
                      isActive ? "border-xblue bg-xblue/5 ring-1 ring-xblue/20" : "border-border bg-card hover:border-xblue/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`font-black text-xs sm:text-sm leading-tight ${isActive ? "text-xblue" : "text-foreground"}`}>
                        {cat.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold px-2 shrink-0 transition-colors duration-200 ${
                          isActive ? "border-xblue/40 text-xblue bg-xblue/10" : "border-border text-muted-foreground bg-background"
                        }`}
                      >
                        <AnimatedNumber value={cat.pct} />%
                      </Badge>
                    </div>

                    <div>
                      <div className="text-[11px] text-muted-foreground font-medium mb-1.5">
                        <AnimatedNumber value={cat.completed} /> of {cat.total} done
                      </div>

                      {/* Progress bar */}
                      <AnimatedProgressBar 
                        pct={cat.pct} 
                        color={isActive ? "bg-xblue" : "bg-xblue/50"} 
                        className="h-2 w-full overflow-hidden rounded-full bg-background border border-border" 
                      />
                    </div>
                  </FadeInCard>
                );
              })}
            </div>

            <RoadmapFlowChart
              title={`${activeLabel} Roadmap`}
              sections={activeSection ? [activeSection] : []}
              storageKey="prep_os_dsa_roadmap_v2"
            />
          </div>
        )}

        {activeTab === "neetcode" && (
          <Neetcode150Section />
        )}

        {activeTab === "doubts" && (
          <DoubtSection />
        )}
      </div>
    </PageTransition>
  );
}

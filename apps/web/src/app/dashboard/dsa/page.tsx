/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useProblems, useSyncLeetCode, useLeetCodeProfile } from "@/features/dsa/useProblems";
import { RoadmapFlowChart } from "@/components/shared/RoadmapFlowChart";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { DoubtSection } from "@/features/dsa/components/DoubtSection";
import { Neetcode150Section } from "@/features/dsa/components/Neetcode150Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard } from "@/components/shared/PageTransition";
import { AlertCircle, UserCheck, GitBranch, HelpCircle, Code2, RefreshCw, Trophy } from "lucide-react";

export default function DsaDashboardPage() {
  const { data: problems = [] } = useProblems();
  const { data: dbLeetcodeProfile } = useLeetCodeProfile();
  const syncMutation = useSyncLeetCode();
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [activeTab, setActiveTab] = useState<"flowchart" | "neetcode" | "doubts">("flowchart");

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

  return (
    <PageTransition className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Code2 className="h-8 w-8 text-xblue" /> Data Structures & Algorithms Roadmap
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Interactive roadmap.sh style flowchart, NeetCode 150 tracker, doubts queue, and live LeetCode sync.
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
        <div className="flex border-b border-border gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("flowchart")}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "flowchart"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <GitBranch className="inline-block mr-1.5 h-3.5 w-3.5" />
            Visual Roadmap Flowchart
          </button>

          <button
            onClick={() => setActiveTab("neetcode")}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "neetcode"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Trophy className="inline-block mr-1.5 h-3.5 w-3.5 text-amber-400" />
            NeetCode 150 Tracker
          </button>

          <button
            onClick={() => setActiveTab("doubts")}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "doubts"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <HelpCircle className="inline-block mr-1.5 h-3.5 w-3.5" />
            Doubts & Future Targets Queue
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "flowchart" && (
          <RoadmapFlowChart
            title="Data Structures & Algorithms Flowchart"
            sections={DSA_ROADMAP_SECTIONS}
            storageKey="prep_os_dsa_roadmap_v2"
          />
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

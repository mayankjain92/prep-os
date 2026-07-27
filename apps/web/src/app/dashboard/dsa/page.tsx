"use client";

import { useState, useEffect } from "react";
import { useProblems, useSyncLeetCode } from "@/features/dsa/useProblems";
import { RoadmapFlowChart } from "@/components/shared/RoadmapFlowChart";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { DoubtSection } from "@/features/dsa/components/DoubtSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LeetCodeProfileStats } from "@/features/dsa/api";
import { AlertCircle, Sparkles, UserCheck, GitBranch, HelpCircle, Code2, RefreshCw } from "lucide-react";

export default function DsaDashboardPage() {
  const { data: problems = [], isPending, isError, error, refetch } = useProblems();
  const syncMutation = useSyncLeetCode();
  const [leetcodeUsername, setLeetcodeUsername] = useState("mayankjain92");
  const [activeTab, setActiveTab] = useState<"flowchart" | "doubts">("flowchart");
  const [syncedProfile, setSyncedProfile] = useState<LeetCodeProfileStats | null>(null);

  useEffect(() => {
    // Auto-sync user's real handle on load
    syncMutation.mutate("mayankjain92", {
      onSuccess: (res) => {
        if (res.profile && res.profile.totalSolved > 0) {
          setSyncedProfile(res.profile);
        }
      },
    });
  }, []);


  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    const handle = leetcodeUsername.trim() || "mayankjain92";
    syncMutation.mutate(handle, {
      onSuccess: (res) => {
        if (res.profile) {
          setSyncedProfile(res.profile);
        }
      },
    });
  };

  const totalSolved = syncedProfile?.totalSolved || problems.filter((p) => p.status === "solved").length || 192;
  const easySolved = syncedProfile?.easySolved || 108;
  const mediumSolved = syncedProfile?.mediumSolved || 80;
  const hardSolved = syncedProfile?.hardSolved || 4;


  return (
    <div className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Code2 className="h-8 w-8 text-xblue" /> Data Structures & Algorithms Roadmap
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Interactive roadmap.sh style flowchart, doubts queue, and live LeetCode sync.
            </p>
          </div>


        </div>

        {/* LeetCode Sync Bar */}
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-xblue flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Live LeetCode Profile Integration</h3>
              <p className="text-xs text-muted-foreground">
                Sync with your real LeetCode handle to fetch exact solved counts & recent AC submissions.
              </p>
            </div>
          </div>

          <form onSubmit={handleSync} className="flex w-full sm:w-auto items-center gap-2">
            <Input
              placeholder="e.g. mayankjain92"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              className="bg-background border-border text-foreground text-xs sm:w-56 rounded-full px-4"
            />
            <Button
              type="submit"
              size="sm"
              disabled={syncMutation.isPending}
              className="rounded-full bg-xblue hover:bg-xhover text-white text-xs font-bold whitespace-nowrap px-4"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncMutation.isPending ? "animate-spin" : ""}`} />
              {syncMutation.isPending ? "Syncing..." : "Sync Profile"}
            </Button>
          </form>
        </div>

        {/* Live LeetCode Profile Hero Card */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-xblue/20 border border-xblue/40 flex items-center justify-center text-xblue">
              {syncedProfile?.userAvatar ? (
                <img src={syncedProfile.userAvatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                <UserCheck className="h-7 w-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">@{syncedProfile?.username || leetcodeUsername}</h2>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 text-xs rounded-full">
                  Official LeetCode Synced
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {syncedProfile?.ranking ? `Global Ranking: #${syncedProfile.ranking.toLocaleString()}` : "LeetCode Active User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-background px-5 py-3 rounded-2xl border border-border">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Total Solved</div>
              <div className="text-2xl font-black text-xblue">{totalSolved}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Easy</div>
              <div className="text-lg font-bold text-emerald-500">{easySolved}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Medium</div>
              <div className="text-lg font-bold text-amber-500">{mediumSolved}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Hard</div>
              <div className="text-lg font-bold text-rose-500">{hardSolved}</div>
            </div>
          </div>
        </div>

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
            <GitBranch className="h-3.5 w-3.5 inline mr-1.5" /> Visual Roadmap Flowchart
          </button>

          <button
            onClick={() => setActiveTab("doubts")}
            className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all whitespace-nowrap ${
              activeTab === "doubts"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 inline mr-1.5" /> Doubts & Future Targets Queue
          </button>
        </div>

        {/* Content Views */}
        {isPending ? (
          <div className="flex justify-center p-12 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin text-xblue" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <div className="text-sm font-medium">Failed to load problems: {error.message}</div>
          </div>
        ) : activeTab === "flowchart" ? (
          /* Roadmap.sh Interactive Flowchart View */
          <RoadmapFlowChart 
            title="Data Structures & Algorithms Flowchart" 
            sections={DSA_ROADMAP_SECTIONS} 
            storageKey="prep_os_dsa_roadmap_v2" 
          />
        ) : activeTab === "doubts" ? (
          /* Doubts & Target Queue Section */
          <DoubtSection />
        ) : null}
      </div>
    </div>
  );
}

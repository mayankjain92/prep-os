"use client";

import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import { RoadmapFlowChart, RoadmapNodeItem } from "@/components/shared/RoadmapFlowChart";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard, AnimatedProgressBar } from "@/components/shared/PageTransition";

const SUBJECTS = [
  { key: "OS", label: "Operating Systems", mainId: "theory-os" },
  { key: "DBMS", label: "DBMS", mainId: "theory-dbms" },
  { key: "CN", label: "Networks (CN)", mainId: "theory-cn" },
  { key: "OOP", label: "OOP & Design", mainId: "theory-oop" },
  { key: "Aptitude", label: "Aptitude", mainId: "theory-aptitude" },
] as const;

export default function TheoryDashboardPage() {
  const { data: roadmapStatus = {} } = useRoadmapProgress("prep_os_theory_roadmap");

  // Compute stats per section from THEORY_ROADMAP_SECTIONS + roadmapStatus
  const subjectStats = SUBJECTS.map((sub) => {
    const section = THEORY_ROADMAP_SECTIONS.find((s) => s.mainId === sub.mainId);
    let total = 0;
    let completed = 0;

    if (section) {
      const traverse = (nodes?: RoadmapNodeItem[]) => {
        nodes?.forEach((n) => {
          total++;
          if (roadmapStatus[n.id] === "done") completed++;
          if (n.subNodes) traverse(n.subNodes);
        });
      };
      traverse(section.leftNodes);
      traverse(section.rightNodes);
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { ...sub, total, completed, percentage };
  });

  return (
    <PageTransition className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-xblue" /> CS Theory & Aptitude Roadmap
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Master core computer science concepts across Operating Systems, DBMS, Networks, OOP, and Aptitude.
          </p>
        </div>

        {/* Section Stats Cards - 5 Subjects Symmetrical Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjectStats.map((stat, idx) => (
            <FadeInCard
              key={stat.key}
              delay={0.05 * idx}
              className="rounded-2xl border border-border bg-card p-4 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-black text-sm sm:text-base text-foreground truncate">{stat.key}</span>
                <Badge
                  variant="outline"
                  className="border-purple-500/30 text-purple-500 bg-purple-500/10 rounded-full text-[10px] font-bold px-2 shrink-0"
                >
                  <AnimatedNumber value={stat.percentage} />%
                </Badge>
              </div>

              <div>
                <div className="text-[11px] text-muted-foreground font-medium mb-1.5">
                  <AnimatedNumber value={stat.completed} /> of {stat.total} done
                </div>

                {/* Progress bar */}
                <AnimatedProgressBar pct={stat.percentage} color="bg-purple-500" className="h-2 w-full overflow-hidden rounded-full bg-background border border-border" />
              </div>
            </FadeInCard>
          ))}
        </div>

        <RoadmapFlowChart
          title="Computer Science Core & Aptitude Flowchart"
          sections={THEORY_ROADMAP_SECTIONS}
          storageKey="prep_os_theory_roadmap"
        />
      </div>
    </PageTransition>
  );
}

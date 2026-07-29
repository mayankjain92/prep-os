"use client";

import { useState } from "react";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import { RoadmapFlowChart, RoadmapNodeItem } from "@/components/shared/RoadmapFlowChart";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard, AnimatedProgressBar } from "@/components/shared/PageTransition";

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

  const activeSection = THEORY_ROADMAP_SECTIONS.find(s => s.mainId === activeSubjectId);
  const activeLabel = SUBJECTS.find(s => s.mainId === activeSubjectId)?.label || "Roadmap";

  return (
    <PageTransition className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold text-xblue uppercase tracking-widest">Placement Curriculum</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-xblue" /> CS Fundamentals & Aptitude
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
            Interactive, node-by-node learning roadmaps designed for technical placement interviews and engineering exams.
          </p>
        </div>

        {/* Section Stats Cards acts as Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjectStats.map((stat, idx) => {
            const isActive = activeSubjectId === stat.mainId;
            return (
              <FadeInCard
                key={stat.key}
                delay={0.05 * idx}
                onClick={() => setActiveSubjectId(stat.mainId)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors duration-200 shadow-sm flex flex-col justify-between ${
                  isActive ? "border-xblue bg-xblue/5 ring-1 ring-xblue/20" : "border-border bg-card hover:border-xblue/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`font-black text-sm sm:text-base truncate ${isActive ? "text-xblue" : "text-foreground"}`}>
                    {stat.key}
                  </span>
                  <Badge
                    variant="outline"
                    className={`rounded-full text-[10px] font-bold px-2 shrink-0 transition-colors duration-200 ${
                      isActive ? "border-xblue/40 text-xblue dark:text-sky-400 bg-xblue/10 dark:bg-xblue/20" : "border-purple-500/30 text-purple-600 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20"
                    }`}
                  >
                    <AnimatedNumber value={stat.percentage} />%
                  </Badge>
                </div>

                <div>
                  <div className="text-[11px] text-muted-foreground font-medium mb-1.5">
                    <AnimatedNumber value={stat.completed} /> of {stat.total} done
                  </div>

                  {/* Progress bar */}
                  <AnimatedProgressBar 
                    pct={stat.percentage} 
                    color={isActive ? "bg-xblue" : "bg-purple-500"} 
                    className="h-2 w-full overflow-hidden rounded-full bg-background border border-border" 
                  />
                </div>
              </FadeInCard>
            );
          })}
        </div>

        {/* Selected Subject Learning Roadmap */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <RoadmapFlowChart
            title={`${activeLabel} Learning Roadmap`}
            sections={activeSection ? [activeSection] : []}
            storageKey="prep_os_theory_roadmap"
          />
        </div>
      </div>
    </PageTransition>
  );
}

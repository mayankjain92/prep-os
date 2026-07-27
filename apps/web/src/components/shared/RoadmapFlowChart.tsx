"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, Sparkles, Filter, Info, ChevronRight, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoadmapProgress, useUpdateRoadmapProgress } from "@/features/roadmap/useRoadmap";
import type { NodeStatus } from "@/features/roadmap/api";

export interface RoadmapNodeItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  subNodes?: RoadmapNodeItem[];
}

export interface RoadmapSection {
  mainTitle: string;
  mainId: string;
  description?: string;
  leftNodes?: RoadmapNodeItem[];
  rightNodes?: RoadmapNodeItem[];
  subSections?: {
    title: string;
    nodes: RoadmapNodeItem[];
  }[];
}

interface RoadmapFlowChartProps {
  title: string;
  sections: RoadmapSection[];
  storageKey: string;
}

export function RoadmapFlowChart({ title, sections, storageKey }: RoadmapFlowChartProps) {
  const { data: nodeStatus = {}, isLoading, error } = useRoadmapProgress(storageKey);
  const updateMutation = useUpdateRoadmapProgress();
  
  const [filter, setFilter] = useState<"all" | "done" | "in-progress" | "pending">("all");
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeItem | null>(null);

  const saveStatuses = (newMap: Record<string, NodeStatus>) => {
    updateMutation.mutate({
      key: storageKey,
      data: { nodeStatuses: newMap }
    });
  };

  const cycleNodeStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = nodeStatus[id] || "pending";
    let next: NodeStatus = "done";
    if (current === "pending") next = "in-progress";
    else if (current === "in-progress") next = "done";
    else if (current === "done") next = "pending";

    saveStatuses({ ...nodeStatus, [id]: next });
  };

  const setExplicitStatus = (id: string, status: NodeStatus) => {
    saveStatuses({ ...nodeStatus, [id]: status });
  };

  // Calculate metrics
  let allNodesList: RoadmapNodeItem[] = [];
  const gatherNodes = (nodes?: RoadmapNodeItem[]) => {
    if (!nodes) return;
    nodes.forEach((n) => {
      allNodesList.push(n);
      if (n.subNodes) gatherNodes(n.subNodes);
    });
  };
  sections.forEach((sec) => {
    gatherNodes(sec.leftNodes);
    gatherNodes(sec.rightNodes);
  });

  const totalNodesCount = allNodesList.length;
  const doneCount = allNodesList.filter((n) => nodeStatus[n.id] === "done").length;
  const inProgressCount = allNodesList.filter((n) => nodeStatus[n.id] === "in-progress").length;
  const pendingCount = totalNodesCount - doneCount - inProgressCount;
  const progressPercentage = totalNodesCount > 0 ? Math.round((doneCount / totalNodesCount) * 100) : 0;

  const renderNodeTree = (node: RoadmapNodeItem, isSubNode = false): React.ReactNode => {
    const st = nodeStatus[node.id] || "pending";
    
    // Only apply filter hiding to top-level nodes to avoid breaking tree structure, 
    // or apply to all but if parent is hidden, children are hidden.
    if (filter === "done" && st !== "done" && !isSubNode) return null;
    if (filter === "in-progress" && st !== "in-progress" && !isSubNode) return null;
    if (filter === "pending" && st !== "pending" && !isSubNode) return null;

    const isDone = st === "done";
    const isInProg = st === "in-progress";

    return (
      <div key={node.id} className={`flex flex-col ${isSubNode ? "mt-3 relative before:absolute before:-left-4 before:top-6 before:h-px before:w-4 before:bg-border" : "space-y-3"}`}>
        <div
          onClick={() => setSelectedNode(node)}
          className={`group relative flex items-center justify-between rounded-2xl border ${isSubNode ? 'p-3 ml-4' : 'p-4'} cursor-pointer transition shadow-sm ${
            isDone
              ? "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/60"
              : isInProg
              ? "border-xblue/40 bg-xblue/10 hover:border-xblue/60"
              : "border-border bg-background hover:border-xblue/40"
          }`}
        >
          <div className="space-y-1 pr-3">
            <span className={`${isSubNode ? 'text-xs' : 'text-sm'} font-black block ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {node.title}
            </span>
            {node.description && (
              <p className="text-xs text-muted-foreground">
                {node.description}
              </p>
            )}
          </div>

          {/* Status Toggle Button */}
          <button
            onClick={(e) => cycleNodeStatus(node.id, e)}
            title="Click to cycle status"
            className="flex-shrink-0"
          >
            {isDone ? (
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 font-bold gap-1 text-[10px] rounded-full px-2 py-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Done
              </Badge>
            ) : isInProg ? (
              <Badge variant="outline" className="border-xblue/40 text-xblue bg-xblue/10 font-bold gap-1 text-[10px] rounded-full px-2 py-1">
                <Clock className="h-3.5 w-3.5" /> Learning
              </Badge>
            ) : (
              <Badge variant="outline" className="border-border text-muted-foreground bg-background hover:bg-card font-bold gap-1 text-[10px] rounded-full px-2 py-1">
                <Circle className="h-3.5 w-3.5" /> Pending
              </Badge>
            )}
          </button>
        </div>

        {node.subNodes && node.subNodes.length > 0 && (
          <div className="relative border-l-2 border-border ml-8">
            {node.subNodes.map(sn => renderNodeTree(sn, true))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-12 text-sm font-semibold text-muted-foreground animate-pulse">Loading Roadmap Data...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-sm font-semibold text-destructive">Error loading roadmap: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Status Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="h-5 w-5 text-xblue" />
            <h2 className="text-xl font-black text-foreground">{title}</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Click any node box to toggle status (⚪ Pending ➔ 🔵 Learning ➔ 🟢 Done).
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="h-2 w-48 overflow-hidden rounded-full bg-background border border-border">
              <div
                className="h-full bg-xblue transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-xblue">{progressPercentage}% Complete</span>
          </div>
        </div>

        {/* Counter Badges & Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-background p-3 rounded-2xl border border-border">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === "all" ? "bg-xblue text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({totalNodesCount})
          </button>

          <button
            onClick={() => setFilter("done")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
              filter === "done" ? "bg-emerald-500 text-white shadow-sm" : "text-emerald-500 hover:bg-emerald-500/10"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Done ({doneCount})
          </button>

          <button
            onClick={() => setFilter("in-progress")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
              filter === "in-progress" ? "bg-xblue text-white shadow-sm" : "text-xblue hover:bg-xblue/10"
            }`}
          >
            <Clock className="h-3.5 w-3.5" /> Learning ({inProgressCount})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
              filter === "pending" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-card"
            }`}
          >
            <Circle className="h-3.5 w-3.5" /> Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Roadmap Tree Visualization */}
      <div className="relative mx-auto max-w-4xl py-6 space-y-16">
        {/* Central Vertical Trunk Line */}
        <div className="absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-1 bg-border rounded-full z-0 hidden md:block" />

        {sections.map((sec) => {
          return (
            <div key={sec.mainId} className="relative z-10 space-y-8">
              {/* Central Section Main Milestone Box */}
              <div className="flex justify-center">
                <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center shadow-sm transform transition hover:border-xblue/50">
                  <h3 className="text-lg font-black tracking-wide text-foreground">{sec.mainTitle}</h3>
                  {sec.description && (
                    <p className="text-xs text-muted-foreground font-semibold mt-1 opacity-90">{sec.description}</p>
                  )}
                </div>
              </div>

              {/* Left & Right Branch Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Branch */}
                <div className="space-y-4">
                  {sec.leftNodes?.map((node) => renderNodeTree(node))}
                </div>

                {/* Right Branch */}
                <div className="space-y-4">
                  {sec.rightNodes?.map((node) => renderNodeTree(node))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Details Modal */}
      {selectedNode && (
        <div
          onClick={() => setSelectedNode(null)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Info className="h-5 w-5 text-xblue" /> {selectedNode.title}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold px-2 py-1 bg-background border border-border rounded-full"
              >
                ✕
              </button>
            </div>

            {selectedNode.description && (
              <p className="text-sm text-muted-foreground bg-background p-4 rounded-2xl border border-border">
                {selectedNode.description}
              </p>
            )}

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Set Progress Status</span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => setExplicitStatus(selectedNode.id, "pending")}
                  variant={nodeStatus[selectedNode.id] === "pending" || !nodeStatus[selectedNode.id] ? "default" : "outline"}
                  className={`w-full text-xs font-bold rounded-full ${nodeStatus[selectedNode.id] === "pending" || !nodeStatus[selectedNode.id] ? "bg-foreground text-background" : "border-border text-muted-foreground"}`}
                >
                  Pending
                </Button>
                <Button
                  onClick={() => setExplicitStatus(selectedNode.id, "in-progress")}
                  variant={nodeStatus[selectedNode.id] === "in-progress" ? "default" : "outline"}
                  className={`w-full text-xs font-bold rounded-full ${nodeStatus[selectedNode.id] === "in-progress" ? "bg-xblue text-white" : "border-border text-muted-foreground"}`}
                >
                  Learning
                </Button>
                <Button
                  onClick={() => setExplicitStatus(selectedNode.id, "done")}
                  variant={nodeStatus[selectedNode.id] === "done" ? "default" : "outline"}
                  className={`w-full text-xs font-bold rounded-full ${nodeStatus[selectedNode.id] === "done" ? "bg-emerald-500 text-white" : "border-border text-muted-foreground"}`}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CircleDashed, Sparkles, Info, X } from "lucide-react";
import {
  useRoadmapProgress,
  useUpdateRoadmapProgress,
} from "@/features/roadmap/useRoadmap";
import type { NodeStatus } from "@/features/roadmap/api";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";

import type { RoadmapNodeItem, RoadmapSection } from "@/features/roadmap/types";
export type { RoadmapNodeItem, RoadmapSection };

interface RoadmapFlowChartProps {
  title: string;
  sections: RoadmapSection[];
  storageKey: string;
}

export function RoadmapFlowChart({
  title,
  sections,
  storageKey,
}: RoadmapFlowChartProps) {
  const queryClient = useQueryClient();
  const {
    data: nodeStatus = {},
    isLoading,
    error,
  } = useRoadmapProgress(storageKey);
  const updateMutation = useUpdateRoadmapProgress();

  const [filter, setFilter] = useState<
    "all" | "done" | "in-progress" | "pending"
  >("all");
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeItem | null>(
    null,
  );

  const getLatestNodeStatusMap = (): Record<string, NodeStatus> => {
    const cached = queryClient.getQueryData<Record<string, NodeStatus>>([
      "roadmap",
      storageKey,
    ]);
    return { ...nodeStatus, ...(cached || {}) };
  };

  const findNodeInTree = (
    nodes?: RoadmapNodeItem[],
    id?: string,
  ): RoadmapNodeItem | null => {
    if (!nodes || !id) return null;
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.subNodes) {
        const found = findNodeInTree(n.subNodes, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findNodeById = (id: string): RoadmapNodeItem | null => {
    for (const sec of sections) {
      const foundLeft = findNodeInTree(sec.leftNodes, id);
      if (foundLeft) return foundLeft;
      const foundRight = findNodeInTree(sec.rightNodes, id);
      if (foundRight) return foundRight;
    }
    return null;
  };

  const getAllDescendantIds = (node: RoadmapNodeItem): string[] => {
    const ids: string[] = [];
    if (node.subNodes) {
      const traverse = (items: RoadmapNodeItem[]) => {
        items.forEach((item) => {
          ids.push(item.id);
          if (item.subNodes) traverse(item.subNodes);
        });
      };
      traverse(node.subNodes);
    }
    return ids;
  };

  const setExplicitStatus = (id: string, status: NodeStatus) => {
    const updates: Record<string, NodeStatus> = { [id]: status };
    const targetNode = findNodeById(id);

    if (targetNode && targetNode.subNodes && targetNode.subNodes.length > 0) {
      const descendantIds = getAllDescendantIds(targetNode);
      if (status === "done" || status === "pending") {
        descendantIds.forEach((descId) => {
          updates[descId] = status;
        });
      }
    }

    updateMutation.mutate({
      key: storageKey,
      data: { nodeStatuses: updates },
    });
  };

  const cycleNodeStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const latestMap = getLatestNodeStatusMap();
    const current = latestMap[id] || "pending";
    let next: NodeStatus = "done";
    if (current === "pending") next = "in-progress";
    else if (current === "in-progress") next = "done";
    else if (current === "done") next = "pending";

    setExplicitStatus(id, next);
  };

  const matchesActiveFilter = (status: NodeStatus) =>
    filter === "all" || status === filter;

  const hasMatchingDescendant = (node: RoadmapNodeItem): boolean => {
    if (!node.subNodes || node.subNodes.length === 0) {
      return false;
    }

    return node.subNodes.some((child) => {
      const childStatus = nodeStatus[child.id] || "pending";
      return matchesActiveFilter(childStatus) || hasMatchingDescendant(child);
    });
  };

  // Calculate metrics across all sections
  const allNodesList: RoadmapNodeItem[] = [];
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
  const doneCount = allNodesList.filter(
    (n) => nodeStatus[n.id] === "done",
  ).length;
  const inProgressCount = allNodesList.filter(
    (n) => nodeStatus[n.id] === "in-progress",
  ).length;
  const pendingCount = totalNodesCount - doneCount - inProgressCount;
  const progressPercentage =
    totalNodesCount > 0 ? Math.round((doneCount / totalNodesCount) * 100) : 0;

  const renderNodeTree = (
    node: RoadmapNodeItem,
    isSubNode = false,
    branch?: "left" | "right",
  ): React.ReactNode => {
    const st = nodeStatus[node.id] || "pending";
    const shouldShowNode =
      matchesActiveFilter(st) || hasMatchingDescendant(node);

    if (!shouldShowNode) {
      return null;
    }

    const isDone = st === "done";
    const isInProg = st === "in-progress";

    return (
      <div key={node.id} className="relative flex flex-col items-stretch">
        {/* Horizontal Branch Line connecting node to central vertical trunk */}
        {!isSubNode && branch === "left" && (
          <div
            className={`hidden md:block absolute -right-12 top-1/2 w-12 h-0.5 transition-colors duration-300 ${
              isDone
                ? "bg-emerald-500/50"
                : isInProg
                ? "bg-sky-500/50"
                : "bg-slate-300 dark:bg-neutral-700/80"
            }`}
          />
        )}
        {!isSubNode && branch === "right" && (
          <div
            className={`hidden md:block absolute -left-12 top-1/2 w-12 h-0.5 transition-colors duration-300 ${
              isDone
                ? "bg-emerald-500/50"
                : isInProg
                ? "bg-sky-500/50"
                : "bg-slate-300 dark:bg-neutral-700/80"
            }`}
          />
        )}

        {/* Main Node Card */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`w-full rounded-2xl border p-5 transition-all flex items-center justify-between gap-4 cursor-pointer select-none group shadow-xs ${
            isDone
              ? "border-emerald-500/40 bg-emerald-50/30 dark:bg-[#131313] hover:border-emerald-500/60 shadow-sm shadow-emerald-950/10 dark:shadow-emerald-950/30"
              : isInProg
              ? "border-sky-500/40 bg-sky-50/30 dark:bg-[#131313] hover:border-sky-500/60 shadow-sm shadow-sky-950/10 dark:shadow-sky-950/30"
              : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#131313] hover:border-slate-300 dark:hover:border-neutral-700"
          }`}
        >
          <div className="space-y-1 flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              ) : isInProg ? (
                <CircleDashed className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 animate-spin" />
              ) : null}
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                {node.title}
              </h4>
            </div>
            {node.description && (
              <p
                className={`text-xs text-slate-500 dark:text-neutral-400 leading-relaxed ${
                  isDone || isInProg ? "pl-6" : ""
                }`}
              >
                {node.description}
              </p>
            )}
          </div>

          {/* Status Badge Toggle */}
          <button
            type="button"
            onClick={(e) => cycleNodeStatus(node.id, e)}
            title="Click to cycle status: Pending → Learning → Done"
            className="shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            {isDone ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </span>
            ) : isInProg ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors">
                <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                Learning
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-slate-300 dark:border-neutral-700/80 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 hover:border-slate-400 dark:hover:border-neutral-600 bg-slate-50 dark:bg-transparent transition-colors">
                <span className="w-2 h-2 rounded-full border border-slate-400 dark:border-neutral-400 inline-block" />
                Pending
              </span>
            )}
          </button>
        </div>

        {/* Nested Sub-Nodes */}
        {node.subNodes && node.subNodes.length > 0 && (
          <div className="relative ml-8 pl-6 border-l-2 border-slate-200 dark:border-neutral-800 space-y-2.5 mt-2.5">
            {node.subNodes.map((sn) => {
              const snStatus = nodeStatus[sn.id] || "pending";
              const shouldShowSn =
                matchesActiveFilter(snStatus) || hasMatchingDescendant(sn);
              if (!shouldShowSn) return null;

              const isSnDone = snStatus === "done";
              const isSnInProg = snStatus === "in-progress";

              return (
                <div key={sn.id} className="relative flex items-center">
                  {/* Horizontal Subnode connector line */}
                  <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-slate-200 dark:bg-neutral-800" />

                  <div
                    onClick={() => setSelectedNode(sn)}
                    className={`w-full rounded-xl border p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all select-none group/sn shadow-2xs ${
                      isSnDone
                        ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-[#0e0e0e] hover:border-emerald-500/50"
                        : isSnInProg
                        ? "border-sky-500/30 bg-sky-50/20 dark:bg-[#0e0e0e] hover:border-sky-500/50"
                        : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0e0e0e] hover:border-slate-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        {isSnDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        ) : isSnInProg ? (
                          <CircleDashed className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0 animate-spin" />
                        ) : null}
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover/sn:text-sky-600 dark:group-hover/sn:text-sky-300 transition-colors">
                          {sn.title}
                        </span>
                      </div>
                      {sn.description && (
                        <p
                          className={`text-[11px] text-slate-500 dark:text-neutral-400 ${
                            isSnDone || isSnInProg ? "pl-5.5" : ""
                          }`}
                        >
                          {sn.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => cycleNodeStatus(sn.id, e)}
                      title="Click to cycle status"
                      className="shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      {isSnDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Done
                        </span>
                      ) : isSnInProg ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                          Learning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-slate-300 dark:border-neutral-700/80 text-slate-600 dark:text-neutral-400 bg-slate-50 dark:bg-transparent">
                          <span className="w-1.5 h-1.5 rounded-full border border-slate-400 dark:border-neutral-400 inline-block" />
                          Pending
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-12 text-center text-sm font-semibold text-slate-400 dark:text-neutral-400 animate-pulse shadow-xs dark:shadow-none">
        Loading Roadmap Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center text-xs font-semibold text-rose-600 dark:text-rose-400">
        Error loading roadmap: {error.message}
      </div>
    );
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-6 lg:p-8 space-y-8 shadow-xs dark:shadow-none"
      data-purpose="expanded-interactive-roadmap"
    >
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col gap-4 pb-6 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Visual interactive tree: click any node box to toggle status (○ Pending → ◉ Learning → ● Done).
          </p>
        </div>

        {/* Filter Pills & Section Progress Bar - Balanced Symmetrical Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Filter Pills */}
          <div
            className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-[#0e0e0e] p-1.5 rounded-xl border border-slate-200 dark:border-white/[0.06] flex-wrap sm:flex-nowrap"
            role="tablist"
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              role="tab"
              aria-selected={filter === "all"}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                filter === "all"
                  ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 shadow-xs font-semibold"
                  : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-neutral-400" />
              <span>All</span>
              <span className="text-[11px] font-mono opacity-80">
                (<AnimatedNumber value={totalNodesCount} />)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("done")}
              role="tab"
              aria-selected={filter === "done"}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                filter === "done"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs font-semibold"
                  : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span>Done</span>
              <span className="text-[11px] font-mono opacity-80">
                (<AnimatedNumber value={doneCount} />)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("in-progress")}
              role="tab"
              aria-selected={filter === "in-progress"}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                filter === "in-progress"
                  ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 shadow-xs font-semibold"
                  : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              <span>Learning</span>
              <span className="text-[11px] font-mono opacity-80">
                (<AnimatedNumber value={inProgressCount} />)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("pending")}
              role="tab"
              aria-selected={filter === "pending"}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                filter === "pending"
                  ? "bg-slate-200/80 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 border-slate-300 dark:border-neutral-700 shadow-xs font-semibold"
                  : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-neutral-500" />
              <span>Pending</span>
              <span className="text-[11px] font-mono opacity-80">
                (<AnimatedNumber value={pendingCount} />)
              </span>
            </button>
          </div>

          {/* Module Progress Bar */}
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-white/[0.02] px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-white/[0.06] shrink-0 self-start sm:self-auto">
            <AnimatedProgressBar
              pct={progressPercentage}
              color="bg-sky-500 dark:bg-sky-400"
              className="w-28 sm:w-36 bg-slate-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden"
            />
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 font-mono whitespace-nowrap">
              <AnimatedNumber value={progressPercentage} />% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Connected Tree Visualization */}
      <div className="relative flex flex-col items-center pt-4 space-y-12">
        {sections.map((sec) => (
          <div key={sec.mainId} className="w-full flex flex-col items-center">
            {/* Top Milestone Box */}
            <div className="relative z-10 w-full max-w-xl text-center">
              <div className="rounded-2xl bg-white/90 dark:bg-[#1c1b1b]/80 border border-slate-200 dark:border-neutral-700/80 p-6 shadow-xl backdrop-blur-sm mx-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {sec.mainTitle}
                </h3>
                {sec.description && (
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
                    {sec.description}
                  </p>
                )}
              </div>
            </div>

            {/* Tree Branch Body with Central Trunk */}
            <div className="w-full max-w-5xl relative mt-0">
              {/* Central Vertical Trunk Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-12 w-0.5 bg-slate-200 dark:bg-neutral-700/80 -translate-x-1/2 z-0" />

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 pt-10 relative z-10">
                {/* Left Branch */}
                <div className="space-y-6 md:pr-4">
                  {sec.leftNodes?.map((node) =>
                    renderNodeTree(node, false, "left"),
                  )}
                </div>

                {/* Right Branch */}
                <div className="space-y-6 md:pl-4">
                  {sec.rightNodes?.map((node) =>
                    renderNodeTree(node, false, "right"),
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Node Details Modal */}
      {selectedNode && (
        <div
          onClick={() => setSelectedNode(null)}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-sky-500 dark:text-sky-400" /> {selectedNode.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-neutral-800/60 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedNode.description && (
              <p className="text-xs text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-[#0e0e0e] p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] leading-relaxed">
                {selectedNode.description}
              </p>
            )}

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">
                Set Progress Status
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExplicitStatus(selectedNode.id, "pending")}
                  className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    nodeStatus[selectedNode.id] === "pending" ||
                    !nodeStatus[selectedNode.id]
                      ? "bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-600 shadow"
                      : "border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0e0e0e] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExplicitStatus(selectedNode.id, "in-progress")
                  }
                  className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    nodeStatus[selectedNode.id] === "in-progress"
                      ? "bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/30"
                      : "border-sky-500/30 bg-sky-50 dark:bg-sky-500/5 text-sky-600 dark:text-sky-400 hover:bg-sky-100/60 dark:hover:bg-sky-500/10"
                  }`}
                >
                  Learning
                </button>
                <button
                  type="button"
                  onClick={() => setExplicitStatus(selectedNode.id, "done")}
                  className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    nodeStatus[selectedNode.id] === "done"
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30"
                      : "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-500/10"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import React from "react";
import { useRoadmapTree } from "../useRoadmapTree";
import { RoadmapToolbar } from "./RoadmapToolbar";
import { RoadmapNode } from "./RoadmapNode";
import { NodeDetailsModal } from "./NodeDetailsModal";
import type { RoadmapNodeItem, RoadmapSection } from "../types";
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
  const {
    nodeStatus,
    isLoading,
    error,
    filter,
    setFilter,
    selectedNode,
    setSelectedNode,
    collapsedNodes,
    allCollapsed,
    toggleNodeCollapse,
    toggleAll,
    allNodesList,
    metrics,
    setStatus,
    cycleStatus,
    parentOfSelected,
  } = useRoadmapTree(storageKey, sections);

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

  const hasSubNodes = allNodesList.some((n) => n.subNodes && n.subNodes.length > 0);

  return (
    <section
      className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-6 lg:p-8 space-y-8 shadow-xs dark:shadow-none"
      data-purpose="expanded-interactive-roadmap"
    >
      <RoadmapToolbar
        title={title}
        filter={filter}
        onFilterChange={setFilter}
        totalCount={metrics.total}
        doneCount={metrics.done}
        inProgressCount={metrics.inProgress}
        pendingCount={metrics.pending}
        progressPercentage={metrics.percentage}
        hasSubNodes={hasSubNodes}
        allCollapsed={allCollapsed}
        onToggleAll={toggleAll}
      />

      <div className="relative flex flex-col items-center pt-4 space-y-12">
        {sections.map((sec) => (
          <div key={sec.mainId} className="w-full flex flex-col items-center">
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

            <div className="w-full max-w-5xl relative mt-0">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-12 w-0.5 bg-slate-200 dark:bg-neutral-700/80 -translate-x-1/2 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 pt-10 relative z-10">
                <div className="space-y-6 md:pr-4">
                  {sec.leftNodes?.map((node) => (
                    <RoadmapNode
                      key={node.id}
                      node={node}
                      branch="left"
                      nodeStatus={nodeStatus}
                      filter={filter}
                      collapsedNodes={collapsedNodes}
                      onSelectNode={setSelectedNode}
                      onCycleStatus={cycleStatus}
                      onToggleCollapse={toggleNodeCollapse}
                    />
                  ))}
                </div>

                <div className="space-y-6 md:pl-4">
                  {sec.rightNodes?.map((node) => (
                    <RoadmapNode
                      key={node.id}
                      node={node}
                      branch="right"
                      nodeStatus={nodeStatus}
                      filter={filter}
                      collapsedNodes={collapsedNodes}
                      onSelectNode={setSelectedNode}
                      onCycleStatus={cycleStatus}
                      onToggleCollapse={toggleNodeCollapse}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NodeDetailsModal
        selectedNode={selectedNode}
        parentTitle={parentOfSelected?.title}
        nodeStatus={nodeStatus}
        onClose={() => setSelectedNode(null)}
        onSetStatus={setStatus}
        onCycleStatus={cycleStatus}
      />
    </section>
  );
}

"use client";

import React from "react";
import {
  CheckCircle2,
  CircleDashed,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { RoadmapNodeItem } from "../types";
import type { NodeStatus } from "../api";
import {
  matchesActiveFilter,
  hasMatchingDescendant,
  FilterType,
} from "../tree-algorithms";

interface RoadmapNodeProps {
  node: RoadmapNodeItem;
  branch?: "left" | "right";
  nodeStatus: Record<string, NodeStatus>;
  filter: FilterType;
  collapsedNodes: Record<string, boolean>;
  onSelectNode: (node: RoadmapNodeItem) => void;
  onCycleStatus: (id: string, e?: React.MouseEvent) => void;
  onToggleCollapse: (id: string, e?: React.MouseEvent) => void;
}

export const RoadmapNode = React.memo(function RoadmapNode({
  node,
  branch,
  nodeStatus,
  filter,
  collapsedNodes,
  onSelectNode,
  onCycleStatus,
  onToggleCollapse,
}: RoadmapNodeProps) {
  const st = nodeStatus[node.id] || "pending";
  const shouldShowNode =
    matchesActiveFilter(st, filter) ||
    hasMatchingDescendant(node, nodeStatus, filter);

  if (!shouldShowNode) return null;

  const isDone = st === "done";
  const isInProg = st === "in-progress";

  return (
    <div key={node.id} className="relative flex flex-col items-stretch">
      {branch === "left" && (
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
      {branch === "right" && (
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

      <div
        onClick={() => onSelectNode(node)}
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

        <button
          type="button"
          onClick={(e) => onCycleStatus(node.id, e)}
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

      {node.subNodes && node.subNodes.length > 0 && (
        <div className="relative ml-6 sm:ml-8 pl-5 sm:pl-6 border-l-2 border-slate-200 dark:border-neutral-800 space-y-3 mt-3">
          {node.subNodes.map((sn) => {
            const snStatus = nodeStatus[sn.id] || "pending";
            const shouldShowSn =
              matchesActiveFilter(snStatus, filter) ||
              hasMatchingDescendant(sn, nodeStatus, filter);
            if (!shouldShowSn) return null;

            const isSnDone = snStatus === "done";
            const isSnInProg = snStatus === "in-progress";

            const hasSubNodes = Boolean(sn.subNodes && sn.subNodes.length > 0);
            const isCollapsed = Boolean(collapsedNodes[sn.id]);
            const leafDoneCount = hasSubNodes
              ? sn.subNodes!.filter(
                  (c) => (nodeStatus[c.id] || "pending") === "done",
                ).length
              : 0;
            const totalLeafCount = hasSubNodes ? sn.subNodes!.length : 0;

            return (
              <div key={sn.id} className="relative flex flex-col items-stretch">
                <div className="absolute -left-5 sm:-left-6 top-5 w-5 sm:w-6 h-0.5 bg-slate-200 dark:bg-neutral-800" />

                <div
                  onClick={() => onSelectNode(sn)}
                  className={`w-full rounded-xl border p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all select-none group/sn shadow-2xs ${
                    isSnDone
                      ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-[#0e0e0e] hover:border-emerald-500/50"
                      : isSnInProg
                      ? "border-sky-500/30 bg-sky-50/20 dark:bg-[#0e0e0e] hover:border-sky-500/50"
                      : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0e0e0e] hover:border-slate-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isSnDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      ) : isSnInProg ? (
                        <CircleDashed className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0 animate-spin" />
                      ) : null}
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover/sn:text-sky-600 dark:group-hover/sn:text-sky-300 transition-colors">
                        {sn.title}
                      </span>
                      {hasSubNodes && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/[0.06] shrink-0">
                          {leafDoneCount}/{totalLeafCount} done
                        </span>
                      )}
                    </div>
                    {sn.description && (
                      <p
                        className={`text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed ${
                          isSnDone || isSnInProg ? "pl-5.5" : ""
                        }`}
                      >
                        {sn.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasSubNodes && (
                      <button
                        type="button"
                        onClick={(e) => onToggleCollapse(sn.id, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                        title={isCollapsed ? "Expand sub-topics" : "Collapse sub-topics"}
                        aria-label={isCollapsed ? "Expand sub-topics" : "Collapse sub-topics"}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => onCycleStatus(sn.id, e)}
                      title="Click to cycle status: Pending → Learning → Done"
                      className="shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      {isSnDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Done
                        </span>
                      ) : isSnInProg ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                          Learning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-slate-300 dark:border-neutral-700/80 text-slate-600 dark:text-neutral-400 bg-slate-50 dark:bg-transparent hover:border-slate-400 dark:hover:border-neutral-600 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full border border-slate-400 dark:border-neutral-400 inline-block" />
                          Pending
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {hasSubNodes && !isCollapsed && (
                  <div className="relative ml-5 sm:ml-6 pl-4 sm:pl-5 border-l-2 border-dashed border-slate-200 dark:border-neutral-800 space-y-2 mt-2 mb-1">
                    {sn.subNodes!.map((leaf) => {
                      const leafStatus = nodeStatus[leaf.id] || "pending";
                      if (!matchesActiveFilter(leafStatus, filter)) return null;

                      const isLeafDone = leafStatus === "done";
                      const isLeafInProg = leafStatus === "in-progress";

                      return (
                        <div key={leaf.id} className="relative flex items-center">
                          <div className="absolute -left-4 sm:-left-5 top-1/2 w-4 sm:w-5 h-0.5 border-t border-dashed border-slate-300 dark:border-neutral-700" />

                          <div
                            onClick={() => onSelectNode(leaf)}
                            className={`w-full rounded-lg border p-2.5 flex items-center justify-between gap-2.5 cursor-pointer transition-all select-none group/leaf shadow-2xs ${
                              isLeafDone
                                ? "border-emerald-500/30 bg-emerald-50/15 dark:bg-[#0c0c0c] hover:border-emerald-500/50"
                                : isLeafInProg
                                ? "border-sky-500/30 bg-sky-50/15 dark:bg-[#0c0c0c] hover:border-sky-500/50"
                                : "border-slate-200/80 dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#0c0c0c] hover:border-slate-300 dark:hover:border-white/15"
                            }`}
                          >
                            <div className="space-y-0.5 flex-1 min-w-0 pr-1.5">
                              <div className="flex items-center gap-1.5">
                                {isLeafDone ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                ) : isLeafInProg ? (
                                  <CircleDashed className="w-3 h-3 text-sky-500 dark:text-sky-400 shrink-0 animate-spin" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-neutral-600 shrink-0" />
                                )}
                                <span className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-neutral-200 truncate group-hover/leaf:text-sky-600 dark:group-hover/leaf:text-sky-300 transition-colors">
                                  {leaf.title}
                                </span>
                              </div>
                              {leaf.description && (
                                <p className="text-[10px] text-slate-500 dark:text-neutral-400 pl-4.5 truncate">
                                  {leaf.description}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => onCycleStatus(leaf.id, e)}
                              title="Click to cycle status"
                              className="shrink-0 transition-transform active:scale-95 cursor-pointer"
                            >
                              {isLeafDone ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Done
                                </span>
                              ) : isLeafInProg ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors">
                                  <span className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                                  Learning
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-300 dark:border-neutral-700/80 text-slate-500 dark:text-neutral-400 bg-white dark:bg-transparent hover:border-slate-400 dark:hover:border-neutral-600 transition-colors">
                                  <span className="w-1 h-1 rounded-full border border-slate-400 dark:border-neutral-500 inline-block" />
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
          })}
        </div>
      )}
    </div>
  );
});

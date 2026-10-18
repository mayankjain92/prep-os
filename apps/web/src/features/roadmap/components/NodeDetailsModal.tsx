"use client";

import React from "react";
import { Info, CheckCircle2, CircleDashed } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import type { RoadmapNodeItem } from "../types";
import type { NodeStatus } from "../api";

interface NodeDetailsModalProps {
  selectedNode: RoadmapNodeItem | null;
  parentTitle?: string;
  nodeStatus: Record<string, NodeStatus>;
  onClose: () => void;
  onSetStatus: (id: string, status: NodeStatus) => void;
  onCycleStatus: (id: string) => void;
}

export function NodeDetailsModal({
  selectedNode,
  parentTitle,
  nodeStatus,
  onClose,
  onSetStatus,
  onCycleStatus,
}: NodeDetailsModalProps) {
  if (!selectedNode) return null;

  const currentStatus = nodeStatus[selectedNode.id] || "pending";
  const hasSubNodes = Boolean(selectedNode.subNodes && selectedNode.subNodes.length > 0);
  const doneSubCount = hasSubNodes
    ? selectedNode.subNodes!.filter(
        (c) => (nodeStatus[c.id] || "pending") === "done",
      ).length
    : 0;

  const modalTitle = (
    <div>
      {parentTitle && (
        <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
          {parentTitle}
        </span>
      )}
      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Info className="h-4 w-4 text-sky-500 dark:text-sky-400" /> {selectedNode.title}
      </h3>
    </div>
  );

  return (
    <Modal
      isOpen={Boolean(selectedNode)}
      onClose={onClose}
      title={modalTitle}
    >
      <div className="p-6 space-y-5">
        {selectedNode.description && (
          <p className="text-xs text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-[#0e0e0e] p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] leading-relaxed">
            {selectedNode.description}
          </p>
        )}

        {hasSubNodes && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                Sub-topics ({selectedNode.subNodes!.length})
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400">
                {doneSubCount} of {selectedNode.subNodes!.length} done
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {selectedNode.subNodes!.map((child) => {
                const cStatus = nodeStatus[child.id] || "pending";
                const isCDone = cStatus === "done";
                const isCProg = cStatus === "in-progress";
                return (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0e0e0e] text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {isCDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      ) : isCProg ? (
                        <CircleDashed className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0 animate-spin" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-neutral-600 shrink-0" />
                      )}
                      <span className="truncate text-slate-800 dark:text-neutral-200 font-medium">
                        {child.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCycleStatus(child.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer transition-colors shrink-0 ${
                        isCDone
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : isCProg
                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                          : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-700"
                      }`}
                    >
                      {isCDone ? "Done" : isCProg ? "Learning" : "Pending"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">
            {hasSubNodes ? "Set Overall Topic Status" : "Set Status"}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSetStatus(selectedNode.id, "pending")}
              className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                currentStatus === "pending"
                  ? "bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-600 shadow"
                  : "border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0e0e0e] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => onSetStatus(selectedNode.id, "in-progress")}
              className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                currentStatus === "in-progress"
                  ? "bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/30"
                  : "border-sky-500/30 bg-sky-50 dark:bg-sky-500/5 text-sky-600 dark:text-sky-400 hover:bg-sky-100/60 dark:hover:bg-sky-500/10"
              }`}
            >
              Learning
            </button>
            <button
              type="button"
              onClick={() => onSetStatus(selectedNode.id, "done")}
              className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                currentStatus === "done"
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30"
                  : "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-500/10"
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

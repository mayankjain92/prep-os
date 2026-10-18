"use client";

import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRoadmapProgress,
  useUpdateRoadmapProgress,
} from "./useRoadmap";
import type { RoadmapNodeItem, RoadmapSection } from "./types";
import type { NodeStatus } from "./api";
import {
  flattenAllNodes,
  calculateTreeMetrics,
  computeBidirectionalStatusUpdates,
  getNextCycledStatus,
  findParentNodeById,
  FilterType,
} from "./tree-algorithms";

export function useRoadmapTree(storageKey: string, sections: RoadmapSection[]) {
  const queryClient = useQueryClient();
  const { data: nodeStatus = {}, isLoading, error } = useRoadmapProgress(storageKey);
  const updateMutation = useUpdateRoadmapProgress();

  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeItem | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);

  // Resolved status map combining query state and any optimistic cache values
  const getLatestNodeStatusMap = useCallback((): Record<string, NodeStatus> => {
    const cached = queryClient.getQueryData<Record<string, NodeStatus>>([
      "roadmap",
      storageKey,
    ]);
    return { ...nodeStatus, ...(cached || {}) };
  }, [queryClient, storageKey, nodeStatus]);

  // Flattened list of all nodes across sections
  const allNodesList = useMemo(() => flattenAllNodes(sections), [sections]);

  // Aggregate completion metrics (total, done, learning, pending, %)
  const metrics = useMemo(
    () => calculateTreeMetrics(allNodesList, nodeStatus),
    [allNodesList, nodeStatus],
  );

  // Expand / collapse handlers
  const toggleNodeCollapse = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCollapsedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const toggleAll = useCallback(() => {
    const next = !allCollapsed;
    setAllCollapsed(next);
    const newCollapsed: Record<string, boolean> = {};
    if (next) {
      allNodesList.forEach((n) => {
        if (n.subNodes && n.subNodes.length > 0) {
          newCollapsed[n.id] = true;
        }
      });
    }
    setCollapsedNodes(newCollapsed);
  }, [allCollapsed, allNodesList]);

  // Explicit status update with bidirectional cascade and rollup
  const setStatus = useCallback(
    (id: string, status: NodeStatus) => {
      const updates = computeBidirectionalStatusUpdates(
        id,
        status,
        sections,
        getLatestNodeStatusMap(),
      );

      updateMutation.mutate({
        key: storageKey,
        data: { nodeStatuses: updates },
      });
    },
    [sections, getLatestNodeStatusMap, updateMutation, storageKey],
  );

  // Cycle status: pending -> in-progress -> done -> pending
  const cycleStatus = useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const latestMap = getLatestNodeStatusMap();
      const current = latestMap[id] || "pending";
      const next = getNextCycledStatus(current);
      setStatus(id, next);
    },
    [getLatestNodeStatusMap, setStatus],
  );

  // Parent breadcrumb for the selected modal node
  const parentOfSelected = useMemo(
    () => (selectedNode ? findParentNodeById(sections, selectedNode.id) : null),
    [selectedNode, sections],
  );

  return {
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
  };
}

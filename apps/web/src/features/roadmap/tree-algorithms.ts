import type { RoadmapNodeItem, RoadmapSection } from "./types";
import type { NodeStatus } from "./api";

export type FilterType = "all" | "done" | "in-progress" | "pending";

/**
 * Searches for a node by ID within a nested array of RoadmapNodeItems.
 */
export function findNodeInTree(
  nodes?: RoadmapNodeItem[],
  id?: string,
): RoadmapNodeItem | null {
  if (!nodes || !id) return null;
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.subNodes) {
      const found = findNodeInTree(n.subNodes, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Searches for a node by ID across all left and right sections.
 */
export function findNodeById(
  sections: RoadmapSection[],
  id: string,
): RoadmapNodeItem | null {
  for (const sec of sections) {
    const foundLeft = findNodeInTree(sec.leftNodes, id);
    if (foundLeft) return foundLeft;
    const foundRight = findNodeInTree(sec.rightNodes, id);
    if (foundRight) return foundRight;
  }
  return null;
}

/**
 * Searches for the parent of a target node within a nested tree.
 */
export function findParentNodeInTree(
  nodes?: RoadmapNodeItem[],
  targetId?: string,
  parent: RoadmapNodeItem | null = null,
): RoadmapNodeItem | null {
  if (!nodes || !targetId) return null;
  for (const n of nodes) {
    if (n.id === targetId) return parent;
    if (n.subNodes) {
      const found = findParentNodeInTree(n.subNodes, targetId, n);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Searches for the parent of a target node across all sections.
 */
export function findParentNodeById(
  sections: RoadmapSection[],
  id: string,
): RoadmapNodeItem | null {
  for (const sec of sections) {
    const foundLeft = findParentNodeInTree(sec.leftNodes, id);
    if (foundLeft) return foundLeft;
    const foundRight = findParentNodeInTree(sec.rightNodes, id);
    if (foundRight) return foundRight;
  }
  return null;
}

/**
 * Flattens all descendant node IDs of a given node (excluding the node itself).
 */
export function getAllDescendantIds(node: RoadmapNodeItem): string[] {
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
}

/**
 * Flattens all nodes across all sections into a single list.
 */
export function flattenAllNodes(sections: RoadmapSection[]): RoadmapNodeItem[] {
  const list: RoadmapNodeItem[] = [];
  const gather = (nodes?: RoadmapNodeItem[]) => {
    if (!nodes) return;
    nodes.forEach((n) => {
      list.push(n);
      if (n.subNodes) gather(n.subNodes);
    });
  };
  sections.forEach((sec) => {
    gather(sec.leftNodes);
    gather(sec.rightNodes);
  });
  return list;
}

/**
 * Checks if a status matches the current filter pill.
 */
export function matchesActiveFilter(
  status: NodeStatus,
  filter: FilterType,
): boolean {
  return filter === "all" || status === filter;
}

/**
 * Checks if any descendant of a node matches the active filter.
 */
export function hasMatchingDescendant(
  node: RoadmapNodeItem,
  nodeStatus: Record<string, NodeStatus>,
  filter: FilterType,
): boolean {
  if (!node.subNodes || node.subNodes.length === 0) {
    return false;
  }

  return node.subNodes.some((child) => {
    const childStatus = nodeStatus[child.id] || "pending";
    return (
      matchesActiveFilter(childStatus, filter) ||
      hasMatchingDescendant(child, nodeStatus, filter)
    );
  });
}

/**
 * Returns the next status in the cyclic toggle: pending -> in-progress -> done -> pending.
 */
export function getNextCycledStatus(current: NodeStatus = "pending"): NodeStatus {
  if (current === "pending") return "in-progress";
  if (current === "in-progress") return "done";
  return "pending";
}

/**
 * Computes bidirectional state updates:
 * 1. Downward cascade: Setting a parent to 'done' or 'pending' updates all its descendants.
 * 2. Upward roll-up: Setting child nodes updates parent/grandparent status based on sibling completion.
 */
export function computeBidirectionalStatusUpdates(
  targetId: string,
  newStatus: NodeStatus,
  sections: RoadmapSection[],
  currentStatusMap: Record<string, NodeStatus>,
): Record<string, NodeStatus> {
  const updates: Record<string, NodeStatus> = { [targetId]: newStatus };
  const targetNode = findNodeById(sections, targetId);

  // 1. Downward cascade to all descendants
  if (targetNode && targetNode.subNodes && targetNode.subNodes.length > 0) {
    const descendantIds = getAllDescendantIds(targetNode);
    if (newStatus === "done" || newStatus === "pending") {
      descendantIds.forEach((descId) => {
        updates[descId] = newStatus;
      });
    }
  }

  // 2. Upward roll-up to ancestors (parents and grandparents)
  const resolvedMap = { ...currentStatusMap, ...updates };
  let currentChildId = targetId;
  let parentNode = findParentNodeById(sections, currentChildId);

  while (parentNode) {
    if (parentNode.subNodes && parentNode.subNodes.length > 0) {
      const childStatuses = parentNode.subNodes.map(
        (child) => updates[child.id] ?? resolvedMap[child.id] ?? "pending",
      );
      const allDone = childStatuses.every((s) => s === "done");
      const allPending = childStatuses.every((s) => s === "pending");

      let computedParentStatus: NodeStatus = "in-progress";
      if (allDone) {
        computedParentStatus = "done";
      } else if (allPending) {
        computedParentStatus = "pending";
      } else {
        computedParentStatus = "in-progress";
      }

      updates[parentNode.id] = computedParentStatus;
      resolvedMap[parentNode.id] = computedParentStatus;
    }
    currentChildId = parentNode.id;
    parentNode = findParentNodeById(sections, currentChildId);
  }

  return updates;
}

/**
 * Calculates aggregate counts and percentage from a flattened list of nodes.
 */
export interface RoadmapMetrics {
  total: number;
  done: number;
  inProgress: number;
  pending: number;
  percentage: number;
}

/**
 * Calculates aggregate counts and percentage from a flattened list of nodes.
 */
export function calculateTreeMetrics(
  allNodes: RoadmapNodeItem[],
  nodeStatus: Record<string, NodeStatus>,
): RoadmapMetrics {
  const total = allNodes.length;
  const done = allNodes.filter((n) => nodeStatus[n.id] === "done").length;
  const inProgress = allNodes.filter(
    (n) => nodeStatus[n.id] === "in-progress",
  ).length;
  const pending = total - done - inProgress;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, done, inProgress, pending, percentage };
}

/**
 * Calculates aggregate counts and percentage directly from roadmap sections and status map.
 */
export function getRoadmapMetrics(
  sections: RoadmapSection[],
  nodeStatus: Record<string, NodeStatus>,
): RoadmapMetrics {
  const allNodes = flattenAllNodes(sections);
  return calculateTreeMetrics(allNodes, nodeStatus);
}


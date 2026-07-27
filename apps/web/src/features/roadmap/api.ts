import { apiFetch } from "@/lib/api-client";
import type { UpdateRoadmapProgressInput } from "@prep-os/shared";

export type NodeStatus = "pending" | "in-progress" | "done";

export async function fetchRoadmapProgress(key: string): Promise<Record<string, NodeStatus>> {
  return apiFetch<Record<string, NodeStatus>>(`/api/roadmaps/${key}`);
}

export async function updateRoadmapProgress(key: string, data: UpdateRoadmapProgressInput): Promise<Record<string, NodeStatus>> {
  return apiFetch<Record<string, NodeStatus>>(`/api/roadmaps/${key}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

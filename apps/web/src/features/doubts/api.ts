import { apiFetch } from "@/lib/api-client";
import type { CreateDoubtInput, UpdateDoubtInput } from "@prep-os/shared";

export type DoubtType = "leetcode" | "topic";
export type PriorityLevel = "high" | "medium" | "low";

export interface DoubtItem {
  id: string;
  title: string;
  type: DoubtType;
  topic: string;
  url?: string;
  priority: PriorityLevel;
  notes?: string;
  resolved: boolean;
  createdAt: string;
}

export async function fetchDoubts(): Promise<DoubtItem[]> {
  return apiFetch<DoubtItem[]>("/api/doubts");
}

export async function createDoubt(data: CreateDoubtInput): Promise<DoubtItem> {
  return apiFetch<DoubtItem>("/api/doubts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDoubt(id: string, data: UpdateDoubtInput): Promise<DoubtItem> {
  return apiFetch<DoubtItem>(`/api/doubts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDoubt(id: string): Promise<void> {
  return apiFetch<void>(`/api/doubts/${id}`, {
    method: "DELETE",
  });
}

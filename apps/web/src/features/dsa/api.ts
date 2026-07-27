import { apiFetch } from "@/lib/api-client";
import type { CreateProblemInput, UpdateProblemInput } from "@prep-os/shared";

export interface Problem {
  _id: string;
  userId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  status: "todo" | "attempted" | "solved" | "revisit";
  url: string;
  notes: string;
  solvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeetCodeProfileStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  userAvatar?: string;
}

export interface SyncLeetCodeResult {
  message: string;
  synced: number;
  profile?: LeetCodeProfileStats;
}

export async function fetchProblems(): Promise<Problem[]> {
  return apiFetch<Problem[]>("/api/problems");
}

export async function fetchProblem(id: string): Promise<Problem> {
  return apiFetch<Problem>(`/api/problems/${id}`);
}

export async function createProblem(data: CreateProblemInput): Promise<Problem> {
  return apiFetch<Problem>("/api/problems", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProblem(
  id: string,
  data: UpdateProblemInput
): Promise<Problem> {
  return apiFetch<Problem>(`/api/problems/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProblem(id: string): Promise<void> {
  return apiFetch<void>(`/api/problems/${id}`, {
    method: "DELETE",
  });
}

export async function syncLeetCode(username?: string): Promise<SyncLeetCodeResult> {
  return apiFetch<SyncLeetCodeResult>("/api/problems/sync", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export async function fetchLeetCodeProfile(): Promise<LeetCodeProfileStats | null> {
  const res = await apiFetch<{ profile: LeetCodeProfileStats | null }>("/api/problems/leetcode-profile");
  return res.profile;
}

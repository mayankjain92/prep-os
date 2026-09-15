import { apiFetch } from "@/lib/api-client";

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
  fromCache?: boolean;
  profile?: LeetCodeProfileStats;
}

export async function fetchProblems(): Promise<Problem[]> {
  return apiFetch<Problem[]>("/api/problems");
}

export interface SyncLeetCodeParams {
  username?: string;
  force?: boolean;
}

export async function syncLeetCode(params?: SyncLeetCodeParams | string): Promise<SyncLeetCodeResult> {
  const body = typeof params === "string" ? { username: params } : params;
  return apiFetch<SyncLeetCodeResult>("/api/problems/sync", {
    method: "POST",
    body: JSON.stringify(body || {}),
  });
}

export async function fetchLeetCodeProfile(): Promise<LeetCodeProfileStats | null> {
  const res = await apiFetch<{ profile: LeetCodeProfileStats | null }>("/api/problems/leetcode-profile");
  return res.profile;
}

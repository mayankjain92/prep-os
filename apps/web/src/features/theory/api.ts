import { apiFetch } from "@/lib/api-client";
import type { CreateTheoryTopicInput, UpdateTheoryTopicInput } from "@prep-os/shared";

export interface TheoryTopic {
  _id: string;
  userId: string;
  subject: "OS" | "DBMS" | "CN" | "Aptitude";
  topicName: string;
  status: "not-started" | "in-progress" | "completed";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectStat {
  subject: string;
  total: number;
  completed: number;
  inProgress: number;
  percentage: number;
}

export async function fetchTheoryTopics(subject?: string): Promise<TheoryTopic[]> {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return apiFetch<TheoryTopic[]>(`/api/theory${query}`);
}

export async function fetchTheoryStats(): Promise<SubjectStat[]> {
  return apiFetch<SubjectStat[]>("/api/theory/stats");
}

export async function seedRoadmap(subject?: string): Promise<{ message: string; addedCount: number }> {
  return apiFetch<{ message: string; addedCount: number }>("/api/theory/seed", {
    method: "POST",
    body: JSON.stringify({ subject }),
  });
}

export async function createTheoryTopic(data: CreateTheoryTopicInput): Promise<TheoryTopic> {
  return apiFetch<TheoryTopic>("/api/theory", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTheoryTopic(id: string, data: UpdateTheoryTopicInput): Promise<TheoryTopic> {
  return apiFetch<TheoryTopic>(`/api/theory/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTheoryTopic(id: string): Promise<void> {
  return apiFetch<void>(`/api/theory/${id}`, {
    method: "DELETE",
  });
}

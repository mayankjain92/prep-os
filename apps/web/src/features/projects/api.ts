import { apiFetch } from "@/lib/api-client";
import type { CreateProjectInput, UpdateProjectInput } from "@prep-os/shared";

export interface ProjectItem {
  _id: string;
  userId: string;
  name: string;
  techStack: string[];
  status: "planning" | "in-progress" | "completed" | "archived";
  repoUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  return apiFetch<ProjectItem[]>("/api/projects");
}

export async function createProject(data: CreateProjectInput): Promise<ProjectItem> {
  return apiFetch<ProjectItem>("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: string, data: UpdateProjectInput): Promise<ProjectItem> {
  return apiFetch<ProjectItem>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<void> {
  return apiFetch<void>(`/api/projects/${id}`, {
    method: "DELETE",
  });
}

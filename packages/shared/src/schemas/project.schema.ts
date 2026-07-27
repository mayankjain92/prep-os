import { z } from "zod";

export const PROJECT_STATUSES = ["planning", "in-progress", "completed", "archived"] as const;

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  techStack: z.array(z.string()).optional().default([]),
  status: z.enum(PROJECT_STATUSES).optional().default("planning"),
  repoUrl: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.input<typeof createProjectSchema>;
export type UpdateProjectInput = z.input<typeof updateProjectSchema>;

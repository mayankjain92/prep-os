import { z } from "zod";

export const ROADMAP_KEYS = [
  "prep_os_dsa_roadmap_v2",
  "prep_os_theory_roadmap",
] as const;

export const roadmapKeyParamSchema = z.object({
  key: z.enum(ROADMAP_KEYS),
});

export const updateRoadmapProgressSchema = z.object({
  nodeStatuses: z.record(z.string(), z.enum(["pending", "in-progress", "done"])),
});

export type UpdateRoadmapProgressInput = z.infer<typeof updateRoadmapProgressSchema>;

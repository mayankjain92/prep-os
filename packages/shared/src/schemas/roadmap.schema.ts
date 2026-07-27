import { z } from "zod";

export const updateRoadmapProgressSchema = z.object({
  nodeStatuses: z.record(z.string(), z.enum(["pending", "in-progress", "done"])),
});

export type UpdateRoadmapProgressInput = z.infer<typeof updateRoadmapProgressSchema>;

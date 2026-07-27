import { z } from "zod";

export const createDoubtSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["leetcode", "topic"]),
  topic: z.string().min(1, "Topic is required"),
  url: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  notes: z.string().optional(),
});

export const updateDoubtSchema = z.object({
  title: z.string().optional(),
  type: z.enum(["leetcode", "topic"]).optional(),
  topic: z.string().optional(),
  url: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  notes: z.string().optional(),
  resolved: z.boolean().optional(),
});

export type CreateDoubtInput = z.infer<typeof createDoubtSchema>;
export type UpdateDoubtInput = z.infer<typeof updateDoubtSchema>;

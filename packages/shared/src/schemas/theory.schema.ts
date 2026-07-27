import { z } from "zod";

export const THEORY_SUBJECTS = ["OS", "DBMS", "CN", "OOP", "Aptitude"] as const;
export const THEORY_STATUSES = ["not-started", "in-progress", "completed"] as const;

export const createTheoryTopicSchema = z.object({
  subject: z.enum(THEORY_SUBJECTS),
  topicName: z.string().min(1, "Topic name is required"),
  status: z.enum(THEORY_STATUSES).optional().default("not-started"),
  notes: z.string().optional().default(""),
});

export const updateTheoryTopicSchema = createTheoryTopicSchema.partial();

export type CreateTheoryTopicInput = z.input<typeof createTheoryTopicSchema>;
export type UpdateTheoryTopicInput = z.input<typeof updateTheoryTopicSchema>;

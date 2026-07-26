import {z} from "zod"

export const difficultyEnum = z.enum(["Easy", "Medium", "Hard"]);
export const statusEnum = z.enum(["todo", "attempted", "solved", "revisit"]);

export const createProblemSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  difficulty: difficultyEnum,
  topics: z.array(z.string()).default([]),
  status: statusEnum.default("todo"),
  url: z.string().url().or(z.literal("")).default(""),
  notes: z.string().default(""),
});

export const updateProblemSchema = createProblemSchema.partial();

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;
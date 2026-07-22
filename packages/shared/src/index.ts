import {z} from "zod";

export const LeetCodeProblemSchema = z.object({
    slug: z.string(),
    title: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    status: z.enum(["Solved", "Attempted", "Todo"]),
});

export type LeetCodeProblem = z.infer<typeof LeetCodeProblemSchema>
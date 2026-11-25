import { Router } from "express";
import { z } from "zod";
import {
  syncLeetCodeProblems,
  getLeetCodeProfile,
  disconnectLeetCodeProfile,
  updateNeetcodeProgress,
} from "../controllers/problemController.js";
import { validate } from "../middleware/validate.js";

const syncSchema = z.object({
  username: z.string().trim().min(1, "LeetCode username is required").max(64),
  force: z.boolean().optional(),
});

const neetcodeProgressSchema = z.object({
  solved: z.array(z.string()).max(500),
  starred: z.array(z.string()).max(500),
});

const router = Router();

router.get("/leetcode-profile", getLeetCodeProfile);
router.delete("/leetcode-profile", disconnectLeetCodeProfile);
router.post("/sync", validate(syncSchema), syncLeetCodeProblems);
router.put("/neetcode-progress", validate(neetcodeProgressSchema), updateNeetcodeProgress);

export default router;
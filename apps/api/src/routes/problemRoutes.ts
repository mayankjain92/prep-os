import { Router } from "express";
import {
  syncLeetCodeProblems,
  getLeetCodeProfile,
  updateNeetcodeProgress,
} from "../controllers/problemController.js";

const router = Router();

router.get("/leetcode-profile", getLeetCodeProfile);
router.post("/sync", syncLeetCodeProblems);
router.put("/neetcode-progress", updateNeetcodeProgress);

export default router;
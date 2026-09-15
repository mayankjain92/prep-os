import { Router } from "express";
import {
  createProblem,
  listProblems,
  updateProblem,
  deleteProblem,
  syncLeetCodeProblems,
  getLeetCodeProfile,
} from "../controllers/problemController.js";

const router = Router();

router.get("/leetcode-profile", getLeetCodeProfile);
router.post("/sync", syncLeetCodeProblems);

router.get("/", listProblems);
router.post("/", createProblem);

router.patch("/:id", updateProblem);
router.delete("/:id", deleteProblem);

export default router;
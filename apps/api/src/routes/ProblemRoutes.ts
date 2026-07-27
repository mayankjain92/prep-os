import { Router } from "express";
import {
  createProblem,
  listProblems,
  getProblem,
  updateProblem,
  deleteProblem,
  syncLeetCodeProblems,
  getLeetCodeProfile,
} from "../controllers/problemControllers.js";

const router = Router();

router.get("/leetcode-profile", getLeetCodeProfile);

router.route("/")
  .get(listProblems)
  .post(createProblem);

router.post("/sync", syncLeetCodeProblems);

router.route("/:id")
  .get(getProblem)
  .patch(updateProblem)
  .delete(deleteProblem);

export default router;
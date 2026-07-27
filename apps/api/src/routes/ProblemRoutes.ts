import { Router } from "express";
import {
  createProblem,
  listProblems,
  getProblem,
  updateProblem,
  deleteProblem,
  syncLeetCodeProblems,
} from "../controllers/problemControllers.js";

const router = Router();

router.route("/")
  .get(listProblems)
  .post(createProblem);

router.post("/sync", syncLeetCodeProblems);

router.route("/:id")
  .get(getProblem)
  .patch(updateProblem)
  .delete(deleteProblem);

export default router;
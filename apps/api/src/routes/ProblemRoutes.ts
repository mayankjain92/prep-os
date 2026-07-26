import { Router } from "express";
import { authStub } from "../middleware/auth.stub";
import { validate } from "../middleware/validate";
import { createProblemSchema, updateProblemSchema } from "@prep-os/shared";
import * as problemController from "../controllers/problemControllers";


const router = Router()

router.use(authStub);

router.post("/", validate(createProblemSchema, "body"), problemController.createProblem);
router.get("/", problemController.listProblems);
router.get("/:id", problemController.getProblem);
router.patch("/:id", validate(updateProblemSchema, "body"), problemController.updateProblem);
router.delete("/:id", problemController.deleteProblem);
 
export default router;
 
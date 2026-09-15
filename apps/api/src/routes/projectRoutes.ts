import { Router } from "express";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "@prep-os/shared";

const router = Router();

router.get("/", listProjects);
router.post("/", validate(createProjectSchema), createProject);

router.patch("/:id", validate(updateProjectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;

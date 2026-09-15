import { Router } from "express";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = Router();

router.route("/")
  .get(listProjects)
  .post(createProject);

router.route("/:id")
  .patch(updateProject)
  .delete(deleteProject);

export default router;

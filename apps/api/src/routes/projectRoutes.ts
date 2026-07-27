import { Router } from "express";
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectControllers.js";

const router = Router();

router.route("/")
  .get(listProjects)
  .post(createProject);

router.route("/:id")
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

export default router;

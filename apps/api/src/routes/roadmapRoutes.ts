import { Router } from "express";
import {
  getRoadmapProgress,
  updateRoadmapProgress,
} from "../controllers/roadmapController.js";
import { validate } from "../middleware/validate.js";
import { roadmapKeyParamSchema, updateRoadmapProgressSchema } from "@prep-os/shared";

const router = Router();

router.get("/:key", validate(roadmapKeyParamSchema, "params"), getRoadmapProgress);
router.put(
  "/:key",
  validate(roadmapKeyParamSchema, "params"),
  validate(updateRoadmapProgressSchema),
  updateRoadmapProgress,
);

export default router;

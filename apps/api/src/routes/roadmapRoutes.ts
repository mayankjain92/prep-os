import { Router } from "express";
import {
  getRoadmapProgress,
  updateRoadmapProgress,
} from "../controllers/roadmapController.js";
import { validate } from "../middleware/validate.js";
import { updateRoadmapProgressSchema } from "@prep-os/shared";

const router = Router();

router.get("/:key", getRoadmapProgress);
router.put("/:key", validate(updateRoadmapProgressSchema), updateRoadmapProgress);

export default router;

import { Router } from "express";
import {
  getRoadmapProgress,
  updateRoadmapProgress,
} from "../controllers/roadmapController.js";

const router = Router();

router.get("/:key", getRoadmapProgress);
router.put("/:key", updateRoadmapProgress);

export default router;

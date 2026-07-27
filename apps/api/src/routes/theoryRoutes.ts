import { Router } from "express";
import {
  listTheoryTopics,
  createTheoryTopic,
  getTheoryStats,
  seedRoadmap,
  updateTheoryTopic,
  deleteTheoryTopic,
} from "../controllers/theoryControllers.js";

const router = Router();

router.get("/stats", getTheoryStats);
router.post("/seed", seedRoadmap);

router.route("/")
  .get(listTheoryTopics)
  .post(createTheoryTopic);

router.route("/:id")
  .patch(updateTheoryTopic)
  .delete(deleteTheoryTopic);

export default router;

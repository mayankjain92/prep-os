import { Router } from "express";
import {
  getDoubts,
  createDoubt,
  updateDoubt,
  deleteDoubt,
} from "../controllers/doubtController.js";

const router = Router();

router.get("/", getDoubts);
router.post("/", createDoubt);
router.patch("/:id", updateDoubt);
router.delete("/:id", deleteDoubt);

export default router;

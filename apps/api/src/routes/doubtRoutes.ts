import { Router } from "express";
import {
  getDoubts,
  createDoubt,
  updateDoubt,
  deleteDoubt,
} from "../controllers/doubtController.js";
import { validate } from "../middleware/validate.js";
import { createDoubtSchema, updateDoubtSchema } from "@prep-os/shared";

const router = Router();

router.get("/", getDoubts);
router.post("/", validate(createDoubtSchema), createDoubt);
router.patch("/:id", validate(updateDoubtSchema), updateDoubt);
router.delete("/:id", deleteDoubt);

export default router;

import { Router } from "express";
import { register, login, oauthLogin, getProfile, checkUsername } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { loginSchema, registerSchema } from "@prep-os/shared";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/oauth", oauthLogin);
router.get("/check-username", checkUsername);
router.get("/profile", authMiddleware, getProfile);

export default router;

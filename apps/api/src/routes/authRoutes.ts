import { Router } from "express";
import { register, login, oauthLogin, getProfile, checkUsername, setUsername, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  loginSchema,
  oauthLoginSchema,
  registerSchema,
  setUsernameSchema,
} from "@prep-os/shared";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/oauth", validate(oauthLoginSchema), oauthLogin);
router.post("/logout", logout);
router.get("/check-username", checkUsername);
router.get("/profile", authMiddleware, getProfile);
router.post("/set-username", authMiddleware, validate(setUsernameSchema), setUsername);

export default router;

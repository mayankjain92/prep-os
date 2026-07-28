import { Router } from "express";
import { register, login, oauthLogin, getProfile, checkUsername, updateNeetcodeProgress } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth", oauthLogin);
router.get("/check-username", checkUsername);
router.get("/profile", authMiddleware, getProfile);
router.put("/neetcode-progress", authMiddleware, updateNeetcodeProgress);

export default router;

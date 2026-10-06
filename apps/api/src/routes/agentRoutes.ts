import express from "express";
import { chatWithAgent } from "../controllers/agentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const agentRoutes = express.Router();

agentRoutes.post("/chat", authMiddleware, chatWithAgent);

export default agentRoutes;

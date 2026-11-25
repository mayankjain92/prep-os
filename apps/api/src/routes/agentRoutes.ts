import express from "express";
import { z } from "zod";
import { chatWithAgent } from "../controllers/agentController.js";
import { validate } from "../middleware/validate.js";

const chatSchema = z.object({
  message: z.string().trim().min(1, "Message is required.").max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        content: z.string(),
      }),
    )
    .max(50)
    .optional()
    .default([]),
});

const agentRoutes = express.Router();

agentRoutes.post("/chat", validate(chatSchema), chatWithAgent);

export default agentRoutes;

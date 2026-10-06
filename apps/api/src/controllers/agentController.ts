import { Request, Response } from "express";
import { askAgent } from "../services/agent/agentService.js";

export const chatWithAgent = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const reply = await askAgent(userId, message.trim(), history || []);

    return res.json({ reply });
  } catch (error: any) {
    console.error("[agentController error]:", error);
    return res.status(500).json({
      error: error.message || "Failed to process agent request.",
    });
  }
};

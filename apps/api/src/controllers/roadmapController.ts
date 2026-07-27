import { Request, Response } from "express";
import { RoadmapProgress } from "../models/RoadmapProgress.js";
import { updateRoadmapProgressSchema } from "@prep-os/shared";

export async function getRoadmapProgress(req: Request, res: Response) {
  try {
    const { key } = req.params;
    let progress = await RoadmapProgress.findOne({ userId: req.userId, roadmapKey: key });
    
    if (!progress) {
      return res.json({});
    }

    // Convert Map to plain object for frontend
    const nodeStatuses: Record<string, string> = {};
    progress.nodeStatuses.forEach((value, key) => {
      nodeStatuses[key] = value;
    });

    res.json(nodeStatuses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roadmap progress" });
  }
}

export async function updateRoadmapProgress(req: Request, res: Response) {
  try {
    const { key } = req.params;
    const parsed = updateRoadmapProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid input" });
    }

    let progress = await RoadmapProgress.findOne({ userId: req.userId, roadmapKey: key });
    
    if (!progress) {
      progress = new RoadmapProgress({
        userId: req.userId,
        roadmapKey: key,
        nodeStatuses: parsed.data.nodeStatuses,
      });
      await progress.save();
    } else {
      progress.nodeStatuses = new Map(Object.entries(parsed.data.nodeStatuses)) as any;
      progress.markModified("nodeStatuses");
      await progress.save();
    }

    const nodeStatuses: Record<string, string> = {};
    progress.nodeStatuses.forEach((value, k) => {
      nodeStatuses[k] = value;
    });

    res.json(nodeStatuses);
  } catch (error) {
    res.status(500).json({ error: "Failed to update roadmap progress" });
  }
}

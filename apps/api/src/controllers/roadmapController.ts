import { Request, Response } from "express";
import { RoadmapProgress } from "../models/RoadmapProgress.js";

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
    const incomingStatuses = req.body.nodeStatuses as Record<
      string,
      "pending" | "in-progress" | "done"
    >;

    let progress = await RoadmapProgress.findOne({ userId: req.userId, roadmapKey: key });
    
    if (!progress) {
      progress = new RoadmapProgress({
        userId: req.userId,
        roadmapKey: key,
        nodeStatuses: incomingStatuses,
      });
      await progress.save();
    } else {
      for (const [nodeId, status] of Object.entries(incomingStatuses)) {
        progress.nodeStatuses.set(nodeId, status);
      }
      progress.markModified("nodeStatuses");
      await progress.save();
    }

    const formattedStatuses: Record<string, string> = {};
    progress.nodeStatuses.forEach((value, k) => {
      formattedStatuses[k] = value;
    });

    res.json(formattedStatuses);
  } catch (error) {
    res.status(500).json({ error: "Failed to update roadmap progress" });
  }
}

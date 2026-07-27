import { Request, Response } from "express";
import { Doubt } from "../models/Doubt.js";
import { createDoubtSchema, updateDoubtSchema } from "@prep-os/shared";

export async function getDoubts(req: Request, res: Response) {
  try {
    const doubts = await Doubt.find({ userId: req.userId }).sort({ createdAt: -1 });
    // Map to frontend interface DoubtItem
    const formattedDoubts = doubts.map(d => ({
      id: d._id.toString(),
      title: d.title,
      type: d.type,
      topic: d.topic,
      url: d.url,
      priority: d.priority,
      notes: d.notes,
      resolved: d.resolved,
      createdAt: d.createdAt,
    }));
    res.json(formattedDoubts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doubts" });
  }
}

export async function createDoubt(req: Request, res: Response) {
  try {
    const parsed = createDoubtSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid input" });
    }
    
    const doubt = await Doubt.create({
      ...parsed.data,
      userId: req.userId,
    });
    
    res.status(201).json({
      id: doubt._id.toString(),
      title: doubt.title,
      type: doubt.type,
      topic: doubt.topic,
      url: doubt.url,
      priority: doubt.priority,
      notes: doubt.notes,
      resolved: doubt.resolved,
      createdAt: doubt.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create doubt" });
  }
}

export async function updateDoubt(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const parsed = updateDoubtSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid input" });
    }

    const doubt = await Doubt.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: parsed.data },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }

    res.json({
      id: doubt._id.toString(),
      title: doubt.title,
      type: doubt.type,
      topic: doubt.topic,
      url: doubt.url,
      priority: doubt.priority,
      notes: doubt.notes,
      resolved: doubt.resolved,
      createdAt: doubt.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update doubt" });
  }
}

export async function deleteDoubt(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findOneAndDelete({ _id: id, userId: req.userId });
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete doubt" });
  }
}

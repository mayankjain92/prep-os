import { Request, Response } from "express";
import { Types } from "mongoose";
import { Problem } from "../models/Problem.js";
import { getLeetCodeUserData, invalidateLeetCodeCache } from "../services/leetcodeService.js";
import { STANDARD_DSA_ROADMAP } from "@prep-os/shared";

function getParamId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
}

export async function createProblem(req: Request, res: Response) {
  const userId = req.userId;
  const problem = await Problem.create({ ...req.body, userId });
  res.status(201).json(problem);
}

export async function listProblems(req: Request, res: Response) {
  const userId = req.userId;

  // Auto-seed standard DSA roadmap if user has no problems recorded yet
  const count = await Problem.countDocuments({ userId: userId as any });
  if (count === 0) {
    const roadmapItems = STANDARD_DSA_ROADMAP.map((item) => ({
      userId,
      title: item.title,
      difficulty: item.difficulty,
      status: "todo",
      url: item.url,
      topics: [item.topic],
      notes: "Standard DSA Roadmap",
    }));
    await Problem.insertMany(roadmapItems);
  }

  const problems = await Problem.find({ userId: userId as any }).sort({ createdAt: 1 });
  res.json(problems);
}

export async function getProblem(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const problem = await Problem.findOne({ _id: id, userId });
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json(problem);
}

export async function updateProblem(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const updateData = { ...req.body };

  if (updateData.status === "solved") {
    const existing = await Problem.findOne({ _id: id, userId });
    if (!existing) {
      return res.status(404).json({ error: "Problem not found" });
    }
    if (!existing.solvedAt) {
      updateData.solvedAt = new Date();
    }
  } else if (updateData.status && updateData.status !== "solved") {
    updateData.solvedAt = null;
  }

  const problem = await Problem.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json(problem);
}

export async function deleteProblem(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const problem = await Problem.findOneAndDelete({ _id: id, userId });
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.status(204).send();
}

export async function syncLeetCodeProblems(req: Request, res: Response) {
  const userId = req.userId;
  const username = (req.body.username as string) || "mayankjain92";

  await invalidateLeetCodeCache(userId, username);
  const dataResult = await getLeetCodeUserData(userId, username);

  let updatedCount = 0;
  for (const item of dataResult.solvedProblems) {
    const existing = await Problem.findOne({
      userId: userId as any,
      $or: [
        { title: new RegExp(`^${item.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        { url: new RegExp(item.titleSlug, "i") },
      ],
    });

    if (existing) {
      existing.status = "solved";
      existing.solvedAt = new Date();
      await existing.save();
      updatedCount++;
    } else {
      await Problem.create({
        userId,
        title: item.title,
        difficulty: item.difficulty,
        status: "solved",
        url: item.url,
        topics: ["LeetCode"],
        notes: `Synced from LeetCode user @${username}`,
        solvedAt: new Date(),
      });
      updatedCount++;
    }
  }

  res.json({
    message: `Successfully synced LeetCode profile for @${username}`,
    synced: updatedCount,
    profile: dataResult.profile,
  });
}
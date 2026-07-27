import { Request, Response } from "express";
import { Types } from "mongoose";
import { TheoryTopic } from "../models/TheoryTopic.js";
import { getTheoryStatsForUser } from "../services/theoryStatsService.js";
import { STANDARD_THEORY_ROADMAPS } from "@prep-os/shared";

function getParamId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
}

export async function listTheoryTopics(req: Request, res: Response) {
  const userId = req.userId;
  const { subject } = req.query;

  const filter: any = { userId };
  if (subject && typeof subject === "string") {
    filter.subject = subject;
  }

  // Populate any missing standard roadmap topics for this user on load
  const subjectsToCheck = (subject && typeof subject === "string")
    ? [subject]
    : Object.keys(STANDARD_THEORY_ROADMAPS);

  for (const sub of subjectsToCheck) {
    const roadmapTopics = STANDARD_THEORY_ROADMAPS[sub] || [];
    const existingTopics = await TheoryTopic.find({ userId, subject: sub as any }).select("topicName");
    const existingSet = new Set(existingTopics.map((t) => t.topicName));

    const newTopics = roadmapTopics
      .filter((name) => !existingSet.has(name))
      .map((name) => ({
        userId,
        subject: sub as any,
        topicName: name,
        status: "not-started",
        notes: "",
      }));

    if (newTopics.length > 0) {
      await TheoryTopic.insertMany(newTopics);
    }
  }

  const topics = await TheoryTopic.find(filter).sort({ createdAt: 1 });
  res.json(topics);
}

export async function createTheoryTopic(req: Request, res: Response) {
  const userId = req.userId;
  const topic = await TheoryTopic.create({ ...req.body, userId });
  res.status(201).json(topic);
}

export async function getTheoryStats(req: Request, res: Response) {
  const userId = req.userId;

  // Auto-seed all standard roadmaps on first stats load if empty
  const count = await TheoryTopic.countDocuments({ userId });
  if (count === 0) {
    for (const sub of Object.keys(STANDARD_THEORY_ROADMAPS)) {
      const roadmapTopics = STANDARD_THEORY_ROADMAPS[sub] || [];
      const newTopics = roadmapTopics.map((name) => ({
        userId,
        subject: sub as any,
        topicName: name,
        status: "not-started",
        notes: "",
      }));
      await TheoryTopic.insertMany(newTopics);
    }
  }

  const stats = await getTheoryStatsForUser(userId);
  res.json(stats);
}

export async function seedRoadmap(req: Request, res: Response) {
  const userId = req.userId;
  const { subject } = req.body;

  const subjectsToSeed = subject
    ? [subject]
    : Object.keys(STANDARD_THEORY_ROADMAPS);

  let addedCount = 0;

  for (const sub of subjectsToSeed) {
    const roadmapTopics = STANDARD_THEORY_ROADMAPS[sub] || [];
    const existingTopics = await TheoryTopic.find({ userId, subject: sub as any }).select("topicName");
    const existingSet = new Set(existingTopics.map((t) => t.topicName));

    const newTopics = roadmapTopics
      .filter((name) => !existingSet.has(name))
      .map((name) => ({
        userId,
        subject: sub as any,
        topicName: name,
        status: "not-started",
        notes: "",
      }));

    if (newTopics.length > 0) {
      await TheoryTopic.insertMany(newTopics);
      addedCount += newTopics.length;
    }
  }

  res.json({ message: `Successfully seeded ${addedCount} roadmap topics`, addedCount });
}

export async function updateTheoryTopic(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Theory topic not found" });
  }

  const topic = await TheoryTopic.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!topic) {
    return res.status(404).json({ error: "Theory topic not found" });
  }
  res.json(topic);
}

export async function deleteTheoryTopic(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Theory topic not found" });
  }

  const topic = await TheoryTopic.findOneAndDelete({ _id: id, userId });
  if (!topic) {
    return res.status(404).json({ error: "Theory topic not found" });
  }
  res.status(204).send();
}

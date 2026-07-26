import { Request, Response } from "express";
import { Problem } from "../models/Problem";

export async function createProblem(req: Request, res: Response) {
  const userId = req.userId;
  const problem = await Problem.create({ ...req.body, userId });
  res.status(201).json(problem);
}

export async function listProblems(req: Request, res: Response) {
  const userId = req.userId;
  const problems = await Problem.find({ userId }).sort({ createdAt: -1 });
  res.json(problems);
}

export async function getProblem(req: Request, res: Response) {
  const userId = req.userId;
  const problem = await Problem.findOne({ _id: req.params.id, userId });
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json(problem);
}

export async function updateProblem(req: Request, res: Response) {
  const userId = req.userId;
  const updateData = { ...req.body };

  if (updateData.status === "solved") {
    const existing = await Problem.findOne({ _id: req.params.id, userId });
    if (!existing) {
      return res.status(404).json({ error: "Problem not found" });
    }
    if (!existing.solvedAt) {
      updateData.solvedAt = new Date();
    }
  } else if (updateData.status && updateData.status !== "solved") {
    // moving OUT of solved (e.g. back to "attempted") clears solvedAt
    updateData.solvedAt = null;
  }

  const problem = await Problem.findOneAndUpdate(
    { _id: req.params.id, userId },
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
  const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId });
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.status(204).send();
}
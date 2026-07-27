import { Request, Response } from "express";
import { Types } from "mongoose";
import { Project } from "../models/Project.js";

function getParamId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
}

export async function listProjects(req: Request, res: Response) {
  const userId = req.userId;
  const projects = await Project.find({ userId }).sort({ createdAt: -1 });
  res.json(projects);
}

export async function createProject(req: Request, res: Response) {
  const userId = req.userId;
  const project = await Project.create({ ...req.body, userId });
  res.status(201).json(project);
}

export async function getProject(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Project not found" });
  }

  const project = await Project.findOne({ _id: id, userId });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
}

export async function updateProject(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Project not found" });
  }

  const project = await Project.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
}

export async function deleteProject(req: Request, res: Response) {
  const userId = req.userId;
  const id = getParamId(req);

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Project not found" });
  }

  const project = await Project.findOneAndDelete({ _id: id, userId });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.status(204).send();
}

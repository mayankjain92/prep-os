import { Request, Response } from "express";
import { User } from "../models/User.js";
import {
  getLeetCodeUserData,
  invalidateLeetCodeCache,
} from "../services/leetcodeService.js";

export async function getLeetCodeProfile(req: Request, res: Response) {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user || !user.leetcodeProfile) {
    return res.json({ profile: null });
  }
  res.json({ profile: user.leetcodeProfile });
}

export async function updateNeetcodeProgress(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { solved, starred } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "neetcodeProgress.solved": Array.isArray(solved) ? solved : [],
          "neetcodeProgress.starred": Array.isArray(starred) ? starred : [],
        },
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "NeetCode progress saved",
      neetcodeProgress: user.neetcodeProgress,
    });
  } catch (error: any) {
    console.error("updateNeetcodeProgress error:", error);
    res.status(500).json({ error: "Failed to update NeetCode progress" });
  }
}

export async function syncLeetCodeProblems(req: Request, res: Response) {
  const userId = req.userId;
  const username = req.body.username as string;
  const force = Boolean(req.body.force);

  if (!username) {
    return res.status(400).json({ error: "LeetCode username is required" });
  }

  if (force) {
    await invalidateLeetCodeCache(userId, username);
  }
  const dataResult = await getLeetCodeUserData(userId, username);

  // Persist synced profile into User document
  await User.findByIdAndUpdate(userId, {
    leetcodeProfile: {
      ...dataResult.profile,
      syncedAt: new Date(),
    },
  });

  res.json({
    message: dataResult.fromCache
      ? `LeetCode profile loaded from Redis cache for @${username}`
      : `Successfully synced LeetCode profile for @${username}`,
    synced: dataResult.profile.totalSolved,
    fromCache: Boolean(dataResult.fromCache),
    profile: dataResult.profile,
  });
}

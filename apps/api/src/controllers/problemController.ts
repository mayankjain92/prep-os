import { Request, Response } from "express";
import { User } from "../models/User.js";
import {
  syncUserLeetCodeProfile,
  invalidateLeetCodeCache,
} from "../services/leetcodeService.js";

export async function getLeetCodeProfile(req: Request, res: Response) {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user || !user.leetcodeProfile?.username) {
    return res.json({ profile: null });
  }
  res.json({ profile: user.leetcodeProfile });
}

export async function disconnectLeetCodeProfile(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user?.leetcodeProfile?.username) {
      await invalidateLeetCodeCache(userId, user.leetcodeProfile.username);
    }

    await User.findByIdAndUpdate(userId, {
      $unset: { leetcodeProfile: 1 },
    });

    res.json({
      message: "LeetCode profile disconnected successfully",
      profile: null,
    });
  } catch (error: any) {
    console.error("disconnectLeetCodeProfile error:", error);
    res.status(500).json({ error: "Failed to disconnect LeetCode profile" });
  }
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

  const result = await syncUserLeetCodeProfile(userId, username, force);

  if (!result.synced) {
    return res.status(502).json({
      error: result.error || `Failed to sync LeetCode profile for @${username}`,
    });
  }

  res.json({
    message: `Successfully synced LeetCode profile for @${username}`,
    synced: result.profile.totalSolved,
    profile: result.profile,
  });
}

import { Doubt } from "../../models/Doubt.js";
import { User } from "../../models/User.js";
import { RoadmapProgress } from "../../models/RoadmapProgress.js";
import { syncUserLeetCodeProfile } from "../leetcodeService.js";

export const createDoubtTool = {
  name: "createDoubt",
  description:
    "Create a new study doubt or problem to revisit in the user's doubt queue.",
  parameters: {
    type: "OBJECT",
    properties: {
      title: {
        type: "STRING",
        description: "Title or core question of the doubt",
      },
      topic: {
        type: "STRING",
        description:
          "Subject topic (e.g., 'Operating Systems', 'Graphs', 'DBMS')",
      },
      type: {
        type: "STRING",
        enum: ["leetcode", "topic"],
        description: "Whether it is a LeetCode problem or a theory topic",
      },
      priority: {
        type: "STRING",
        enum: ["high", "medium", "low"],
        description: "Priority level",
      },
      notes: {
        type: "STRING",
        description: "Optional notes or context about why the user was stuck",
      },
    },
    required: ["title", "topic", "type"],
  },

  execute: async (userId: string, args: any) => {
    const doubt = await Doubt.create({
      userId,
      title: args.title,
      topic: args.topic,
      type: args.type,
      priority: args.priority || "medium",
      notes: args.notes || "",
    });
    return {
      success: true,
      message: `Doubt '${doubt.title}' logged with ID ${doubt._id}`,
    };
  },
};

export const syncLeetCodeTool = {
  name: "syncLeetCode",
  description:
    "Trigger an on-demand synchronization with LeetCode to fetch the student's latest problem solve counts and global ranking, saving fresh stats to the database.",
  parameters: {
    type: "OBJECT",
    properties: {
      username: {
        type: "STRING",
        description:
          "LeetCode username to sync (optional if already linked in user profile)",
      },
    },
  },
  execute: async (userId: string, args: any) => {
    const user = await User.findById(userId);
    const username = args?.username || user?.leetcodeProfile?.username;
    if (!username) {
      return {
        success: false,
        error:
          "No LeetCode username provided and none linked in user profile.",
      };
    }
    const syncRes = await syncUserLeetCodeProfile(userId, username, true);
    return {
      success: syncRes.synced,
      message: syncRes.synced
        ? `Successfully synced latest LeetCode stats for @${username}. Total solved: ${syncRes.profile.totalSolved} (Easy: ${syncRes.profile.easySolved}, Med: ${syncRes.profile.mediumSolved}, Hard: ${syncRes.profile.hardSolved})`
        : `Could not reach live LeetCode API, returned current cached profile for @${username}.`,
      profile: syncRes.profile,
    };
  },
};

export const getUserProgressTool = {
  name: "getUserProgress",
  description:
    "Retrieve a breakdown of the student's preparation: streak, cached LeetCode stats, solved NeetCode problem IDs, completed vs pending CS roadmap topics, and active doubt titles/topics.",
  parameters: {
    type: "OBJECT",
    properties: {},
  },
  execute: async (userId: string) => {
    const user = await User.findById(userId);

    const activeDoubts = await Doubt.find({
      userId,
      resolved: false,
    })
      .select("title topic priority createdAt")
      .limit(5);

    const roadmaps = await RoadmapProgress.find({ userId });
    const roadmapBreakdown = roadmaps.map((r) => {
      const completed: string[] = [];
      const inProgress: string[] = [];
      r.nodeStatuses?.forEach((status: string, nodeId: string) => {
        if (status === "done") completed.push(nodeId);
        if (status === "in-progress") inProgress.push(nodeId);
      });
      return {
        roadmap: r.roadmapKey,
        completedTopics: completed,
        inProgressTopics: inProgress,
      };
    });

    return {
      streak: {
        current: user?.currentStreak || 0,
        longest: user?.longestStreak || 0,
      },
      leetcodeProfile: user?.leetcodeProfile || null,
      leetcodeSyncStatus: user?.leetcodeProfile?.syncedAt
        ? { syncedNow: false, syncedAt: user.leetcodeProfile.syncedAt }
        : { syncedNow: false },
      neetcode: {
        totalSolved: user?.neetcodeProgress?.solved?.length || 0,
        solvedProblemsList: user?.neetcodeProgress?.solved || [],
      },
      roadmaps: roadmapBreakdown,
      unresolvedDoubts: activeDoubts.map((d) => ({
        id: d._id,
        title: d.title,
        topic: d.topic,
        priority: d.priority,
      })),
    };
  },
};

export const getLeetCodeStatsTool = {
  name: "getLeetCodeStats",
  description:
    "Retrieve the user's latest LeetCode solved count (easy, medium, hard) and global ranking. Automatically triggers a sync with LeetCode to guarantee fresh live data.",
  parameters: {
    type: "OBJECT",
    properties: {
      username: {
        type: "STRING",
        description:
          "LeetCode username (optional if already linked to user profile)",
      },
    },
  },
  execute: async (userId: string, args: any) => {
    const user = await User.findById(userId);
    const username = args?.username || user?.leetcodeProfile?.username;
    if (!username) {
      return {
        error: "No LeetCode username provided and none linked in profile.",
      };
    }
    const syncRes = await syncUserLeetCodeProfile(userId, username, true);
    return {
      ...syncRes.profile,
      syncedNow: syncRes.synced,
    };
  },
};

export const toolsRegistry = {
  createDoubt: createDoubtTool,
  getUserProgress: getUserProgressTool,
  getLeetCodeStats: getLeetCodeStatsTool,
  syncLeetCode: syncLeetCodeTool,
};

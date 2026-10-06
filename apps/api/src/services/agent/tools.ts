import { z } from "zod";
import { Doubt } from "../../models/Doubt.js";
import { User } from "../../models/User.js";
import { RoadmapProgress } from "../../models/RoadmapProgress.js";
import { getLeetCodeUserData } from "../leetcodeService.js";

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

export const getUserProgressTool = {
  name: "getUserProgress",
  description:
    "Retrieve the student's daily streak, total NeetCode problems solved, and active unresolved doubts count.",
  parameters: {
    type: "OBJECT",
    properties: {},
  },
  execute: async (userId: string) => {
    const user = await User.findById(userId);
    const activeDoubts = await Doubt.countDocuments({
      userId,
      resolved: false,
    });
    const roadmaps = await RoadmapProgress.find({ userId });
    return {
      streak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      neetcodeSolvedCount: user?.neetcodeProgress?.solved?.length || 0,
      activeUnresolvedDoubts: activeDoubts,
      roadmapsTracked: roadmaps.map((r) => r.roadmapKey),
    };
  },
};

export const getLeetCodeStatsTool = {
  name: "getLeetCodeStats",
  description:
    "Retrieve the user's LeetCode solved count (easy, medium, hard) and global ranking.",
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
    const username = args.username || user?.leetcodeProfile?.username;
    if (!username) {
      return {
        error: "No LeetCode username provided and none linked in profile.",
      };
    }
    const data = await getLeetCodeUserData(userId, username);
    return data.profile;
  },
};

export const toolsRegistry = {
  createDoubt: createDoubtTool,
  getUserProgress: getUserProgressTool,
  getLeetCodeStats: getLeetCodeStatsTool,
};

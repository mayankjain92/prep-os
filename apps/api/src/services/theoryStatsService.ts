import { TheoryTopic } from "../models/TheoryTopic.js";

export interface SubjectStat {
  subject: string;
  total: number;
  completed: number;
  inProgress: number;
  percentage: number;
}

export async function getTheoryStatsForUser(userId: string): Promise<SubjectStat[]> {
  const stats = await TheoryTopic.aggregate([
    {
      $match: { userId },
    },
    {
      $group: {
        _id: "$subject",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        subject: "$_id",
        total: 1,
        completed: 1,
        inProgress: 1,
        percentage: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$completed", "$total"] }, 100] }, 1] },
          ],
        },
      },
    },
  ]);

  return stats;
}

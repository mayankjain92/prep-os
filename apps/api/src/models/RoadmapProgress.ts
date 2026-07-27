import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoadmapProgress extends Document {
  userId: Types.ObjectId;
  roadmapKey: string;
  nodeStatuses: Map<string, "pending" | "in-progress" | "done">;
  createdAt: Date;
  updatedAt: Date;
}

const roadmapProgressSchema = new Schema<IRoadmapProgress>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    roadmapKey: { type: String, required: true, index: true },
    nodeStatuses: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

roadmapProgressSchema.index({ userId: 1, roadmapKey: 1 }, { unique: true });

export const RoadmapProgress = mongoose.model<IRoadmapProgress>("RoadmapProgress", roadmapProgressSchema);

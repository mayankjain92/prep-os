import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDoubt extends Document {
  userId: Types.ObjectId;
  title: string;
  type: "leetcode" | "topic";
  topic: string;
  url?: string;
  priority: "high" | "medium" | "low";
  notes?: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doubtSchema = new Schema<IDoubt>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["leetcode", "topic"], required: true },
    topic: { type: String, required: true, trim: true },
    url: { type: String, trim: true, default: "" },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    notes: { type: String, trim: true, default: "" },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Doubt = mongoose.model<IDoubt>("Doubt", doubtSchema);
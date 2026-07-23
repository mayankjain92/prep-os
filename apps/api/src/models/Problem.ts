import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProblem extends Document {
  userId: Types.ObjectId;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  status: "todo" | "attempted" | "solved" | "revisit";
  url: string;
  notes: string;
  solvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    topics: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["todo", "attempted", "solved", "revisit"],
      default: "todo",
    },
    url: { type: String, default: "" },
    notes: { type: String, default: "" },
    solvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);
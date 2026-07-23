import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  userId: Types.ObjectId;
  name: string;
  techStack: string[];
  repoUrl: string;
  status: "planning" | "in-progress" | "completed" | "shipped";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true, trim: true },
    techStack: { type: [String], default: [] },
    repoUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "shipped"],
      default: "planning",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
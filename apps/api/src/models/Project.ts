import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  userId: string;
  name: string;
  techStack: string[];
  status: "planning" | "in-progress" | "completed" | "archived";
  repoUrl: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "archived"],
      default: "planning",
    },
    repoUrl: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Project = model<IProject>("Project", projectSchema);
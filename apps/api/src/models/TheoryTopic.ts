import { Schema, model, Document } from "mongoose";

export interface ITheoryTopic extends Document {
  userId: string;
  subject: "OS" | "DBMS" | "CN" | "OOP" | "Aptitude";
  topicName: string;
  status: "not-started" | "in-progress" | "completed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const theoryTopicSchema = new Schema<ITheoryTopic>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      enum: ["OS", "DBMS", "CN", "OOP", "Aptitude"],
      required: true,
    },
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
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

theoryTopicSchema.index({ userId: 1, subject: 1 });

export const TheoryTopic = model<ITheoryTopic>("TheoryTopic", theoryTopicSchema);
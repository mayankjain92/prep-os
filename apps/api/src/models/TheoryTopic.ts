import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITheoryTopic extends Document {
  userId: Types.ObjectId;
  subject: "OS" | "DBMS" | "CN" | "Aptitude";
  topicName: string;
  status: "not-started" | "in-progress" | "completed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const theoryTopicSchema = new Schema<ITheoryTopic>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    subject: { type: String, enum: ["OS", "DBMS", "CN", "Aptitude"], required: true },
    topicName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const TheoryTopic = mongoose.model<ITheoryTopic>("TheoryTopic", theoryTopicSchema);
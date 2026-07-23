import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDoubt extends Document {
  userId: Types.ObjectId;
  topic: string;
  problemNumber: number | null;
  description: string;
  status: "open" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const doubtSchema = new Schema<IDoubt>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    topic: { type: String, required: true, trim: true },
    problemNumber: { type: Number, default: null },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
  },
  { timestamps: true }
);

export const Doubt = mongoose.model<IDoubt>("Doubt", doubtSchema);
import mongoose, {Schema, Document, Types} from "mongoose";
import {DSA_TOPICS} from "@prep-os/shared";

export interface ITopicStatus extends Document{
    userId: Types.ObjectId;
    topicName: (typeof DSA_TOPICS)[number];
    status: "learning" | "done" | "skip";
    crearedAt : Date;
    updatedAt : Date;
}

const topicStatusSchema = new Schema<ITopicStatus>(
    {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    topicName: { type: String, enum: DSA_TOPICS, required: true },
    status: { type: String, enum: ["learning", "done", "skip"], default: "learning" },
  },
  { timestamps: true }
)

topicStatusSchema.index({userId: 1, topicName: 1}, {unique: true});

export const TopicStatus = mongoose.model<ITopicStatus>("TopicStatus", topicStatusSchema);
import { Schema, model, Document } from "mongoose";

export interface ILeetCodeProfile {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  userAvatar?: string;
  syncedAt?: Date;
}

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  authProvider?: "email" | "google" | "github";
  providerId?: string;
  avatarUrl?: string;
  leetcodeProfile?: ILeetCodeProfile;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    providerId: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    leetcodeProfile: {
      username: { type: String },
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      ranking: { type: Number, default: 0 },
      userAvatar: { type: String },
      syncedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);

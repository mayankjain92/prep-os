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
  username?: string;
  email: string;
  passwordHash?: string;
  authProvider?: "email" | "google" | "github";
  providerId?: string;
  avatarUrl?: string;
  leetcodeProfile?: ILeetCodeProfile;
  neetcodeProgress?: {
    solved: string[];
    starred: string[];
  };
  loginDates?: string[];
  currentStreak?: number;
  longestStreak?: number;
  lastLoginDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
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
    neetcodeProgress: {
      solved: { type: [String], default: [] },
      starred: { type: [String], default: [] },
    },
    loginDates: {
      type: [String],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastLoginDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);

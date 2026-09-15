import jwt from "jsonwebtoken";
import { IUser } from "../models/User.js";
import { env } from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

/**
 * Centrally signs JWT token for authenticated users
 */
export function generateToken(user: IUser): string {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Standardizes user profile payload returned across all auth endpoints
 */
export function formatAuthUser(user: IUser) {
  return {
    id: user._id.toString(),
    username: user.username || null,
    email: user.email,
    authProvider: user.authProvider || "email",
    avatarUrl: user.avatarUrl || "",
    loginDates: user.loginDates || [],
    currentStreak: user.currentStreak || 0,
    longestStreak: user.longestStreak || 0,
    lastLoginDate: user.lastLoginDate || "",
  };
}

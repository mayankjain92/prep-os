import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User, IUser } from "../models/User.js";
import { RoadmapProgress } from "../models/RoadmapProgress.js";
import { TopicStatus } from "../models/TopicStatus.js";
import { Project } from "../models/Project.js";
import { registerSchema, loginSchema } from "@prep-os/shared";

const JWT_SECRET = process.env.JWT_SECRET || "prep-os-super-secret-key-12345";
const JWT_EXPIRES_IN = "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function checkUsername(req: Request, res: Response) {
  try {
    const rawUsername = ((req.query.username as string) || "").trim().toLowerCase();
    if (!rawUsername || rawUsername.length < 3 || rawUsername.length > 20) {
      return res.json({ available: false, message: "Username must be 3-20 characters" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(rawUsername)) {
      return res.json({ available: false, message: "Only letters, numbers, and underscores allowed" });
    }
    const existing = await User.findOne({ username: rawUsername });
    if (existing) {
      return res.json({ available: false, message: "Username is already taken" });
    }
    return res.json({ available: true, message: "Username is available!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to check username" });
  }
}

export async function register(req: Request, res: Response) {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues?.[0]?.message || "Invalid input";
    return res.status(400).json({ error: errorMsg });
  }

  const { username, email, password } = parseResult.data;
  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  const existingEmail = await User.findOne({ email: cleanEmail });
  if (existingEmail) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  const existingUsername = await User.findOne({ username: cleanUsername });
  if (existingUsername) {
    return res.status(400).json({ error: "Username is already taken" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const createdUser = await User.create({
    username: cleanUsername,
    email: cleanEmail,
    passwordHash,
    authProvider: "email",
  });

  const updatedUser = await recordDailyLogin(createdUser);

  const token = jwt.sign(
    { userId: (updatedUser._id as any).toString(), email: updatedUser.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(201).json({
    message: "Registration successful",
    token,
    user: {
      id: (updatedUser._id as any).toString(),
      username: updatedUser.username || updatedUser.email.split("@")[0],
      email: updatedUser.email,
      loginDates: updatedUser.loginDates || [],
      currentStreak: updatedUser.currentStreak || 0,
      longestStreak: updatedUser.longestStreak || 0,
      lastLoginDate: updatedUser.lastLoginDate || "",
    },
  });
}

export async function login(req: Request, res: Response) {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues?.[0]?.message || "Invalid input";
    return res.status(400).json({ error: errorMsg });
  }

  const { email, password } = parseResult.data;
  const identifier = email.trim().toLowerCase();

  // Find user by either email OR username
  const existingUser = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!existingUser || !existingUser.passwordHash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const updatedUser = await recordDailyLogin(existingUser);

  const token = jwt.sign(
    { userId: (updatedUser._id as any).toString(), email: updatedUser.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: (updatedUser._id as any).toString(),
      username: updatedUser.username || updatedUser.email.split("@")[0],
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      loginDates: updatedUser.loginDates || [],
      currentStreak: updatedUser.currentStreak || 0,
      longestStreak: updatedUser.longestStreak || 0,
      lastLoginDate: updatedUser.lastLoginDate || "",
    },
  });
}

export async function oauthLogin(req: Request, res: Response) {
  try {
    let email = req.body.email;
    let provider = req.body.provider || "google";
    let providerId = req.body.providerId || "";
    let avatarUrl = req.body.avatarUrl || "";

    // 1. Google ID Token Verification (Official Google Identity Services)
    if (req.body.credential) {
      provider = "google";
      try {
        if (GOOGLE_CLIENT_ID) {
          const ticket = await googleClient.verifyIdToken({
            idToken: req.body.credential,
            audience: GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          if (payload) {
            email = payload.email;
            providerId = payload.sub;
            avatarUrl = payload.picture || "";
          }
        } else {
          // Decode payload if client ID isn't set yet
          const decoded = jwt.decode(req.body.credential) as any;
          if (decoded && decoded.email) {
            email = decoded.email;
            providerId = decoded.sub || "";
            avatarUrl = decoded.picture || "";
          }
        }
      } catch (err) {
        console.error("Google token verification error:", err);
      }
    }

    // 2. GitHub OAuth Authorization Code Exchange
    if (req.body.code && GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
      provider = "github";
      try {
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: req.body.code,
          }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          const userRes = await fetch("https://api.github.com/user", {
            headers: { Authorization: `token ${tokenData.access_token}` },
          });
          const githubUser = await userRes.json();

          // Fetch primary email if private
          let userEmail = githubUser.email;
          if (!userEmail) {
            const emailsRes = await fetch("https://api.github.com/user/emails", {
              headers: { Authorization: `token ${tokenData.access_token}` },
            });
            const emails = await emailsRes.json();
            if (Array.isArray(emails)) {
              const primary = emails.find((e: any) => e.primary) || emails[0];
              userEmail = primary?.email;
            }
          }

          email = userEmail || `${githubUser.login}@github.com`;
          providerId = String(githubUser.id);
          avatarUrl = githubUser.avatar_url || "";
        }
      } catch (err) {
        console.error("GitHub OAuth code exchange error:", err);
      }
    }

    if (!email) {
      return res.status(400).json({ error: "Could not retrieve user email from OAuth provider." });
    }

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      existingUser = await User.create({
        email,
        authProvider: provider,
        providerId,
        avatarUrl,
      });
    } else {
      existingUser.authProvider = provider;
      if (providerId) existingUser.providerId = providerId;
      if (avatarUrl) existingUser.avatarUrl = avatarUrl;
      await existingUser.save();
    }

    const updatedUser = await recordDailyLogin(existingUser);

    const token = jwt.sign(
      { userId: (updatedUser._id as any).toString(), email: updatedUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: `${provider} OAuth login successful`,
      token,
      user: {
        id: (updatedUser._id as any).toString(),
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        loginDates: updatedUser.loginDates || [],
        currentStreak: updatedUser.currentStreak || 0,
        longestStreak: updatedUser.longestStreak || 0,
        lastLoginDate: updatedUser.lastLoginDate || "",
      },
    });
  } catch (error: any) {
    console.error("OAuth error:", error);
    res.status(500).json({ error: error.message || "OAuth authentication failed." });
  }
}

export async function recordDailyLogin(user: any): Promise<any> {
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const loginDates: string[] = user.loginDates || [];

  if (!user.lastLoginDate) {
    user.lastLoginDate = todayStr;
    user.currentStreak = 1;
    user.longestStreak = Math.max(user.longestStreak || 0, 1);
    if (!loginDates.includes(todayStr)) {
      loginDates.push(todayStr);
    }
    user.loginDates = loginDates;
    await user.save();
    return user;
  }

  if (user.lastLoginDate === todayStr) {
    if (!loginDates.includes(todayStr)) {
      loginDates.push(todayStr);
      user.loginDates = loginDates;
      await user.save();
    }
    return user;
  }

  const lastDate = new Date(user.lastLoginDate);
  const currentDate = new Date(todayStr);
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else {
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  user.lastLoginDate = todayStr;
  if (!loginDates.includes(todayStr)) {
    loginDates.push(todayStr);
  }
  user.loginDates = loginDates;
  await user.save();
  return user;
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await recordDailyLogin(existingUser);

    const roadmapProgress = await RoadmapProgress.find({ userId });
    let totalDoneNodes = 0;
    roadmapProgress.forEach((rp) => {
      if (rp.nodeStatuses) {
        for (const [, status] of rp.nodeStatuses) {
          if (status === "done") totalDoneNodes++;
        }
      }
    });

    const theoryCompletedCount = await TopicStatus.countDocuments({
      userId,
      status: "done",
    });

    const projectsCount = await Project.countDocuments({
      userId,
    });
    const completedProjectsCount = await Project.countDocuments({
      userId,
      status: "completed",
    });

    res.json({
      user: {
        id: (updatedUser._id as any).toString(),
        username: updatedUser.username || updatedUser.email.split("@")[0],
        email: updatedUser.email,
        authProvider: updatedUser.authProvider,
        avatarUrl: updatedUser.avatarUrl,
        leetcodeProfile: updatedUser.leetcodeProfile,
        neetcodeProgress: updatedUser.neetcodeProgress || { solved: [], starred: [] },
        loginDates: updatedUser.loginDates || [],
        currentStreak: updatedUser.currentStreak || 0,
        longestStreak: updatedUser.longestStreak || 0,
        lastLoginDate: updatedUser.lastLoginDate || "",
        createdAt: updatedUser.createdAt,
        stats: {
          dsaSolved: totalDoneNodes,
          theoryCompleted: theoryCompletedCount,
          projectsTotal: projectsCount,
          projectsCompleted: completedProjectsCount,
        },
      },
    });
  } catch (error: any) {
    console.error("getProfile error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}

export async function updateNeetcodeProgress(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { solved, starred } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "neetcodeProgress.solved": Array.isArray(solved) ? solved : [],
          "neetcodeProgress.starred": Array.isArray(starred) ? starred : [],
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "NeetCode progress saved",
      neetcodeProgress: user.neetcodeProgress,
    });
  } catch (error: any) {
    console.error("updateNeetcodeProgress error:", error);
    res.status(500).json({ error: "Failed to update NeetCode progress" });
  }
}


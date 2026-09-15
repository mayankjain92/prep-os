import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { RoadmapProgress } from "../models/RoadmapProgress.js";
import { Project } from "../models/Project.js";
import { registerSchema, loginSchema } from "@prep-os/shared";
import { verifyGoogleToken } from "../services/oauthService.js";
import { recordDailyLogin } from "../services/streakService.js";
import { generateToken, formatAuthUser } from "../services/authService.js";

export async function checkUsername(req: Request, res: Response) {
  try {
    const rawUsername = ((req.query.username as string) || "")
      .trim()
      .toLowerCase();
    if (!rawUsername || rawUsername.length < 3 || rawUsername.length > 20) {
      return res.json({
        available: false,
        message: "Username must be 3-20 characters",
      });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(rawUsername)) {
      return res.json({
        available: false,
        message: "Only letters, numbers, and underscores allowed",
      });
    }
    const existing = await User.findOne({ username: rawUsername });
    if (existing) {
      return res.json({
        available: false,
        message: "Username is already taken",
      });
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

  const existingUsername = await User.findOne({ username: cleanUsername });

  const existingEmail = await User.findOne({ email: cleanEmail });
  if (existingEmail) {
    if (
      existingUsername &&
      existingUsername._id.toString() !== existingEmail._id.toString()
    ) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Account exists (e.g., via OAuth) without password set
    if (!existingEmail.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      existingEmail.passwordHash = await bcrypt.hash(password, salt);
      existingEmail.username = cleanUsername;
      await existingEmail.save();

      const updatedUser = await recordDailyLogin(existingEmail);
      const token = generateToken(updatedUser);

      return res.status(200).json({
        message: "Password linked to account successfully",
        token,
        user: formatAuthUser(updatedUser),
      });
    }

    return res
      .status(400)
      .json({ error: "Email is already registered. Please sign in." });
  }

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
  const token = generateToken(updatedUser);

  res.status(201).json({
    message: "Registration successful",
    token,
    user: formatAuthUser(updatedUser),
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

  if (!existingUser) {
    return res
      .status(401)
      .json({ error: "Invalid username/email or password" });
  }

  if (!existingUser.passwordHash) {
    return res.status(400).json({
      error: `This account was registered via ${existingUser.authProvider || "Google/GitHub"}. Please sign in with ${existingUser.authProvider || "Google"} or register a password.`,
    });
  }

  const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
  if (!isMatch) {
    return res
      .status(401)
      .json({ error: "Invalid username/email or password" });
  }

  const updatedUser = await recordDailyLogin(existingUser);
  const token = generateToken(updatedUser);

  res.json({
    message: "Login successful",
    token,
    user: formatAuthUser(updatedUser),
  });
}

export async function oauthLogin(req: Request, res: Response) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google credential is required" });
    }

    const { email, providerId, avatarUrl } =
      await verifyGoogleToken(credential);

    if (!email) {
      return res
        .status(400)
        .json({ error: "Could not retrieve user email from OAuth provider." });
    }

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      // Create user without forcing a username; user chooses it in onboarding
      existingUser = await User.create({
        email,
        authProvider: "google",
        providerId,
        avatarUrl,
      });
    } else {
      let changed = false;
      if (providerId && !existingUser.providerId) {
        existingUser.providerId = providerId;
        changed = true;
      }
      if (avatarUrl && !existingUser.avatarUrl) {
        existingUser.avatarUrl = avatarUrl;
        changed = true;
      }
      if (changed) {
        await existingUser.save();
      }
    }

    const updatedUser = await recordDailyLogin(existingUser);
    const token = generateToken(updatedUser);

    res.json({
      message: "Google login successful",
      token,
      user: formatAuthUser(updatedUser),
    });
  } catch (error: any) {
    console.error("OAuth error:", error);
    res
      .status(500)
      .json({ error: error.message || "OAuth authentication failed." });
  }
}

export async function setUsername(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const rawUsername = ((req.body.username as string) || "").trim().toLowerCase();

    if (!rawUsername || rawUsername.length < 3 || rawUsername.length > 20) {
      return res.status(400).json({ error: "Username must be 3-20 characters" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(rawUsername)) {
      return res.status(400).json({ error: "Only letters, numbers, and underscores allowed" });
    }

    const existing = await User.findOne({ username: rawUsername });
    if (existing && existing._id.toString() !== userId) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = rawUsername;
    await user.save();

    return res.json({
      message: "Username set successfully",
      user: formatAuthUser(user),
    });
  } catch (error) {
    console.error("setUsername error:", error);
    return res.status(500).json({ error: "Failed to set username" });
  }
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
    let theoryCompletedCount = 0;

    roadmapProgress.forEach((rp) => {
      if (rp.nodeStatuses) {
        for (const [, status] of rp.nodeStatuses) {
          if (status === "done") {
            if (rp.roadmapKey === "prep_os_theory_roadmap") {
              theoryCompletedCount++;
            } else {
              totalDoneNodes++;
            }
          }
        }
      }
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
        username: updatedUser.username || null,
        email: updatedUser.email,
        authProvider: updatedUser.authProvider,
        avatarUrl: updatedUser.avatarUrl,
        leetcodeProfile: updatedUser.leetcodeProfile,
        neetcodeProgress: updatedUser.neetcodeProgress || {
          solved: [],
          starred: [],
        },
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

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { registerSchema, loginSchema } from "@prep-os/shared";

const JWT_SECRET = process.env.JWT_SECRET || "prep-os-super-secret-key-12345";
const JWT_EXPIRES_IN = "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function register(req: Request, res: Response) {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues?.[0]?.message || "Invalid input";
    return res.status(400).json({ error: errorMsg });
  }

  const { email, password } = parseResult.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    passwordHash,
    authProvider: "email",
  });

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(201).json({
    message: "Registration successful",
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
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

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
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

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        authProvider: provider,
        providerId,
        avatarUrl,
      });
    } else {
      user.authProvider = provider;
      if (providerId) user.providerId = providerId;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: `${provider} OAuth login successful`,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error("OAuth error:", error);
    res.status(500).json({ error: error.message || "OAuth authentication failed." });
  }
}

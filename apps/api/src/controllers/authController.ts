import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { registerSchema, loginSchema } from "@prep-os/shared";

const JWT_SECRET = process.env.JWT_SECRET || "prep-os-super-secret-key-12345";
const JWT_EXPIRES_IN = "7d";

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
  if (!user) {
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

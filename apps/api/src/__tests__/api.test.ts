import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import problemRoutes from "../routes/problemRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/problems", authMiddleware, problemRoutes);

describe("API Health & Auth Middleware Integration Tests", () => {
  it("GET /health should return 200 status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /api/problems/leetcode-profile without auth header in production should return 401", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const res = await request(app).get("/api/problems/leetcode-profile");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");

    process.env.NODE_ENV = originalEnv;
  });

  it("GET /api/problems/leetcode-profile with valid Bearer JWT token should be accepted", async () => {
    vi.spyOn(User, "findById").mockResolvedValue({
      leetcodeProfile: { username: "testuser", totalSolved: 42 },
    } as any);

    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      { userId: "000000000000000000000001", email: "test@example.com" },
      process.env.JWT_SECRET || "prep-os-super-secret-key-12345"
    );

    const res = await request(app)
      .get("/api/problems/leetcode-profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ profile: { username: "testuser", totalSolved: 42 } });
  });
});

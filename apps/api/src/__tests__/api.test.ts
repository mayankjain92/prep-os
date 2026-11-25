import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import problemRoutes from "../routes/problemRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import doubtRoutes from "../routes/doubtRoutes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/problems", authMiddleware, problemRoutes);
app.use("/api/doubts", authMiddleware, doubtRoutes);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("API Health & Auth Middleware Integration Tests", () => {
  it("GET /health should return 200 status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /api/problems/leetcode-profile without auth should return 401", async () => {
    const res = await request(app).get("/api/problems/leetcode-profile");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
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

  it("GET /api/problems/leetcode-profile with valid HttpOnly cookie should be accepted", async () => {
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
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ profile: { username: "testuser", totalSolved: 42 } });
  });

  it("GET /api/problems/leetcode-profile should return profile null when no username linked", async () => {
    vi.spyOn(User, "findById").mockResolvedValue({
      leetcodeProfile: { totalSolved: 0 },
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
    expect(res.body).toEqual({ profile: null });
  });

  it("DELETE /api/problems/leetcode-profile should disconnect account and return profile null", async () => {
    vi.spyOn(User, "findById").mockResolvedValue({
      _id: "000000000000000000000001",
      leetcodeProfile: { username: "testuser", totalSolved: 42 },
    } as any);
    const updateSpy = vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue({} as any);

    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      { userId: "000000000000000000000001", email: "test@example.com" },
      process.env.JWT_SECRET || "prep-os-super-secret-key-12345"
    );

    const res = await request(app)
      .delete("/api/problems/leetcode-profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "LeetCode profile disconnected successfully",
      profile: null,
    });
    expect(updateSpy).toHaveBeenCalledWith("000000000000000000000001", {
      $unset: { leetcodeProfile: 1 },
    });
  });

  it("POST /api/auth/logout should clear cookie and return 200", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Logged out successfully" });
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("token=");
  });

  it("POST /api/auth/register should reject existing OAuth account email with 400", async () => {
    vi.spyOn(User, "findOne")
      .mockResolvedValueOnce(null as any)
      .mockResolvedValueOnce({
        _id: "000000000000000000000002",
        email: "oauth@example.com",
        authProvider: "google",
        passwordHash: undefined,
      } as any);

    const res = await request(app).post("/api/auth/register").send({
      username: "attacker",
      email: "oauth@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("already registered");
  });

  it("PATCH /api/doubts/:id should return 404 on invalid ObjectId", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      { userId: "000000000000000000000001", email: "test@example.com" },
      process.env.JWT_SECRET || "prep-os-super-secret-key-12345"
    );

    const res = await request(app)
      .patch("/api/doubts/not-an-object-id")
      .set("Authorization", `Bearer ${token}`)
      .send({ resolved: true });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Doubt not found");
  });
});

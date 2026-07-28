import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import problemRoutes from "../routes/ProblemRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Problem } from "../models/Problem.js";

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

  it("GET /api/problems without auth header or stub in production should return 401", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const res = await request(app).get("/api/problems");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");

    process.env.NODE_ENV = originalEnv;
  });

  it("GET /api/problems with valid Bearer JWT token should be accepted", async () => {
    vi.spyOn(Problem, "countDocuments").mockResolvedValue(1 as any);
    vi.spyOn(Problem, "find").mockReturnValue({
      sort: vi.fn().mockResolvedValue([{ title: "Two Sum", status: "solved" }]),
    } as any);

    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign({ userId: "000000000000000000000001", email: "test@example.com" }, process.env.JWT_SECRET || "prep-os-super-secret-key-12345");

    const res = await request(app)
      .get("/api/problems")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ title: "Two Sum", status: "solved" }]);
  });
});

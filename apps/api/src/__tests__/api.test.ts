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

  it("GET /api/problems with dev stub header x-user-id should be accepted", async () => {
    vi.spyOn(Problem, "countDocuments").mockResolvedValue(1 as any);
    vi.spyOn(Problem, "find").mockReturnValue({
      sort: vi.fn().mockResolvedValue([{ title: "Two Sum", status: "solved" }]),
    } as any);

    const res = await request(app)
      .get("/api/problems")
      .set("x-user-id", "000000000000000000000001");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ title: "Two Sum", status: "solved" }]);
  });
});

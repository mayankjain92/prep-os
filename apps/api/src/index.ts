import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/ProblemRoutes.js";
import theoryRoutes from "./routes/theoryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { startKeepAlive } from "./services/keepAliveService.js";

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes (Public)
app.use("/api/auth", authRoutes);

// Health check (Public / Auth optional) - Supports both /health and /api/health
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Protected routes (require authMiddleware)
app.use("/api/problems", authMiddleware, problemRoutes);
app.use("/api/theory", authMiddleware, theoryRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/doubts", authMiddleware, doubtRoutes);
app.use("/api/roadmaps", authMiddleware, roadmapRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[api error]:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    startKeepAlive();
  });
}).catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { startKeepAlive } from "./services/keepAliveService.js";
import { errorHandler } from "./middleware/error.middleware.js";

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
    timestamp: new Date().toISOString(),
  });
});

// Protected routes (require authMiddleware)
app.use("/api/problems", authMiddleware, problemRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/doubts", authMiddleware, doubtRoutes);
app.use("/api/roadmaps", authMiddleware, roadmapRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`
  })
})
app.use(errorHandler);

const PORT = process.env.PORT || 4000;


async function startServer(): Promise<void>{
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`BACKEND running on http://localhost:${PORT}`)
      startKeepAlive();
    })
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
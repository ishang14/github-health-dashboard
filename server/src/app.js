import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";

import { requireAuth } from "./middleware/requireAuth.js";
import { connectDatabase } from "./config/database.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

// Everything below requires a valid session and is scoped to req.userId.
app.use("/api/analyze", requireAuth, analysisRoutes);
app.use("/api/history", requireAuth, historyRoutes);
app.use("/api/repositories", requireAuth, repositoryRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "GitHub Repository Health Dashboard API is running 🚀"
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
};

startServer();

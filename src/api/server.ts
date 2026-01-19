/**
 * Express server setup with Claude AI integration
 */

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import "express-async-errors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { accountRouter } from "./routes/accounts.js";
import { contactRouter } from "./routes/contacts.js";
import { researchRouter } from "./routes/research.js";
import { prospectingRouter } from "./routes/prospecting.js";
import { meetingRouter } from "./routes/meetings.js";
import { linkedinRouter } from "./routes/linkedin.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from web build (in production)
if (process.env.NODE_ENV === "production") {
  const webDistPath = path.join(__dirname, "..", "web");
  app.use(express.static(webDistPath));
}

// API Routes
app.use("/api/accounts", accountRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/research", researchRouter);
app.use("/api/prospecting", prospectingRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/linkedin", linkedinRouter);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve index.html for all non-API routes (SPA support)
if (process.env.NODE_ENV === "production") {
  app.get("*", (req: Request, res: Response) => {
    const webDistPath = path.join(__dirname, "..", "web", "index.html");
    res.sendFile(webDistPath);
  });
} else {
  // 404 handler for development
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
  );
  console.log(`📚 API docs available at http://localhost:${PORT}/api`);
});

export default app;

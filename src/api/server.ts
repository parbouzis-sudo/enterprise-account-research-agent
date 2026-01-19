/**
 * Express server setup with Claude AI integration
 */

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import "express-async-errors";
import dotenv from "dotenv";
import { accountRouter } from "./routes/accounts";
import { contactRouter } from "./routes/contacts";
import { researchRouter } from "./routes/research";
import { prospectingRouter } from "./routes/prospecting";
import { meetingRouter } from "./routes/meetings";
import { linkedinRouter } from "./routes/linkedin";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app. use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app. listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
  );
  console.log(`📚 API docs available at http://localhost:${PORT}/api`);
});

export default app;

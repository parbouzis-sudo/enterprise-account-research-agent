/**
 * Prospecting and outreach message generation routes
 */

import { Router, Request, Response } from "express";
import { ClaudeService } from "../services/claudeService";

export const prospectingRouter = Router();

// POST /api/prospecting/generate-message - Generate outreach message
prospectingRouter.post(
  "/generate-message",
  async (req: Request, res: Response) => {
    try {
      const { contact, account, context, messageType } = req.body;

      const message = await ClaudeService. generateOutreachMessage(
        contact,
        account,
        context,
        messageType
      );

      res.json(message);
    } catch (error) {
      console.error("Message generation error:", error);
      res.status(500).json({ error: "Failed to generate message" });
    }
  }
);

// POST /api/prospecting/templates - Get message templates
prospectingRouter.post("/templates", async (req: Request, res: Response) => {
  try {
    const { messageType } = req.body;
    res.json({ templates: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

/**
 * Account research analysis routes
 */

import { Router, Request, Response } from "express";
import { ClaudeService } from "../../shared/services/claudeService.js";

export const researchRouter = Router();

// POST /api/research/analyze - Analyze an account
researchRouter.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { accountId, account, contacts } = req.body;

    const research = await ClaudeService.analyzeAccount(account, contacts);

    res.json(research);
  } catch (error) {
    console.error("Research analysis error:", error);
    res.status(500).json({ error: "Failed to analyze account" });
  }
});

// GET /api/research/: accountId - Get account research
researchRouter.get("/:accountId", async (req:  Request, res: Response) => {
  try {
    const { accountId } = req.params;
    res.json({ accountId, research: {} });
  } catch (error) {
    res.status(404).json({ error: "Research not found" });
  }
});

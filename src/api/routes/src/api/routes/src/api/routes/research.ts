/**
 * Account research analysis routes
 */

import { Router, Request, Response } from "express";
import { ClaudeService } from "../services/claudeService.js";

export const researchRouter = Router();

// POST /api/research/analyze - Analyze an account
researchRouter.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { accountId, account, contacts } = req.body;

    // Validate required fields
    if (!account) {
      return res.status(400).json({
        error: "Missing required field: account",
        details: "Account data is required for analysis"
      });
    }

    if (!account.companyName) {
      return res.status(400).json({
        error: "Invalid account data",
        details: "Account must have a companyName"
      });
    }

    // Ensure contacts is an array
    const contactsArray = Array.isArray(contacts) ? contacts : [];

    const research = await ClaudeService.analyzeAccount(account, contactsArray);

    res.json(research);
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error";
    console.error("Research analysis error:", {
      error: errorMessage,
      stack: error?.stack,
      accountId: req.body.accountId,
    });

    res.status(500).json({
      error: "Failed to analyze account",
      details: errorMessage
    });
  }
});

// GET /api/research/:accountId - Get account research
researchRouter.get("/:accountId", async (req:  Request, res: Response) => {
  try {
    const { accountId } = req.params;

    // Validate accountId
    if (!accountId || accountId.trim() === "") {
      return res.status(400).json({
        error: "Invalid account ID",
        details: "Account ID must be provided"
      });
    }

    // TODO: Implement actual research retrieval from database
    res.json({ accountId, research: {} });
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error";
    console.error("Error retrieving research:", {
      error: errorMessage,
      stack: error?.stack,
      accountId: req.params.accountId,
    });

    res.status(404).json({
      error: "Research not found",
      details: errorMessage
    });
  }
});

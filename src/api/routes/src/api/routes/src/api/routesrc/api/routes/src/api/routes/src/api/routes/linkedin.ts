/**
 * LinkedIn Navigator integration routes
 */

import { Router, Request, Response } from "express";
import LinkedInService from "../services/linkedinService.js";

export const linkedinRouter = Router();

// POST /api/linkedin/sync - Sync data from LinkedIn Navigator
linkedinRouter.post("/sync", async (req: Request, res: Response) => {
  try {
    const { accountUrls, contactUrls, accessToken } = req.body;

    // Validate required fields
    if (!accessToken) {
      return res.status(400).json({
        error: "Missing required field: accessToken",
        details: "LinkedIn access token is required for synchronization"
      });
    }

    if (!accountUrls && !contactUrls) {
      return res.status(400).json({
        error: "Missing data to sync",
        details: "At least one of accountUrls or contactUrls must be provided"
      });
    }

    const linkedinService = new LinkedInService(accessToken);
    const syncResult = await linkedinService.syncNavigatorData(
      accountUrls || [],
      contactUrls || []
    );

    res.json(syncResult);
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error";
    console.error("LinkedIn sync error:", {
      error: errorMessage,
      stack: error?.stack,
    });

    res.status(500).json({
      error: "Failed to sync LinkedIn data",
      details: errorMessage
    });
  }
});

// POST /api/linkedin/fetch-accounts - Fetch accounts from LinkedIn
linkedinRouter.post(
  "/fetch-accounts",
  async (req: Request, res: Response) => {
    try {
      const { filters, accessToken } = req.body;

      // Validate required fields
      if (!accessToken) {
        return res.status(400).json({
          error: "Missing required field: accessToken",
          details: "LinkedIn access token is required to fetch accounts"
        });
      }

      const linkedinService = new LinkedInService(accessToken);
      const accounts = await linkedinService. fetchAccountsFromNavigator(filters);

      res.json({ accounts });
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      console.error("Error fetching LinkedIn accounts:", {
        error: errorMessage,
        stack: error?.stack,
      });

      res.status(500).json({
        error: "Failed to fetch accounts",
        details: errorMessage
      });
    }
  }
);

// POST /api/linkedin/fetch-contacts - Fetch contacts from LinkedIn
linkedinRouter.post(
  "/fetch-contacts",
  async (req: Request, res: Response) => {
    try {
      const { accountId, accessToken } = req.body;

      // Validate required fields
      if (!accessToken) {
        return res.status(400).json({
          error: "Missing required field: accessToken",
          details: "LinkedIn access token is required to fetch contacts"
        });
      }

      if (!accountId) {
        return res.status(400).json({
          error: "Missing required field: accountId",
          details: "Account ID is required to fetch contacts"
        });
      }

      const linkedinService = new LinkedInService(accessToken);
      const contacts = await linkedinService. fetchContactsFromNavigator(accountId);

      res.json({ contacts });
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      console.error("Error fetching LinkedIn contacts:", {
        error: errorMessage,
        stack: error?.stack,
      });

      res.status(500).json({
        error: "Failed to fetch contacts",
        details: errorMessage
      });
    }
  }
);

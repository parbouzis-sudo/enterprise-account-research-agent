/**
 * LinkedIn Navigator integration routes
 */

import { Router, Request, Response } from "express";
import LinkedInService from "../../shared/services/linkedinService.js";

export const linkedinRouter = Router();

// POST /api/linkedin/sync - Sync data from LinkedIn Navigator
linkedinRouter.post("/sync", async (req: Request, res: Response) => {
  try {
    const { accountUrls, contactUrls, accessToken } = req.body;

    const linkedinService = new LinkedInService(accessToken);
    const syncResult = await linkedinService.syncNavigatorData(
      accountUrls || [],
      contactUrls || []
    );

    res.json(syncResult);
  } catch (error) {
    console.error("LinkedIn sync error:", error);
    res.status(500).json({ error: "Failed to sync LinkedIn data" });
  }
});

// POST /api/linkedin/fetch-accounts - Fetch accounts from LinkedIn
linkedinRouter.post(
  "/fetch-accounts",
  async (req: Request, res: Response) => {
    try {
      const { filters, accessToken } = req.body;

      const linkedinService = new LinkedInService(accessToken);
      const accounts = await linkedinService.fetchAccountsFromNavigator(filters);

      res.json({ accounts });
    } catch (error) {
      console.error("Error fetching LinkedIn accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  }
);

// POST /api/linkedin/fetch-contacts - Fetch contacts from LinkedIn
linkedinRouter.post(
  "/fetch-contacts",
  async (req: Request, res: Response) => {
    try {
      const { accountId, accessToken } = req.body;

      const linkedinService = new LinkedInService(accessToken);
      const contacts = await linkedinService.fetchContactsFromNavigator(accountId);

      res.json({ contacts });
    } catch (error) {
      console.error("Error fetching LinkedIn contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  }
);

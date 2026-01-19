/**
 * Prospecting and outreach message generation routes
 */

import { Router, Request, Response } from "express";
import { ClaudeService } from "../services/claudeService.js";

export const prospectingRouter = Router();

// POST /api/prospecting/generate-message - Generate outreach message
prospectingRouter.post(
  "/generate-message",
  async (req: Request, res: Response) => {
    try {
      const { contact, account, context, messageType } = req.body;

      // Validate required fields
      if (!contact) {
        return res.status(400).json({
          error: "Missing required field: contact",
          details: "Contact data is required to generate message"
        });
      }

      if (!contact.firstName || !contact.lastName) {
        return res.status(400).json({
          error: "Invalid contact data",
          details: "Contact must have firstName and lastName"
        });
      }

      if (!account) {
        return res.status(400).json({
          error: "Missing required field: account",
          details: "Account data is required to generate message"
        });
      }

      if (!account.companyName) {
        return res.status(400).json({
          error: "Invalid account data",
          details: "Account must have a companyName"
        });
      }

      if (!messageType) {
        return res.status(400).json({
          error: "Missing required field: messageType",
          details: "Message type must be one of: email, phone, linkedin"
        });
      }

      const validMessageTypes = ["email", "phone", "linkedin"];
      if (!validMessageTypes.includes(messageType)) {
        return res.status(400).json({
          error: "Invalid message type",
          details: `Message type must be one of: ${validMessageTypes.join(", ")}`
        });
      }

      const message = await ClaudeService. generateOutreachMessage(
        contact,
        account,
        context || "",
        messageType
      );

      res.json(message);
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      console.error("Message generation error:", {
        error: errorMessage,
        stack: error?.stack,
        messageType: req.body.messageType,
      });

      res.status(500).json({
        error: "Failed to generate message",
        details: errorMessage
      });
    }
  }
);

// POST /api/prospecting/templates - Get message templates
prospectingRouter.post("/templates", async (req: Request, res: Response) => {
  try {
    const { messageType } = req.body;

    // Validate message type if provided
    if (messageType) {
      const validMessageTypes = ["email", "phone", "linkedin"];
      if (!validMessageTypes.includes(messageType)) {
        return res.status(400).json({
          error: "Invalid message type",
          details: `Message type must be one of: ${validMessageTypes.join(", ")}`
        });
      }
    }

    // TODO: Implement actual template retrieval
    res.json({ templates: [] });
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error";
    console.error("Error fetching templates:", {
      error: errorMessage,
      stack: error?.stack,
    });

    res.status(500).json({
      error: "Failed to fetch templates",
      details: errorMessage
    });
  }
});

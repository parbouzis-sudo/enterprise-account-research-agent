/**
 * Contact management routes
 */

import { Router, Request, Response } from "express";

export const contactRouter = Router();

// GET /api/contacts - List contacts
contactRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { accountId } = req.query;
    res.json({ contacts: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// POST /api/contacts - Create contact
contactRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, title, email, accountId } = req.body;

    const newContact = {
      id: `contact_${Date.now()}`,
      firstName,
      lastName,
      title,
      email,
      accountId,
      stage: "prospect",
      linkedinUrl: "",
      createdAt: new Date(),
    };

    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ error: "Failed to create contact" });
  }
});

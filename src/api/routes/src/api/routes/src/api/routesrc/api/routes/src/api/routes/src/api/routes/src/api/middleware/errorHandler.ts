/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", error);

  const statusCode = 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    error: {
      message,
      code: "INTERNAL_ERROR",
    },
  });
}

import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type AppError = Error & { statusCode?: number; details?: unknown };

export const errorMiddleware = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: "Validation failed",
        details: error.flatten()
      },
      meta: {}
    });
    return;
  }

  const statusCode = error.statusCode ?? 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
      details: error.details ?? null
    },
    meta: {}
  });
};

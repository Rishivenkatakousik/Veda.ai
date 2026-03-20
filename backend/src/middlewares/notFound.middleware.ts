import type { Request, Response } from "express";

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`
    },
    meta: {}
  });
};

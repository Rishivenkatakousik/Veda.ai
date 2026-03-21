import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body ?? {},
      params:
        req.params && typeof req.params === "object"
          ? { ...(req.params as Record<string, string>) }
          : {},
      query:
        req.query && typeof req.query === "object"
          ? { ...(req.query as Record<string, unknown>) }
          : {}
    });
    next();
  };

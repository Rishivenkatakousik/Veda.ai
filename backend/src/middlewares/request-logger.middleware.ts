import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            requestId: string;
        }
    }
}
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = (req.headers["x-request-id"] as string) || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const log = {
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: duration,
            ip: req.ip,
            userAgent: req.headers["user-agent"] ?? ""
        };
        if (res.statusCode >= 500) {
            console.error("[request]", JSON.stringify(log));
        }
        else if (res.statusCode >= 400) {
            console.warn("[request]", JSON.stringify(log));
        }
        else {
            console.info("[request]", JSON.stringify(log));
        }
    });
    next();
};

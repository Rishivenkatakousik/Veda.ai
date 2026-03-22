import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
type AppError = Error & {
    statusCode?: number;
    details?: unknown;
};
const MULTER_ERROR_MESSAGES: Record<string, string> = {
    LIMIT_FILE_SIZE: "File size exceeds the allowed limit",
    LIMIT_FILE_COUNT: "Too many files uploaded",
    LIMIT_UNEXPECTED_FILE: "File type not allowed. Accepted: JPEG, PNG, WebP, PDF, DOC, DOCX"
};
export const errorMiddleware = (error: AppError, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof multer.MulterError) {
        const message = MULTER_ERROR_MESSAGES[error.code] ?? error.message;
        res.status(400).json({
            success: false,
            data: null,
            error: { message, code: error.code },
            meta: {}
        });
        return;
    }
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

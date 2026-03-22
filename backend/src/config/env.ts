import dotenv from "dotenv";
import { z } from "zod";
import type { AppEnv } from "../types/env";
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    API_PREFIX: z.string().min(1).default("/api/v1"),
    PUBLIC_BASE_URL: z.string().url().optional(),
    MONGODB_URI: z.string().url(),
    REDIS_URL: z.string().url(),
    AI_MODEL: z.string().min(1).default("gemini-2.0-flash"),
    GEMINI_API_KEY: z.string().min(1),
    BULLMQ_PREFIX: z.string().min(1).default("vedaai"),
    QUEUE_NAME: z.string().min(1).default("assignment-generation"),
    CORS_ORIGINS: z.string().default("http://localhost:3000"),
    MAX_FILE_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(10),
    UPLOAD_DIR: z.string().min(1).default("uploads"),
    ALLOWED_UPLOAD_MIMES: z
        .string()
        .default("image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    MAX_UPLOAD_FILES: z.coerce.number().int().positive().default(5),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100)
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
    throw new Error(`Invalid environment configuration: ${message}`);
}
const values = parsed.data;
export const env: AppEnv = {
    ...values,
    CORS_ORIGINS: values.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
    ALLOWED_UPLOAD_MIMES: values.ALLOWED_UPLOAD_MIMES.split(",").map((m) => m.trim()),
    MAX_UPLOAD_FILES: values.MAX_UPLOAD_FILES
};

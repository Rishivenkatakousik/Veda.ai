import dotenv from "dotenv";
import { z } from "zod";
import type { AppEnv } from "../types/env";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().min(1).default("/api/v1"),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  AI_PROVIDER: z.enum(["openai", "claude"]).default("openai"),
  OPENAI_API_KEY: z.string().optional(),
  CLAUDE_API_KEY: z.string().optional(),
  BULLMQ_PREFIX: z.string().min(1).default("vedaai"),
  QUEUE_NAME: z.string().min(1).default("assignment-generation"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  MAX_FILE_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(10),
  UPLOAD_DIR: z.string().min(1).default("uploads"),
  ALLOWED_UPLOAD_MIMES: z
    .string()
    .default("image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
  MAX_UPLOAD_FILES: z.coerce.number().int().positive().default(5)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration: ${message}`);
}

const values = parsed.data;

if (values.AI_PROVIDER === "openai" && !values.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai");
}

if (values.AI_PROVIDER === "claude" && !values.CLAUDE_API_KEY) {
  throw new Error("CLAUDE_API_KEY is required when AI_PROVIDER=claude");
}

export const env: AppEnv = {
  ...values,
  CORS_ORIGINS: values.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
  ALLOWED_UPLOAD_MIMES: values.ALLOWED_UPLOAD_MIMES.split(",").map((m) => m.trim()),
  MAX_UPLOAD_FILES: values.MAX_UPLOAD_FILES
};

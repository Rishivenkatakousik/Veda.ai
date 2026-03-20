export type AppEnv = {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  API_PREFIX: string;
  MONGODB_URI: string;
  REDIS_URL: string;
  AI_PROVIDER: "openai" | "claude";
  OPENAI_API_KEY?: string;
  CLAUDE_API_KEY?: string;
  BULLMQ_PREFIX: string;
  QUEUE_NAME: string;
  CORS_ORIGINS: string[];
  MAX_FILE_UPLOAD_SIZE_MB: number;
  UPLOAD_DIR: string;
  ALLOWED_UPLOAD_MIMES: string[];
  MAX_UPLOAD_FILES: number;
};

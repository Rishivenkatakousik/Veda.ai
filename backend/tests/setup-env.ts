/**
 * Ensures config/env can load in test runs without a local .env file.
 */
process.env.NODE_ENV = "test";
process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/veda-test";
process.env.REDIS_URL ??= "redis://127.0.0.1:6379";
process.env.GEMINI_API_KEY ??= "test-gemini-key-placeholder-for-vitest";

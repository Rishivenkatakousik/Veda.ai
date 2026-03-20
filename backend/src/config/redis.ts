import Redis from "ioredis";
import { env } from "./env";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
});

redis.on("connect", () => {
  console.info("[redis] connected");
});

redis.on("error", (error: Error) => {
  console.error("[redis] error", error.message);
});

export const getRedisHealth = async (): Promise<{
  status: "up" | "down";
  latencyMs?: number;
}> => {
  const start = Date.now();
  try {
    const pong = await redis.ping();
    if (pong !== "PONG") {
      return { status: "down" };
    }
    return { status: "up", latencyMs: Date.now() - start };
  } catch {
    return { status: "down" };
  }
};

export const closeRedis = async (): Promise<void> => {
  await redis.quit();
};

import Redis from "ioredis";
import { env } from "./env";
export const standaloneRedisOptions = {
    maxRetriesPerRequest: null as number | null,
    enableReadyCheck: true,
    retryStrategy(times: number): number | null {
        if (times > 40) {
            return null;
        }
        return Math.min(times * 100, 3000);
    }
};
export const redis = new Redis(env.REDIS_URL, standaloneRedisOptions);
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
    }
    catch {
        return { status: "down" };
    }
};
export const closeRedis = async (): Promise<void> => {
    await redis.quit();
};

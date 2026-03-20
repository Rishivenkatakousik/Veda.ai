import type { Request, Response } from "express";
import { getMongoHealth } from "../config/mongodb";
import { getQueueHealth } from "../config/queue";
import { getRedisHealth } from "../config/redis";

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const [mongo, redis, queue] = await Promise.all([
    getMongoHealth(),
    getRedisHealth(),
    getQueueHealth()
  ]);

  const isHealthy =
    mongo.status === "up" && redis.status === "up" && queue.status === "up";

  const verbose = req.query.verbose === "true";

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: {
      service: "vedaai-backend",
      status: isHealthy ? "up" : "degraded",
      ...(verbose ? { checks: { mongo, redis, queue } } : {})
    },
    error: null,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
};

import { Queue } from "bullmq";
import { env } from "./env";

export const assignmentQueue = new Queue(env.QUEUE_NAME, {
  connection: { url: env.REDIS_URL },
  prefix: env.BULLMQ_PREFIX
});

export const getQueueHealth = async (): Promise<{
  status: "up" | "down";
  waiting: number;
  active: number;
  failed: number;
  delayed: number;
  paused: number;
  completed: number;
}> => {
  try {
    const counts = await assignmentQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused"
    );

    return {
      status: "up",
      waiting: counts.waiting ?? 0,
      active: counts.active ?? 0,
      failed: counts.failed ?? 0,
      delayed: counts.delayed ?? 0,
      paused: counts.paused ?? 0,
      completed: counts.completed ?? 0
    };
  } catch {
    return {
      status: "down",
      waiting: 0,
      active: 0,
      failed: 0,
      delayed: 0,
      paused: 0,
      completed: 0
    };
  }
};

export const closeQueue = async (): Promise<void> => {
  await assignmentQueue.close();
};

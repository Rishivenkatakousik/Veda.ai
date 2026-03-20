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
}> => {
  try {
    const [waiting, active, failed] = await Promise.all([
      assignmentQueue.getWaitingCount(),
      assignmentQueue.getActiveCount(),
      assignmentQueue.getFailedCount()
    ]);

    return {
      status: "up",
      waiting,
      active,
      failed
    };
  } catch {
    return {
      status: "down",
      waiting: 0,
      active: 0,
      failed: 0
    };
  }
};

export const closeQueue = async (): Promise<void> => {
  await assignmentQueue.close();
};

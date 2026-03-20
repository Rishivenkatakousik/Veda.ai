import Redis from "ioredis";
import { env } from "../config/env";
import type { AssignmentStatus } from "../types/assignment";

const CHANNEL = "vedaai:assignment-status";

export type AssignmentStatusEvent = {
  assignmentId: string;
  status: AssignmentStatus;
  timestamp: string;
};

/**
 * Publish a status change from the worker process via Redis pub/sub.
 * A dedicated publisher connection is created lazily to avoid
 * interfering with the shared ioredis instance used by BullMQ.
 */
let publisher: Redis | null = null;

const getPublisher = (): Redis => {
  if (!publisher) {
    publisher = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
  }
  return publisher;
};

export const publishStatusChange = async (
  assignmentId: string,
  status: AssignmentStatus
): Promise<void> => {
  const event: AssignmentStatusEvent = {
    assignmentId,
    status,
    timestamp: new Date().toISOString()
  };
  await getPublisher().publish(CHANNEL, JSON.stringify(event));
};

/**
 * Subscribe to status changes from the server process.
 * Uses a separate Redis connection (subscribers can't issue other commands).
 */
export const subscribeToStatusChanges = (
  handler: (event: AssignmentStatusEvent) => void
): Redis => {
  const subscriber = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

  subscriber.subscribe(CHANNEL).catch((err) => {
    console.error("[realtime] failed to subscribe:", err);
  });

  subscriber.on("message", (_channel: string, message: string) => {
    try {
      const event = JSON.parse(message) as AssignmentStatusEvent;
      handler(event);
    } catch (err) {
      console.error("[realtime] bad message:", err);
    }
  });

  return subscriber;
};

export const closePublisher = async (): Promise<void> => {
  if (publisher) {
    await publisher.quit();
    publisher = null;
  }
};

import type { Server as HttpServer } from "http";
import type Redis from "ioredis";
import { Server } from "socket.io";
import { env } from "../config/env";
import { subscribeToStatusChanges } from "../services/realtime.service";

let io: Server | null = null;
let subscriber: Redis | null = null;

/** Engine.IO does not reliably support Express-style `origin(origin, cb)` CORS. */
const socketIoCors =
  env.NODE_ENV === "development"
    ? { origin: true as const, credentials: true, methods: ["GET", "POST"] }
    : {
        origin: env.CORS_ORIGINS,
        credentials: true,
        methods: ["GET", "POST"]
      };

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: socketIoCors
  });

  io.on("connection", (socket) => {
    console.info(`[socket] connected: ${socket.id}`);

    socket.on(
      "subscribe:assignment",
      (payload: string | { assignmentId?: string } | undefined) => {
        const id =
          typeof payload === "string"
            ? payload
            : payload && typeof payload === "object"
              ? payload.assignmentId
              : undefined;
        if (id) socket.join(`assignment:${id}`);
      }
    );

    socket.on(
      "unsubscribe:assignment",
      (payload: string | { assignmentId?: string } | undefined) => {
        const id =
          typeof payload === "string"
            ? payload
            : payload && typeof payload === "object"
              ? payload.assignmentId
              : undefined;
        if (id) socket.leave(`assignment:${id}`);
      }
    );

    socket.on("disconnect", () => {
      console.info(`[socket] disconnected: ${socket.id}`);
    });
  });

  subscriber = subscribeToStatusChanges((event) => {
    const eventName = `assignment:${event.status}`;
    io?.to(`assignment:${event.assignmentId}`).emit(eventName, {
      assignmentId: event.assignmentId,
      status: event.status,
      timestamp: event.timestamp
    });
    io?.emit(eventName, {
      assignmentId: event.assignmentId,
      status: event.status,
      timestamp: event.timestamp
    });
  });

  return io;
};

export const getSocket = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

export const closeSocket = async (): Promise<void> => {
  if (subscriber) {
    await subscriber.quit();
    subscriber = null;
  }
  if (io) {
    await io.close();
    io = null;
  }
};

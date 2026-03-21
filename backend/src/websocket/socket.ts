import type { Server as HttpServer } from "http";
import type Redis from "ioredis";
import { Server } from "socket.io";
import { expressCorsOptions } from "../config/cors";
import { subscribeToStatusChanges } from "../services/realtime.service";

let io: Server | null = null;
let subscriber: Redis | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: expressCorsOptions
  });

  io.on("connection", (socket) => {
    console.info(`[socket] connected: ${socket.id}`);

    socket.on("subscribe:assignment", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
    });

    socket.on("unsubscribe:assignment", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });

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

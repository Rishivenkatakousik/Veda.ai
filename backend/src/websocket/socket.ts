import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.info(`[socket] connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.info(`[socket] disconnected: ${socket.id}`);
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

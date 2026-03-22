import { io, type Socket } from "socket.io-client";

function isLocalDevBrowser(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "development") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

function resolveSocketUrl(): string {
  if (isLocalDevBrowser()) {
    const fromNextConfig = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim();
    if (fromNextConfig) return fromNextConfig;
    return window.location.origin;
  }

  const explicit = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (explicit) return explicit;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000";
}

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(resolveSocketUrl(), {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      transports: ["websocket", "polling"],
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

import { io, type Socket } from "socket.io-client";

function isLocalDevBrowser(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "development") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

function originFromApiBaseUrl(apiBase: string): string | null {
  const t = apiBase.trim();
  if (!t.startsWith("http://") && !t.startsWith("https://")) return null;
  try {
    return new URL(t).origin;
  } catch {
    return null;
  }
}

function resolveSocketUrl(): string {
  if (typeof window !== "undefined" && isLocalDevBrowser()) {
    const fromNextConfig = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim();
    if (fromNextConfig) return fromNextConfig;
    return window.location.origin;
  }

  const explicit = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (explicit) return explicit;

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiBase) {
    const fromApi = originFromApiBaseUrl(apiBase);
    if (fromApi) return fromApi;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000";
}

function socketTransportsForUrl(url: string): ("websocket" | "polling")[] {
  if (typeof window === "undefined") return ["websocket", "polling"];
  if (isLocalDevBrowser()) return ["websocket", "polling"];
  if (process.env.NODE_ENV !== "production") return ["websocket", "polling"];
  try {
    if (new URL(url).origin === window.location.origin) {
      return ["polling", "websocket"];
    }
  } catch {
    /* ignore */
  }
  return ["websocket", "polling"];
}

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = resolveSocketUrl();
    socket = io(url, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      transports: socketTransportsForUrl(url),
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

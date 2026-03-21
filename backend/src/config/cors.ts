import type { CorsOptions } from "cors";
import { env } from "./env";

/** Browsers may send Origin as http://localhost:3000, http://127.0.0.1:3000, etc. */
const LOCAL_DEV_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

export function isCorsOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }
  if (env.NODE_ENV === "development" && LOCAL_DEV_ORIGIN.test(origin)) {
    return true;
  }
  return env.CORS_ORIGINS.includes(origin);
}

export const expressCorsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (isCorsOriginAllowed(origin)) {
      callback(null, origin);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

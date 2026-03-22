import type { NextConfig } from "next";

/** Where the Express API listens (no trailing slash). Used for dev rewrites and Socket.IO URL. */
const backendBase =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  env: {
    /** Same origin as rewrites — avoids a mismatched `NEXT_PUBLIC_WS_URL` (e.g. :5000 vs :4000). */
    NEXT_PUBLIC_BACKEND_ORIGIN: backendBase,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backendBase}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;

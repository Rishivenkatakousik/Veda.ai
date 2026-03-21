import type { NextConfig } from "next";

/** Where the Express API listens (no trailing slash). Used only for dev rewrites. */
const backendBase =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

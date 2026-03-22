import type { NextConfig } from "next";

const backendBase =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  env: {
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

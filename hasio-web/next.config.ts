import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Use parent dirs locally, fall back to local copies on Vercel
const convexDir = fs.existsSync(path.resolve(__dirname, "../convex"))
  ? path.resolve(__dirname, "../convex")
  : path.resolve(__dirname, "convex-local");

const constantsDir = fs.existsSync(path.resolve(__dirname, "../constants"))
  ? path.resolve(__dirname, "../constants")
  : path.resolve(__dirname, "constants-local");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@convex": convexDir,
      "@constants": constantsDir,
    };
    return config;
  },
  typescript: {
    // Convex types are generated in the parent project
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

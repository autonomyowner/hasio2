import type { NextConfig } from "next";
import path from "path";

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
      "@convex": path.resolve(__dirname, "../convex"),
      "@constants": path.resolve(__dirname, "../constants"),
    };
    return config;
  },
  typescript: {
    // Convex types are generated in the parent project
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fully static site (no server functions) — export to /out so it can deploy
  // to any static host: Netlify, Vercel, cPanel, S3, etc.
  output: "export",
  // Pin the workspace root to this project (a stray parent lockfile exists).
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Static export can't use the Next image optimizer at runtime.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Enable runtime features required by the admin CMS and server actions.
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

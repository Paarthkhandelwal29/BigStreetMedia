import path from "node:path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Enable runtime features required by the admin CMS and server actions.
  turbopack: {
    root: path.join(process.cwd()),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "300mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "xukffutagheviyizhfmm.supabase.co",
      },
    ],
  },
};

export default nextConfig;

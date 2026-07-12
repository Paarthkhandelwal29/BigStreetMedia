import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#ffc107",
    icons: [
      {
        src: "/logo-dark.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-dark.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

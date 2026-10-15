import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos ship from /public/media as plain <img>; Workers has no built-in image optimiser.
  images: { unoptimized: true },
};

export default nextConfig;

initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["animejs"],
  images: {
    domains: ["img.youtube.com"],
  },
};

export default nextConfig;

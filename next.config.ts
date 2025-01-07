import type { NextConfig } from "next";
const allowedImageHosts = ["updc-dev.zijela.com"];

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },

  output: "standalone",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  env: {
    // Add your environment variables here
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;

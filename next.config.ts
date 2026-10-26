import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? {
    output: "export",
    assetPrefix: "/jang-ga-gan-da",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;

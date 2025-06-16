import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "patlog.vercel.app",
        pathname: "/**", // Allows all paths under the hostname
      },
    ],
  },
};

export default nextConfig;

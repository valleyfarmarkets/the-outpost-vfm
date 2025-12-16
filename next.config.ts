import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Radix UI packages for proper bundling
  transpilePackages: [
    "@radix-ui/react-dialog",
    "@radix-ui/react-select",
  ],

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Improve build stability
  webpack: (config, { isServer }) => {
    // Fixes for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.knowde.com",
        pathname: "/**",
      },
      {
        // Allow any HTTPS hostname for user-uploaded supplier/product logos
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

import dotenv from "dotenv";
import { NextConfig } from "next";

// ✅ Load environment variables
dotenv.config();

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch errors early
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;

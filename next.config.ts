import dotenv from "dotenv";
import { NextConfig } from "next";

// ✅ Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Ensure all required environment variables are available
const requiredEnvVars = ["MONGODB_URI", "NEXTAUTH_URL", "JWT_SECRET"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch errors early
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.JWT_SECRET,
  },
  webpack: (config, { isServer }) => {
    // Fallbacks for client-side builds
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
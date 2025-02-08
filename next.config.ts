// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false,  // Disable the new app directory feature
  },
};

export default nextConfig;


// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Ensure the "@/..." alias always resolves in CI/Prod
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },

  // Keep typedRoutes if you had it enabled earlier via experimental
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;

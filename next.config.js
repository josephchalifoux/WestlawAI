/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  async rewrites() {
    return [
      // Old endpoint -> new clean endpoint
      { source: '/api/upload', destination: '/api/file-upload' },
    ];
  },
};

module.exports = nextConfig;

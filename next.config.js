/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["http://192.168.1.4:3000"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [
      {
        source: '/outputs/:path*',
        destination: '/api/static/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/outputs/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
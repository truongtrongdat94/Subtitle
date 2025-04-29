/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["http://192.168.1.4:3000"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Tăng giới hạn body cho Server Actions
    },
  },
};

module.exports = nextConfig;
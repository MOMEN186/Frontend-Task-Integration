/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.2:3000"],
  },

  async rewrites() {
    return [
      // json-server api
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
      // upload endpoint used by signedUrl
      {
        source: "/upload/:path*",
        destination: "http://localhost:3001/upload/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: "/mock/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
};

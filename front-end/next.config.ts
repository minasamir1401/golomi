import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 🧠 Smart Backend Discovery
    // Detects backend URL and prevents common "trailing slash" or redundant "/api" errors
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${apiUrl}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;

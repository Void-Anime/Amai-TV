/** @type {import('next').NextConfig} */
const backend = process.env.NEXT_PUBLIC_API_URL || 'https://amai-tv-mnklmteux-shaan786lls-projects.vercel.app';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    if (backend) {
      return [
        { source: '/api/:path*', destination: `${backend.replace(/\/$/, '')}/api/:path*` },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;


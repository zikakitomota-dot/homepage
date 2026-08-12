/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.zaleastudio.com' }],
        destination: 'https://zaleastudio.com/:path*',
        permanent: true,
      },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-use', permanent: true },
      { source: '/money/:path*', destination: '/finance/:path*', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

module.exports = nextConfig;

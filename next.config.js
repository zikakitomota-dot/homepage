/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: __dirname },
  images: { unoptimized: true },
  async rewrites() {
    return {
      afterFiles: [
        { source: '/health', destination: '/health/index.html' },
        { source: '/health/:path+', destination: '/health/:path+/index.html' },
      ],
    };
  },
  async redirects() {
    return [
      { source: '/images/english-games-social', destination: '/images/english-games-social.png', permanent: true },
      { source: '/images/english-games-pinterest', destination: '/images/english-games-pinterest.png', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-use', permanent: true },
      { source: '/money', destination: '/finance', permanent: true },
      { source: '/money/:path+', destination: '/finance/:path+', permanent: true },
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

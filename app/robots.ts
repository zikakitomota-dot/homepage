import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'Pinterestbot',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://zaleastudio.com/sitemap.xml',
    host: 'https://zaleastudio.com',
  };
}

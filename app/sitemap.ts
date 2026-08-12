import type { MetadataRoute } from 'next';
import { englishGames } from '@/lib/games/english-games';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const lastModified = new Date('2026-08-12');

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/little-money-master-volume-1`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...[
      "/money",
      "/money/discount-calculator",
      "/money/split-bill-calculator",
      "/money/savings-goal-calculator",
      "/money/unit-price-calculator",
      "/money/fuel-cost-calculator",
      "/money/cashback-calculator",
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/money" ? 0.9 : 0.8,
    })),
    {
      url: `${baseUrl}/games`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games/english`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games/english/academy`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...[
      '/english-games-for-kids',
      '/grammar-games-for-kids',
      '/vocabulary-games-for-kids',
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...englishGames.map((game) => ({
      url: `${baseUrl}/games/english/${game.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

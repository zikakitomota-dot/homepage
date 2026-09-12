import type { MetadataRoute } from 'next';
import { englishGames } from '@/lib/games/english-games';
import { SITE_URL } from '@/lib/site';
import { publishedFreebies } from '@/lib/freebies';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/little-money-master-volume-1`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/freebies`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...publishedFreebies.map((freebie) => ({
      url: `${baseUrl}/freebies/${freebie.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...[
      "/finance",
      "/finance/discount-calculator",
      "/finance/split-bill-calculator",
      "/finance/savings-goal-calculator",
      "/finance/unit-price-calculator",
      "/finance/fuel-cost-calculator",
      "/finance/cashback-calculator",
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/finance" ? 0.9 : 0.8,
    })),
    ...[
      "/work-time",
      "/work-time/work-hours-calculator",
      "/work-time/business-days-calculator",
      "/work-time/time-duration-calculator",
      "/work-time/overtime-calculator",
      "/work-time/salary-to-hourly-calculator",
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/work-time" ? 0.9 : 0.8,
    })),
    ...[
      "/education",
      "/education/grade-calculator",
      "/education/final-grade-calculator",
      "/education/weighted-grade-calculator",
      "/education/gpa-calculator",
      "/education/test-grade-calculator",
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/education" ? 0.9 : 0.8,
    })),
    ...[
      "/math",
      "/math/percentage-calculator",
      "/math/fraction-calculator",
      "/math/ratio-calculator",
      "/math/average-calculator",
      "/math/standard-deviation-calculator",
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/math" ? 0.9 : 0.8,
    })),
    ...[
      '/guides',
      '/guides/how-to-set-a-realistic-savings-goal',
      '/guides/pre-writing-skills-activities',
      '/guides/equal-vs-unequal-bill-splitting',
      '/guides/percentage-points-vs-percentage-change',
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '/guides' ? 0.8 : 0.7,
    })),
    {
      url: `${baseUrl}/games`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games/english`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games/english/academy`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games/math/addition-level-1`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/science/animal-habitats`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...[
      '/english-games-for-kids',
      '/grammar-games-for-kids',
      '/vocabulary-games-for-kids',
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...englishGames.map((game) => ({
      url: `${baseUrl}/games/english/${game.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

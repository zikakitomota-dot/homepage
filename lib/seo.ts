import type { Metadata } from 'next';

export const ENGLISH_GAMES_SOCIAL_IMAGE = {
  url: '/images/english-games-social.png',
  width: 1200,
  height: 630,
  alt: 'Free English Games for Kids from Zalea Studio',
} as const;

export const ENGLISH_GAMES_PINTEREST_IMAGE = {
  url: '/images/english-games-pinterest.png',
  width: 1000,
  height: 1500,
  alt: 'Free English grammar games for children ages 5–8',
} as const;

export const ACADEMY_SOCIAL_IMAGE = {
  url: '/images/academy/zalea-english-academy-payhip-collage.png',
  width: 2000,
  height: 2000,
  alt: 'Zalea English Academy grammar and vocabulary game collection',
} as const;

type EducationalMetadata = {
  title: string;
  description: string;
  path: string;
  image?: typeof ENGLISH_GAMES_SOCIAL_IMAGE | typeof ACADEMY_SOCIAL_IMAGE;
};

export function createEducationalMetadata({
  title,
  description,
  path,
  image = ENGLISH_GAMES_SOCIAL_IMAGE,
}: EducationalMetadata): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      images: [image, ENGLISH_GAMES_PINTEREST_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

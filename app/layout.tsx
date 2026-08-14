import './globals.css';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@/components/google-analytics';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://zaleastudio.com'),
  title: {
    default: 'Zalea Studio | Free Online Tools & Digital Products',
    template: '%s | Zalea Studio',
  },
  description:
    'Free online tools, educational games, printable resources, and practical digital products designed to make everyday decisions easier.',
  other: {
    'google-adsense-account': 'ca-pub-2130981852492599',
    'p:domain_verify': '1398120562850ed1f403122bb9b2fdff',
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon-96x96.png',
    apple: '/favicon-96x96.png',
  },
  keywords: [
    'health calculators',
    'BMI calculator',
    'calorie calculator',
    'free online tools',
    'educational printables',
    'educational games',
    'financial literacy for kids',
    'digital products',
    'digital tools',
    'Zalea Studio',
  ],
  authors: [{ name: 'Zalea Studio' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Zalea Studio | Free Online Tools & Digital Products',
    description:
      'Free online tools, educational games, printable resources, and practical digital products designed to make everyday decisions easier.',
    siteName: 'Zalea Studio',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zalea Studio | Free Online Tools & Digital Products',
    description:
      'Free online tools, educational games, printable resources, and practical digital products designed to make everyday decisions easier.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Zalea Studio',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon-96x96.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Zalea Studio',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2130981852492599"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(siteJsonLd) }} />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}

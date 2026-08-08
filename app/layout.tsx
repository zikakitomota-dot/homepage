import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

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
        { url: "/favicon.ico" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          id="adsense-script"
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2130981852492599"
          crossOrigin="anonymous"
        />
        {children}</body>
    </html>
  );
}

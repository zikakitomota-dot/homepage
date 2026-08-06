import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://zaleastudio.com'),
  title: {
    default: 'Zalea Studio — Free Online Calculators & Digital Tools',
    template: '%s | Zalea Studio',
  },
  description:
    'Zalea Studio builds free online calculators, educational resources, printable products, and digital tools that help people make smarter everyday decisions.',
  icons: {
      icon: "/favicon.ico",
    },
  keywords: [
    'health calculators',
    'BMI calculator',
    'calorie calculator',
    'free online tools',
    'educational printables',
    'digital tools',
    'Zalea Studio',
  ],
  authors: [{ name: 'Zalea Studio' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Zalea Studio — Free Online Calculators & Digital Tools',
    description:
      'Free online calculators, educational resources, printable products, and digital tools that help people make smarter everyday decisions.',
    siteName: 'Zalea Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zalea Studio — Free Online Calculators & Digital Tools',
    description:
      'Free online calculators, educational resources, printable products, and digital tools that help people make smarter everyday decisions.',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}

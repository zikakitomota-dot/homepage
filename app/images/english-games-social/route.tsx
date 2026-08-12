import { ImageResponse } from 'next/og';
import { EnglishGamesArtwork } from '@/components/social/english-games-artwork';

export async function GET() {
  return new ImageResponse(<EnglishGamesArtwork />, {
    width: 1200,
    height: 630,
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
  });
}

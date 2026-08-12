import { ImageResponse } from 'next/og';
import { EnglishGamesArtwork } from '@/components/social/english-games-artwork';

export async function GET() {
  return new ImageResponse(<EnglishGamesArtwork vertical />, {
    width: 1000,
    height: 1500,
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
  });
}

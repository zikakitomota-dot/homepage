import { NextResponse } from 'next/server';
import { hasAcademyAccess } from '@/lib/games/academy-access';
import { ACADEMY_COOKIE_NAME } from '@/lib/games/entitlement-token';

export async function GET() {
  return NextResponse.json({ unlocked: await hasAcademyAccess() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ success: false }, { status: 403 });
  const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set(ACADEMY_COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}

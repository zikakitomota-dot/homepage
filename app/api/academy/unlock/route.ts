import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAcademyConfiguration } from '@/lib/games/academy-access';
import { ACADEMY_COOKIE_NAME, ACADEMY_ENTITLEMENT_SECONDS, createAcademyEntitlement } from '@/lib/games/entitlement-token';
import { verifyPayhipLicense } from '@/lib/games/payhip-license';

type RateLimitBinding = { limit: (options: { key: string }) => Promise<{ success: boolean }> };
type UnlockBindings = { ACADEMY_UNLOCK_RATE_LIMITER?: RateLimitBinding };
const schema = z.object({ licenseKey: z.string().trim().min(8).max(200).regex(/^[A-Za-z0-9-]+$/) }).strict();

function json(success: boolean, message: string, status: number) {
  return NextResponse.json({ success, ...(message ? { message } : {}) }, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

async function rateLimitKey(request: Request) {
  const ip = request.headers.get('cf-connecting-ip')?.trim() || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function isRateLimited(request: Request) {
  try {
    const env = getCloudflareContext().env as unknown as UnlockBindings;
    if (!env.ACADEMY_UNLOCK_RATE_LIMITER) return false;
    return !(await env.ACADEMY_UNLOCK_RATE_LIMITER.limit({ key: await rateLimitKey(request) })).success;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(request.headers.get('content-type') || '').toLowerCase().includes('application/json')) return json(false, 'Please submit your license key and try again.', 415);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json(false, 'This request could not be verified. Please refresh the page and try again.', 403);
  if (await isRateLimited(request)) return json(false, 'Too many verification attempts were made. Please wait a minute and try again.', 429);

  let body: unknown;
  try { body = await request.json(); } catch { return json(false, "We couldn't verify this license key. Please check the key and try again.", 400); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return json(false, "We couldn't verify this license key. Please check the key and try again.", 400);

  const { productSecret, productLink } = getAcademyConfiguration();
  if (!productSecret || !productLink) {
    console.error('[academy-unlock] PAYHIP_PRODUCT_SECRET and PAYHIP_PRODUCT_LINK must be configured in the server environment.');
    return json(false, "We couldn't verify your license right now. Please try again in a few minutes.", 503);
  }

  const result = await verifyPayhipLicense(parsed.data.licenseKey, productSecret, productLink);
  if (result.status === 'service-error') return json(false, "We couldn't verify your license right now. Please try again in a few minutes.", 503);
  if (result.status === 'disabled') return json(false, 'This license is not currently active. If you believe this is a mistake, please contact Zalea Studio.', 403);
  if (result.status !== 'valid') return json(false, "We couldn't verify this license key. Please check that you've entered the key exactly as shown in your Payhip purchase email.", 400);

  const response = json(true, '', 200);
  response.cookies.set(ACADEMY_COOKIE_NAME, await createAcademyEntitlement(productSecret), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: ACADEMY_ENTITLEMENT_SECONDS,
  });
  return response;
}

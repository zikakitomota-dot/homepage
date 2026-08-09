import { getCloudflareContext } from '@opennextjs/cloudflare';
import { z } from 'zod';

const CONTACT_TO_EMAIL = 'zikakitomota@gmail.com';
const RESEND_API_URL = 'https://api.resend.com/emails';
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

type RateLimitBinding = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};

const localRateLimits = new Map<string, { count: number; resetAt: number }>();

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(150).refine((value) => !/[\r\n]/.test(value)),
  message: z.string().trim().min(10).max(3000),
  company: z.string().max(200).optional().default(''),
  startedAt: z.number().int().positive(),
}).strict();

function json(message: string, status: number) {
  return Response.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } },
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character] || character);
}

function getClientIp(request: Request) {
  return request.headers.get('cf-connecting-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'Not available';
}

async function hashRateLimitKey(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function isRateLimited(key: string) {
  try {
    const env = getCloudflareContext().env as unknown as { CONTACT_RATE_LIMITER?: RateLimitBinding };
    if (env.CONTACT_RATE_LIMITER) {
      const result = await env.CONTACT_RATE_LIMITER.limit({ key });
      return !result.success;
    }
  } catch {
    // `next dev` has no Cloudflare request context, so use the local fallback.
  }

  const now = Date.now();
  const current = localRateLimits.get(key);
  if (!current || current.resetAt <= now) {
    localRateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function formatTextBody(data: z.infer<typeof contactSchema>, submittedAt: string, ipAddress: string) {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    `Submission date/time: ${submittedAt}`,
    `IP address: ${ipAddress}`,
    '',
    'Message:',
    data.message,
  ].join('\n');
}

function formatHtmlBody(data: z.infer<typeof contactSchema>, submittedAt: string, ipAddress: string) {
  const message = escapeHtml(data.message).replace(/\n/g, '<br>');
  return `<h2>Zalea Studio contact submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <p><strong>Submission date/time:</strong> ${escapeHtml(submittedAt)}</p>
    <p><strong>IP address:</strong> ${escapeHtml(ipAddress)}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>${message}</p>`;
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json('Please submit the contact form and try again.', 415);
  }

  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json('This submission could not be verified. Please refresh the page and try again.', 403);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json('Please check the form fields and try again.', 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json('Please complete every field with valid information and try again.', 400);
  }

  const data = parsed.data;
  const elapsed = Date.now() - data.startedAt;
  if (data.company.trim() || elapsed < 1500 || elapsed < 0) {
    return json('This submission could not be verified. Please refresh the page and try again.', 400);
  }

  const ipAddress = getClientIp(request);
  const rateLimitKey = await hashRateLimitKey(`${ipAddress}|${data.email.toLowerCase()}`);
  if (await isRateLimited(rateLimitKey)) {
    return json('Too many messages were submitted. Please wait a minute and try again.', 429);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.error('Contact email delivery is not configured.');
    return json('Email delivery is temporarily unavailable. Please try again later.', 503);
  }

  const submittedAt = new Date().toISOString();
  let resendResponse: Response;
  try {
    resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `[Zalea Studio Contact] ${data.subject}`,
        text: formatTextBody(data, submittedAt, ipAddress),
        html: formatHtmlBody(data, submittedAt, ipAddress),
      }),
    });
  } catch {
    console.error('Contact email delivery request failed.');
    return json('Your message could not be sent right now. Please try again in a moment.', 502);
  }

  if (!resendResponse.ok) {
    console.error('Resend rejected a contact email delivery request.', { status: resendResponse.status });
    return json('Your message could not be sent right now. Please try again in a moment.', 502);
  }

  return json('Your message has been sent successfully.', 200);
}

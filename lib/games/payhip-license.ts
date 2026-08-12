const PAYHIP_VERIFY_URL = 'https://payhip.com/api/v2/license/verify';

type PayhipResponse = { data?: { enabled?: unknown; product_link?: unknown; product_name?: unknown } };
export type LicenseVerificationResult = { status: 'valid' } | { status: 'invalid' | 'disabled' | 'wrong-product' | 'service-error' };

function normalizeProductKey(value: string) {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    return url.pathname.split('/').filter(Boolean).at(-1)?.toLowerCase() || '';
  } catch {
    return trimmed.replace(/^\/+|\/+$/g, '').split('/').at(-1)?.toLowerCase() || '';
  }
}

export async function verifyPayhipLicense(
  licenseKey: string,
  productSecret: string,
  expectedProductKey: string,
  fetcher: typeof fetch = fetch,
): Promise<LicenseVerificationResult> {
  const url = new URL(PAYHIP_VERIFY_URL);
  url.searchParams.set('license_key', licenseKey);
  let response: Response;
  try {
    response = await fetcher(url, { method: 'GET', headers: { 'product-secret-key': productSecret, Accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
  } catch {
    return { status: 'service-error' };
  }
  if (response.status >= 500) return { status: 'service-error' };
  let payload: PayhipResponse;
  try { payload = await response.json() as PayhipResponse; } catch { return { status: response.ok ? 'service-error' : 'invalid' }; }
  if (!response.ok || !payload.data) return { status: 'invalid' };
  if (payload.data.enabled === false) return { status: 'disabled' };
  if (payload.data.enabled !== true) return { status: 'invalid' };
  if (typeof payload.data.product_link !== 'string' || normalizeProductKey(payload.data.product_link) !== normalizeProductKey(expectedProductKey)) return { status: 'wrong-product' };
  return { status: 'valid' };
}

const PAYHIP_VERIFY_URL = 'https://payhip.com/api/v2/license/verify';

type PayhipResponse = { data?: { enabled?: unknown; product_link?: unknown; product_name?: unknown } };
export type LicenseVerificationResult = { status: 'valid' } | { status: 'invalid' | 'disabled' | 'wrong-product' | 'service-error' };

function normalizeProductLink(value: string) {
  try {
    const url = new URL(value);
    return `${url.protocol.toLowerCase()}//${url.host.toLowerCase()}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    return value.trim().replace(/\/+$/, '').toLowerCase();
  }
}

export async function verifyPayhipLicense(
  licenseKey: string,
  productSecret: string,
  expectedProductLink: string,
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
  if (typeof payload.data.product_link !== 'string' || normalizeProductLink(payload.data.product_link) !== normalizeProductLink(expectedProductLink)) return { status: 'wrong-product' };
  return { status: 'valid' };
}

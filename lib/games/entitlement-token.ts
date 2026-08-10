export const ACADEMY_COOKIE_NAME = 'zalea-academy-access';
export const ACADEMY_ENTITLEMENT_SECONDS = 60 * 60 * 24 * 7;

type EntitlementPayload = { academyAccess: true; issuedAt: number; expiresAt: number; version: 1 };

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signingKey(secret: string) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function createAcademyEntitlement(secret: string, now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const payload: EntitlementPayload = { academyAccess: true, issuedAt, expiresAt: issuedAt + ACADEMY_ENTITLEMENT_SECONDS, version: 1 };
  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign('HMAC', await signingKey(secret), new TextEncoder().encode(`zalea-academy:${encodedPayload}`));
  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAcademyEntitlement(token: string | undefined, secret: string, now = Date.now()) {
  if (!token) return false;
  const [encodedPayload, encodedSignature, extra] = token.split('.');
  if (!encodedPayload || !encodedSignature || extra) return false;
  try {
    const validSignature = await crypto.subtle.verify('HMAC', await signingKey(secret), fromBase64Url(encodedSignature), new TextEncoder().encode(`zalea-academy:${encodedPayload}`));
    if (!validSignature) return false;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as Partial<EntitlementPayload>;
    const nowSeconds = Math.floor(now / 1000);
    return payload.academyAccess === true && payload.version === 1 && typeof payload.issuedAt === 'number' && typeof payload.expiresAt === 'number' && payload.issuedAt <= nowSeconds && payload.expiresAt > nowSeconds;
  } catch {
    return false;
  }
}

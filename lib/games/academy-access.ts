import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookies } from 'next/headers';
import { ACADEMY_COOKIE_NAME, verifyAcademyEntitlement } from './entitlement-token';

type AcademyBindings = { PAYHIP_PRODUCT_SECRET?: string; PAYHIP_PRODUCT_LINK?: string };

export function getAcademyConfiguration() {
  let bindings: AcademyBindings | undefined;
  try { bindings = getCloudflareContext().env as unknown as AcademyBindings; } catch { /* next dev uses process.env. */ }
  return {
    productSecret: bindings?.PAYHIP_PRODUCT_SECRET?.trim() || process.env.PAYHIP_PRODUCT_SECRET?.trim() || '',
    productLink: bindings?.PAYHIP_PRODUCT_LINK?.trim() || process.env.PAYHIP_PRODUCT_LINK?.trim() || '',
  };
}

export async function hasAcademyAccess() {
  const { productSecret } = getAcademyConfiguration();
  if (!productSecret) return false;
  return verifyAcademyEntitlement((await cookies()).get(ACADEMY_COOKIE_NAME)?.value, productSecret);
}

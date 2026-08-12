import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookies } from 'next/headers';
import { PAYHIP_ACADEMY_PRODUCT_KEY } from '@/lib/site';
import { ACADEMY_COOKIE_NAME, verifyAcademyEntitlement } from './entitlement-token';

type AcademyBindings = {
  PAYHIP_PRODUCT_SECRET?: string;
  PAYHIP_PRODUCT_KEY?: string;
  PAYHIP_PRODUCT_LINK?: string;
};

export function getAcademyConfiguration() {
  let bindings: AcademyBindings | undefined;
  try { bindings = getCloudflareContext().env as unknown as AcademyBindings; } catch { /* next dev uses process.env. */ }
  return {
    productSecret: bindings?.PAYHIP_PRODUCT_SECRET?.trim() || process.env.PAYHIP_PRODUCT_SECRET?.trim() || '',
    productKey:
      bindings?.PAYHIP_PRODUCT_KEY?.trim() ||
      process.env.PAYHIP_PRODUCT_KEY?.trim() ||
      bindings?.PAYHIP_PRODUCT_LINK?.trim() ||
      process.env.PAYHIP_PRODUCT_LINK?.trim() ||
      PAYHIP_ACADEMY_PRODUCT_KEY,
  };
}

export async function hasAcademyAccess() {
  const { productSecret } = getAcademyConfiguration();
  if (!productSecret) return false;
  return verifyAcademyEntitlement((await cookies()).get(ACADEMY_COOKIE_NAME)?.value, productSecret);
}

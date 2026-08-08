import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage, LegalSection, legalLinkClass } from '@/components/legal-page';
import { getLegalLastUpdated } from '@/lib/legal';
import { PAYHIP_PRODUCT_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Terms of Use | Zalea Studio' },
  description: 'Read the plain-English terms governing Zalea Studio educational games, practical tools and future Academy products.',
  alternates: { canonical: '/terms-of-use' },
  openGraph: {
    title: 'Terms of Use | Zalea Studio',
    description: 'Terms for using Zalea Studio educational games, calculators and future premium products.',
    url: '/terms-of-use',
    type: 'website',
  },
};

export default function TermsOfUsePage() {
  return (
    <LegalPage title="Terms of Use" description="These terms set the ground rules for using Zalea Studio's website, practical tools, educational games and digital products." lastUpdated={getLegalLastUpdated()}>
      <LegalSection title="1. Acceptance of terms">
        <p>By accessing or using Zalea Studio, you agree to these Terms of Use and the <Link className={legalLinkClass} href="/privacy-policy">Privacy Policy</Link>. If you do not agree, please do not use the service. A parent, guardian or teacher should supervise a child&apos;s use and decide whether the content is suitable for that child.</p>
      </LegalSection>

      <LegalSection title="2. Educational purpose">
        <p>The games and learning materials are designed to support practice and general education. They are not a substitute for formal education, a qualified teacher or an individual educational assessment.</p>
        <p>Calculators and articles provide general estimates and information only. They are not medical, financial, legal or other professional advice. Seek an appropriately qualified professional where a decision could materially affect health, finances, legal rights or safety.</p>
      </LegalSection>

      <LegalSection title="3. Permitted use">
        <p>You may use public pages, free games and calculators for personal, family and ordinary educational practice. Premium Academy content is licensed for personal or household use unless a separate teacher or classroom licence is offered and purchased in the future.</p>
        <p>The right to use content is limited, non-exclusive and non-transferable. It does not transfer ownership of the website, software, questions, illustrations or digital products.</p>
      </LegalSection>

      <LegalSection title="4. Intellectual property">
        <p>The Zalea Studio name, site design, original text, game questions, illustrations, software and digital products are owned by Zalea Studio or used with permission and may be protected by applicable intellectual-property laws.</p>
        <p>Users may not copy, reproduce, redistribute, publish, resell or commercially exploit Academy content or substantial parts of the website without written permission. Public page links may be shared normally.</p>
      </LegalSection>

      <LegalSection title="5. User conduct">
        <p>You agree not to:</p>
        <LegalList>
          <li>damage, disrupt, overload or attempt unauthorised access to the website or its infrastructure;</li>
          <li>circumvent payment, entitlement, rate-limit or security controls;</li>
          <li>publish, share, resell or misuse a premium license key;</li>
          <li>scrape or reproduce substantial game or question-bank content;</li>
          <li>upload malicious code, probe for vulnerabilities without permission or interfere with another visitor;</li>
          <li>misrepresent an affiliation with Zalea Studio or use the service unlawfully.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. No warranty">
        <p>Zalea Studio works to provide useful, accurate and accessible experiences, but the website is provided on an “as available” basis. Content, calculations and features may contain errors or may not suit every situation. Zalea Studio does not promise uninterrupted availability, a particular learning result or that every feature will always remain unchanged.</p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p>To the fullest extent permitted by applicable law, Zalea Studio is not responsible for indirect or consequential loss arising from use of, or inability to use, the website. Nothing in these terms excludes responsibility that cannot lawfully be excluded or limits mandatory consumer protections.</p>
        <p>Users remain responsible for decisions made using the website and for maintaining suitable backups, browser settings and device security.</p>
      </LegalSection>

      <LegalSection title="8. Future premium products">
        <p>Zalea English Academy – Lifetime Access is intended as a one-time purchase. “Lifetime Access” means access to the Academy content identified as included with the purchase, and included future Academy updates, for as long as Zalea Studio operates and supports that product. It is not a subscription and does not include unrelated products unless the checkout description says otherwise.</p>
        <p>A preview, launch announcement or disabled button does not create a purchase agreement before checkout is available. The product description displayed at purchase will identify the price, included content and any specific licence conditions.</p>
      </LegalSection>

      <LegalSection title="9. License keys">
        <p>When license-key access becomes available, a valid key may be required to unlock Academy content. Keys must not be published, resold, shared publicly or used to bypass access limits. Zalea Studio may limit, suspend or disable a key where reasonably necessary to address fraud, a refund, misuse or a material breach of these terms.</p>
        <p>Personal or household access does not automatically permit classroom-wide or commercial use. Any future teacher or classroom licence will have its own clearly stated terms.</p>
      </LegalSection>

      <LegalSection title="10. Refund policy">
        <p>Future purchases are expected to be processed through Payhip. The refund policy and any eligibility conditions displayed on the product and checkout page at the time of purchase will apply, together with any rights that cannot be excluded under applicable consumer law.</p>
        <p>If paid content is defective or materially different from its checkout description, contact Zalea Studio promptly with the order details so the issue can be reviewed. Zalea Studio does not currently accept payments directly through this website.</p>
      </LegalSection>

      <LegalSection title="11. External links and services">
        <p>The website may link to Cloudflare, Google, Payhip, health tools or other third-party services. External services have their own terms, privacy practices and availability. A link does not mean Zalea Studio controls or guarantees the external service.</p>
      </LegalSection>

      <LegalSection title="12. Changes to these terms">
        <p>These terms may be updated when features, providers or legal requirements change. The automatically generated Last Updated date at the top identifies the version produced with the current site build. If one provision is unenforceable, the remaining provisions continue to apply.</p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>Questions about these terms can be sent through the <Link className={legalLinkClass} href="/contact">Contact Zalea Studio page</Link> or through the <a className={legalLinkClass} href={PAYHIP_PRODUCT_URL} target="_blank" rel="noreferrer">official Zalea Studio storefront</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage, LegalSection, legalLinkClass } from '@/components/legal-page';
import { getLegalLastUpdated } from '@/lib/legal';
import { PAYHIP_PRODUCT_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | Zalea Studio' },
  description: 'Learn how Zalea Studio handles information across its educational games, practical tools, advertising and future Academy purchases.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Zalea Studio',
    description: 'Plain-English information about privacy, local game progress, Google services, Payhip and Cloudflare hosting.',
    url: '/privacy-policy',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" description="This policy explains what information may be processed when you use Zalea Studio, why it is used, and the choices available to you." lastUpdated={getLegalLastUpdated()}>
      <LegalSection title="1. Introduction">
        <p>This Privacy Policy applies to zaleastudio.com and the calculators, educational games, Academy previews and digital-product links offered through it. Zalea Studio aims to collect as little personal information as reasonably necessary.</p>
        <p>External services, including Payhip checkout pages, operate under their own privacy policies. This policy does not replace the notices provided by those services.</p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <LegalList>
          <li><strong className="text-foreground">Technical information:</strong> hosting and security services may process an IP address, request time, browser and device type, requested page, referring page and diagnostic or security logs.</li>
          <li><strong className="text-foreground">Local progress:</strong> game scores, completion information and preferences may be saved in browser storage on the device.</li>
          <li><strong className="text-foreground">Messages:</strong> if you contact Zalea Studio, the message and contact details you choose to provide may be used to respond and maintain an appropriate support record.</li>
          <li><strong className="text-foreground">Future purchase records:</strong> Zalea Studio may receive limited order, customer and license information from Payhip where needed to deliver or support a purchase.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Information we do not collect through the free games">
        <p>The free English games do not require an account and do not ask children for their name, email address, birthday, school, home address or photograph. Current game progress stays locally on the user&apos;s device and is not sent to a Zalea Studio child profile.</p>
        <p>Zalea Studio does not receive or store full payment-card details. Those details are handled by the checkout provider and its payment processors when purchases become available.</p>
      </LegalSection>

      <LegalSection title="4. Cookies and local storage">
        <p>Cookies and similar technologies may support site operation, security, advertising, measurement and privacy choices. Local storage is used to remember game progress on the device. Clearing browser data may remove saved scores and preferences.</p>
        <p>You can control cookies through your browser and any consent or privacy controls displayed on the site. Blocking some technologies may affect features, saved progress or advertising.</p>
      </LegalSection>

      <LegalSection title="5. Google Analytics">
        <p>Where Google Analytics is enabled, it may collect pseudonymous usage information such as pages visited, session statistics, approximate location, browser and device information, and a client identifier. This information helps identify general usage patterns and improve the site.</p>
        <p>Zalea Studio does not intentionally send names, email addresses, school information, birthdays or license keys to Google Analytics. Learn more in Google&apos;s <a className={legalLinkClass} href="https://support.google.com/analytics/answer/11593727" target="_blank" rel="noreferrer">data-collection explanation</a> and <a className={legalLinkClass} href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</p>
      </LegalSection>

      <LegalSection title="6. Advertising and Google AdSense">
        <p>Zalea Studio may display advertising where appropriate and currently loads Google AdSense technology. Google and its advertising partners may use cookies, web beacons, IP addresses or similar identifiers to deliver, limit, measure and report advertisements.</p>
        <p>Advertising and consent settings should be configured for the visitor&apos;s region and any child-directed treatment requirements. Visitors can learn more through <a className={legalLinkClass} href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from partner sites</a> and Google&apos;s <a className={legalLinkClass} href="https://adssettings.google.com/" target="_blank" rel="noreferrer">advertising controls</a>.</p>
      </LegalSection>

      <LegalSection title="7. Payhip and premium purchases">
        <p>Zalea English Academy and other digital-product purchases may use Payhip. Payhip and its payment partners may process a buyer&apos;s name, email address, order details, billing information and payment information. Zalea Studio may receive limited information needed to deliver the purchase, confirm access and provide support.</p>
        <p>Payhip&apos;s processing is governed by its <a className={legalLinkClass} href="https://payhip.com/privacy" target="_blank" rel="noreferrer">Privacy and Cookies Policy</a>. Full payment-card details are not stored by Zalea Studio.</p>
      </LegalSection>

      <LegalSection title="8. Cloudflare hosting">
        <p>Zalea Studio uses Cloudflare infrastructure for hosting, content delivery, performance and security. Cloudflare may process IP addresses, request data and security logs to deliver and protect the website. See <a className={legalLinkClass} href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Cloudflare&apos;s Privacy Policy</a> for more information.</p>
      </LegalSection>

      <LegalSection title="9. License keys and Academy access">
        <p>An adult purchaser may submit a Payhip-generated license key for secure server-side validation. The raw key is sent to Payhip for verification but is not stored in browser storage, analytics or the Academy access cookie. After successful verification, the site stores a signed, HttpOnly entitlement cookie containing no buyer email or license key. It expires after seven days, after which the key must be entered again so refunded or disabled licenses are not trusted indefinitely.</p>
      </LegalSection>

      <LegalSection title="10. Children&apos;s privacy">
        <p>The learning games are designed for children to use with suitable parent, guardian or teacher guidance. Children should not send names, contact details, school information, photos or other personal information through the site.</p>
        <p>If a parent or guardian believes a child has provided personal information to Zalea Studio, please contact us so the matter can be reviewed and appropriate deletion steps can be taken.</p>
      </LegalSection>

      <LegalSection title="11. Third-party services">
        <p>Zalea Studio may rely on providers such as Cloudflare, Google and Payhip only where reasonably needed to operate, secure, measure, advertise or sell through the service. These providers may process information in other countries under their own terms and safeguards. Links to external sites are subject to the external site&apos;s own privacy practices.</p>
      </LegalSection>

      <LegalSection title="12. Data security and retention">
        <p>Information is kept only as long as reasonably necessary for support, security, transaction, accounting, tax or legal purposes. Local game progress remains on the device until the browser removes it. Reasonable technical and administrative safeguards are used, but no online service can guarantee absolute security.</p>
      </LegalSection>

      <LegalSection title="13. Your choices">
        <p>Depending on where you live, you may have rights to request access, correction, deletion, restriction or a copy of certain personal information, or to object to particular processing. Requests may require reasonable identity verification, and some records may need to be retained where required by law.</p>
      </LegalSection>

      <LegalSection title="14. Changes to this policy">
        <p>This policy may be updated when features, providers or legal requirements change. The automatically generated Last Updated date at the top identifies the version produced with the current site build.</p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>For privacy questions or requests, visit the <Link className={legalLinkClass} href="/contact">Contact Zalea Studio page</Link> or use the contact option available through the <a className={legalLinkClass} href={PAYHIP_PRODUCT_URL} target="_blank" rel="noreferrer">official Zalea Studio storefront</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}

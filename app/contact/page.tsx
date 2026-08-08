import type { Metadata } from 'next';
import { BriefcaseBusiness, Bug, Calculator, Lightbulb, Mail, MessageSquareText } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTACT_EMAIL, CONTACT_EMAIL_EXAMPLE } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Contact Zalea Studio' },
  description: 'Contact Zalea Studio to report a bug, suggest a game, request a calculator, share feedback or discuss a business enquiry.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Zalea Studio',
    description: 'Share feedback, report bugs or suggest new educational games and practical tools.',
    url: '/contact',
    type: 'website',
  },
};

const contactReasons = [
  { icon: Bug, label: 'Report bugs' },
  { icon: Lightbulb, label: 'Suggest new games' },
  { icon: Calculator, label: 'Request calculators' },
  { icon: MessageSquareText, label: 'Provide feedback' },
  { icon: BriefcaseBusiness, label: 'Business enquiries' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-secondary/30"><div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20"><Mail className="mx-auto h-11 w-11 text-primary" aria-hidden="true" /><h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Contact Zalea Studio</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Questions and thoughtful ideas are welcome. Choose the most relevant reason below and include enough detail to help us understand your message.</p></div></section>

        <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{contactReasons.map(({ icon: Icon, label }) => <div key={label} className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-border/70 bg-white p-4 text-center"><Icon className="h-6 w-6 text-primary" aria-hidden="true" /><p className="mt-3 font-semibold">{label}</p></div>)}</div>
          <Card className="mx-auto mt-10 max-w-2xl border-primary/20 bg-primary/5"><CardHeader><CardTitle className="text-2xl">Get in touch</CardTitle></CardHeader><CardContent>{CONTACT_EMAIL ? <><p className="leading-relaxed text-muted-foreground">Email Zalea Studio and include a clear subject line so your message can be directed appropriately.</p><a href={`mailto:${CONTACT_EMAIL}`} className="mt-5 inline-flex min-h-12 items-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90">{CONTACT_EMAIL}</a></> : <><p className="font-semibold text-foreground">Contact form coming soon.</p><p className="mt-3 leading-relaxed text-muted-foreground">A monitored public email address has not been configured yet. Set <code className="rounded bg-background px-1.5 py-1 text-sm text-foreground">NEXT_PUBLIC_CONTACT_EMAIL</code> to display the real address here.</p><div className="mt-5 rounded-lg border border-dashed border-primary/30 bg-background p-4"><p className="text-xs font-bold uppercase tracking-wider text-primary">Example only — replace before publishing</p><p className="mt-2 font-mono text-sm text-muted-foreground">{CONTACT_EMAIL_EXAMPLE}</p></div></>}</CardContent></Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

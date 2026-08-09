'use client';

import { FormEvent, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MESSAGE_MAX_LENGTH = 3000;

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = { name: '', email: '', subject: '', message: '' };

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';

  if (subject.length < 3) errors.subject = 'Please enter a subject.';
  else if (subject.length > 150) errors.subject = 'Subject must be 150 characters or fewer.';

  if (message.length < 10) errors.message = 'Please enter a message of at least 10 characters.';
  else if (message.length > MESSAGE_MAX_LENGTH) errors.message = `Message must be ${MESSAGE_MAX_LENGTH.toLocaleString()} characters or fewer.`;

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [company, setCompany] = useState('');
  const startedAt = useRef(Date.now());

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatus('idle');
    setErrorMessage('');

    if (Object.keys(nextErrors).length > 0) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, company, startedAt: startedAt.current }),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || 'Your message could not be sent. Please try again in a moment.');
      }

      setValues(emptyForm);
      setCompany('');
      setErrors({});
      setStatus('success');
      startedAt.current = Date.now();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Your message could not be sent. Please try again in a moment.');
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="mx-auto mt-10 max-w-2xl border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl">Get in touch</CardTitle>
        <p className="leading-relaxed text-muted-foreground">Complete the form below and your message will be sent securely to Zalea Studio.</p>
      </CardHeader>
      <CardContent>
        {status === 'success' && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-900" role="status" aria-live="polite">
            <p className="text-xl font-bold">Thank you!</p>
            <p className="mt-2">Your message has been sent successfully.</p>
            <p className="mt-1">We&apos;ll get back to you as soon as possible.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900" role="alert">
            <p className="font-semibold">We couldn&apos;t send your message.</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <input type="text" name="company" value={company} onChange={(event) => setCompany(event.target.value)} className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} maxLength={100} autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
              {errors.name && <p id="name-error" className="text-sm text-red-700">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={values.email} onChange={(event) => updateField('email', event.target.value)} maxLength={254} autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
              {errors.email && <p id="email-error" className="text-sm text-red-700">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" value={values.subject} onChange={(event) => updateField('subject', event.target.value)} maxLength={150} required aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} />
            {errors.subject && <p id="subject-error" className="text-sm text-red-700">{errors.subject}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="message">Message</Label>
              <span className="text-xs text-muted-foreground" aria-live="polite">{values.message.length.toLocaleString()} / {MESSAGE_MAX_LENGTH.toLocaleString()}</span>
            </div>
            <Textarea id="message" name="message" value={values.message} onChange={(event) => updateField('message', event.target.value)} maxLength={MESSAGE_MAX_LENGTH} rows={8} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : 'message-help'} />
            {errors.message ? <p id="message-error" className="text-sm text-red-700">{errors.message}</p> : <p id="message-help" className="text-sm text-muted-foreground">Please do not include passwords, payment information or other sensitive details.</p>}
          </div>

          <Button type="submit" size="lg" className="min-w-40" disabled={isSending}>
            {isSending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Sending…</> : <><Send className="mr-2 h-4 w-4" aria-hidden="true" />Send Message</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

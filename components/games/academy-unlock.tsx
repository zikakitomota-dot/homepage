'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, LogOut, UnlockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AcademyUnlock({ initiallyUnlocked }: { initiallyUnlocked: boolean }) {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState('');
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const unlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const key = licenseKey.trim();
    if (key.length < 8) { setError("We couldn't verify this license key. Please check the key and try again."); return; }
    setIsVerifying(true); setError('');
    try {
      const response = await fetch('/api/academy/unlock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ licenseKey: key }) });
      const result = await response.json().catch(() => null) as { success?: boolean; message?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.message || "We couldn't verify your license right now. Please try again in a few minutes.");
      setLicenseKey(''); setUnlocked(true); router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't verify your license right now. Please try again in a few minutes.");
    } finally { setIsVerifying(false); }
  };

  const removeAccess = async () => {
    setIsVerifying(true); setError('');
    try {
      const response = await fetch('/api/academy/access', { method: 'DELETE' });
      if (!response.ok) throw new Error('Access could not be removed right now.');
      setUnlocked(false); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Access could not be removed right now.'); }
    finally { setIsVerifying(false); }
  };

  if (unlocked) return <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-green-200 bg-green-50 p-6 text-left text-green-950" role="status">
    <CheckCircle2 className="h-9 w-9 text-green-700" aria-hidden="true" />
    <h3 className="mt-3 text-2xl font-bold">Academy Unlocked!</h3>
    <p className="mt-2 leading-relaxed">Your Zalea English Academy access is active on this device.</p>
    <Button asChild className="mt-5 min-h-12 w-full sm:w-auto"><Link href="#academy-library">Start Learning</Link></Button>
    <div className="mt-6 border-t border-green-200 pt-5"><p className="text-sm font-semibold">Academy Settings</p><button type="button" disabled={isVerifying} onClick={removeAccess} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 disabled:opacity-60"><LogOut className="mr-2 h-4 w-4" aria-hidden="true" />Remove Academy Access From This Device</button></div>
    {error && <p className="mt-4 text-sm font-semibold text-red-700" role="alert">{error}</p>}
  </div>;

  return <form onSubmit={unlock} className="mx-auto mt-6 max-w-lg text-left" noValidate>
    <label htmlFor="academy-license-key" className="text-sm font-semibold">License Key</label>
    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
      <input id="academy-license-key" value={licenseKey} onChange={(event) => { setLicenseKey(event.target.value); setError(''); }} disabled={isVerifying} autoComplete="off" spellCheck={false} placeholder="XXXX-XXXX-XXXX-XXXX" className="min-h-12 min-w-0 flex-1 rounded-md border border-input bg-background px-3 font-mono uppercase disabled:opacity-60" required />
      <Button type="submit" disabled={isVerifying} className="h-auto min-h-12 whitespace-normal py-3 sm:min-w-40">{isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Verifying...</> : <><UnlockKeyhole className="mr-2 h-4 w-4" aria-hidden="true" />Unlock Academy</>}</Button>
    </div>
    {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert"><p className="font-semibold">{error}</p>{error.startsWith('This license is not currently active') && <Link href="/contact" className="mt-2 inline-block font-semibold underline">Contact Zalea Studio</Link>}</div>}
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Your key is sent securely to Zalea Studio for Payhip verification. It is not stored in this browser.</p>
  </form>;
}
